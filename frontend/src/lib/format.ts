export function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    return `€ ${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `€ ${Math.round(value / 1_000)}K`;
  }
  return `€ ${value}`;
}

export function positionColor(pos: string): string {
  const map: Record<string, string> = {
    GK: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    CB: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    RB: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    LB: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    DM: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    CM: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    AM: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    RW: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    LW: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    ST: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  return map[pos] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30";
}

export function statLabel(key: string): string {
  const labels: Record<string, string> = {
    pace: "Velocidade",
    shooting: "Finalização",
    passing: "Passe",
    dribbling: "Drible",
    defending: "Defesa",
    physical: "Físico",
    goalkeeping: "Goleiro",
  };
  return labels[key] ?? key;
}
