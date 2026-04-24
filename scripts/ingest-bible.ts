/**
 * Ingestão completa da Bíblia ACF no Supabase + geração de embeddings.
 *
 * Rode: npm run ingest:bible
 *
 * Requer no .env.local:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - OPENAI_API_KEY (opcional; sem ele, só importa texto)
 *
 * Fonte: https://github.com/thiagobodruk/biblia (ACF 1994, domínio público)
 *
 * Fluxo:
 *   1. Baixa JSON ACF (~5MB)
 *   2. Normaliza para (version_id, book_id, capitulo, versiculo, texto)
 *   3. Upsert em bible_verses em batches de 500
 *   4. Gera embeddings em batches de 100 via OpenAI text-embedding-3-small
 *   5. Atualiza a coluna embedding
 *
 * Idempotente: pode rodar várias vezes. Resume pulando versos já embebidos.
 */

import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

loadEnv({ path: resolve(process.cwd(), ".env.local") });

// ----------------- constantes -----------------

const ACF_URL =
  "https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/acf.json";
const VERSION_ID = "ACF";
const BATCH_INSERT = 500;
const BATCH_EMBED = 100;
const EMBED_MODEL = "text-embedding-3-small";
const EMBED_DIM = 1536;

// Mapa abbrev -> book_id (espelha src/lib/seed/bible-books.ts).
// Precisa bater com o que a migration 0002 já inseriu em bible_books.
const ABBREV_TO_ID: Record<string, number> = {
  gn: 1, ex: 2, lv: 3, nm: 4, dt: 5, js: 6, jz: 7, rt: 8,
  "1sm": 9, "2sm": 10, "1rs": 11, "2rs": 12, "1cr": 13, "2cr": 14,
  ed: 15, ne: 16, et: 17,
  jó: 18, jo_old: 18, job: 18, // thiagobodruk usa "jó"
  sl: 19, pv: 20, ec: 21, ct: 22, is: 23, jr: 24, lm: 25,
  ez: 26, dn: 27, os: 28, jl: 29, am: 30, ob: 31, jn: 32,
  mq: 33, na: 34, hc: 35, sf: 36, ag: 37, zc: 38, ml: 39,
  mt: 40, mc: 41, lc: 42, jo: 43, at: 44, atos: 44, rm: 45,
  "1co": 46, "2co": 47, gl: 48, ef: 49, fp: 50, cl: 51,
  "1ts": 52, "2ts": 53, "1tm": 54, "2tm": 55, tt: 56, fm: 57,
  hb: 58, tg: 59,
  "1pe": 60, "2pe": 61, "1jo": 62, "2jo": 63, "3jo": 64,
  jd: 65, ap: 66,
};

// ----------------- tipos -----------------

type BookJson = {
  abbrev: string;
  name?: string;
  chapters: string[][]; // array de capítulos, cada um é array de versos (strings)
};

type VerseRow = {
  version_id: string;
  book_id: number;
  capitulo: number;
  versiculo: number;
  texto: string;
};

// ----------------- helpers -----------------

