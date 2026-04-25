"use server";

import { createClientOrNull } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/user";
import { avaliarConquistas } from "@/lib/repo/conquistas";
import { revalidatePath } from "next/cache";

export async function salvarReflexaoAction(formData: FormData) {
  const texto = String(formData.get("texto") ?? "").trim();
  const pergunta = String(formData.get("pergunta") ?? "").trim();
  if (!texto) return { ok: false, error: "Escreva sua reflexao." };

  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const hoje = new Date().toISOString().slice(0, 10);
  const prefix = pergunta ? `[Reflexão] ${pergunta}\n\n` : "[Reflexão] ";

  // Concatena com entrada existente do dia (se houver)
  const { data: existing } = await supabase
    .from("diario_entradas")
    .select("texto")
    .eq("user_id", user.id)
    .eq("data", hoje)
    .maybeSingle();
  const prev = (existing as { texto?: string } | null)?.texto ?? "";
  const novoTexto = prev ? `${prev}\n\n${prefix}${texto}` : `${prefix}${texto}`;

  const { error } = await supabase.from("diario_entradas").upsert(
    { user_id: user.id, data: hoje, texto: novoTexto },
    { onConflict: "user_id,data" },
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath("/home");
  revalidatePath("/diario");
  return { ok: true };
}

export async function iniciarDiaAction() {
  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  await atualizarStreakEPontos(user.id, 5); await avaliarConquistas(user.id);
  revalidatePath("/home");
  return { ok: true };
}

export async function salvarOracaoAction(formData: FormData) {
  const texto = String(formData.get("texto") ?? "").trim();
  if (!texto) return { ok: false, error: "Escreva sua oração." };

  const user = await getCurrentUser();
  if (user.isPreview) {
    return {
      ok: true,
      preview: true,
      message: "Oração salva (modo preview — não persiste).",
    };
  }

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const { error } = await supabase
    .from("oracoes")
    .insert({ user_id: user.id, texto });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/home");
  revalidatePath("/oracao");
  return { ok: true };
}

export async function concluirMissaoAction(formData: FormData) {
  const missaoId = String(formData.get("missao_id") ?? "");
  if (!missaoId) return { ok: false, error: "Missão não informada." };

  const user = await getCurrentUser();
  if (user.isPreview) {
    return { ok: true, preview: true };
  }

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const { error } = await supabase
    .from("user_missoes")
    .upsert(
      { user_id: user.id, missao_id: missaoId },
      { onConflict: "user_id,missao_id", ignoreDuplicates: true },
    );
  if (error) return { ok: false, error: error.message };

  // Atualiza streak + pontos
  await atualizarStreakEPontos(user.id, 10); await avaliarConquistas(user.id);

  revalidatePath("/home");
  revalidatePath("/missoes");
  return { ok: true };
}

export async function concluirDevocionalAction(formData: FormData) {
  const slug = String(formData.get("devocional_slug") ?? "").trim();
  const anotacao = String(formData.get("anotacao") ?? "").trim() || null;
  if (!slug) return { ok: false, error: "Devocional não informado." };

  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  // Busca o UUID real pelo slug — o id que vem do seed local nao eh UUID,
  // entao precisamos resolver no banco antes de inserir o progresso.
  const { data: devo } = await supabase
    .from("devocionais")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  const realId = (devo as { id: string } | null)?.id;
  if (!realId) {
    return {
      ok: false,
      error: "Este devocional ainda não está disponível pra conclusão.",
    };
  }

  const { error } = await supabase
    .from("user_devocional_progress")
    .upsert(
      { user_id: user.id, devocional_id: realId, anotacao },
      { onConflict: "user_id,devocional_id" },
    );
  if (error) return { ok: false, error: error.message };

  await atualizarStreakEPontos(user.id, 15); await avaliarConquistas(user.id);

  revalidatePath("/home");
  revalidatePath("/devocionais");
  return { ok: true };
}

export async function salvarDiarioAction(formData: FormData) {
  const emocao = String(formData.get("emocao") ?? "").trim() || null;
  const texto = String(formData.get("texto") ?? "").trim();
  const data =
    String(formData.get("data") ?? "") ||
    new Date().toISOString().slice(0, 10);

  if (!texto) return { ok: false, error: "Escreva sua reflexão." };

  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const { error } = await supabase
    .from("diario_entradas")
    .upsert(
      { user_id: user.id, data, emocao, texto },
      { onConflict: "user_id,data" },
    );
  if (error) return { ok: false, error: error.message };

  revalidatePath("/diario");
  return { ok: true };
}

export async function toggleHighlightAction(formData: FormData) {
  const verseId = String(formData.get("verse_id") ?? "");
  const cor = String(formData.get("cor") ?? "gold");
  if (!verseId) return { ok: false, error: "Versículo não informado." };

  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const { data: existing } = await supabase
    .from("user_highlights")
    .select("id")
    .eq("user_id", user.id)
    .eq("verse_id", verseId)
    .maybeSingle();

  if (existing) {
    await supabase.from("user_highlights").delete().eq("id", (existing as { id: string }).id);
  } else {
    await supabase
      .from("user_highlights")
      .insert({ user_id: user.id, verse_id: verseId, cor });
  }
  return { ok: true };
}

export async function toggleBookmarkAction(formData: FormData) {
  const verseId = String(formData.get("verse_id") ?? "");
  if (!verseId) return { ok: false, error: "Versículo não informado." };

  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const { data: existing } = await supabase
    .from("user_bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("verse_id", verseId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_bookmarks")
      .delete()
      .eq("id", (existing as { id: string }).id);
  } else {
    await supabase
      .from("user_bookmarks")
      .insert({ user_id: user.id, verse_id: verseId });
  }
  return { ok: true };
}

