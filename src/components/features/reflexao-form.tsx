"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { salvarReflexaoAction } from "@/lib/auth/actions-app";
import { toast } from "sonner";

export function ReflexaoForm({ pergunta }: { pergunta: string }) {
  const [texto, setTexto] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!texto.trim()) return;
    const fd = new FormData();
    fd.set("texto", texto);
    fd.set("pergunta", pergunta);
    startTransition(async () => {
      const res = await salvarReflexaoAction(fd);
      if (res.ok) {
        toast.success(res.preview ? "Salvo (preview)" : "Reflexão salva no diário");
        setTexto("");
      } else {
        toast.error(res.error ?? "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <p className="font-serif text-base leading-snug">{pergunta}</p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva sua resposta..."
        className="min-h-[72px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button
        type="submit"
        size="sm"
        disabled={pending || !texto.trim()}
        className="self-end"
      >
        {pending ? "Salvando..." : "Salvar no diário"}
      </Button>
    </form>
  );
}
