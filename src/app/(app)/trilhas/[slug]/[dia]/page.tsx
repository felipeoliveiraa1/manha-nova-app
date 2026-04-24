import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrilha, getDiaDaTrilha } from "@/lib/repo/trilhas";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, PartyPopper } from "lucide-react";

export default async function DiaTrilhaPage({
  params,
}: {
  params: Promise<{ slug: string; dia: string }>;
}) {
  const { slug, dia: diaStr } = await params;
  const dia = parseInt(diaStr, 10);
  const trilha = await getTrilha(slug);
  if (!trilha || Number.isNaN(dia)) notFound();

  const diaRow = await getDiaDaTrilha(trilha.id, dia);
  if (!diaRow) notFound();

  const temProxima = dia < trilha.duracao_dias;

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href={`/trilhas/${slug}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {trilha.titulo}
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Dia {dia} / {trilha.duracao_dias}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">
          {diaRow.titulo}
        </h1>
      </header>

      {diaRow.versiculo_texto && (
        <Card className="mb-6 border-primary/20 bg-linear-to-br from-card to-primary/5">
          <CardContent className="p-5 text-center">
            <p className="font-serif text-lg leading-snug">
              &ldquo;{diaRow.versiculo_texto}&rdquo;
            </p>
            {diaRow.versiculo_ref && (
              <p className="mt-2 text-xs text-muted-foreground">
                {diaRow.versiculo_ref}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <section className="mb-6">
        <h2 className="mb-2 text-[11px] uppercase tracking-wider text-primary">
          Reflexão
        </h2>
        <p className="leading-relaxed text-foreground/90">{diaRow.conteudo}</p>
      </section>

      {diaRow.pratica && (
        <section className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h2 className="mb-2 text-[11px] uppercase tracking-wider text-primary">
            Prática do dia
          </h2>
          <p className="text-sm leading-relaxed">{diaRow.pratica}</p>
        </section>
      )}

      {temProxima ? (
        <Link
          href={`/trilhas/${slug}/${dia + 1}`}
          className={buttonVariants({ size: "lg" })}
        >
          Concluir e avançar <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
          <PartyPopper className="mx-auto mb-2 h-8 w-8 text-primary" />
          <p className="font-serif text-lg font-semibold text-primary">
            Trilha concluída
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Parabéns pelos {trilha.duracao_dias} dias. Continue firme.
          </p>
        </div>
      )}
    </div>
  );
}
