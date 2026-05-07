import Link from "next/link";
import { Crown, Lock } from "lucide-react";
import { getUserTier } from "@/lib/auth/guards";

/**
 * Server component que bloqueia conteudo se o user nao for premium.
 * - guest (deslogado): mostra paywall + CTA login/cadastro
 * - free: mostra paywall + CTA upgrade
 * - premium: renderiza children
 *
 * Uso:
 *   <PremiumGate feature="Estudos com Yan">
 *     <ConteudoPremium />
 *   </PremiumGate>
 */
export async function PremiumGate({
  feature,
  children,
}: {
  feature: string;
  children: React.ReactNode;
}) {
  const tier = await getUserTier();
  if (tier === "premium") return <>{children}</>;

  return (
    <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-card to-primary/5 p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Lock className="h-6 w-6" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
        Conteúdo Premium
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold">{feature}</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
        Esse conteúdo faz parte do plano Premium com Yan. Assine pra desbloquear
        devocionais em vídeo, estudos teológicos, webinários e desafios.
      </p>
      <Link
        href={tier === "guest" ? "/login" : "/upgrade"}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Crown className="h-4 w-4" />
        {tier === "guest" ? "Entrar pra continuar" : "Conhecer Premium"}
      </Link>
    </div>
  );
}
