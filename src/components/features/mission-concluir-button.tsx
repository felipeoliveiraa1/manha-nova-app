"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { concluirMissaoAction } from "@/lib/auth/actions-app";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MissionConcluirButton({
  missaoId,
  initiallyDone = false,
  label,
  className,
}: {
  missaoId: string;
  initiallyDone?: boolean;
  label?: string;
  className?: string;
}) {
  const [done, setDone] = useState(initiallyDone);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (done || pending) return;
    const fd = new FormData();
    fd.set("missao_id", missaoId);
    startTransition(async () => {
      const res = await concluirMissaoAction(fd);
      if (res.ok) {
        setDone(true);
        toast.success(
          res.preview
            ? "Missão concluída (modo preview)"
            : "Missão concluída! +10 pontos",
        );
      } else {
        toast.error(res.error ?? "Erro ao concluir.");
      }
    });
  }

  if (label) {
    return (
      <Button
        onClick={onClick}
        disabled={done || pending}
        size="sm"
        variant={done ? "secondary" : "default"}
        className={className}
      >
        <CheckCircle2 className="h-4 w-4" />
        {done ? "Concluída" : label}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={done || pending}
      size="icon"
      variant={done ? "secondary" : "outline"}
      aria-label={done ? "Missão concluída" : "Concluir missão"}
      className={cn(done && "text-emerald-400", className)}
    >
      <CheckCircle2 className="h-5 w-5" />
    </Button>
  );
}
