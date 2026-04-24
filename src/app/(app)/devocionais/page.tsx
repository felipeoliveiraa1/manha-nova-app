import Link from "next/link";
import { listDevocionais, listSeries } from "@/lib/repo/devocionais";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, BookOpen } from "lucide-react";
import { requireActiveSubscription } from "@/lib/auth/guards";

export default async function DevocionaisPage() {
  await requireActiveSubscription();
  const [devocionais, series] = await Promise.all([
    listDevocionais(),
    listSeries(),
  ]);

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Devocionais</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Uma pausa diária e jornadas temáticas.
      </p>

      <section className="mb-8">
        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Séries
        </h2>
        <div className="grid gap-3">
          {series.map((s) => (
            <Link key={s.id} href={`/devocionais/series/${s.slug}`}>
              <Card className="transition hover:border-primary/40">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-base font-semibold">
                      {s.titulo}
                    </h3>
                    {s.descricao && (
                      <p className="text-xs text-muted-foreground">
                        {s.descricao}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Devocionais diários
        </h2>
        <div className="grid gap-3">
          {devocionais.map((d) => (
            <Link key={d.id} href={`/devocionais/${d.slug}`}>
              <Card className="transition hover:border-primary/40">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-base font-semibold">
                      {d.titulo}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {d.versiculo_ref} · {d.tempo_min} min
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
