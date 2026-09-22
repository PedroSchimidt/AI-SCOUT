import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Wallet, TrendingUp, Calendar } from "lucide-react";
import { useGameStore } from "../store/gameStore";
import { formatMoney } from "../lib/format";

export function DashboardPage() {
  const career = useGameStore((s) => s.career);
  const match = useGameStore((s) => s.match);
  const players = useGameStore((s) => s.players);
  const lineup = useGameStore((s) => s.lineup);

  if (!career) return null;

  const squad = players.filter((p) => p.status === "contracted");
  const market = players.filter((p) => p.status === "available");
  const lineupFilled = lineup.slots.filter((s) => s.playerId).length;
  const avgOvr = Math.round(squad.reduce((a, p) => a + p.overall, 0) / Math.max(1, squad.length));

  const cards = [
    {
      label: "Orçamento",
      value: formatMoney(career.budget),
      icon: Wallet,
      accent: "text-emerald-400",
    },
    {
      label: "Reputação",
      value: String(career.reputation),
      icon: TrendingUp,
      accent: "text-teal-300",
    },
    {
      label: "Média elenco",
      value: String(avgOvr),
      icon: Trophy,
      accent: "text-amber-300",
    },
    {
      label: "Mercado",
      value: `${market.length} jogadores`,
      icon: Calendar,
      accent: "text-violet-300",
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
      <header className="mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-3xl font-bold text-white"
        >
          Painel
        </motion.h1>
        <p className="mt-1 text-slate-400">
          Olá, {career.managerName} — {career.clubName}
        </p>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel flex items-center gap-4 p-4"
          >
            <div className={`rounded-xl bg-white/5 p-3 ${c.accent}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="font-display text-xl font-semibold text-white">{c.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Próxima partida</h2>
            <span className="rounded-full bg-teal-500/15 px-2.5 py-0.5 text-xs font-medium text-teal-300">
              Rodada {match.roundNumber}
            </span>
          </div>
          <div className="flex items-center justify-center gap-6 py-6">
            <div className="text-center">
              <p className="text-sm text-slate-400">Casa</p>
              <p className="font-display text-lg font-bold text-white">{career.clubName}</p>
            </div>
            <div className="font-display text-2xl font-bold text-slate-600">×</div>
            <div className="text-center">
              <p className="text-sm text-slate-400">Visitante</p>
              <p className="font-display text-lg font-bold text-white">{match.opponentName}</p>
            </div>
          </div>
          {match.status === "finished" ? (
            <p className="text-center text-3xl font-bold text-teal-300">
              {match.homeScore} — {match.awayScore}
            </p>
          ) : (
            <p className="text-center text-sm text-slate-500">
              Escalação {lineupFilled}/11 · {lineup.formation}
            </p>
          )}
          <Link to="/match" className="btn-primary mt-6 w-full">
            Ir para partida
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6"
        >
          <h2 className="mb-4 font-display text-lg font-semibold">Atalhos</h2>
          <ul className="space-y-3">
            {[
              { to: "/scouting", title: "Scouting", desc: `${market.length} alvos na rodada ${career.currentRound}` },
              { to: "/tactics", title: "Tática", desc: `${lineup.mentality} · pressing ${lineup.pressing}` },
              { to: "/assistant", title: "Assistente IA", desc: "Pergunte sobre escalação e mercado" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:bg-surface-hover"
                >
                  <div>
                    <p className="font-medium text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
