import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Newspaper } from "lucide-react";

const POSTS = [
  {
    titulo: "5 hábitos para ter uma rotina constante com Deus",
    resumo:
      "Pequenas práticas que transformam sua relação com a Palavra ao longo do ano.",
    tempo_min: 6,
  },
  {
    titulo: "Por que a ansiedade não é o fim da sua fé",
    resumo:
      "A Bíblia está cheia de heróis ansiosos. E o que eles fizeram com isso.",
    tempo_min: 5,
  },
  {
    titulo: "Como memorizar versículos sem sofrer",
    resumo:
      "Um método simples pra gravar a Palavra no coração sem virar legalismo.",
    tempo_min: 4,
  },
];

export default function BlogPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">Blog</h1>

      <div className="grid gap-3">
        {POSTS.map((p) => (
          <Card key={p.titulo}>
            <CardContent className="flex items-start gap-3 p-4">
              <Newspaper className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <h3 className="font-serif text-base font-semibold">
                  {p.titulo}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {p.resumo}
                </p>
                <p className="mt-1 text-[11px] text-primary">
                  {p.tempo_min} min
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
