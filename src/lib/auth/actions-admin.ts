"use server";

import { createClientOrNull } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assertAdmin(): Promise<"preview" | "ok"> {
  const user = await getCurrentUser();
  if (user.isPreview) return "preview";
  if (user.profile.role !== "admin") {
    redirect("/home?error=" + encodeURIComponent("Apenas administradores."));
  }
  return "ok";
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function redirectPreview(base: string): never {
  redirect(
    `${base}?error=${encodeURIComponent("Modo preview: conecte o Supabase para salvar.")}`,
  );
}

export async function criarDevocionalAction(formData: FormData): Promise<void> {
  const gate = await assertAdmin();
  if (gate === "preview") redirectPreview("/admin/devocionais/novo");

  const supabase = await createClientOrNull();
  if (!supabase) redirectPreview("/admin/devocionais/novo");

  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) {
    redirect(
      "/admin/devocionais/novo?error=" + encodeURIComponent("Título obrigatório."),
    );
  }

  const row = {
    slug: String(formData.get("slug") ?? "").trim() || slugify(titulo),
    titulo,
    versiculo_ref: String(formData.get("versiculo_ref") ?? ""),
    versiculo_texto: String(formData.get("versiculo_texto") ?? ""),
    explicacao: String(formData.get("explicacao") ?? ""),
    aplicacao: String(formData.get("aplicacao") ?? ""),
    oracao: String(formData.get("oracao") ?? ""),
    pergunta: String(formData.get("pergunta") ?? "") || null,
    tempo_min: Number(formData.get("tempo_min") ?? 3),
    publicado: formData.get("publicado") === "on",
  };

  const { error } = await supabase!.from("devocionais").insert(row);
  if (error) {
    redirect("/admin/devocionais/novo?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/devocionais");
  revalidatePath("/devocionais");
  redirect("/admin/devocionais");
}

export async function criarMissaoAction(formData: FormData): Promise<void> {
  const gate = await assertAdmin();
  if (gate === "preview") redirectPreview("/admin/missoes/novo");
  const supabase = await createClientOrNull();
  if (!supabase) redirectPreview("/admin/missoes/novo");

  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo)
    redirect(
      "/admin/missoes/novo?error=" + encodeURIComponent("Título obrigatório."),
    );

  const { error } = await supabase!.from("missoes").insert({
    titulo,
    descricao: String(formData.get("descricao") ?? "") || null,
    tipo: String(formData.get("tipo") ?? "diaria"),
    duracao_dias: Number(formData.get("duracao_dias") ?? 0) || null,
    pontos: Number(formData.get("pontos") ?? 10),
    publicado: formData.get("publicado") === "on",
  });
  if (error) {
    redirect("/admin/missoes/novo?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/missoes");
  revalidatePath("/missoes");
  redirect("/admin/missoes");
}

export async function criarQuizAction(formData: FormData): Promise<void> {
  const gate = await assertAdmin();
  if (gate === "preview") redirectPreview("/admin/quiz/novo");
  const supabase = await createClientOrNull();
  if (!supabase) redirectPreview("/admin/quiz/novo");

  const pergunta = String(formData.get("pergunta") ?? "").trim();
  if (!pergunta)
    redirect(
      "/admin/quiz/novo?error=" + encodeURIComponent("Pergunta obrigatória."),
    );

  const alternativas = ["a", "b", "c", "d"].map((k) => ({
    id: k,
    texto: String(formData.get(`alt_${k}`) ?? "").trim(),
  }));
  if (alternativas.some((a) => !a.texto))
    redirect(
      "/admin/quiz/novo?error=" +
        encodeURIComponent("Preencha as 4 alternativas."),
    );

  const { error } = await supabase!.from("quiz_perguntas").insert({
    pergunta,
    alternativas,
    correta: String(formData.get("correta") ?? "a"),
    explicacao: String(formData.get("explicacao") ?? "") || null,
    categoria: String(formData.get("categoria") ?? "Geral"),
    nivel: Number(formData.get("nivel") ?? 1),
    publicado: formData.get("publicado") === "on",
  });
  if (error) {
    redirect("/admin/quiz/novo?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/quiz");
  redirect("/admin/quiz");
}

export async function criarTrilhaAction(formData: FormData): Promise<void> {
  const gate = await assertAdmin();
  if (gate === "preview") redirectPreview("/admin/trilhas/novo");
  const supabase = await createClientOrNull();
  if (!supabase) redirectPreview("/admin/trilhas/novo");

  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo)
    redirect(
      "/admin/trilhas/novo?error=" + encodeURIComponent("Título obrigatório."),
    );

  const { error } = await supabase!.from("trilhas").insert({
    slug: String(formData.get("slug") ?? "").trim() || slugify(titulo),
    titulo,
    descricao: String(formData.get("descricao") ?? "") || null,
    duracao_dias: Number(formData.get("duracao_dias") ?? 7),
    publicado: formData.get("publicado") === "on",
  });
  if (error) {
    redirect("/admin/trilhas/novo?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/trilhas");
  revalidatePath("/trilhas");
  redirect("/admin/trilhas");
}

export async function criarVideoAction(formData: FormData): Promise<void> {
  const gate = await assertAdmin();
  if (gate === "preview") redirectPreview("/admin/videos/novo");
  const supabase = await createClientOrNull();
  if (!supabase) redirectPreview("/admin/videos/novo");

  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo)
    redirect(
      "/admin/videos/novo?error=" + encodeURIComponent("Título obrigatório."),
    );

  const { error } = await supabase!.from("mensagens_dia").insert({
    titulo,
    descricao: String(formData.get("descricao") ?? "") || null,
    thumbnail_url: String(formData.get("thumbnail_url") ?? ""),
    video_url: String(formData.get("video_url") ?? ""),
    duracao_seg: Number(formData.get("duracao_seg") ?? 0) || null,
    publicado_em:
      String(formData.get("publicado_em") ?? "") ||
      new Date().toISOString().slice(0, 10),
  });
  if (error) {
    redirect("/admin/videos/novo?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/videos");
  revalidatePath("/home");
  redirect("/admin/videos");
}

export async function criarIgrejaAction(formData: FormData): Promise<void> {
  const gate = await assertAdmin();
  if (gate === "preview") redirectPreview("/admin/igrejas/novo");
  const supabase = await createClientOrNull();
  if (!supabase) redirectPreview("/admin/igrejas/novo");

  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome)
    redirect(
      "/admin/igrejas/novo?error=" + encodeURIComponent("Nome obrigatório."),
    );

  const { error } = await supabase!.from("igrejas").insert({
    nome,
    denominacao: String(formData.get("denominacao") ?? "") || null,
    endereco: String(formData.get("endereco") ?? "") || null,
    cidade: String(formData.get("cidade") ?? "") || null,
    estado: String(formData.get("estado") ?? "") || null,
    website: String(formData.get("website") ?? "") || null,
    lat: Number(formData.get("lat") ?? 0) || null,
    lng: Number(formData.get("lng") ?? 0) || null,
  });
  if (error) {
    redirect("/admin/igrejas/novo?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/igrejas");
  revalidatePath("/igrejas");
  redirect("/admin/igrejas");
}
