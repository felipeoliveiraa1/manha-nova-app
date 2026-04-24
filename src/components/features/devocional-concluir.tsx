"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { concluirDevocionalAction } from "@/lib/auth/actions-app";
import { toast } from "sonner";

export function DevocionalConcluir({
  devocionalId,
}: {
  devocionalId: string;
}) {
  const [done, setDone] = useState(false);
  const [anotacao, setAnotacao] = useState("");
  const [pending, startTransition] = useTransition();

  function onConcluir() {
    const fd = new FormData();
    fd.set("devocional_id", devocionalId);
    if (anotacao) fd.set("anotacao", anotacao);
    startTransition(async () => {
      const res = await concluirDevocionalAction(fd);
      if (res.ok) {
        setDone(true);
        toast.success(
          res.preview ? "Concluído (modo preview)" : "Devocional concluído! +15 pontos",
        );
      } else {
        toast.error(res.error ?? "Erro.");
      }
    });
  }

  return (
    <section className="mt-8 flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5">
      <h2 className="text-[11px] uppercase tracking-wider text-primary">
        Sua anotação
      </h2>
      <textarea
        value={anotacao}
        onChange={(e) => setAnotacao(e.target.value)}
        placeholder="O que Deus falou com você hoje?"
        className="min-h-[100px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button onClick={onConcluir} disabled={done || pending} size="lg">
        <CheckCircle2 className="h-4 w-4" />
        {done
          ? "Concluído"
          : pending
            ? "Salvando..."
            : "Concluir devocional"}
      </Button>
    </section>
  );
}
