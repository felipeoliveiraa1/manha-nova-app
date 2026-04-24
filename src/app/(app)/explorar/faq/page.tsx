import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const FAQS = [
  {
    q: "Como começar a ler a Bíblia?",
    a: "Comece pelos evangelhos (João é o mais acessível). Depois siga para Gênesis e Salmos. Use um plano de leitura do app.",
  },
  {
    q: "Por que existem tantas versões da Bíblia?",
    a: "Cada tradução tenta equilibrar fidelidade ao original e facilidade de leitura. ACF e ARA são mais literais; NVI e NVT são mais dinâmicas.",
  },
  {
    q: "Posso orar se não sei o que dizer?",
    a: "Sim. Ore com suas palavras mesmo. Deus lê o coração antes das palavras. Use os Salmos como modelo.",
  },
  {
    q: "Como saber a vontade de Deus?",
    a: "Palavra + oração + sabedoria + conselho + paz. Nenhum desses sozinho basta — todos juntos apontam uma direção.",
  },
  {
    q: "Preciso ir à igreja?",
    a: "A fé é pessoal, mas não solitária. Hebreus 10:25 nos exorta a não abandonar a reunião.",
  },
];

export default function FaqPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Perguntas da fé
      </h1>

      <div className="grid gap-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl border border-border bg-card p-4 transition hover:border-primary/40"
          >
            <summary className="cursor-pointer list-none font-medium">
              {f.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
