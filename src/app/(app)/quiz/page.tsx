import Link from "next/link";
import { listQuizPerguntas, getRankingSemanal } from "@/lib/repo/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { QuizGame } from "@/components/features/quiz-game";
import { Trophy } from "lucide-react";

export default async function QuizPage() {
  const [perguntas, ranking] = await Promise.all([
    listQuizPerguntas(5),
    getRankingSemanal(),
  ]);

  return (
    <div className="px-4 pt-6 pb-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Quiz bíblico</h1>
          <p className="text-sm text-muted-foreground">
            Teste o que você sabe sobre a Palavra.
          </p>
        </div>
        <Link
          href="/quiz/ranking"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Trophy className="h-4 w-4" /> Ranking
        </Link>
      </div>

      <Link
        href="/quiz/desafio-semanal"
        className="mb-6 block"
      >
        <div className="flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/5 p-4 transition hover:border-primary hover:bg-primary/10">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider text-primary">
              Desafio da semana
            </p>
            <p className="font-serif text-sm font-semibold">
              10 perguntas · +100 pts
            </p>
          </div>
          <span className="text-xs text-primary">Jogar →</span>
        </div>
      </Link>

      <QuizGame perguntas={perguntas} />

      <section className="mt-10">
        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Top da semana
        </h2>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {ranking.slice(0, 5).map((r, idx) => (
              <div
                key={`${r.nome}-${idx}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm">{r.nome}</span>
                <span className="text-sm text-muted-foreground">
                  {r.pontos} pts
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
