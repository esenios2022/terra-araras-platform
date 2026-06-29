"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { IntakeMessage } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default function IntakeChat({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [messages, setMessages] = useState<IntakeMessage[]>([
    { role: "assistant", content: t.intake.greeting },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;

    const userMessage: IntakeMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text, locale }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error");

      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t.intake.error }]);
    } finally {
      setLoading(false);
    }
  }

  function sendForm(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="mx-auto flex h-[75vh] max-w-2xl flex-col rounded-2xl bg-white/70 shadow-sm">
      <div className="flex items-center justify-end border-b border-terra/10 p-3">
        <Link
          href="/dashboard/biblioteca"
          className="text-sm font-medium text-terra hover:underline"
        >
          {t.intake.goToLibrary}
        </Link>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-terra text-terra-sand"
                : "bg-terra-sand text-terra-dark"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <p className="text-xs text-terra-dark/50">{t.intake.typing}</p>}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {t.intake.quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => send(reply)}
              disabled={loading}
              className="rounded-full border border-terra/30 px-3 py-1.5 text-xs text-terra-dark hover:bg-terra/10 disabled:opacity-60"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={sendForm} className="flex gap-2 border-t border-terra/10 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.intake.placeholder}
          className="flex-1 rounded-full border border-terra/30 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-terra px-5 py-2 text-sm font-semibold text-terra-sand disabled:opacity-60"
        >
          {t.intake.send}
        </button>
      </form>
    </div>
  );
}
