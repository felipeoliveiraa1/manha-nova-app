import Link from "next/link";
import { TopHeader } from "@/components/layout/top-header";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { BookOpen, Headphones, CheckCircle2, Flame, Target } from "lucide-react";
import { versiculoDoDia } from "@/lib/seed/versiculos";
import { perguntaDoDia } from "@/lib/seed/perguntas-reflexao";
import { getDevocionalDoDia } from "@/lib/repo/devocionais";
import { getMissaoDoDia } from "@/lib/repo/missoes";
import { getMensagemDoDia } from "@/lib/repo/mensagens";
import { getCurrentUser } from "@/lib/auth/user";
import { missoesConcluidasHoje } from "@/lib/repo/stats";
import { OracaoForm } from "@/components/features/oracao-form";
import { MissionConcluirButton } from "@/components/features/mission-concluir-button";
import { ReflexaoForm } from "@/components/features/reflexao-form";
import { IniciarDiaCta } from "@/components/features/iniciar-dia-cta";
import { VideoPlayer } from "@/components/features/video-player";
import { requireActiveSubscription } from "@/lib/auth/guards";

export default async function HomePage() {
  await requireActiveSubscription();
  const user = await getCurrentUser();
  const [versiculo, devocional, missao, mensagem, missoesHoje] =
    await Promise.all([
      Promise.resolve(versiculoDoDia()),
      getDevocionalDoDia(),
      getMissaoDoDia(),
      getMensagemDoDia(),
      user.isPreview ? Promise.resolve(3) : missoesConcluidasHoje(user.id),
    ]);

  return (
    <div>
      <TopHeader />

      <main className="flex flex-col gap-4 px-4 pb-8">
        {/* Bloco 1 — Versículo do dia */}
        <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary">
              Versículo do dia
            </span>
            <p className="font-serif text-xl leading-snug">
              &ldquo;{versiculo.texto}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground">{versiculo.ref}</p>
            <div className="flex gap-2">
              <Link
                href={`/biblia/busca?q=${encodeURIComponent(versiculo.ref)}`}
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                <BookOpen className="h-4 w-4" /> Meditar
              </Link>
              <Link
                href="/audio"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Headphones className="h-4 w-4" /> Ouvir
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Bloco 2 — Devocional */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Devocional de hoje
              </p>
              <h3 className="font-serif text-base font-semibold leading-tight">
                {devocional.titulo}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {devocional.tempo_min} min de leitura
              </p>
            </div>
            <Link
              href={`/devocionais/${devocional.slug}`}
              className={buttonVariants({ size: "sm" })}
            >
              Ler agora
            </Link>
          </CardContent>
        </Card>

        {/* Bloco 3 — Missão */}
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Missão do dia
              </p>
              <p className="text-sm">{missao.titulo}</p>
              {missao.descricao && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {missao.descricao}
                </p>
              )}
            </div>
            <MissionConcluirButton missaoId={missao.id} />
          </CardContent>
        </Card>

        {/* Bloco 4 — Oração rápida */}
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Oração rápida
            </p>
            <OracaoForm />
          </CardContent>
        </Card>

        {/* Bloco 5 — Reflexão */}
        <Card>
          <CardContent className="flex flex-col gap-3 p-5">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Reflexão
            </p>
            <ReflexaoForm pergunta={perguntaDoDia()} />
          </CardContent>
        </Card>

        {/* Bloco 6 — Progresso */}
        <Card>
          <CardContent className="grid grid-cols-3 divide-x divide-border p-0">
            {[
              {
                label: "Streak",
                value: String(user.profile.streak_dias),
                icon: <Flame className="h-3.5 w-3.5" />,
              },
              {
                label: "Missões hoje",
                value: String(missoesHoje),
                icon: <Target className="h-3.5 w-3.5" />,
              },
              {
                label: "Minutos",
                value: String(user.profile.tempo_com_deus_min),
                icon: null,
              },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center p-4">
                <span className="font-serif text-2xl font-semibold text-primary">
                  {s.value}
                </span>
                <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.icon}
                  {s.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bloco 7 — CTA principal */}
        <IniciarDiaCta />

        {/* Bloco 8 — Mensagem do dia */}
        <VideoPlayer
          url={mensagem.video_url}
          titulo={mensagem.titulo}
          thumbnail={mensagem.thumbnail_url || null}
          duracao={mensagem.duracao_seg ?? null}
        />

        {/* Bloco 9 — Conexão */}
        <div className="mt-2 flex items-center justify-center gap-4 py-2 text-xs text-muted-foreground">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            @Instagram
          </a>
          <span className="opacity-30">•</span>
          <a
            href="https://youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            YouTube
          </a>
        </div>
      </main>
    </div>
  );
}
