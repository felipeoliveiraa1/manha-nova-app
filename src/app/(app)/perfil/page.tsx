import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user";
import { createClientOrNull } from "@/lib/supabase/server";
import { listConquistas, listUserConquistas } from "@/lib/repo/conquistas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import {
  Flame,
  Trophy,
  Target,
  Timer,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  Award,
  BookOpen,
  Crown,
  Lock,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  crown: Crown,
  book: BookOpen,
  target: Target,
};

async function getSubscription(userId: string, email: string | null) {
  const supabase = await createClientOrNull();
  if (!supabase || !email) return null;
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .or(`user_id.eq.${userId},email.eq.${email}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as { status: string; current_period_end: string | null } | null;
}

export default async function PerfilPage() {
  const user = await getCurrentUser();
  const [sub, todasConquistas, userConquistas] = await Promise.all([
    user.isPreview ? Promise.resolve(null) : getSubscription(user.id, user.email),
    listConquistas(),
    user.isPreview
      ? Promise.resolve(new Set<string>(["streak-7", "primeiro-devocional"]))
      : listUserConquistas(user.id),
  ]);

  const firstLetter = (user.profile.nome ?? "U").trim().charAt(0).toUpperCase();

  return (
    <div className="px-4 pt-6 pb-8">
      <header className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 font-serif text-2xl font-semibold text-primary">
          {firstLetter}
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold">
            {user.profile.nome ?? "Usuário"}
          </h1>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          {user.isPreview && (
            <p className="mt-1 inline-block rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
              Modo preview
            </p>
          )}
        </div>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Stat
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={user.profile.streak_dias}
        />
        <Stat
          icon={<Timer className="h-5 w-5" />}
          label="Min com Deus"
          value={user.profile.tempo_com_deus_min}
        />
        <Stat
          icon={<Target className="h-5 w-5" />}
          label="Pontos"
          value={user.profile.pontos}
        />
        <Stat
          icon={<Trophy className="h-5 w-5" />}
          label="Nível"
          value={user.profile.nivel}
        />
      </div>

      <Card className="mb-4">
        <CardContent className="flex items-center gap-4 p-5">
          <CreditCard className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Assinatura</p>
            <p className="text-xs text-muted-foreground">
              {sub
                ? `${sub.status}${sub.current_period_end ? " · renova em " + new Date(sub.current_period_end).toLocaleDateString("pt-BR") : ""}`
                : user.isPreview
                  ? "preview (sem assinatura)"
                  : "Nenhuma assinatura ativa"}
            </p>
          </div>
          <a
            href="https://kiwify.app/members"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Gerenciar
          </a>
        </CardContent>
      </Card>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
            Conquistas
          </h2>
          <Link
            href="/conquistas"
            className="text-xs text-primary hover:underline"
          >
            Ver todas ({userConquistas.size}/{todasConquistas.length})
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {todasConquistas.slice(0, 8).map((c) => {
            const Icon = ICON_MAP[c.icone ?? ""] ?? Award;
            const isUnlocked = userConquistas.has(c.slug);
            return (
              <div
                key={c.id}
                title={c.titulo}
                className={
                  isUnlocked
                    ? "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary"
                    : "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground/50"
                }
              >
                <Icon className="h-6 w-6" />
                {!isUnlocked && (
                  <Lock className="absolute right-1 bottom-1 h-3 w-3" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-2">
        <RowLink href="/conquistas" label="Conquistas" icon={<Award className="h-4 w-4" />} />
        <RowLink href="/oracao" label="Minhas orações" />
        <RowLink href="/diario" label="Meu diário" />
        <RowLink href="/missoes" label="Missões e conquistas" />
        <RowLink
          href="/configuracoes"
          label="Configurações"
          icon={<Settings className="h-4 w-4" />}
        />
      </div>

      <form action={logoutAction} className="mt-8">
        <Button type="submit" variant="outline" size="lg" className="w-full">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </form>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          {icon}
        </span>
        <div>
          <p className="font-serif text-xl font-semibold">{value}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function RowLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition hover:border-primary/40"
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
