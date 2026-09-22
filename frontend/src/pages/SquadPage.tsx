import { useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { PlayerCard } from "../components/ui/PlayerCard";
import { PlayerDetail } from "../components/players/PlayerDetail";

export function SquadPage() {
  const players = useGameStore((s) => s.players);
  const selectedPlayerId = useGameStore((s) => s.selectedPlayerId);
  const selectPlayer = useGameStore((s) => s.selectPlayer);

  const squad = useMemo(
    () => players.filter((p) => p.status === "contracted").sort((a, b) => b.overall - a.overall),
    [players],
  );

  const selected = squad.find((p) => p.id === selectedPlayerId) ?? squad[0];

  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold text-white">Elenco</h1>
          <p className="text-slate-400">{squad.length} jogadores contratados</p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {squad.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              selected={selected?.id === p.id}
              onClick={() => selectPlayer(p.id)}
            />
          ))}
        </div>
      </div>
      {selected && (
        <aside className="w-full border-t border-surface-border lg:w-96 lg:border-l lg:border-t-0">
          <PlayerDetail player={selected} onClose={() => selectPlayer(null)} />
        </aside>
      )}
    </div>
  );
}
