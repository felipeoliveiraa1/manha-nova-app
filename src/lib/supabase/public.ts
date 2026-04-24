import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cliente Supabase para leitura de dados PUBLICOS (tabelas sem RLS, ou com
 * policies abertas). Nao usa cookies, nao depende de sessao — o que torna
 * as queries mais rapidas e permite que o Next cacheie a resposta.
 *
 * Usos tipicos: bible_verses, bible_books, bible_versions, devocionais,
 * missoes, quiz_perguntas (todas publicas).
 */
let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createPublicClient() {
  if (cached) return cached;
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  cached = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (...args) => fetch(...args) },
    },
  );
  return cached;
}
