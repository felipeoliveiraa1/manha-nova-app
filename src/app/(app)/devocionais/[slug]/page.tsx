import Link from "next/link";
import { notFound } from "next/navigation";
import { getDevocional } from "@/lib/repo/devocionais";
import { createClientOrNull } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/user";
import { Card, CardContent } from "@/components/ui/card";
import { DevocionalConcluir } from "@/components/features/devocional-concluir";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

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
