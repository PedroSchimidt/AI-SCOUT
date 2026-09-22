import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Search,
  LayoutGrid,
  Swords,
  MessageCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useGameStore } from "../../store/gameStore";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Painel" },
  { to: "/squad", icon: Users, label: "Elenco" },
  { to: "/scouting", icon: Search, label: "Scouting" },
  { to: "/tactics", icon: LayoutGrid, label: "Tática" },
  { to: "/match", icon: Swords, label: "Partida" },
  { to: "/assistant", icon: MessageCircle, label: "Assistente IA" },
];

export function Sidebar() {
  const career = useGameStore((s) => s.career);
  const backendOnline = useGameStore((s) => s.backendOnline);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-surface-border bg-pitch-900/80 backdrop-blur-xl">
      <div className="border-b border-surface-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 font-display text-lg font-bold text-pitch-950">
            AS
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-white">AI Scout</h1>
            <p className="text-xs text-slate-400">Olheiro inteligente</p>
          </div>
        </div>
        {career && (
          <div className="mt-4 rounded-xl bg-white/5 px-3 py-2">
            <p className="truncate text-sm font-medium text-teal-200">{career.clubName}</p>
            <p className="text-xs text-slate-500">
              Rodada {career.currentRound} · Rep. {career.reputation}
            </p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-500/15 text-teal-200"
                  : "text-slate-400 hover:bg-surface-hover hover:text-slate-200"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-border p-4 text-xs text-slate-500">
        <Link to="/welcome" className="mb-3 block text-teal-500/80 hover:text-teal-400">
          Nova carreira →
        </Link>
        <div className="flex items-center gap-2">
          {backendOnline ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-teal-400" />
              <span>API conectada</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-amber-500/80" />
              <span>Modo local (demo)</span>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
