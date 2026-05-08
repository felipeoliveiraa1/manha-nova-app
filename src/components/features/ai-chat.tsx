"use client";

import { useState, useRef, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles, AlertCircle, Crown, Lock } from "lucide-react";
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

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "/upgrade";

export function AiChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [conversaId, setConversaId] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
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
      if (res.status === 429 && data.needsUpgrade) {
        setNeedsUpgrade(true);
        return;
      }
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

  if (needsUpgrade) {
    return (
      <div className="flex flex-col gap-4">
        {/* Mantem as mensagens anteriores visiveis */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-3">
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
          </div>
        )}

        <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-card to-primary/5 p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
            Limite gratuito atingido
          </p>
          <h3 className="mt-2 font-serif text-xl font-semibold">
            Você usou suas 5 mensagens de hoje
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            Faça upgrade pra Premium e tenha 30 mensagens por dia + acesso
            completo aos devocionais em vídeo, estudos e webinários do Yan.
          </p>
          <a
            href={CHECKOUT_URL}
            className={`mt-5 inline-flex items-center gap-2 ${buttonVariants({ size: "default" })}`}
          >
            <Crown className="h-4 w-4" />
            Assinar Premium · R$29,90/mês
          </a>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Limite renova amanhã. Cancele quando quiser.
          </p>
        </div>
      </div>
    );
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
