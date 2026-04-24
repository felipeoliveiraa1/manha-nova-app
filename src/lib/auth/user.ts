import { createClientOrNull, hasSupabaseEnv } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export type CurrentUser = {
  id: string;
  email: string | null;
  profile: Profile;
  isPreview: boolean;
};

const PREVIEW_USER: CurrentUser = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "preview@appbiblia.com.br",
  profile: {
    id: "00000000-0000-0000-0000-000000000000",
    nome: "Yan",
    foto_url: null,
    timezone: "America/Sao_Paulo",
    role: "user",
    onboarding_done: true,
    streak_dias: 7,
    streak_maior: 21,
    ultimo_acesso_dia: new Date().toISOString().slice(0, 10),
    tempo_com_deus_min: 142,
    pontos: 430,
    nivel: 3,
    preferencia_tema: "dark",
    preferencia_versao_biblia: "ACF",
    horario_notificacao: "07:00",
    created_at: new Date().toISOString(),
  },
  isPreview: true,
};

/**
 * Retorna o usuario atual + profile, com fallback de preview quando Supabase
 * nao esta configurado. Permite que todas as paginas renderizem sem crash.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  if (!hasSupabaseEnv()) return PREVIEW_USER;

  const supabase = await createClientOrNull();
  if (!supabase) return PREVIEW_USER;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return PREVIEW_USER;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = (data as Profile | null) ?? {
    ...PREVIEW_USER.profile,
    id: user.id,
    nome: user.email?.split("@")[0] ?? null,
  };

  return {
    id: user.id,
    email: user.email ?? null,
    profile,
    isPreview: false,
  };
}
