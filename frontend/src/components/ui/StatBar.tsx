import { statLabel } from "../../lib/format";

interface StatBarProps {
  name: string;
  value: number;
  highlight?: boolean;
}

export function StatBar({ name, value, highlight }: StatBarProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-slate-400">{statLabel(name)}</span>
      <div className="stat-bar-track">
        <div
          className={`stat-bar-fill ${highlight ? "from-amber-500 to-yellow-300" : ""}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-xs text-teal-300">{value}</span>
    </div>
  );
}
