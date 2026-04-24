import Link from "next/link";
import { notFound } from "next/navigation";
import { findPlano } from "@/lib/seed/planos-leitura";
import { findBookByAbbrev } from "@/lib/seed/bible-books";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const revalidate = 86400;

export default async function PlanoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plano = findPlano(slug);
  if (!plano) notFound();

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/biblia/planos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Planos
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Plano · {plano.dias.length} dias
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">
          {plano.titulo}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{plano.descricao}</p>
      </header>

      <div className="grid gap-2">
        {plano.dias.map((d) => {
          const refs = d.referencias.map((r) => {
            const book = findBookByAbbrev(r.abbrev);
            return book ? `${book.nome} ${r.capitulo}` : `${r.abbrev} ${r.capitulo}`;
          });
          return (
            <Card key={d.dia} className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 font-serif text-primary">
                  {d.dia}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Dia {d.dia}
                  </p>
                  <p className="text-sm">{refs.join(" · ")}</p>
                </div>
                <div className="flex gap-2">
                  {d.referencias.map((r, i) => (
                    <Link
                      key={i}
                      href={`/biblia/${r.abbrev}/${r.capitulo}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border hover:border-primary/40"
                      aria-label={`Abrir ${r.abbrev} ${r.capitulo}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
