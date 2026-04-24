import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Flame,
  BookOpen,
  Sparkles,
  Target,
  PenLine,
  Shield,
  Check,
  ArrowRight,
  Mail,
  CreditCard,
  Sunrise,
} from "lucide-react";
import { FadeIn } from "@/components/landing/fade-in";
import { PhoneMockup } from "@/components/landing/phone-mockup";
import { StickyCta } from "@/components/landing/sticky-cta";
import { FaqAccordion } from "@/components/landing/faq-accordion";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      <StickyCta href={CHECKOUT_URL} />

      {/* ===== Header fixo ===== */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 font-serif text-lg font-semibold">
            <Sunrise className="h-4 w-4 text-primary" />
            Manhã Nova
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Entrar
            </Link>
            <a
              href={CHECKOUT_URL}
              className={buttonVariants({ size: "sm" })}
            >
              <span className="hidden sm:inline">Assinar R$29,90</span>
              <span className="sm:hidden">Assinar</span>
            </a>
          </nav>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[120%] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(43_74%_57%/0.18),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background"
        />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-24 md:grid-cols-2 md:gap-8 md:pt-24">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sunrise className="h-3 w-3" />
              Sua rotina com Deus, todo dia
            </span>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              A primeira coisa do seu dia não precisa ser o{" "}
              <span className="text-primary">Instagram</span>.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Manhã Nova é o app que substitui o scroll matinal por{" "}
              <strong className="text-foreground">5 minutos com Deus</strong> —
              devocional, oração, missão do dia e a Bíblia completa. Menos
              ruído, mais propósito.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <a
                href={CHECKOUT_URL}
                className={buttonVariants({ size: "lg" })}
              >
                Assinar por R$29,90/mês
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-xs text-muted-foreground">
                7 dias de garantia · Cancele quando quiser · Pagamento seguro
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <PhoneMockup />
          </FadeIn>
        </div>
      </section>

      {/* ===== Problema ===== */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <FadeIn>
            <h2 className="max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              Você sabe que devia. Mas{" "}
              <span className="text-primary">22h31</span>, a alma cansada, a
              Bíblia fechada.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Não é falta de fé. É falta de <em>ambiente</em>.
            </p>
          </FadeIn>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {DORES.map((dor, i) => (
              <FadeIn key={dor} delay={i * 0.08}>
                <div className="rounded-xl border border-border bg-card/50 p-6">
                  <p className="font-serif text-lg leading-snug">{dor}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Solução ===== */}
      <section className="border-t border-border/50 bg-linear-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
          <FadeIn>
            <p className="font-serif text-2xl leading-relaxed text-muted-foreground sm:text-3xl">
              E se, pela manhã, o primeiro app que você abrisse{" "}
              <span className="text-foreground">te lembrasse quem você é?</span>
            </p>
            <p className="mt-6 font-serif text-xl text-primary sm:text-2xl">
              Foi pra isso que construímos o Manhã Nova.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <FadeIn>
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                O que tem dentro
              </p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                Tudo que você precisa, nada que distrai.
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <div className="group h-full rounded-xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary transition group-hover:bg-primary/25">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Diferencial ===== */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <FadeIn>
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                O diferencial
              </p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                Não é mais um app de versículo do dia.
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-4 md:grid-cols-2">
            {DIFERENCIAIS.map((d, i) => (
              <FadeIn key={d.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-xl border border-primary/20 bg-background/60 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <d.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold">
                      {d.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {d.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Como funciona ===== */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <FadeIn>
            <div className="mb-14 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Como funciona
              </p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                Em 3 passos, do pagamento ao primeiro devocional.
              </h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.12}>
                <div className="relative h-full rounded-xl border border-border bg-card p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="mb-3 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Versículo-âncora ===== */}
      <section className="border-t border-border/50 bg-linear-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <FadeIn>
            <Sunrise className="mx-auto mb-6 h-8 w-8 text-primary" />
            <blockquote className="font-serif text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
              &ldquo;As misericórdias do Senhor são a causa de não sermos
              consumidos, porque as suas misericórdias não têm fim;{" "}
              <span className="text-primary">novas são cada manhã</span>.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm font-medium tracking-wider text-muted-foreground">
              LAMENTAÇÕES 3:22-23
            </p>
            <p className="mt-8 text-sm text-muted-foreground">
              É daqui que o nome vem.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== Preço ===== */}
      <section id="preco" className="border-t border-border/50">
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
          <FadeIn>
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Investimento
              </p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                Tudo por menos de{" "}
                <span className="text-primary">R$1 por dia</span>.
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-primary/40 bg-linear-to-br from-card to-primary/5 p-8 shadow-xl shadow-primary/5 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
              />
              <div className="relative">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span className="font-serif text-6xl font-semibold tracking-tight text-primary">
                    29
                  </span>
                  <span className="font-serif text-3xl font-semibold text-primary">
                    ,90
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    /mês
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Acesso completo, sem limite.
                </p>

                <ul className="mt-6 grid gap-2.5">
                  {INCLUSO.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={CHECKOUT_URL}
                  className={buttonVariants({
                    size: "lg",
                    className: "mt-8 w-full",
                  })}
                >
                  Começar minha rotina
                  <ArrowRight className="h-4 w-4" />
                </a>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Cancele quando quiser · Pagamento seguro via Greenn
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== Garantia ===== */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <FadeIn>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
              7 dias de garantia incondicional.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Se nesses 7 dias você sentir que o Manhã Nova não é pra você,
              devolvemos{" "}
              <strong className="text-foreground">100% do valor</strong>. Sem
              precisar justificar, sem ligação, sem pergunta.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
          <FadeIn>
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Dúvidas
              </p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                Antes de você decidir.
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <FaqAccordion items={FAQ} />
          </FadeIn>
        </div>
      </section>

      {/* ===== CTA Final ===== */}
      <section className="border-t border-border/50 bg-linear-to-t from-primary/10 to-transparent">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <FadeIn>
            <p className="mb-4 font-serif text-lg italic text-primary">
              Novas são cada manhã.
            </p>
            <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">
              Amanhã de manhã, começa de novo.{" "}
              <span className="text-primary">Com Ele.</span>
            </h2>
            <div className="mt-10 flex flex-col items-center gap-3">
              <a
                href={CHECKOUT_URL}
                className={buttonVariants({ size: "lg" })}
              >
                Assinar por R$29,90/mês
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-xs text-muted-foreground">
                Cancele quando quiser · 7 dias de garantia
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border/50">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <span className="flex items-center gap-2 font-serif text-sm font-semibold text-foreground">
            <Sunrise className="h-4 w-4 text-primary" />
            Manhã Nova
          </span>
          <nav className="flex items-center gap-5">
            <Link href="/login" className="hover:text-foreground">
              Entrar
            </Link>
            <Link href="/esqueci-senha" className="hover:text-foreground">
              Esqueci a senha
            </Link>
            <a href={CHECKOUT_URL} className="hover:text-foreground">
              Assinar
            </a>
          </nav>
          <p>© {new Date().getFullYear()} Manhã Nova</p>
        </div>
      </footer>
    </div>
  );
}

const DORES = [
  "Abre a Bíblia segunda. Esquece quarta. Culpa domingo.",
  "Tenta devocional no YouTube. Vira consumo, não encontro.",
  "Quer orar, mas trava. Não sabe por onde começar.",
  "Sente Deus distante e não acha o caminho de volta.",
];

const FEATURES = [
  {
    title: "Central diária",
    desc: "Versículo, devocional, missão, oração e reflexão. Todo dia, no mesmo lugar.",
    icon: Flame,
  },
  {
    title: "Bíblia completa",
    desc: "31.000+ versos em ACF com busca por significado, marcações e notas.",
    icon: BookOpen,
  },
  {
    title: "IA Espiritual",
    desc: "Conte o que sente. Receba versículo real, aplicação e oração em segundos.",
    icon: Sparkles,
  },
  {
    title: "Missões e trilhas",
    desc: "Desafios diários + jornadas de 7 a 21 dias. Sem mais piloto automático.",
    icon: Target,
  },
  {
    title: "Diário espiritual",
    desc: "Registra orações, emoções e evolução. Lembra das respostas que Deus te deu.",
    icon: PenLine,
  },
  {
    title: "Sem distração",
    desc: "Sem anúncios, sem algoritmo, sem ruído. Só você e a Palavra.",
    icon: Shield,
  },
];

const DIFERENCIAIS = [
  {
    title: "Bíblia inteira, não só trechos",
    desc: "31.102 versos da ACF completos — não só o versículo do dia que todo mundo tem.",
    icon: BookOpen,
  },
  {
    title: "Busca por significado",
    desc: "Digita 'ansiedade' e acha versos sobre paz, confiança e medo — mesmo sem a palavra literal.",
    icon: Sparkles,
  },
  {
    title: "IA que cita versículo real",
    desc: "Tecnologia RAG com embeddings garante que nunca inventa — só cita o que está escrito.",
    icon: Flame,
  },
  {
    title: "Gamificação que vira hábito",
    desc: "Streak diário, conquistas, níveis. Não é pontuação vazia — é progresso visível.",
    icon: Target,
  },
];

const STEPS = [
  {
    title: "Assine",
    desc: "Checkout seguro no Greenn. Pix, cartão ou boleto. Leva 1 minuto.",
    icon: CreditCard,
  },
  {
    title: "Receba na hora",
    desc: "Email com seu acesso (email + senha) chega em segundos. Sem esperar aprovação.",
    icon: Mail,
  },
  {
    title: "Abra todo dia",
    desc: "5 minutos bastam. O app te lembra. A rotina faz o resto.",
    icon: Sunrise,
  },
];

const INCLUSO = [
  "Bíblia ACF completa (31.000+ versos)",
  "Devocionais diários e séries temáticas",
  "IA Espiritual ilimitada (30 msgs/dia)",
  "Missões, desafios e conquistas",
  "Trilhas de 7 a 21 dias",
  "Diário espiritual com gráfico de evolução",
  "Quiz bíblico e conquistas",
  "Atualizações semanais de conteúdo",
];

const FAQ = [
  {
    q: "Funciona no iPhone e Android?",
    a: "Sim. É um webapp (PWA). Abre no Safari, Chrome, Edge e Firefox. Pode instalar na tela inicial e usar como app nativo.",
  },
  {
    q: "Preciso baixar na App Store ou Play Store?",
    a: "Não. Acesso direto pelo link que chega por email. Sem esperar aprovação de loja, sem ocupar espaço do celular.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Direto no painel do Greenn, um clique, sem burocracia e sem ligação.",
  },
  {
    q: "Se eu cancelar, perco meu diário e notas?",
    a: "Não. Tudo fica salvo no nosso banco. Se reassinar depois, volta exatamente como estava.",
  },
  {
    q: "Tem versão gratuita?",
    a: "Não. Todo o conteúdo, a IA e a Bíblia completa estão inclusos por R$29,90/mês. Sem anúncios, sem upsell, sem cascata de planos.",
  },
  {
    q: "Como recebo meu acesso depois da compra?",
    a: "Na hora. Você recebe um email com seu email de login e uma senha gerada em segundos. 1 clique no botão do email e você está dentro.",
  },
  {
    q: "E se eu não conseguir logar?",
    a: "Use 'Esqueci minha senha' na tela de login. Chega um novo email com link em instantes. Se ainda assim travar, responde esse email que a gente resolve.",
  },
];
