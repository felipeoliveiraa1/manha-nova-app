import Link from "next/link";
import { notFound } from "next/navigation";
import { HISTORIAS } from "@/lib/seed/historias";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default async function HistoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = HISTORIAS.find((x) => x.slug === slug);
  if (!h) notFound();

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar/historias"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          História · {h.ref}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">
          {h.titulo}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Personagens: {h.personagens.join(", ")}
        </p>
      </header>

      <Card className="mb-4">
        <CardContent className="p-5">
          <p className="leading-relaxed text-foreground/90">{h.resumo}</p>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5">
          <p className="text-[11px] uppercase tracking-wider text-primary">
            Lição
          </p>
          <p className="mt-2 font-serif text-base">{h.licao}</p>
        </CardContent>
      </Card>
    </div>
  );
}
