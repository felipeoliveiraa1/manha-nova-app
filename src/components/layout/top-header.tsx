import { Flame, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function TopHeader() {
  let nome = "amigo";
  let streak = 7;

  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (hasSupabase) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("nome,streak_dias")
        .eq("id", user.id)
        .maybeSingle();
      const profile = data as { nome?: string; streak_dias?: number } | null;
      if (profile) {
        nome = profile.nome || nome;
        streak = profile.streak_dias ?? 0;
      }
    }
  } else {
    nome = "preview";
  }

  const greeting = getGreeting();

  return (
    <header className="flex items-center justify-between px-5 pt-6 pb-3">
      <div>
        <p className="text-xs text-muted-foreground">{greeting},</p>
        <h1 className="text-xl font-serif font-semibold leading-tight">
          {nome}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary streak-glow">
          <Flame className="h-3.5 w-3.5" />
          <span>{streak} dias</span>
        </div>
        <button
          type="button"
          aria-label="Notificações"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function getGreeting() {
  // Servidor Vercel roda em UTC; pega hora local de SP pra saudacao certa.
  const horaSP = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      hour: "numeric",
      hour12: false,
    }).format(new Date()),
    10,
  );
  if (horaSP < 5) return "Boa madrugada";
  if (horaSP < 12) return "Bom dia";
  if (horaSP < 18) return "Boa tarde";
  return "Boa noite";
}
