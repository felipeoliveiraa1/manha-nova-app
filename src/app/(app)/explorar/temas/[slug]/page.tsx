import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMAS } from "@/lib/seed/temas";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default async function TemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tema = TEMAS.find((t) => t.slug === slug);
  if (!tema) notFound();

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar/temas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Tema
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">
          {tema.titulo}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{tema.descricao}</p>
      </header>

      <div className="grid gap-3">
        {tema.versiculos.map((v) => (
          <Card key={v.ref} className="border-primary/10">
            <CardContent className="p-5">
              <p className="font-serif text-base leading-relaxed">
                &ldquo;{v.texto}&rdquo;
              </p>
              <p className="mt-2 text-xs text-primary">{v.ref}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
