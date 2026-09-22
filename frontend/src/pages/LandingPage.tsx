import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export function LandingPage() {
  const navigate = useNavigate();
  const startCareer = useGameStore((s) => s.startCareer);
  const resetDemo = useGameStore((s) => s.resetDemo);
  const [club, setClub] = useState("Atlético do Porto");
  const [manager, setManager] = useState("Pedro");

  const enterDemo = () => {
    resetDemo();
    navigate("/");
  };

  const enterNew = () => {
    startCareer(club.trim() || "Meu Clube", manager.trim() || "Treinador");
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 pitch-pattern opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 font-display text-2xl font-black text-pitch-950 shadow-glow">
            AS
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            AI Scout
          </h1>
          <p className="mt-3 text-slate-400">
            Simulador de olheiro de futebol com IA — monte elenco, scout jogadores e viva cada rodada.
          </p>
        </div>

        <div className="glass-panel space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Nome do clube</label>
            <input
              value={club}
              onChange={(e) => setClub(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none ring-teal-500/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Treinador</label>
            <input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-white outline-none ring-teal-500/30 focus:ring-2"
            />
          </div>
          <button type="button" className="btn-primary w-full" onClick={enterNew}>
            <Play className="h-4 w-4" />
            Iniciar carreira
          </button>
          <button type="button" className="btn-ghost w-full" onClick={enterDemo}>
            <Sparkles className="h-4 w-4" />
            Entrar na demo completa
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Dados salvos no navegador · Backend FastAPI em{" "}
          <code className="text-teal-600/80">/api/health</code> quando disponível
        </p>
      </motion.div>
    </div>
  );
}
