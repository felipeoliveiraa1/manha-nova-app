import Link from "next/link";
import { getRankingSemanal } from "@/lib/repo/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Medal } from "lucide-react";

export default async function RankingPage() {
  const ranking = await getRankingSemanal();

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/quiz"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Ranking semanal
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold">
          Top do Quiz
        </h1>
      </header>

      <Card>
        <CardContent className="divide-y divide-border p-0">
          {ranking.map((r, idx) => (
            <div
              key={`${r.nome}-${idx}`}
              className="flex items-center gap-3 px-4 py-3"
            >
              {idx < 3 ? (
                <Medal
                  className={
                    idx === 0
                      ? "h-5 w-5 text-yellow-400"
                      : idx === 1
                        ? "h-5 w-5 text-zinc-300"
                        : "h-5 w-5 text-amber-600"
                  }
                />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center text-[11px] text-muted-foreground">
                  {idx + 1}
                </span>
              )}
              <span className="flex-1 text-sm">{r.nome}</span>
              <span className="text-sm font-semibold text-primary">
                {r.pontos}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
