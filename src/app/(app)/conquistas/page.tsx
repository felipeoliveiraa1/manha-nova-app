import { getCurrentUser } from "@/lib/auth/user";
import { listConquistas, listUserConquistas } from "@/lib/repo/conquistas";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Crown, BookOpen, Target, Lock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  crown: Crown,
  book: BookOpen,
  target: Target,
};

export default async function ConquistasPage() {
  const user = await getCurrentUser();
  const [todas, desbloqueadas] = await Promise.all([
    listConquistas(),
    user.isPreview
      ? Promise.resolve(new Set<string>(["streak-7", "primeiro-devocional"]))
      : listUserConquistas(user.id),
  ]);

  const unlocked = todas.filter((c) => desbloqueadas.has(c.slug));
  const locked = todas.filter((c) => !desbloqueadas.has(c.slug));

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Conquistas</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {unlocked.length} de {todas.length} desbloqueadas
      </p>

      {unlocked.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xs uppercase tracking-wider text-primary">
            Desbloqueadas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map((c) => {
              const Icon = ICON_MAP[c.icone ?? ""] ?? Award;
              return (
                <Card key={c.id} className="border-primary/40 bg-primary/5">
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <Icon className="h-8 w-8 text-primary" />
                    <h3 className="font-serif text-sm font-semibold">
                      {c.titulo}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {c.descricao}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          A desbloquear
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {locked.map((c) => {
            const Icon = ICON_MAP[c.icone ?? ""] ?? Award;
            return (
              <Card key={c.id} className="opacity-60">
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="relative">
                    <Icon className={cn("h-8 w-8 text-muted-foreground/50")} />
                    <Lock className="absolute -right-1 -bottom-1 h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-muted-foreground">
                    {c.titulo}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {c.descricao}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
