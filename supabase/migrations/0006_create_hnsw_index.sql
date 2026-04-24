-- =============================================================
-- Cria o indice HNSW para busca semantica.
-- RODE NO SQL EDITOR (nao via PostgREST — tem timeout HTTP de 60s).
-- O build leva ~1-2 min em 31k vetores de 1536 dim.
-- =============================================================

-- Settings para acelerar o build do indice:
set maintenance_work_mem = '1GB';
set max_parallel_maintenance_workers = 4;

-- Drop se existir (garantia de estado limpo)
drop index if exists public.bible_verses_embedding_idx;

-- Cria o HNSW.
-- m=16, ef_construction=64 (defaults sensatos; bons pra este dataset)
create index bible_verses_embedding_idx
  on public.bible_verses
  using hnsw (embedding vector_cosine_ops);

-- ANALYZE pro planner usar o indice corretamente.
analyze public.bible_verses;
