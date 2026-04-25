-- Indices BTree compostos pras tabelas de marcacao do usuario.
-- getMarcacoesDoCapitulo dispara 3 queries com .eq("user_id").in("verse_id", [...]).
-- A constraint UNIQUE(user_id, verse_id) ja cria um indice implicito, mas
-- declaramos explicitamente pra garantir e facilitar EXPLAIN.

create index if not exists user_highlights_user_verse_idx
  on public.user_highlights (user_id, verse_id);

create index if not exists user_notes_user_verse_idx
  on public.user_notes (user_id, verse_id);

create index if not exists user_bookmarks_user_verse_idx
  on public.user_bookmarks (user_id, verse_id);
