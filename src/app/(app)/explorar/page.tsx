import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Map,
  Tag,
  Scroll,
  Newspaper,
  MessageCircleQuestion,
} from "lucide-react";

const ITEMS = [
  {
    href: "/explorar/dicionario",
    titulo: "Dicionário bíblico",
    desc: "Definições dos principais termos bíblicos",
    icon: BookOpen,
  },
  {
    href: "/explorar/temas",
    titulo: "Temas da Bíblia",
    desc: "Versículos organizados por tema",
    icon: Tag,
  },
  {
    href: "/explorar/historias",
    titulo: "Histórias bíblicas",
    desc: "As grandes histórias da Escritura",
    icon: Scroll,
  },
  {
    href: "/explorar/mapas",
    titulo: "Mapas bíblicos",
    desc: "Lugares onde a história aconteceu",
    icon: Map,
  },
  {
    href: "/explorar/blog",
    titulo: "Blog",
    desc: "Artigos e reflexões",
    icon: Newspaper,
  },
  {
    href: "/explorar/faq",
    titulo: "Perguntas da fé",
    desc: "Respostas para dúvidas comuns",
    icon: MessageCircleQuestion,
  },
];

export default function ExplorarPage() {
  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Explorar</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Recursos para aprofundar seu estudo.
      </p>

      <div className="grid gap-3">
        {ITEMS.map((it) => (
          <Link key={it.href} href={it.href}>
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-base font-semibold">
                    {it.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground">{it.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
