import { X, Dumbbell } from "lucide-react";
import type { Player } from "../../types/game";
import { StatBar } from "../ui/StatBar";
import { formatMoney, positionColor } from "../../lib/format";
import { useGameStore } from "../../store/gameStore";

const TRAIN_FOCUS = [
  "pace",
  "shooting",
  "passing",
  "dribbling",
  "defending",
  "physical",
] as const;

interface PlayerDetailProps {
  player: Player;
  onClose: () => void;
}

export function PlayerDetail({ player, onClose }: PlayerDetailProps) {
  const trainPlayer = useGameStore((s) => s.trainPlayer);
  const releasePlayer = useGameStore((s) => s.releasePlayer);

  const isGk = player.position === "GK";
  const stats = isGk
    ? (["goalkeeping", "passing", "physical"] as const)
    : TRAIN_FOCUS;

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      <div className="flex items-start justify-between border-b border-white/5 p-4">
        <div>
          <span
            className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${positionColor(player.position)}`}
          >
            {player.position}
          </span>
          <h2 className="mt-2 font-display text-xl font-bold text-white">{player.name}</h2>
          <p className="text-sm text-slate-400">
            {player.age} anos · {player.nationality}
          </p>
        </div>
        <button type="button" onClick={onClose} className="btn-ghost !p-2">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 flex gap-4">
          <div className="rounded-xl bg-teal-500/10 px-4 py-3 text-center">
            <p className="text-xs uppercase text-slate-500">Overall</p>
            <p className="font-display text-3xl font-bold text-teal-300">{player.overall}</p>
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-3 text-center">
            <p className="text-xs uppercase text-slate-500">Potencial</p>
            <p className="font-display text-3xl font-bold text-amber-300">{player.potential}</p>
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-3 text-center">
            <p className="text-xs uppercase text-slate-500">Moral</p>
            <p className="font-display text-3xl font-bold text-slate-200">{player.morale}</p>
          </div>
        </div>

        {player.biography && (
          <p className="mb-4 text-sm leading-relaxed text-slate-300">{player.biography}</p>
        )}

        {player.personality?.traits?.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {player.personality.traits.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="space-y-2">
          {stats.map((key) => (
            <StatBar key={key} name={key} value={player[key] as number} />
          ))}
          {isGk && <StatBar name="goalkeeping" value={player.goalkeeping} highlight />}
        </div>

        {player.scoutReport && (
          <blockquote className="mt-4 border-l-2 border-teal-500/50 pl-3 text-sm italic text-slate-400">
            {player.scoutReport}
          </blockquote>
        )}

        {player.status === "contracted" && (
          <div className="mt-6">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Dumbbell className="h-3.5 w-3.5" /> Treino rápido
            </p>
            <div className="flex flex-wrap gap-2">
              {TRAIN_FOCUS.map((focus) => (
                <button
                  key={focus}
                  type="button"
                  className="btn-ghost !px-3 !py-1.5 !text-xs capitalize"
                  onClick={() => trainPlayer(player.id, focus)}
                >
                  {focus}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 p-4 text-sm text-slate-400">
        {player.status === "available" && (
          <p>Valor: {formatMoney(player.transferFee)} · Salário pedido: {formatMoney(player.wage)}/sem</p>
        )}
        {player.status === "contracted" && (
          <div className="flex items-center justify-between">
            <span>{formatMoney(player.wage)}/sem · {player.goals}G {player.assists}A</span>
            <button
              type="button"
              className="text-xs text-rose-400 hover:text-rose-300"
              onClick={() => releasePlayer(player.id)}
            >
              Rescindir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
