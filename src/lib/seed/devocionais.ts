import type { Devocional, DevocionalSerie } from "@/lib/supabase/types";

export const SERIES_SEED: DevocionalSerie[] = [
  {
    id: "s-ansiedade",
    slug: "vencendo-a-ansiedade",
    titulo: "Vencendo a ansiedade",
    descricao: "7 dias para entregar o peso do amanhã a Deus.",
    capa_url: null,
    ordem: 1,
    publicado: true,
  },
  {
    id: "s-fe",
    slug: "fortalecendo-sua-fe",
    titulo: "Fortalecendo sua fé",
    descricao: "7 dias meditando nas promessas que sustentam seu caminhar.",
    capa_url: null,
    ordem: 2,
    publicado: true,
  },
  {
    id: "s-proposito",
    slug: "vivendo-seu-proposito",
    titulo: "Vivendo seu propósito",
    descricao: "7 dias para descobrir e andar no chamado que Deus tem para você.",
    capa_url: null,
    ordem: 3,
    publicado: true,
  },
  {
    id: "s-disciplina",
    slug: "disciplina-espiritual",
    titulo: "Disciplina espiritual",
    descricao: "7 dias construindo hábitos simples de oração, leitura e jejum.",
    capa_url: null,
    ordem: 4,
    publicado: true,
  },
];

