import Link from "next/link";
import { LogIn, UserPlus, Lock } from "lucide-react";
import { getUserTier } from "@/lib/auth/guards";
import { buttonVariants } from "@/components/ui/button";

/**
 * Server component que bloqueia conteudo pra guests (nao cadastrados).
 * Free e premium passam direto.
 *
 * Uso:
 *   <AuthGate feature="Devocional completo">
 *     <ConteudoCompleto />
 *   </AuthGate>
 */
export async function AuthGate({
  feature,
  children,
}: {
  feature: string;
  children: React.ReactNode;
}) {
  const tier = await getUserTier();
  if (tier !== "guest") return <>{children}</>;

  return (
    <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-card to-primary/5 p-6 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Lock className="h-6 w-6" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
        Conteúdo pra cadastrados
      </p>
      <h3 className="mt-2 font-serif text-xl font-semibold">{feature}</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
        Faça seu cadastro grátis pra ler o devocional completo, salvar
        anotações e marcar como concluído.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link href="/cadastro" className={buttonVariants({ size: "sm" })}>
          <UserPlus className="h-4 w-4" />
          Criar conta grátis
        </Link>
        <Link
          href="/login"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <LogIn className="h-4 w-4" />
          Já tenho conta
        </Link>
      </div>
    </div>
  );
}
