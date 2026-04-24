"use client";

import { useTransition } from "react";
import { Sparkles } from "lucide-react";
import { iniciarDiaAction } from "@/lib/auth/actions-app";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function IniciarDiaCta() {
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const res = await iniciarDiaAction();
      if (res.ok) {
        toast.success(
          res.preview ? "Dia iniciado (preview)" : "Bom dia começado! +5 pontos",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res.error ?? "Erro.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border border-primary/40 bg-primary/10 p-5 text-left transition hover:border-primary hover:bg-primary/15 disabled:opacity-60",
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl transition-all group-hover:bg-primary/30" />
      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-wider text-primary">
            Toque pra marcar o dia
          </p>
          <p className="font-serif text-lg font-semibold">
            {pending ? "Iniciando..." : "Começar meu dia com Deus"}
          </p>
        </div>
      </div>
    </button>
  );
}
