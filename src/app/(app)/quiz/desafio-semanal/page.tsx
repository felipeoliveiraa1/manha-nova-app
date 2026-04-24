import Link from "next/link";
import { listQuizPerguntas } from "@/lib/repo/quiz";
import { QuizGame } from "@/components/features/quiz-game";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";

export default async function DesafioSemanalPage() {
  // 10 perguntas — o triplo do quiz normal.
  const perguntas = await listQuizPerguntas(10);

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/quiz"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Desafio da semana
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold">
          10 perguntas · 100 pts
        </h1>
      </header>

      <Card className="mb-6 border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4 text-sm">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Responda as 10 sem consultar pra ganhar +100 pontos de bônus.
            Disponível de segunda a domingo.
          </p>
        </CardContent>
      </Card>

      <QuizGame perguntas={perguntas} />
    </div>
  );
}
