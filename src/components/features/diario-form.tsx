"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { salvarDiarioAction } from "@/lib/auth/actions-app";
import { toast } from "sonner";
import {
  Wind,
  HandHeart,
  Smile,
  Frown,
  Angry,
  CloudDrizzle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const EMOCOES: {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "paz", label: "Paz", Icon: Wind },
  { id: "gratidao", label: "Gratidão", Icon: HandHeart },
  { id: "alegria", label: "Alegria", Icon: Smile },
  { id: "esperanca", label: "Esperança", Icon: Sparkles },
  { id: "ansiedade", label: "Ansiedade", Icon: AlertCircle },
  { id: "tristeza", label: "Tristeza", Icon: Frown },
  { id: "raiva", label: "Raiva", Icon: Angry },
  { id: "medo", label: "Medo", Icon: CloudDrizzle },
];

export function DiarioForm() {
  const router = useRouter();
  const [emocao, setEmocao] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!texto.trim()) {
      toast.error("Escreva algo antes de salvar.");
      return;
    }
    const fd = new FormData();
    fd.set("texto", texto);
    if (emocao) fd.set("emocao", emocao);
    startTransition(async () => {
      const res = await salvarDiarioAction(fd);
      if (res.ok) {
        toast.success(res.preview ? "Salvo (modo preview)" : "Entrada salva");
        router.push("/diario");
      } else {
        toast.error(res.error ?? "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
          Como você está?
        </p>
        <div className="grid grid-cols-4 gap-2">
          {EMOCOES.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setEmocao(e.id === emocao ? null : e.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-[11px] transition",
                emocao === e.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40",
              )}
            >
              <e.Icon className="h-5 w-5" />
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
          Sua reflexão
        </p>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="O que Deus falou com você? Pelo que você é grato? O que pesou?"
          className="min-h-[220px] w-full resize-none rounded-md border border-input bg-background p-4 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" size="lg" disabled={pending || !texto.trim()}>
        {pending ? "Salvando..." : "Salvar entrada"}
      </Button>
    </form>
  );
}
