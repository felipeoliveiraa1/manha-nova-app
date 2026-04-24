-- =============================================================
-- Seed de conteudo: biblia (versoes + livros + capitulos-chave),
-- devocionais, series, missoes, quiz, trilhas, conquistas, igrejas,
-- mensagens do dia. Espelha src/lib/seed/*.
-- Execute APOS 0001_init.sql.
-- =============================================================

-- ------------------------------------------------------------
-- Biblia: versoes
-- ------------------------------------------------------------
insert into public.bible_versions (id, nome, idioma, dominio_publico, ordem) values
  ('ACF', 'Almeida Corrigida Fiel', 'pt-BR', true, 1),
  ('ARA', 'Almeida Revista e Atualizada', 'pt-BR', false, 2),
  ('NVI', 'Nova Versao Internacional', 'pt-BR', false, 3)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Biblia: livros (66) para ACF
-- ------------------------------------------------------------
insert into public.bible_books (id, version_id, abbrev, nome, testamento, ordem, total_capitulos) values
  (1, 'ACF', 'gn', 'Genesis', 'AT', 1, 50),
  (2, 'ACF', 'ex', 'Exodo', 'AT', 2, 40),
  (3, 'ACF', 'lv', 'Levitico', 'AT', 3, 27),
  (4, 'ACF', 'nm', 'Numeros', 'AT', 4, 36),
  (5, 'ACF', 'dt', 'Deuteronomio', 'AT', 5, 34),
  (6, 'ACF', 'js', 'Josue', 'AT', 6, 24),
  (7, 'ACF', 'jz', 'Juizes', 'AT', 7, 21),
  (8, 'ACF', 'rt', 'Rute', 'AT', 8, 4),
  (9, 'ACF', '1sm', '1 Samuel', 'AT', 9, 31),
  (10, 'ACF', '2sm', '2 Samuel', 'AT', 10, 24),
  (11, 'ACF', '1rs', '1 Reis', 'AT', 11, 22),
  (12, 'ACF', '2rs', '2 Reis', 'AT', 12, 25),
  (13, 'ACF', '1cr', '1 Cronicas', 'AT', 13, 29),
  (14, 'ACF', '2cr', '2 Cronicas', 'AT', 14, 36),
  (15, 'ACF', 'ed', 'Esdras', 'AT', 15, 10),
  (16, 'ACF', 'ne', 'Neemias', 'AT', 16, 13),
  (17, 'ACF', 'et', 'Ester', 'AT', 17, 10),
  (18, 'ACF', 'jo_old', 'Jo', 'AT', 18, 42),
  (19, 'ACF', 'sl', 'Salmos', 'AT', 19, 150),
  (20, 'ACF', 'pv', 'Proverbios', 'AT', 20, 31),
  (21, 'ACF', 'ec', 'Eclesiastes', 'AT', 21, 12),
  (22, 'ACF', 'ct', 'Canticos', 'AT', 22, 8),
  (23, 'ACF', 'is', 'Isaias', 'AT', 23, 66),
  (24, 'ACF', 'jr', 'Jeremias', 'AT', 24, 52),
  (25, 'ACF', 'lm', 'Lamentacoes', 'AT', 25, 5),
  (26, 'ACF', 'ez', 'Ezequiel', 'AT', 26, 48),
  (27, 'ACF', 'dn', 'Daniel', 'AT', 27, 12),
  (28, 'ACF', 'os', 'Oseias', 'AT', 28, 14),
  (29, 'ACF', 'jl', 'Joel', 'AT', 29, 3),
  (30, 'ACF', 'am', 'Amos', 'AT', 30, 9),
  (31, 'ACF', 'ob', 'Obadias', 'AT', 31, 1),
  (32, 'ACF', 'jn', 'Jonas', 'AT', 32, 4),
  (33, 'ACF', 'mq', 'Miqueias', 'AT', 33, 7),
  (34, 'ACF', 'na', 'Naum', 'AT', 34, 3),
  (35, 'ACF', 'hc', 'Habacuque', 'AT', 35, 3),
  (36, 'ACF', 'sf', 'Sofonias', 'AT', 36, 3),
  (37, 'ACF', 'ag', 'Ageu', 'AT', 37, 2),
  (38, 'ACF', 'zc', 'Zacarias', 'AT', 38, 14),
  (39, 'ACF', 'ml', 'Malaquias', 'AT', 39, 4),
  (40, 'ACF', 'mt', 'Mateus', 'NT', 40, 28),
  (41, 'ACF', 'mc', 'Marcos', 'NT', 41, 16),
  (42, 'ACF', 'lc', 'Lucas', 'NT', 42, 24),
  (43, 'ACF', 'jo', 'Joao', 'NT', 43, 21),
  (44, 'ACF', 'at', 'Atos', 'NT', 44, 28),
  (45, 'ACF', 'rm', 'Romanos', 'NT', 45, 16),
  (46, 'ACF', '1co', '1 Corintios', 'NT', 46, 16),
  (47, 'ACF', '2co', '2 Corintios', 'NT', 47, 13),
  (48, 'ACF', 'gl', 'Galatas', 'NT', 48, 6),
  (49, 'ACF', 'ef', 'Efesios', 'NT', 49, 6),
  (50, 'ACF', 'fp', 'Filipenses', 'NT', 50, 4),
  (51, 'ACF', 'cl', 'Colossenses', 'NT', 51, 4),
  (52, 'ACF', '1ts', '1 Tessalonicenses', 'NT', 52, 5),
  (53, 'ACF', '2ts', '2 Tessalonicenses', 'NT', 53, 3),
  (54, 'ACF', '1tm', '1 Timoteo', 'NT', 54, 6),
  (55, 'ACF', '2tm', '2 Timoteo', 'NT', 55, 4),
  (56, 'ACF', 'tt', 'Tito', 'NT', 56, 3),
  (57, 'ACF', 'fm', 'Filemom', 'NT', 57, 1),
  (58, 'ACF', 'hb', 'Hebreus', 'NT', 58, 13),
  (59, 'ACF', 'tg', 'Tiago', 'NT', 59, 5),
  (60, 'ACF', '1pe', '1 Pedro', 'NT', 60, 5),
  (61, 'ACF', '2pe', '2 Pedro', 'NT', 61, 3),
  (62, 'ACF', '1jo', '1 Joao', 'NT', 62, 5),
  (63, 'ACF', '2jo', '2 Joao', 'NT', 63, 1),
  (64, 'ACF', '3jo', '3 Joao', 'NT', 64, 1),
  (65, 'ACF', 'jd', 'Judas', 'NT', 65, 1),
  (66, 'ACF', 'ap', 'Apocalipse', 'NT', 66, 22)
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Biblia: versiculos seed (capitulos-chave)
-- ------------------------------------------------------------
-- Salmo 23
insert into public.bible_verses (version_id, book_id, capitulo, versiculo, texto) values
  ('ACF', 19, 23, 1, 'O Senhor e o meu pastor, nada me faltara.'),
  ('ACF', 19, 23, 2, 'Deitar-me faz em verdes pastos, guia-me mansamente a aguas tranquilas.'),
  ('ACF', 19, 23, 3, 'Refrigera a minha alma; guia-me pelas veredas da justica, por amor do seu nome.'),
  ('ACF', 19, 23, 4, 'Ainda que eu andasse pelo vale da sombra da morte, nao temeria mal algum, porque tu estas comigo; a tua vara e o teu cajado me consolam.'),
  ('ACF', 19, 23, 5, 'Preparas uma mesa perante mim na presenca dos meus inimigos, unges a minha cabeca com oleo, o meu calice transborda.'),
  ('ACF', 19, 23, 6, 'Certamente que a bondade e a misericordia me seguirao todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.')
on conflict (version_id, book_id, capitulo, versiculo) do nothing;

-- Joao 3:16-17
insert into public.bible_verses (version_id, book_id, capitulo, versiculo, texto) values
  ('ACF', 43, 3, 16, 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigenito, para que todo aquele que nele cre nao pereca, mas tenha a vida eterna.'),
  ('ACF', 43, 3, 17, 'Porque Deus enviou o seu Filho ao mundo, nao para que condenasse o mundo, mas para que o mundo fosse salvo por ele.')
on conflict (version_id, book_id, capitulo, versiculo) do nothing;

-- Filipenses 4
insert into public.bible_verses (version_id, book_id, capitulo, versiculo, texto) values
  ('ACF', 50, 4, 4, 'Regozijai-vos sempre no Senhor; outra vez digo, regozijai-vos.'),
  ('ACF', 50, 4, 6, 'Nao andeis ansiosos por coisa alguma; antes em tudo sejam conhecidas diante de Deus as vossas peticoes, pela oracao e suplica, com acoes de gracas.'),
  ('ACF', 50, 4, 7, 'E a paz de Deus, que excede todo o entendimento, guardara os vossos coracoes e os vossos sentimentos em Cristo Jesus.'),
  ('ACF', 50, 4, 13, 'Posso todas as coisas em Cristo que me fortalece.')
on conflict (version_id, book_id, capitulo, versiculo) do nothing;

-- ------------------------------------------------------------
-- Series + devocionais
-- ------------------------------------------------------------
insert into public.devocional_series (id, slug, titulo, descricao, ordem, publicado) values
  (gen_random_uuid(), 'vencendo-a-ansiedade', 'Vencendo a ansiedade', '7 dias para entregar o peso do amanha a Deus.', 1, true),
  (gen_random_uuid(), 'fortalecendo-sua-fe', 'Fortalecendo sua fe', '7 dias meditando nas promessas.', 2, true),
  (gen_random_uuid(), 'vivendo-seu-proposito', 'Vivendo seu proposito', '7 dias para descobrir o chamado.', 3, true),
  (gen_random_uuid(), 'disciplina-espiritual', 'Disciplina espiritual', '7 dias construindo habitos simples.', 4, true)
on conflict (slug) do nothing;

insert into public.devocionais (slug, titulo, versiculo_ref, versiculo_texto, explicacao, aplicacao, oracao, pergunta, tempo_min, ordem, publicado) values
  ('o-privilegio-da-oracao', 'O privilegio da oracao',
   'Filipenses 4:6-7',
   'Nao andeis ansiosos por coisa alguma; antes em tudo sejam conhecidas diante de Deus as vossas peticoes, pela oracao e suplica, com acoes de gracas.',
   'Orar nao e convencer Deus a mudar de ideia - e convidar Deus a mudar a sua. A oracao tira voce do centro do universo.',
   'Hoje, em vez de tentar resolver tudo sozinho, pare por 60 segundos e entregue a Deus a decisao que mais te tira o sono.',
   'Senhor, hoje eu solto das minhas maos o que so as Tuas maos podem carregar.',
   'O que voce precisa entregar a Deus agora?',
   3, 1, true),
  ('quando-tudo-parece-pesado', 'Quando tudo parece pesado',
   'Mateus 11:28',
   'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.',
   'Jesus nao promete remover a carga imediatamente - promete alivio. Hoje, venha. Nao venha arrumado. Venha como esta.',
   'Liste 3 coisas que estao pesando em voce hoje. Depois, entregue cada uma em oracao.',
   'Jesus, eu venho. Eu nao estou bem. Me sustenta.',
   'O que mais esta pesando em voce hoje?',
   4, 1, true),
  ('a-fe-que-move', 'A fe que move',
   'Hebreus 11:1',
   'Ora, a fe e o firme fundamento das coisas que se esperam, e a prova das coisas que se nao veem.',
   'Fe nao e sentir. Fe e agir sobre o que Deus disse, mesmo quando o sentimento nao acompanha.',
   'Qual e o proximo passo que voce sabe que Deus esta te pedindo e que voce tem adiado? De o passo hoje.',
   'Pai, da-me coragem para andar pelo que Tu disseste, nao pelo que eu sinto.',
   'Qual passo de fe voce vai dar hoje?',
   3, 1, true)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Missoes
-- ------------------------------------------------------------
insert into public.missoes (titulo, descricao, tipo, pontos, ordem, publicado) values
  ('Envie gratidao', 'Envie uma mensagem de gratidao para alguem que tem sido importante.', 'diaria', 10, 1, true),
  ('10 minutos em silencio', 'Fique 10 minutos em silencio, so ouvindo Deus.', 'diaria', 10, 2, true),
  ('Ore por 3 pessoas', 'Pare e ore especificamente por 3 pessoas diferentes hoje.', 'diaria', 10, 3, true),
  ('Leia um capitulo', 'Leia um capitulo inteiro da Biblia, sem pressa.', 'diaria', 10, 4, true),
  ('Memorize um versiculo', 'Escolha 1 versiculo e decore-o ao longo do dia.', 'diaria', 10, 5, true),
  ('Peca perdao', 'Peca perdao a alguem por algo que voce fez.', 'diaria', 15, 6, true),
  ('Encoraje alguem', 'Envie uma palavra de encorajamento baseada num versiculo.', 'diaria', 10, 7, true),
  ('Jejum de uma refeicao', 'Pule uma refeicao e dedique o tempo a oracao.', 'semanal', 40, 1, true),
  ('Va a um culto', 'Participe de um culto ou reuniao presencial.', 'semanal', 30, 2, true),
  ('Ofertar', 'Ofereca algo (dinheiro, tempo, recurso) a uma pessoa ou ministerio.', 'semanal', 30, 3, true);

insert into public.missoes (titulo, descricao, tipo, duracao_dias, pontos, ordem, publicado) values
  ('7 dias sem reclamar', '7 dias sem fazer reclamacoes. Toda vez que perceber, reinicie.', 'desafio', 7, 100, 1, true),
  ('21 dias de oracao matinal', '21 dias orando antes de tocar no celular pela manha.', 'desafio', 21, 300, 2, true),
  ('14 dias de gratidao', '14 dias registrando 3 coisas pelas quais voce e grato.', 'desafio', 14, 200, 3, true);

-- ------------------------------------------------------------
-- Quiz
-- ------------------------------------------------------------
insert into public.quiz_perguntas (pergunta, alternativas, correta, explicacao, categoria, nivel, publicado) values
  ('Quantos livros ha na Biblia (AT + NT)?',
   '[{"id":"a","texto":"66"},{"id":"b","texto":"72"},{"id":"c","texto":"39"},{"id":"d","texto":"27"}]'::jsonb,
   'a', '39 no Antigo + 27 no Novo = 66 livros.', 'Geral', 1, true),
  ('Qual e o primeiro livro da Biblia?',
   '[{"id":"a","texto":"Exodo"},{"id":"b","texto":"Genesis"},{"id":"c","texto":"Salmos"},{"id":"d","texto":"Mateus"}]'::jsonb,
   'b', 'Genesis abre a Biblia narrando a criacao.', 'AT', 1, true),
  ('Quem construiu a arca?',
   '[{"id":"a","texto":"Moises"},{"id":"b","texto":"Abraao"},{"id":"c","texto":"Noe"},{"id":"d","texto":"Davi"}]'::jsonb,
   'c', 'Noe obedeceu Deus e construiu a arca (Gn 6).', 'AT', 1, true),
  ('Quantos discipulos Jesus escolheu?',
   '[{"id":"a","texto":"10"},{"id":"b","texto":"12"},{"id":"c","texto":"7"},{"id":"d","texto":"24"}]'::jsonb,
   'b', 'Os 12 apostolos foram escolhidos por Jesus.', 'NT', 1, true),
  ('Qual cidade Jesus nasceu?',
   '[{"id":"a","texto":"Nazare"},{"id":"b","texto":"Jerusalem"},{"id":"c","texto":"Belem"},{"id":"d","texto":"Cafarnaum"}]'::jsonb,
   'c', 'Jesus nasceu em Belem, conforme profetizado em Miqueias 5:2.', 'NT', 1, true);

-- ------------------------------------------------------------
-- Trilhas
-- ------------------------------------------------------------
insert into public.trilhas (slug, titulo, descricao, duracao_dias, publicado) values
  ('vencendo-a-ansiedade', 'Vencendo a ansiedade', '7 dias para entregar o peso do amanha e descansar em Deus.', 7, true),
  ('fortalecendo-sua-fe', 'Fortalecendo sua fe', '7 dias meditando nas promessas.', 7, true),
  ('disciplina-espiritual', 'Disciplina espiritual', '21 dias construindo habitos de oracao e silencio.', 21, true)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Conquistas
-- ------------------------------------------------------------
insert into public.conquistas (slug, titulo, descricao, icone, criterio) values
  ('streak-7', 'Constante', '7 dias seguidos com Deus.', 'flame', '{"type":"streak","dias":7}'::jsonb),
  ('streak-21', 'Disciplinado', '21 dias seguidos com Deus.', 'flame', '{"type":"streak","dias":21}'::jsonb),
  ('streak-100', 'Inflexivel', '100 dias seguidos.', 'crown', '{"type":"streak","dias":100}'::jsonb),
  ('primeiro-devocional', 'Primeiro passo', 'Concluiu seu primeiro devocional.', 'book', '{"type":"devocionais","n":1}'::jsonb),
  ('10-devocionais', 'Leitor assiduo', 'Concluiu 10 devocionais.', 'book', '{"type":"devocionais","n":10}'::jsonb),
  ('50-missoes', 'Fazedor', 'Concluiu 50 missoes.', 'target', '{"type":"missoes","n":50}'::jsonb)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- Igrejas (exemplos)
-- ------------------------------------------------------------
insert into public.igrejas (nome, denominacao, endereco, cidade, estado, website, lat, lng) values
  ('Lagoinha Alphaville', 'Batista', 'Alameda Rio Negro, 585 - Alphaville', 'Barueri', 'SP', 'https://www.lagoinhaalpha.com.br', -23.4979, -46.85),
  ('Videira Central', 'Nao denominacional', 'Av. das Nacoes Unidas, 12901 - Brooklin', 'Sao Paulo', 'SP', null, -23.617, -46.698),
  ('Bola de Neve', 'Nao denominacional', 'Rua Treze de Maio, 560 - Bela Vista', 'Sao Paulo', 'SP', null, -23.556, -46.646);