export const DEVOCIONAIS_SEED: Devocional[] = [
  {
    id: "d-001",
    slug: "o-privilegio-da-oracao",
    serie_id: null,
    titulo: "O privilégio da oração",
    versiculo_ref: "Filipenses 4:6-7",
    versiculo_texto:
      "Não andeis ansiosos por coisa alguma; antes em tudo sejam conhecidas diante de Deus as vossas petições, pela oração e súplica, com ações de graças.",
    explicacao:
      "Orar não é convencer Deus a mudar de ideia — é convidar Deus a mudar a sua. A oração tira você do centro do universo e coloca o Pai no lugar que é d'Ele. E quando isso acontece, a paz vem. Não a paz das circunstâncias, mas a paz de saber Quem governa as circunstâncias.",
    aplicacao:
      "Hoje, em vez de tentar resolver tudo sozinho, pare por 60 segundos e entregue a Deus a decisão que mais te tira o sono. Escreva abaixo o que você entregou.",
    oracao:
      "Senhor, hoje eu solto das minhas mãos o que só as Tuas mãos podem carregar. Obrigado por ouvir. Em nome de Jesus, amém.",
    pergunta: "O que você precisa entregar a Deus agora?",
    tempo_min: 3,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d-002",
    slug: "quando-tudo-parece-pesado",
    serie_id: "s-ansiedade",
    titulo: "Quando tudo parece pesado",
    versiculo_ref: "Mateus 11:28",
    versiculo_texto:
      "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    explicacao:
      "Jesus não promete remover a carga imediatamente — Ele promete alívio. Existe diferença entre tirar o problema e sustentar a pessoa no meio dele. Hoje, venha. Não venha arrumado. Venha como está.",
    aplicacao:
      "Liste 3 coisas que estão pesando em você hoje. Depois, oficialmente entregue cada uma em oração, uma por vez.",
    oracao: "Jesus, eu venho. Eu não estou bem. Me sustenta. Amém.",
    pergunta: "O que mais está pesando em você hoje?",
    tempo_min: 4,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d-003",
    slug: "a-fe-que-move",
    serie_id: "s-fe",
    titulo: "A fé que move",
    versiculo_ref: "Hebreus 11:1",
    versiculo_texto:
      "Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.",
    explicacao:
      "Fé não é sentir. Fé é agir sobre o que Deus disse, mesmo quando o sentimento não acompanha. A fé não nasce no sofá — nasce no passo.",
    aplicacao:
      "Qual é o próximo passo que você sabe que Deus está te pedindo e que você tem adiado? Dê o passo hoje, mesmo que pequeno.",
    oracao: "Pai, dá-me coragem para andar pelo que Tu disseste, não pelo que eu sinto.",
    pergunta: "Qual passo de fé você vai dar hoje?",
    tempo_min: 3,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d-004",
    slug: "voce-foi-criado-para-mais",
    serie_id: "s-proposito",
    titulo: "Você foi criado para mais",
    versiculo_ref: "Efésios 2:10",
    versiculo_texto:
      "Porque somos feitura sua, criados em Cristo Jesus para as boas obras, as quais Deus preparou para que andássemos nelas.",
    explicacao:
      "Você não foi criado por acaso, nem para sobreviver. Antes de você nascer, Deus já preparou caminhos — e eles são bons.",
    aplicacao:
      "Escreva 1 dom que você reconhece em si mesmo e 1 pessoa que pode se beneficiar dele esta semana.",
    oracao: "Senhor, me usa. Me mostra onde devo pisar hoje.",
    pergunta: "Para que obra Deus te preparou?",
    tempo_min: 3,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d-005",
    slug: "a-disciplina-que-liberta",
    serie_id: "s-disciplina",
    titulo: "A disciplina que liberta",
    versiculo_ref: "1 Coríntios 9:27",
    versiculo_texto:
      "Antes subjugo o meu corpo, e o reduzo à servidão, para que, pregando aos outros, eu mesmo não venha de alguma maneira a ficar reprovado.",
    explicacao:
      "Disciplina espiritual não é legalismo. É o contrário — é o caminho de se tornar livre do que te escraviza. Oração, leitura, jejum e silêncio são os remos que te levam contra a correnteza do mundo.",
    aplicacao:
      "Escolha UMA disciplina para praticar esta semana por 10 min/dia: oração, leitura, silêncio ou jejum.",
    oracao: "Pai, eu quero ser livre. Me disciplina.",
    pergunta: "Qual disciplina você vai praticar esta semana?",
    tempo_min: 4,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d-006",
    slug: "confianca-em-meio-ao-caos",
    serie_id: null,
    titulo: "Confiança em meio ao caos",
    versiculo_ref: "Salmos 46:1",
    versiculo_texto:
      "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.",
    explicacao:
      "Refúgio: lugar seguro. Fortaleza: lugar forte. Socorro presente: não atrasa. Três palavras que respondem três medos — sentir-se exposto, fraco e abandonado.",
    aplicacao:
      "Identifique qual das três palavras você mais precisa hoje e ore pedindo essa manifestação específica de Deus.",
    oracao:
      "Deus, seja refúgio, fortaleza e socorro hoje. Eu não dou conta sozinho.",
    pergunta: "Do que você mais precisa hoje: refúgio, fortaleza ou socorro?",
    tempo_min: 3,
    data: null,
    ordem: 2,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "d-007",
    slug: "o-perdao-que-cura",
    serie_id: null,
    titulo: "O perdão que cura",
    versiculo_ref: "Efésios 4:32",
    versiculo_texto:
      "Antes sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.",
    explicacao:
      "Perdão não é dizer que o que te fizeram foi certo. É se recusar a carregar mais tempo o peso que não é seu. Você perdoa não pela pessoa — você perdoa por você.",
    aplicacao:
      "Escreva o nome de alguém que você precisa perdoar. Diga em oração: 'Pai, eu solto'.",
    oracao:
      "Senhor, eu não consigo sozinho. Me ajuda a perdoar como Tu me perdoaste.",
    pergunta: "Quem você precisa perdoar hoje?",
    tempo_min: 4,
    data: null,
    ordem: 3,
    publicado: true,
    created_at: new Date().toISOString(),
  },
];

/**
 * Escolhe o devocional do dia de forma determinística (mesmo dia = mesmo devocional).
 */
export function devocionalDoDia(): Devocional {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  return DEVOCIONAIS_SEED[dayOfYear % DEVOCIONAIS_SEED.length];
}
