import Link from "next/link";
import { listTrilhas } from "@/lib/repo/trilhas";
import { Card, CardContent } from "@/components/ui/card";
import { Compass } from "lucide-react";

export default async function TrilhasPage() {
  const trilhas = await listTrilhas();

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Trilhas</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Jornadas temáticas de 7 a 21 dias.
      </p>

      <div className="grid gap-3">
        {trilhas.map((t) => (
          <Link key={t.id} href={`/trilhas/${t.slug}`}>
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold">
                    {t.titulo}
                  </h3>
                  {t.descricao && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.descricao}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-primary">
                    {t.duracao_dias} dias
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
