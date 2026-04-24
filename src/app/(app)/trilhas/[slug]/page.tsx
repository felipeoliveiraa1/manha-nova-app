import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrilha, listDiasDaTrilha } from "@/lib/repo/trilhas";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Lock } from "lucide-react";

export default async function TrilhaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trilha = await getTrilha(slug);
  if (!trilha) notFound();
  const dias = await listDiasDaTrilha(trilha.id);

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/trilhas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Trilha · {trilha.duracao_dias} dias
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">
          {trilha.titulo}
        </h1>
        {trilha.descricao && (
          <p className="mt-2 text-sm text-muted-foreground">
            {trilha.descricao}
          </p>
        )}
      </header>

      <div className="grid gap-2">
        {Array.from({ length: trilha.duracao_dias }).map((_, idx) => {
          const dia = dias.find((d) => d.dia === idx + 1);
          const disponivel = !!dia;
          return (
            <Link
              key={idx}
              href={disponivel ? `/trilhas/${trilha.slug}/${idx + 1}` : "#"}
              className={disponivel ? "" : "pointer-events-none"}
            >
              <Card
                className={
                  disponivel
                    ? "transition hover:border-primary/40"
                    : "opacity-50"
                }
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 font-serif text-primary">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {dia?.titulo ?? `Dia ${idx + 1}`}
                    </p>
                    {dia?.versiculo_ref && (
                      <p className="text-[11px] text-muted-foreground">
                        {dia.versiculo_ref}
                      </p>
                    )}
                  </div>
                  {!disponivel && (
                    <Lock className="h-4 w-4 text-muted-foreground/60" />
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
