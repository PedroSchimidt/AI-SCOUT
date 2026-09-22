import { useMemo, useState } from "react";
import { Wand2 } from "lucide-react";
import { FORMATION_LABELS } from "../data/formations";
import { useGameStore } from "../store/gameStore";
import { Pitch } from "../components/tactics/Pitch";
import type { Formation, Mentality, Pressing } from "../types/game";
import { PlayerCard } from "../components/ui/PlayerCard";

export function TacticsPage() {
  const lineup = useGameStore((s) => s.lineup);
  const players = useGameStore((s) => s.players);
  const setFormation = useGameStore((s) => s.setFormation);
  const setMentality = useGameStore((s) => s.setMentality);
  const setPressing = useGameStore((s) => s.setPressing);
  const assignSlot = useGameStore((s) => s.assignSlot);
  const autoPickLineup = useGameStore((s) => s.autoPickLineup);

  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);
  const squad = players.filter((p) => p.status === "contracted");
  const activePosition = activeSlot !== null ? lineup.slots[activeSlot]?.position : null;

  const candidates = squad
    .filter((p) => !activePosition || p.position === activePosition)
    .sort((a, b) => b.overall - a.overall);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Tática</h1>
          <p className="text-slate-400">Clique no campo e escolha o jogador</p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => autoPickLineup()}>
          <Wand2 className="h-4 w-4" />
          Auto-escalação
        </button>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col items-center gap-6">
          <Pitch
            formation={lineup.formation}
            slots={lineup.slots}
            playersById={playersById}
            activeSlot={activeSlot}
            onSlotClick={(i) => setActiveSlot(i)}
          />

          <div className="flex flex-wrap justify-center gap-2">
            {FORMATION_LABELS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormation(f as Formation)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  lineup.formation === f
                    ? "bg-teal-500/20 text-teal-200 ring-1 ring-teal-500/40"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Mentalidade</p>
            <div className="flex flex-wrap gap-2">
              {(["defensive", "balanced", "attacking"] as Mentality[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMentality(m)}
                  className={`btn-ghost !py-1.5 capitalize ${lineup.mentality === m ? "!border-teal-500/40 !text-teal-200" : ""}`}
                >
                  {m === "defensive" ? "Defensiva" : m === "balanced" ? "Equilibrada" : "Ofensiva"}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Pressing</p>
            <div className="flex flex-wrap gap-2">
              {(["low", "medium", "high"] as Pressing[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPressing(p)}
                  className={`btn-ghost !py-1.5 capitalize ${lineup.pressing === p ? "!border-teal-500/40 !text-teal-200" : ""}`}
                >
                  {p === "low" ? "Baixo" : p === "medium" ? "Médio" : "Alto"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-slate-300">
              {activeSlot !== null
                ? `Posição ${lineup.slots[activeSlot].position} — escolha jogador`
                : "Selecione uma posição no campo"}
            </p>
            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {activeSlot !== null && (
                <button
                  type="button"
                  className="btn-ghost w-full !text-xs text-slate-500"
                  onClick={() => assignSlot(activeSlot, null)}
                >
                  Limpar posição
                </button>
              )}
              {candidates.map((p) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  compact
                  onClick={() => {
                    if (activeSlot !== null) {
                      assignSlot(activeSlot, p.id);
                      setActiveSlot(null);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
