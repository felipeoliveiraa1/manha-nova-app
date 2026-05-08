import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevocional } from "@/lib/repo/devocionais";
import { createClientOrNull } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getUserTier } from "@/lib/auth/guards";
import {
  hasViewedDevocional,
  countDistinctDevocionais,
  recordFeatureUse,
  FREE_LIMITS,
} from "@/lib/auth/limits";
import { Card, CardContent } from "@/components/ui/card";
import { DevocionalConcluir } from "@/components/features/devocional-concluir";
import { AuthGate } from "@/components/features/auth-gate";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Crown, Lock } from "lucide-react";

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "/upgrade";

export default async function DevocionalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const devocional = await getDevocional(slug);
  if (!devocional) notFound();

  // Estado de conclusao do usuario logado
  let jaConcluido = false;
  let anotacaoSalva = "";
  let bloqueadoPorLimite = false;
  const user = await getCurrentUser();
  if (!user.isPreview) {
    const supabase = await createClientOrNull();
    if (supabase) {
      const { data: devo } = await supabase
        .from("devocionais")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      const realId = (devo as { id: string } | null)?.id;
      if (realId) {
        const { data: prog } = await supabase
          .from("user_devocional_progress")
          .select("anotacao")
          .eq("user_id", user.id)
          .eq("devocional_id", realId)
          .maybeSingle();
        if (prog) {
          jaConcluido = true;
          anotacaoSalva = (prog as { anotacao: string | null }).anotacao ?? "";
        }
      }
    }

    // Limite de devocionais por semana (free 2, premium ilimitado)
    const tier = await getUserTier();
    if (tier === "free") {
      const jaViu = await hasViewedDevocional(user.id, slug);
      if (jaViu) {
        // Reabrindo um devocional ja visto — libera sem consumir quota
      } else {
        const distintos = await countDistinctDevocionais(user.id);
        if (distintos >= FREE_LIMITS.devocional.count) {
          bloqueadoPorLimite = true;
        } else {
          // Registra uso novo (incluindo slug pra detectar reabertura depois)
          await recordFeatureUse(user.id, "devocional", { slug });
        }
      }
    }
  }

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/devocionais"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Devocional · {devocional.tempo_min} min
        </p>
        <div className="mt-2 flex items-start gap-2">
          <h1 className="flex-1 font-serif text-3xl font-semibold leading-tight">
            {devocional.titulo}
          </h1>
          {jaConcluido && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Concluído
            </span>
          )}
        </div>
      </header>

      <Card className="mb-6 border-primary/20 bg-linear-to-br from-card to-primary/5">
        <CardContent className="p-6 text-center">
          <p className="font-serif text-lg leading-snug">
            &ldquo;{devocional.versiculo_texto}&rdquo;
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {devocional.versiculo_ref}
          </p>
        </CardContent>
      </Card>

      <AuthGate feature={devocional.titulo}>
        {bloqueadoPorLimite ? (
          <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-card to-primary/5 p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
              Limite gratuito atingido
            </p>
            <h3 className="mt-2 font-serif text-xl font-semibold">
              Você já leu seus 2 devocionais desta semana
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
              No plano gratuito, são 2 devocionais novos por semana. Faça
              upgrade pra Premium e leia todos os 341 sem limite, com vídeos
              do Yan, estudos e webinários.
            </p>
            <a
              href={CHECKOUT_URL}
              className={`mt-5 inline-flex items-center gap-2 ${buttonVariants({ size: "default" })}`}
            >
              <Crown className="h-4 w-4" />
              Assinar Premium · R$29,90/mês
            </a>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Você pode reabrir devocionais que já leu nesta semana.
            </p>
          </div>
        ) : (
          <>
            <Section titulo="Reflexão" texto={devocional.explicacao} />
            <Section titulo="Aplicação prática" texto={devocional.aplicacao} />
            <Section titulo="Oração" texto={devocional.oracao} />

            {devocional.pergunta && (
              <section className="mb-6">
                <h2 className="mb-2 text-[11px] uppercase tracking-wider text-primary">
                  Para refletir
                </h2>
                <p className="font-serif text-base">{devocional.pergunta}</p>
              </section>
            )}

            <DevocionalConcluir
              devocionalSlug={slug}
              jaConcluido={jaConcluido}
              anotacaoSalva={anotacaoSalva}
            />
          </>
        )}
      </AuthGate>
    </div>
  );
}

function Section({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-[11px] uppercase tracking-wider text-primary">
        {titulo}
      </h2>
      <p className="text-base leading-relaxed text-foreground/90">{texto}</p>
    </section>
  );
}
