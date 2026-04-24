"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type Msg = {
  role: "user" | "assistant";
  content: string;
};

const SUGESTOES = [
  "Estou com muita ansiedade hoje",
  "Preciso de forças pra perdoar alguém",
  "Como confiar em Deus quando não vejo resposta?",
  "O que fazer quando tudo parece pesado?",
];

export function AiChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [conversaId, setConversaId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content }]);
    setPending(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: content, conversaId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Falha ao conectar com a IA.");
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              data.error ??
              "Desculpe, não consegui responder agora. Tente novamente em instantes.",
          },
        ]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.resposta }]);
        if (data.conversaId) setConversaId(data.conversaId);
      }
    } catch {
      toast.error("Falha de conexão.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Olá, estou aqui.</p>
                <p className="text-xs text-muted-foreground">
                  Fale o que estiver no coração. Sugestões:
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-md border border-border p-3 text-left text-sm transition hover:border-primary/40 hover:bg-card"
                >
                  {s}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div
        ref={scrollRef}
        className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-6 rounded-xl rounded-br-sm bg-primary/15 p-3 text-sm"
                : "mr-6 rounded-xl rounded-bl-sm border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap"
            }
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="mr-6 flex items-center gap-2 rounded-xl rounded-bl-sm border border-border bg-card p-3 text-sm text-muted-foreground">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
            </span>
            Buscando uma resposta...
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="O que você quer conversar?"
          rows={2}
          className="min-h-[44px] flex-1 resize-none rounded-md border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="icon" disabled={pending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
        A IA não substitui pastor, terapeuta ou médico. Se estiver em crise,
        ligue 188 (CVV) ou 192 (SAMU).
      </p>
    </div>
  );
}
