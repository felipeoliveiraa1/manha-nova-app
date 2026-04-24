import { NextResponse } from "next/server";
import { createClientOrNull } from "@/lib/supabase/server";
import { buscarVersiculosRelevantes } from "@/lib/repo/biblia";

const DAILY_LIMIT = 30;
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `Você é um assistente pastoral cristão evangélico brasileiro que ajuda o usuário a viver uma rotina espiritual saudável.

Sua função é acolher, direcionar à Palavra e à oração. Não é ser oráculo, nem substituir pastor, terapeuta ou médico.

Sempre que responder, siga o formato:

**Entendo**
(1-2 frases mostrando que você compreendeu o que o usuário está sentindo/vivendo)

**Versículo**
(1 versículo em Português com a referência, preferencialmente da ACF ou NVI)

**Aplicação**
(2-3 frases práticas aplicando o versículo à situação do usuário)

**Oração**
(3-4 frases de oração na primeira pessoa que o usuário possa fazer agora)

REGRAS:
- Nunca invente versículos. Use apenas versículos que você tem certeza que existem na Bíblia.
- Se o usuário relatar pensamentos suicidas, crise emocional grave, violência doméstica, ou sintomas de emergência médica: reconheça, ore, e ORIENTE a procurar ajuda profissional (CVV 188, SAMU 192) com urgência — isso vem antes de qualquer versículo.
- Fique na linha evangélica central (Jesus único Salvador, Bíblia inspirada, salvação pela graça mediante a fé). Evite debates doutrinários secundários (pré/pós-tribulacionismo, cessacionismo etc.).
- Seja caloroso mas breve. Jamais ultrapasse 180 palavras no total.
- Escreva em PT-BR.`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "OpenAI não configurado. Defina OPENAI_API_KEY no .env.local para ativar a IA.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    conversaId?: string;
    mensagem?: string;
  };
  const mensagem = (body.mensagem ?? "").trim();
  if (!mensagem) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  const supabase = await createClientOrNull();
  let userId: string | null = null;
  let history: { role: "user" | "assistant"; content: string }[] = [];
  let conversaId = body.conversaId ?? null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    userId = user.id;

    // Rate limit diário
    const startDay = new Date();
    startDay.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("ai_mensagens")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("role", "user")
      .gte("created_at", startDay.toISOString());
    if ((count ?? 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: `Você atingiu o limite diário de ${DAILY_LIMIT} mensagens. Volte amanhã.`,
        },
        { status: 429 },
      );
    }

    // Cria conversa se precisar
    if (!conversaId) {
      const { data: conv } = await supabase
        .from("ai_conversas")
        .insert({
          user_id: userId,
          titulo: mensagem.slice(0, 60),
        })
        .select("id")
        .single();
      conversaId = (conv as { id: string } | null)?.id ?? null;
    } else {
      // Carrega ultimas 10 mensagens
      const { data: msgs } = await supabase
        .from("ai_mensagens")
        .select("role,conteudo")
        .eq("conversa_id", conversaId)
        .order("created_at", { ascending: true })
        .limit(10);
      history = ((msgs as { role: string; conteudo: string }[] | null) ?? []).map(
        (m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.conteudo,
        }),
      );
    }
  }

  // RAG: busca top-3 versiculos mais relevantes pra mensagem do usuario.
  // Se a busca semantica estiver indisponivel (sem embeddings), volta array vazio
  // e a IA segue sem contexto extra.
  const versosRelevantes = await buscarVersiculosRelevantes(mensagem, 3).catch(
    () => [],
  );
  const contextoBiblico = versosRelevantes
    .map(
      (v) =>
        `[${v.book_nome} ${v.capitulo}:${v.versiculo}] "${v.texto.replace(/\s+/g, " ").trim()}"`,
    )
    .join("\n");
  const systemWithContext = contextoBiblico
    ? `${SYSTEM_PROMPT}\n\n---\nCONTEXTO BIBLICO RELEVANTE (use esses versiculos SE fizerem sentido, citando a referencia exata; nunca invente):\n${contextoBiblico}`
    : SYSTEM_PROMPT;

  const messages = [
    { role: "system", content: systemWithContext },
    ...history,
    { role: "user", content: mensagem },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 500,
      messages,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json(
      { error: "Falha na IA", detail: txt.slice(0, 400) },
      { status: 502 },
    );
  }

  const payload = (await res.json()) as {
    choices: { message: { content: string } }[];
    usage?: { total_tokens?: number };
  };
  const resposta = payload.choices[0]?.message.content?.trim() ?? "";

  // Persiste
  if (supabase && userId && conversaId) {
    await supabase.from("ai_mensagens").insert([
      {
        conversa_id: conversaId,
        user_id: userId,
        role: "user",
        conteudo: mensagem,
      },
      {
        conversa_id: conversaId,
        user_id: userId,
        role: "assistant",
        conteudo: resposta,
        tokens: payload.usage?.total_tokens ?? null,
      },
    ]);
  }

  return NextResponse.json({ resposta, conversaId });
}