export async function salvarNotaAction(formData: FormData) {
  const verseId = String(formData.get("verse_id") ?? "");
  const texto = String(formData.get("texto") ?? "").trim();
  if (!verseId || !texto) return { ok: false, error: "Faltam dados." };

  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const { error } = await supabase
    .from("user_notes")
    .insert({ user_id: user.id, verse_id: verseId, texto });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function salvarConfigAction(formData: FormData) {
  const tema = String(formData.get("tema") ?? "dark");
  const horario = String(formData.get("horario") ?? "") || null;
  const versao = String(formData.get("versao") ?? "ACF");

  const user = await getCurrentUser();
  if (user.isPreview) return { ok: true, preview: true };

  const supabase = await createClientOrNull();
  if (!supabase) return { ok: false, error: "Supabase indisponível." };

  const { error } = await supabase
    .from("profiles")
    .update({
      preferencia_tema: tema,
      horario_notificacao: horario,
      preferencia_versao_biblia: versao,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/configuracoes");
  return { ok: true };
}

// ---------------- helpers ----------------

async function atualizarStreakEPontos(userId: string, pontosDelta: number) {
  const supabase = await createClientOrNull();
  if (!supabase) return;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  const { data } = await supabase
    .from("profiles")
    .select("streak_dias,streak_maior,ultimo_acesso_dia,pontos,nivel")
    .eq("id", userId)
    .maybeSingle();
  if (!data) return;

  const p = data as {
    streak_dias: number;
    streak_maior: number;
    ultimo_acesso_dia: string | null;
    pontos: number;
    nivel: number;
  };

  let streak = p.streak_dias;
  if (p.ultimo_acesso_dia === today) {
    // mesmo dia, mantem
  } else if (p.ultimo_acesso_dia === yesterday) {
    streak = (p.streak_dias ?? 0) + 1;
  } else {
    streak = 1;
  }
  const streakMaior = Math.max(p.streak_maior ?? 0, streak);
  const pontos = (p.pontos ?? 0) + pontosDelta;
  const nivel = Math.max(1, Math.floor(pontos / 200) + 1);

  await supabase
    .from("profiles")
    .update({
      streak_dias: streak,
      streak_maior: streakMaior,
      ultimo_acesso_dia: today,
      pontos,
      nivel,
    })
    .eq("id", userId);
}
