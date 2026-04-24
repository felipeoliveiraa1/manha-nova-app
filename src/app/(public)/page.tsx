import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Flame, BookOpen, Sparkles, Target, PenLine } from "lucide-react";

const KIWIFY_CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-serif text-lg font-semibold">
          <Flame className="h-4 w-4 text-primary" />
          Manhã Nova
        </span>
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Entrar
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section className="flex flex-col items-center gap-6 py-14 text-center">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            Sua rotina com Deus, todo dia
          </span>
          <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            O app que transforma tempo com Deus em{" "}
            <span className="text-primary">hábito</span>.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Devocional, bíblia completa, missões, IA espiritual, diário e muito
            mais. Pensado para criar constância, não só consumir conteúdo.
          </p>
          <div className="flex flex-col items-center gap-2 pt-2">
            <a
              href={KIWIFY_CHECKOUT_URL}
              className={buttonVariants({ size: "lg" })}
            >
              Começar agora · R$29,90/mês
            </a>
            <p className="text-xs text-muted-foreground">
              Cancele quando quiser · Pagamento seguro
            </p>
          </div>
        </section>

        <section className="grid gap-4 pt-8 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Manhã Nova
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Central diária",
    desc: "Versículo, devocional, missão, oração e reflexão. Um lugar para começar o dia.",
    icon: Flame,
  },
  {
    title: "Bíblia completa",
    desc: "Leitura offline, busca inteligente, marcações, notas e áudio.",
    icon: BookOpen,
  },
  {
    title: "IA Espiritual",
    desc: "Conte o que está sentindo e receba versículo, direcionamento e oração.",
    icon: Sparkles,
  },
  {
    title: "Missões e trilhas",
    desc: "Desafios diários e jornadas temáticas para disciplina espiritual.",
    icon: Target,
  },
  {
    title: "Diário espiritual",
    desc: "Registre orações, emoções e veja sua evolução ao longo do tempo.",
    icon: PenLine,
  },
];
