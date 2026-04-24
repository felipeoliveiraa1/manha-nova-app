import type { Trilha, TrilhaDia } from "@/lib/supabase/types";

export const TRILHAS_SEED: Trilha[] = [
  {
    id: "t-ansiedade",
    slug: "vencendo-a-ansiedade",
    titulo: "Vencendo a ansiedade",
    descricao:
      "7 dias para entregar o peso do amanhã e aprender a descansar em Deus.",
    capa_url: null,
    duracao_dias: 7,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "t-fe",
    slug: "fortalecendo-sua-fe",
    titulo: "Fortalecendo sua fé",
    descricao:
      "7 dias meditando nas promessas e construindo uma fé que não vacila.",
    capa_url: null,
    duracao_dias: 7,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "t-disciplina",
    slug: "disciplina-espiritual",
    titulo: "Disciplina espiritual",
    descricao: "21 dias construindo hábitos de oração, leitura e silêncio.",
    capa_url: null,
    duracao_dias: 21,
    publicado: true,
    created_at: new Date().toISOString(),
  },
];

function diasFor(
  trilhaId: string,
  titulos: Array<{
    titulo: string;
    conteudo: string;
    pratica: string;
    ref: string;
    texto: string;
  }>,
): TrilhaDia[] {
  return titulos.map((t, idx) => ({
    id: `${trilhaId}-d${idx + 1}`,
    trilha_id: trilhaId,
    dia: idx + 1,
    titulo: t.titulo,
    conteudo: t.conteudo,
    pratica: t.pratica,
    versiculo_ref: t.ref,
    versiculo_texto: t.texto,
    audio_url: null,
  }));
}

export const TRILHA_DIAS_SEED: TrilhaDia[] = [
  ...diasFor("t-ansiedade", [
    {
      titulo: "Dia 1 · Reconhecer o peso",
      conteudo:
        "Antes de tirar o peso, precisamos confessar que ele existe. Deus não se assusta com a sua ansiedade.",
      pratica: "Escreva em 3 frases o que mais tem te tirado o sono.",
      ref: "Salmos 55:22",
      texto:
        "Lança o teu cuidado sobre o Senhor, e ele te susterá; nunca permitirá que o justo seja abalado.",
    },
    {
      titulo: "Dia 2 · Respirar antes de reagir",
      conteudo: "Ansiedade antecipa. Oração traz de volta ao agora.",
      pratica: "Quando perceber ansiedade, respire 4s e ore: 'Deus, agora'.",
      ref: "Mateus 6:34",
      texto: "Não vos inquieteis, pois, pelo dia de amanhã.",
    },
    {
      titulo: "Dia 3 · Olhar para trás",
      conteudo: "Lembre-se das vezes em que Deus já te sustentou.",
      pratica: "Liste 3 situações em que Deus te sustentou no passado.",
      ref: "1 Samuel 7:12",
      texto: "Até aqui nos ajudou o Senhor.",
    },
    {
      titulo: "Dia 4 · Entregar o controle",
      conteudo: "Você não precisa resolver tudo. Você só precisa obedecer o próximo passo.",
      pratica: "Liste o que está fora do seu controle e entregue em oração.",
      ref: "Provérbios 3:5-6",
      texto: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.",
    },
    {
      titulo: "Dia 5 · Descansar no Pai",
      conteudo: "Deus não é um chefe cobrador. É Pai.",
      pratica: "Passe 5 min em silêncio, só recebendo o amor do Pai.",
      ref: "Mateus 11:28",
      texto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    },
    {
      titulo: "Dia 6 · Gratidão que cura",
      conteudo: "Onde há gratidão, a ansiedade perde força.",
      pratica: "Escreva 10 coisas pelas quais você é grato hoje.",
      ref: "Filipenses 4:6",
      texto: "Não andeis ansiosos por coisa alguma.",
    },
    {
      titulo: "Dia 7 · A paz que excede",
      conteudo: "A paz de Deus não depende das circunstâncias.",
      pratica: "Ore pedindo especificamente a paz que excede todo entendimento.",
      ref: "Filipenses 4:7",
      texto: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações.",
    },
  ]),
  ...diasFor("t-fe", [
    {
      titulo: "Dia 1 · O que é fé",
      conteudo: "Fé não é sentir — é agir no que Deus disse.",
      pratica: "Identifique uma promessa de Deus que você precisa crer hoje.",
      ref: "Hebreus 11:1",
      texto: "Ora, a fé é o firme fundamento das coisas que se esperam.",
    },
    {
      titulo: "Dia 2 · Fé vem pelo ouvir",
      conteudo: "Fé cresce na exposição à Palavra.",
      pratica: "Leia 1 capítulo em voz alta hoje.",
      ref: "Romanos 10:17",
      texto: "De sorte que a fé é pelo ouvir, e o ouvir pela palavra de Deus.",
    },
    {
      titulo: "Dia 3 · A fé que age",
      conteudo: "Fé sem obras é morta.",
      pratica: "Dê um passo concreto que exige fé hoje.",
      ref: "Tiago 2:17",
      texto: "Assim também a fé, se não tiver as obras, é morta em si mesma.",
    },
    {
      titulo: "Dia 4 · Quando a fé balança",
      conteudo: "Dúvida não é inimiga da fé — é convite à busca.",
      pratica: "Traga a Deus a maior dúvida que tem hoje.",
      ref: "Marcos 9:24",
      texto: "Eu creio, Senhor! ajuda a minha incredulidade.",
    },
    {
      titulo: "Dia 5 · Fé que espera",
      conteudo: "A fé bíblica não é imediatista.",
      pratica: "Reafirme uma promessa que você ainda não viu cumprida.",
      ref: "Hebreus 11:13",
      texto: "Todos estes morreram na fé, sem terem recebido as promessas.",
    },
    {
      titulo: "Dia 6 · Fé coletiva",
      conteudo: "Você não precisa crer sozinho.",
      pratica: "Peça oração a alguém por algo que você precisa crer.",
      ref: "Mateus 18:20",
      texto: "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles.",
    },
    {
      titulo: "Dia 7 · A vitória pela fé",
      conteudo: "A fé é a vitória que vence o mundo.",
      pratica: "Celebre hoje 3 coisas que Deus já fez por você.",
      ref: "1 João 5:4",
      texto: "E esta é a vitória que vence o mundo: a nossa fé.",
    },
  ]),
];