function env(name: string, required = true) {
  const v = process.env[name];
  if (!v && required) {
    console.error(`\n❌ Env obrigatoria ausente: ${name}`);
    console.error(`   Preencha em .env.local e rode de novo.\n`);
    process.exit(1);
  }
  return v ?? "";
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function adminClient(): SupabaseClient {
  return createClient(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}

async function openaiEmbed(texts: string[]): Promise<number[][]> {
  const key = env("OPENAI_API_KEY");
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: texts,
      dimensions: EMBED_DIM,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI embeddings ${res.status}: ${body.slice(0, 400)}`);
  }
  const data = (await res.json()) as {
    data: { index: number; embedding: number[] }[];
  };
  const out: number[][] = new Array(texts.length);
  for (const d of data.data) out[d.index] = d.embedding;
  return out;
}

// ----------------- fase A: texto -----------------

async function fetchAcfJson(): Promise<BookJson[]> {
  console.log(`→ Baixando ACF de ${ACF_URL}...`);
  const res = await fetch(ACF_URL);
  if (!res.ok) throw new Error(`fetch ACF falhou: ${res.status}`);
  const json = (await res.json()) as BookJson[];
  console.log(`✓ ${json.length} livros no JSON.`);
  return json;
}

function flatten(books: BookJson[]): VerseRow[] {
  const out: VerseRow[] = [];
  const missing: string[] = [];
  for (const book of books) {
    const abbrev = book.abbrev.toLowerCase();
    const bookId = ABBREV_TO_ID[abbrev];
    if (!bookId) {
      missing.push(abbrev);
      continue;
    }
    book.chapters.forEach((chapter, chapIdx) => {
      chapter.forEach((texto, verseIdx) => {
        out.push({
          version_id: VERSION_ID,
          book_id: bookId,
          capitulo: chapIdx + 1,
          versiculo: verseIdx + 1,
          texto: (texto || "").trim(),
        });
      });
    });
  }
  if (missing.length > 0) {
    console.warn(
      `⚠️  Livros sem mapeamento (serao pulados): ${missing.join(", ")}`,
    );
  }
  return out.filter((v) => v.texto.length > 0);
}

async function upsertVerses(
  sb: SupabaseClient,
  rows: VerseRow[],
  existingCount: number,
) {
  // Se ja temos igual ou mais que o JSON traz, pulamos Fase A.
  // (Upsert com update triggers HNSW reindex e explode timeout.)
  if (existingCount >= rows.length) {
    console.log(
      `→ Fase A: pulada (${existingCount} versos ja no banco >= ${rows.length} no JSON).`,
    );
    return;
  }

  console.log(
    `→ Fase A: upsert de ${rows.length} versos em batches de ${BATCH_INSERT}...`,
  );
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_INSERT) {
    const batch = rows.slice(i, i + BATCH_INSERT);
    const { error } = await sb
      .from("bible_verses")
      .upsert(batch, {
        onConflict: "version_id,book_id,capitulo,versiculo",
        // true = ON CONFLICT DO NOTHING (evita reindex de linhas identicas)
        ignoreDuplicates: true,
      });
    if (error) {
      console.error(`❌ erro no batch iniciando em ${i}:`, error.message);
      throw error;
    }
    inserted += batch.length;
    const pct = ((inserted / rows.length) * 100).toFixed(1);
    process.stdout.write(`\r  ${inserted}/${rows.length} (${pct}%)`);
  }
  process.stdout.write("\n");
  console.log(`✓ Fase A concluida: ${inserted} versos processados.`);
}

// ----------------- fase B: embeddings -----------------

async function embedMissing(sb: SupabaseClient) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      `⚠️  OPENAI_API_KEY nao configurado. Pulando geracao de embeddings.`,
    );
    console.warn(
      `   Busca textual continua funcionando; busca semantica fica indisponivel.`,
    );
    return;
  }

  // Verifica se a coluna embedding existe (migration 0003 aplicada).
  const probe = await sb
    .from("bible_verses")
    .select("id,embedding")
    .limit(1);
  if (probe.error && /embedding/.test(probe.error.message)) {
    console.warn(
      `\n⚠️  Coluna 'embedding' nao existe. Aplique a migration 0003 no SQL Editor do Supabase:`,
    );
    console.warn(`   supabase/migrations/0003_bible_embeddings.sql`);
    console.warn(`   Depois rode: npm run ingest:bible novamente.\n`);
    console.warn(`   Fase A (texto) ja esta completa. Pulando Fase B.\n`);
    return;
  }

  // Drop do indice HNSW durante bulk writes (padrao de bulk loading).
  console.log(`→ Drop temporario do indice HNSW (bulk pattern)...`);
  const dropRes = await sb.rpc("drop_bible_embedding_index");
  if (dropRes.error) {
    console.warn(
      `⚠️  Nao deu pra dropar indice (ok se nao existia): ${dropRes.error.message}`,
    );
  }

  console.log(`→ Fase B: gerando embeddings para versos sem embedding...`);

  let totalProcessed = 0;
  let retries = 0;

  // Loop ate nao ter mais nada pra processar.
  while (true) {
    const { data, error } = await sb
      .from("bible_verses")
      .select("id,texto")
      .eq("version_id", VERSION_ID)
      .is("embedding", null)
      .order("id", { ascending: true })
      .limit(BATCH_EMBED);

    if (error) throw error;
    if (!data || data.length === 0) break;

    const rows = data as { id: number; texto: string }[];
    const texts = rows.map((r) => r.texto);

    let vectors: number[][];
    try {
      vectors = await openaiEmbed(texts);
      retries = 0;
    } catch (err) {
      retries++;
      const wait = Math.min(60_000, 2_000 * 2 ** retries);
      console.warn(
        `⚠️  OpenAI falhou (${(err as Error).message.slice(0, 80)}). Retry em ${wait / 1000}s...`,
      );
      if (retries >= 5) throw err;
      await sleep(wait);
      continue;
    }

    // Batch update via RPC (set local statement_timeout = 0 dentro da funcao).
    // Retry automatico para timeouts, DNS flap e rate limits.
    const ids = rows.map((r) => r.id);
    const embStrs = vectors.map((v) => `[${v.join(",")}]`);

    let attempt = 0;
    while (true) {
      const { error } = await sb.rpc("update_verse_embeddings_batch", {
        ids,
        embeddings: embStrs,
      });
      if (!error) break;
      const msg =
        String(error.message ?? "") +
        String((error as { details?: string }).details ?? "");
      const isRetryable =
        /fetch failed|ENOTFOUND|ETIMEDOUT|ECONNRESET|statement timeout|timeout|57014/i.test(
          msg,
        );
      attempt++;
      if (!isRetryable || attempt >= 6) throw error;
      const wait = Math.min(30_000, 1000 * 2 ** attempt);
      console.warn(
        `\n⚠️  batch update falhou (${msg.slice(0, 80)}). Retry ${attempt}/6 em ${wait / 1000}s...`,
      );
      await sleep(wait);
    }

    totalProcessed += rows.length;
    process.stdout.write(`\r  embedded: ${totalProcessed}`);
    // pequeno respiro pra nao martelar rate limit
    await sleep(200);
  }
  process.stdout.write("\n");
  console.log(`✓ Fase B concluida: ${totalProcessed} embeddings gerados.`);

  // Recria o indice HNSW apos bulk write.
  console.log(`→ Recriando indice HNSW (pode levar ~1 min)...`);
  const createRes = await sb.rpc("create_bible_embedding_index");
  if (createRes.error) {
    console.warn(
      `⚠️  Falha ao recriar indice: ${createRes.error.message}`,
    );
    console.warn(
      `   Rode manualmente no SQL Editor: select create_bible_embedding_index();`,
    );
  } else {
    console.log(`✓ Indice HNSW recriado.`);
  }
}

// ----------------- main -----------------

async function main() {
  const start = Date.now();
  console.log("\n════════════════════════════════════════════");
  console.log("  App Biblia · Ingestao ACF + embeddings");
  console.log("════════════════════════════════════════════\n");

  const sb = adminClient();

  // Verifica que as tabelas existem.
  const { error: checkErr } = await sb.from("bible_verses").select("id").limit(1);
  if (checkErr) {
    console.error(`\n❌ Tabela bible_verses inacessivel: ${checkErr.message}`);
    console.error(`   Rodou as migrations 0001 e 0003 no Supabase?\n`);
    process.exit(1);
  }

  const { count: existingCount } = await sb
    .from("bible_verses")
    .select("id", { count: "exact", head: true })
    .eq("version_id", VERSION_ID);
  console.log(`  Versos ACF ja no banco: ${existingCount ?? 0}\n`);

  // Fase A: texto
  const books = await fetchAcfJson();
  const rows = flatten(books);
  console.log(`  Total de versos no JSON: ${rows.length}\n`);
  await upsertVerses(sb, rows, existingCount ?? 0);

  // Fase B: embeddings
  console.log();
  await embedMissing(sb);

  const mins = ((Date.now() - start) / 60000).toFixed(1);
  console.log(`\n✓ Ingestao completa em ${mins} min.\n`);
}

main().catch((e) => {
  console.error("\n❌ Ingestao falhou:", e);
  process.exit(1);
});
