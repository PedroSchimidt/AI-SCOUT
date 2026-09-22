import { motion } from "framer-motion";
import { SLOT_COORDS } from "../../data/formations";
import type { Formation, LineupSlot, Player } from "../../types/game";

interface PitchProps {
  formation: Formation;
  slots: LineupSlot[];
  playersById: Map<number, Player>;
  activeSlot: number | null;
  onSlotClick: (index: number) => void;
}

export function Pitch({ formation, slots, playersById, activeSlot, onSlotClick }: PitchProps) {
  const coords = SLOT_COORDS[formation];

  return (
    <div className="relative aspect-[3/4] w-full max-w-lg overflow-hidden rounded-2xl border-2 border-pitch-line/40 bg-gradient-to-b from-pitch-800 to-pitch-900 shadow-glow pitch-pattern">
      <div className="pointer-events-none absolute inset-4 rounded-xl border border-white/15" />
      <div className="pointer-events-none absolute left-1/2 top-4 h-16 w-[42%] -translate-x-1/2 rounded-b-lg border border-t-0 border-white/15" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 h-16 w-[42%] -translate-x-1/2 rounded-t-lg border border-b-0 border-white/15" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />

      {slots.map((slot, i) => {
        const c = coords[i];
        const player = slot.playerId ? playersById.get(slot.playerId) : undefined;
        const isActive = activeSlot === i;

        return (
          <motion.button
            key={`${formation}-${i}-${slot.position}`}
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSlotClick(i)}
            className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 text-[10px] font-bold transition ${
              isActive
                ? "border-teal-300 bg-teal-500/30 text-white shadow-glow"
                : player
                  ? "border-teal-500/50 bg-pitch-950/90 text-teal-200 hover:border-teal-400"
                  : "border-dashed border-white/25 bg-black/30 text-slate-500 hover:border-teal-500/40"
            }`}
            style={{ left: `${c.x}%`, top: `${100 - c.y}%` }}
            title={player?.name ?? slot.position}
          >
            <span className="text-[9px] opacity-70">{slot.position}</span>
            <span className="leading-none">{player ? player.overall : "—"}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
