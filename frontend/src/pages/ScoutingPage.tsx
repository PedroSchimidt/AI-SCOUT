import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { PlayerCard } from "../components/ui/PlayerCard";
import { PlayerDetail } from "../components/players/PlayerDetail";

export function ScoutingPage() {
  const players = useGameStore((s) => s.players);
  const scoutFilter = useGameStore((s) => s.scoutFilter);
  const setScoutFilter = useGameStore((s) => s.setScoutFilter);
  const signPlayer = useGameStore((s) => s.signPlayer);
  const career = useGameStore((s) => s.career);
  const selectedPlayerId = useGameStore((s) => s.selectedPlayerId);
  const selectPlayer = useGameStore((s) => s.selectPlayer);
  const [toast, setToast] = useState<string | null>(null);

  const market = useMemo(() => {
    const q = scoutFilter.toLowerCase();
    return players
      .filter((p) => p.status === "available")
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q) ||
          p.nationality.toLowerCase().includes(q),
      )
      .sort((a, b) => b.potential - a.potential);
  }, [players, scoutFilter]);

  const selected = market.find((p) => p.id === selectedPlayerId) ?? market[0];

  const handleSign = (id: number) => {
    const ok = signPlayer(id);
    setToast(ok ? "Contratação fechada!" : "Orçamento insuficiente.");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Scouting</h1>
            <p className="text-slate-400">
              Mercado rodada {career?.currentRound ?? "—"} · Orçamento{" "}
              {career ? `€ ${(career.budget / 1_000_000).toFixed(2)}M` : "—"}
            </p>
          </div>
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={scoutFilter}
              onChange={(e) => setScoutFilter(e.target.value)}
              placeholder="Buscar nome, posição..."
              className="w-full rounded-xl border border-white/10 bg-black/30 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>
        </header>

        {toast && (
          <div className="mb-4 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-200">
            {toast}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {market.map((p) => (
            <PlayerCard
              key={p.id}
              player={p}
              selected={selected?.id === p.id}
              onClick={() => selectPlayer(p.id)}
              footer={
                <button
                  type="button"
                  className="btn-primary w-full !py-2 !text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSign(p.id);
                  }}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Contratar
                </button>
              }
            />
          ))}
          {market.length === 0 && (
            <p className="col-span-full text-center text-slate-500">Nenhum jogador no mercado.</p>
          )}
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
