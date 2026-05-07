import Link from "next/link";
import { Crown, ArrowRight } from "lucide-react";
import { getUserTier } from "@/lib/auth/guards";

/**
 * Banner de upgrade pra users free. Renderiza vazio se user ja e premium
 * ou se nao tem sessao (guest). Server component — zero JS no cliente.
 */
export async function UpgradeBanner() {
  const tier = await getUserTier();
  if (tier !== "free") return null;

  return (
    <Link
      href="/upgrade"
      className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-primary/40 bg-linear-to-r from-primary/15 via-primary/10 to-transparent p-4 transition hover:border-primary"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Crown className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wider text-primary">
          Premium com Yan
        </p>
        <p className="text-sm font-medium">
          Devocionais em vídeo, estudos e webinários
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" />
    </Link>
  );
}
