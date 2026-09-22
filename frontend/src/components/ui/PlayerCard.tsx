import { motion } from "framer-motion";
import type { Player } from "../../types/game";
import { formatMoney, positionColor } from "../../lib/format";

interface PlayerCardProps {
  player: Player;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
  footer?: React.ReactNode;
}

export function PlayerCard({ player, selected, compact, onClick, footer }: PlayerCardProps) {
  return (
    <motion.button
      type="button"
      layout
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`glass-panel w-full text-left transition ${
        selected ? "ring-2 ring-teal-400/60 shadow-glow" : "hover:border-teal-500/25"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base font-semibold text-white">{player.name}</p>
          <p className="text-xs text-slate-400">
            {player.age} anos · {player.nationality}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${positionColor(player.position)}`}
          >
            {player.position}
          </span>
          <span className="font-display text-2xl font-bold leading-none text-teal-300">
            {player.overall}
          </span>
        </div>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>POT {player.potential}</span>
          <span>·</span>
          <span>
            {player.status === "available"
              ? formatMoney(player.transferFee)
              : formatMoney(player.wage) + "/sem"}
          </span>
          {player.status === "contracted" && (
            <>
              <span>·</span>
              <span>Fitness {player.fitness}%</span>
            </>
          )}
        </div>
      )}
      {footer && <div className="mt-3 border-t border-white/5 pt-3">{footer}</div>}
    </motion.button>
  );
}
