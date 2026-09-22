import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FORMATION_SLOTS } from "../data/formations";
import {
  demoCareer,
  demoChat,
  demoFinishedEvents,
  demoLineup,
  demoMatch,
  demoPlayers,
} from "../data/mockCareer";
import type {
  Career,
  ChatMessage,
  Formation,
  Lineup,
  Match,
  Mentality,
  Player,
  Pressing,
} from "../types/game";

let nextPlayerId = 200;
let nextMsgId = 100;

interface GameState {
  career: Career | null;
  players: Player[];
  lineup: Lineup;
  match: Match;
  chat: ChatMessage[];
  backendOnline: boolean;
  selectedPlayerId: number | null;
  scoutFilter: string;

  setBackendOnline: (v: boolean) => void;
  startCareer: (clubName: string, managerName: string) => void;
  resetDemo: () => void;
  selectPlayer: (id: number | null) => void;
  setScoutFilter: (q: string) => void;

  signPlayer: (playerId: number) => boolean;
  releasePlayer: (playerId: number) => void;
  trainPlayer: (playerId: number, focus: keyof Player) => void;

  setFormation: (f: Formation) => void;
  setMentality: (m: Mentality) => void;
  setPressing: (p: Pressing) => void;
  assignSlot: (slotIndex: number, playerId: number | null) => void;
  autoPickLineup: () => void;

  simulateMatch: () => void;
  advanceRound: () => void;

  sendChat: (content: string) => void;
}

function seedState() {
  return {
    career: demoCareer,
    players: [...demoPlayers],
    lineup: { ...demoLineup, slots: demoLineup.slots.map((s) => ({ ...s })) },
    match: { ...demoMatch },
    chat: [...demoChat],
  };
}

function assistantReply(userText: string, state: GameState): string {
  const lower = userText.toLowerCase();
  const squad = state.players.filter((p) => p.status === "contracted");
  const market = state.players.filter((p) => p.status === "available");
  const top = [...squad].sort((a, b) => b.overall - a.overall)[0];

  if (lower.includes("escala") || lower.includes("tática") || lower.includes("formação")) {
    const empty = state.lineup.slots.filter((s) => !s.playerId).length;
    return empty > 0
      ? `Ainda há ${empty} posição(ões) vazias no ${state.lineup.formation}. Use Tática para completar — sugiro colocar ${top?.name ?? "seus melhores"} onde o overall encaixa na posição.`
      : `Escalação ${state.lineup.formation} completa com mentalidade ${state.lineup.mentality}. Próximo passo: simular a rodada ${state.career?.currentRound ?? 1} contra ${state.match.opponentName}.`;
  }
  if (lower.includes("mercado") || lower.includes("contrat")) {
    const pick = market.sort((a, b) => b.potential - a.potential)[0];
    return pick
      ? `No mercado desta rodada, ${pick.name} (${pick.position}, OVR ${pick.overall}, POT ${pick.potential}) se destaca por ${formatFee(pick.transferFee)}. Orçamento atual: ${formatFee(state.career?.budget ?? 0)}.`
      : "Mercado vazio nesta rodada. Avance a temporada para gerar novos alvos.";
  }
  if (lower.includes("próxim") || lower.includes("partida") || lower.includes("advers")) {
    return `Rodada ${state.match.roundNumber}: ${state.career?.clubName ?? "Seu clube"} recebe ${state.match.opponentName}. Reputação ${state.career?.reputation ?? 0} — um resultado positivo aumenta a confiança do elenco.`;
  }
  return `Entendi. Com ${squad.length} jogadores no elenco e orçamento de ${formatFee(state.career?.budget ?? 0)}, posso detalhar mercado, escalação ou a partida. Tente perguntar "como escalo?" ou "quem contrato?".`;
}

