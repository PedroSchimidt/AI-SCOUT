import { motion, AnimatePresence } from "framer-motion";
import { Play, FastForward } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export function MatchPage() {
  const career = useGameStore((s) => s.career);
  const match = useGameStore((s) => s.match);
  const lineup = useGameStore((s) => s.lineup);
  const simulateMatch = useGameStore((s) => s.simulateMatch);
  const advanceRound = useGameStore((s) => s.advanceRound);

  const filled = lineup.slots.filter((s) => s.playerId).length;
  const canPlay = filled >= 11 && match.status === "scheduled";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Partida</h1>
        <p className="text-slate-400">Rodada {match.roundNumber}</p>
      </header>

      <div className="glass-panel mx-auto w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-b from-pitch-800/80 to-pitch-900/50 px-6 py-10 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500">Campeonato</p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="flex-1 text-right">
              <p className="font-display text-xl font-bold text-white md:text-2xl">
                {career?.clubName}
              </p>
              <p className="text-sm text-teal-400/80">Casa</p>
            </div>
            <div className="font-display text-4xl font-black tabular-nums text-white md:text-5xl">
              {match.status === "scheduled" ? (
                <span className="text-slate-600">vs</span>
              ) : (
                <>
                  {match.homeScore}
                  <span className="mx-2 text-slate-600">:</span>
                  {match.awayScore}
                </>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-display text-xl font-bold text-white md:text-2xl">
                {match.opponentName}
              </p>
              <p className="text-sm text-slate-500">Visitante</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Formação {lineup.formation} · {lineup.mentality} · pressing {lineup.pressing}
          </p>
        </div>

        <div className="border-t border-white/5 p-6">
          {match.status === "scheduled" && (
            <>
              <p className="mb-4 text-center text-sm text-slate-500">
                Escalação {filled}/11 {filled < 11 && "— complete a tática para jogar"}
              </p>
              <button type="button" className="btn-primary w-full" disabled={!canPlay} onClick={simulateMatch}>
                <Play className="h-4 w-4" />
                Simular partida
              </button>
            </>
          )}

          {match.status === "finished" && (
            <>
              <h2 className="mb-4 font-display text-lg font-semibold text-slate-200">Narrativa</h2>
              <ul className="max-h-80 space-y-3 overflow-y-auto">
                <AnimatePresence>
                  {match.events.map((ev) => (
                    <motion.li
                      key={ev.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 rounded-xl px-3 py-2 text-sm ${
                        ev.type === "goal"
                          ? "bg-teal-500/15 text-teal-100"
                          : ev.type === "halftime" || ev.type === "fulltime"
                            ? "bg-white/5 font-medium text-slate-300"
                            : "text-slate-400"
                      }`}
                    >
                      <span className="w-10 shrink-0 font-mono text-xs text-slate-500">
                        {ev.minute}'
                      </span>
                      <span>{ev.commentary}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <button type="button" className="btn-primary mt-6 w-full" onClick={advanceRound}>
                <FastForward className="h-4 w-4" />
                Próxima rodada
              </button>
            </>
          )}

          {match.status === "live" && (
            <p className="animate-pulse-soft text-center text-teal-300">Partida ao vivo…</p>
          )}
        </div>
      </div>
    </div>
  );
}
