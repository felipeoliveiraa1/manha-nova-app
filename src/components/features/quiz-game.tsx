"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, RotateCcw, Lightbulb } from "lucide-react";
import type { QuizPergunta } from "@/lib/supabase/types";

export function QuizGame({ perguntas }: { perguntas: QuizPergunta[] }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [finished, setFinished] = useState(false);

  if (perguntas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Sem perguntas disponíveis no momento.
        </CardContent>
      </Card>
    );
  }

  if (finished) {
    const total = perguntas.length;
    const pct = Math.round((acertos / total) * 100);
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="font-serif text-5xl font-semibold text-primary">
            {acertos}/{total}
          </span>
          <p className="text-sm text-muted-foreground">
            Você acertou {pct}% · {acertos * 10} pontos
          </p>
          <Button
            onClick={() => {
              setIdx(0);
              setSelected(null);
              setAcertos(0);
              setErros(0);
              setFinished(false);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Jogar de novo
          </Button>
        </CardContent>
      </Card>
    );
  }

  const atual = perguntas[idx];
  const respondeu = selected !== null;

  function escolher(altId: string) {
    if (respondeu) return;
    setSelected(altId);
    if (altId === atual.correta) setAcertos((a) => a + 1);
    else setErros((e) => e + 1);
  }

  function proximo() {
    if (idx < perguntas.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Pergunta {idx + 1}/{perguntas.length}
        </span>
        <span className="flex gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {acertos}
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            {erros}
          </span>
        </span>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <p className="font-serif text-lg leading-snug">{atual.pergunta}</p>
          <div className="flex flex-col gap-2">
            {atual.alternativas.map((a) => {
              const isCorrect = a.id === atual.correta;
              const isPicked = a.id === selected;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => escolher(a.id)}
                  disabled={respondeu}
                  className={cn(
                    "rounded-md border border-border bg-background p-3 text-left text-sm transition",
                    !respondeu && "hover:border-primary/40 hover:bg-card",
                    respondeu && isCorrect && "border-emerald-500/60 bg-emerald-500/10 text-emerald-200",
                    respondeu &&
                      isPicked &&
                      !isCorrect &&
                      "border-rose-500/60 bg-rose-500/10 text-rose-200",
                    respondeu &&
                      !isPicked &&
                      !isCorrect &&
                      "opacity-60",
                  )}
                >
                  {a.texto}
                </button>
              );
            })}
          </div>
          {respondeu && atual.explicacao && (
            <p className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{atual.explicacao}</span>
            </p>
          )}
          {respondeu && (
            <Button onClick={proximo} size="lg">
              {idx < perguntas.length - 1 ? "Próxima" : "Ver resultado"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