function formatFee(n: number) {
  if (n >= 1_000_000) return `€ ${(n / 1_000_000).toFixed(1)}M`;
  return `€ ${Math.round(n / 1000)}K`;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...seedState(),
      backendOnline: false,
      selectedPlayerId: null,
      scoutFilter: "",

      setBackendOnline: (v) => set({ backendOnline: v }),
      selectPlayer: (id) => set({ selectedPlayerId: id }),
      setScoutFilter: (q) => set({ scoutFilter: q }),

      startCareer: (clubName, managerName) =>
        set({
          ...seedState(),
          career: {
            ...demoCareer,
            clubName,
            managerName,
            budget: 5_000_000,
            reputation: 40,
            currentRound: 1,
            marketReadyForRound: null,
          },
        }),

      resetDemo: () =>
        set({
          ...seedState(),
          selectedPlayerId: null,
          scoutFilter: "",
        }),

      signPlayer: (playerId) => {
        const state = get();
        const player = state.players.find((p) => p.id === playerId);
        if (!player || player.status !== "available" || !state.career) return false;
        if (state.career.budget < player.transferFee) return false;
        set({
          career: { ...state.career, budget: state.career.budget - player.transferFee },
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, status: "contracted" as const, transferFee: 0 } : p,
          ),
        });
        return true;
      },

      releasePlayer: (playerId) => {
        set({
          players: get().players.map((p) =>
            p.id === playerId ? { ...p, status: "released" as const } : p,
          ),
          lineup: {
            ...get().lineup,
            slots: get().lineup.slots.map((s) =>
              s.playerId === playerId ? { ...s, playerId: null } : s,
            ),
          },
        });
      },

      trainPlayer: (playerId, focus) => {
        const statKeys = [
          "pace",
          "shooting",
          "passing",
          "dribbling",
          "defending",
          "physical",
          "goalkeeping",
        ] as const;
        if (!statKeys.includes(focus as (typeof statKeys)[number])) return;
        set({
          players: get().players.map((p) => {
            if (p.id !== playerId) return p;
            const key = focus as (typeof statKeys)[number];
            const before = p[key] as number;
            const delta = before >= 90 ? 0 : Math.random() > 0.35 ? 1 : 0;
            const after = Math.min(99, before + delta);
            return {
              ...p,
              [key]: after,
              overall: Math.min(99, p.overall + (delta && key !== "goalkeeping" ? 1 : 0)),
              fitness: Math.max(70, p.fitness - 8),
            };
          }),
        });
      },

      setFormation: (formation) => {
        const slots = FORMATION_SLOTS[formation].map((position) => ({
          position,
          playerId: null as number | null,
        }));
        set({ lineup: { ...get().lineup, formation, slots } });
        get().autoPickLineup();
      },

      setMentality: (mentality) => set({ lineup: { ...get().lineup, mentality } }),
      setPressing: (pressing) => set({ lineup: { ...get().lineup, pressing } }),

      assignSlot: (slotIndex, playerId) => {
        const lineup = get().lineup;
        const slots = lineup.slots.map((s, i) => {
          if (i === slotIndex) return { ...s, playerId };
          if (playerId !== null && s.playerId === playerId) return { ...s, playerId: null };
          return s;
        });
        set({ lineup: { ...lineup, slots } });
      },

      autoPickLineup: () => {
        const { players, lineup } = get();
        const contracted = players.filter((p) => p.status === "contracted");
        const slots = lineup.slots.map((slot) => {
          const candidates = contracted
            .filter((p) => p.position === slot.position)
            .sort((a, b) => b.overall - a.overall);
          const pick = candidates[0];
          return { ...slot, playerId: pick?.id ?? null };
        });
        set({ lineup: { ...lineup, slots } });
      },

      simulateMatch: () => {
        const state = get();
        const filled = state.lineup.slots.filter((s) => s.playerId).length;
        if (filled < 11) return;

        set({
          match: {
            ...state.match,
            status: "finished",
            homeScore: 2,
            awayScore: Math.random() > 0.55 ? 1 : 0,
            events: demoFinishedEvents,
          },
          players: state.players.map((p) => {
            if (p.status !== "contracted") return p;
            return {
              ...p,
              matchesPlayed: p.matchesPlayed + 1,
              fitness: Math.max(65, p.fitness - 12),
              morale: Math.min(100, p.morale + 4),
            };
          }),
          career: state.career
            ? {
                ...state.career,
                reputation: Math.min(99, state.career.reputation + 2),
                budget: state.career.budget + 350_000,
              }
            : null,
        });
      },

      advanceRound: () => {
        const state = get();
        if (!state.career) return;
        const next = state.career.currentRound + 1;
        const opponents = ["União Leste", "Porto Verde", "Metropolitano", "Serra Alta", "Costa FC"];
        set({
          career: {
            ...state.career,
            currentRound: next,
            marketReadyForRound: next,
          },
          match: {
            id: state.match.id + 1,
            roundNumber: next,
            status: "scheduled",
            opponentName: opponents[next % opponents.length],
            homeScore: 0,
            awayScore: 0,
            events: [],
          },
          players: [
            ...state.players,
            {
              id: nextPlayerId++,
              careerId: 1,
              name: "Prospecto IA",
              age: 18 + Math.floor(Math.random() * 5),
              nationality: "Brasil",
              position: "CM",
              biography: "Gerado pelo mercado da nova rodada.",
              personality: { traits: ["desconhecido"] },
              pace: 70,
              shooting: 58,
              passing: 72,
              dribbling: 68,
              defending: 55,
              physical: 64,
              goalkeeping: 10,
              potential: 85,
              overall: 66,
              status: "available",
              transferFee: 900_000,
              wage: 10_000,
              discoveredRound: next,
              fitness: 100,
              morale: 50,
              matchesPlayed: 0,
              goals: 0,
              assists: 0,
            },
          ],
        });
      },

      sendChat: (content) => {
        const trimmed = content.trim();
        if (!trimmed) return;
        const state = get();
        const userMsg: ChatMessage = {
          id: nextMsgId++,
          role: "user",
          content: trimmed,
          createdAt: new Date().toISOString(),
        };
        const reply: ChatMessage = {
          id: nextMsgId++,
          role: "assistant",
          content: assistantReply(trimmed, { ...state, chat: [...state.chat, userMsg] }),
          createdAt: new Date().toISOString(),
        };
        set({ chat: [...state.chat, userMsg, reply] });
      },
    }),
    {
      name: "ai-scout-save",
      partialize: (s) => ({
        career: s.career,
        players: s.players,
        lineup: s.lineup,
        match: s.match,
        chat: s.chat,
      }),
    },
  ),
);
