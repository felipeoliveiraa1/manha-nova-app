import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  Check,
  Crown,
  Video,
  GraduationCap,
  Calendar,
  Target,
} from "lucide-react";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

const PREMIUM_FEATURES = [
  { icon: Video, label: "Devocional diário em vídeo com Yan e convidados" },
  { icon: GraduationCap, label: "Estudos teológicos com Yan sobre temas diversos" },
  { icon: Calendar, label: "Webinários ao vivo com Yan" },
  { icon: Target, label: "Plano de estudo da Bíblia teológico" },
  { icon: Crown, label: "Desafios exclusivos com Yan" },
];

export default async function UpgradePage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Crown className="h-8 w-8" />
      </div>

      <h1 className="font-serif text-3xl font-semibold leading-tight">
        Vá além do conteúdo gratuito
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {user.email
          ? `${user.email} — desbloqueie tudo que o Yan preparou pra fortalecer sua caminhada com Deus.`
          : "Desbloqueie tudo que o Yan preparou pra fortalecer sua caminhada com Deus."}
      </p>

      <Card className="mt-8 border-primary/30 bg-linear-to-br from-card to-primary/5">
        <CardContent className="flex flex-col gap-5 p-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
              Premium
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold">
              R$ 29,90<span className="text-sm text-muted-foreground">/mês</span>
            </p>
          </div>

          <ul className="flex flex-col gap-3 text-sm">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{f.label}</span>
              </li>
            ))}
          </ul>

          <a href={CHECKOUT_URL} className={buttonVariants({ size: "lg" })}>
            Assinar agora
          </a>
          <p className="text-center text-[11px] text-muted-foreground">
            7 dias de garantia · Cancele quando quiser
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link
          href="/home"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar pro app
        </Link>
      </div>
    </div>
  );
}
