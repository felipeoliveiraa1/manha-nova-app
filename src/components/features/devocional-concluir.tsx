"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { concluirDevocionalAction } from "@/lib/auth/actions-app";
import { useActionHandler } from "@/lib/auth/use-action-handler";

export function DevocionalConcluir({
  devocionalSlug,
  jaConcluido = false,
  anotacaoSalva = "",
}: {
  devocionalSlug: string;
  jaConcluido?: boolean;
  anotacaoSalva?: string;
}) {
  const router = useRouter();
  const handle = useActionHandler();
  const [done, setDone] = useState(jaConcluido);
  const [anotacao, setAnotacao] = useState(anotacaoSalva);
  const [pending, startTransition] = useTransition();

  function onConcluir() {
    const fd = new FormData();
    fd.set("devocional_slug", devocionalSlug);
    if (anotacao) fd.set("anotacao", anotacao);
    startTransition(async () => {
      const res = await concluirDevocionalAction(fd);
      if (handle(res, "Devocional concluído! +15 pontos")) {
        setDone(true);
        router.refresh();
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
