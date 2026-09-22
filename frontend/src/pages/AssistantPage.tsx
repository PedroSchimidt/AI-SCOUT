import { useEffect, useRef, useState } from "react";
import { Send, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

const suggestions = [
  "Como escalo para a próxima partida?",
  "Quem devo contratar no mercado?",
  "Analise meu elenco",
];

export function AssistantPage() {
  const chat = useGameStore((s) => s.chat);
  const sendChat = useGameStore((s) => s.sendChat);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const submit = (text: string) => {
    sendChat(text);
    setInput("");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="border-b border-surface-border px-6 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Assistente IA</h1>
            <p className="text-sm text-slate-400">
              Respostas locais inteligentes · integração Grok quando a API estiver pronta
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden p-4 md:p-6">
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-2xl border border-white/5 bg-black/20 p-4">
          {chat.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-teal-600/30 text-teal-50"
                    : "glass-panel !rounded-2xl text-slate-200"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400 transition hover:border-teal-500/30 hover:text-teal-200"
              onClick={() => submit(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao olheiro..."
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-teal-500/30"
          />
          <button type="submit" className="btn-primary !px-4" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
