export type HistoriaBiblica = {
  slug: string;
  titulo: string;
  personagens: string[];
  resumo: string;
  licao: string;
  ref: string;
};

export const HISTORIAS: HistoriaBiblica[] = [
  {
    slug: "criacao",
    titulo: "A criação do mundo",
    personagens: ["Deus", "Adão", "Eva"],
    resumo:
      "Em seis dias, Deus criou os céus, a terra, as plantas, os animais e o homem à Sua imagem.",
    licao:
      "Tudo que existe foi pensado por Deus. Você também: é intencional, não acidente.",
    ref: "Gênesis 1-2",
  },
  {
    slug: "arca-de-noe",
    titulo: "A arca de Noé",
    personagens: ["Noé", "Família", "Animais"],
    resumo:
      "Diante da corrupção da humanidade, Deus instruiu Noé a construir uma arca. Deus preservou Noé e salvou o mundo animal.",
    licao: "Obedecer mesmo quando não faz sentido aos olhos do mundo.",
    ref: "Gênesis 6-9",
  },
  {
    slug: "abraao",
    titulo: "O chamado de Abraão",
    personagens: ["Abraão", "Sara"],
    resumo:
      "Deus chamou Abraão a deixar sua terra, com a promessa de se tornar pai de uma grande nação.",
    licao:
      "Fé é deixar o conhecido para seguir Deus ao desconhecido.",
    ref: "Gênesis 12",
  },
  {
    slug: "jose-do-egito",
    titulo: "José do Egito",
    personagens: ["José", "Irmãos", "Faraó"],
    resumo:
      "Vendido pelos irmãos, José acaba governador do Egito e, em meio à fome, perdoa e salva sua família.",
    licao:
      "O que intentaram para o mal, Deus tornou em bem. Confie no processo.",
    ref: "Gênesis 37-50",
  },
  {
    slug: "exodo",
    titulo: "O Êxodo e o Mar Vermelho",
    personagens: ["Moisés", "Faraó", "Povo de Israel"],
    resumo:
      "Moisés liderou o povo escravizado para fora do Egito. Deus abriu o Mar Vermelho na fuga.",
    licao: "Deus abre caminho onde não há.",
    ref: "Êxodo 14",
  },
  {
    slug: "davi-e-golias",
    titulo: "Davi e Golias",
    personagens: ["Davi", "Golias", "Saul"],
    resumo:
      "Jovem pastor, Davi derrota o gigante filisteu Golias com uma funda e 5 pedras, em nome do Senhor.",
    licao: "Não é o tamanho do gigante — é o tamanho do seu Deus.",
    ref: "1 Samuel 17",
  },
  {
    slug: "daniel-cova",
    titulo: "Daniel na cova dos leões",
    personagens: ["Daniel", "Dario"],
    resumo:
      "Fiel à oração, Daniel foi lançado na cova dos leões. Deus fechou a boca dos leões.",
    licao: "A fidelidade tem custo e recompensa.",
    ref: "Daniel 6",
  },
  {
    slug: "natividade",
    titulo: "O nascimento de Jesus",
    personagens: ["Maria", "José", "Pastores", "Magos"],
    resumo:
      "Em Belém, Jesus nasceu em um estábulo. Anjos anunciaram e pastores o visitaram.",
    licao: "Deus se faz pequeno para nos salvar.",
    ref: "Lucas 2",
  },
  {
    slug: "pesca-milagrosa",
    titulo: "A pesca milagrosa",
    personagens: ["Jesus", "Pedro", "Discípulos"],
    resumo:
      "Após uma noite em vão, Pedro obedece Jesus e lança a rede. A pesca foi tão grande que rasgou a rede.",
    licao: "Obedecer a voz de Deus muda o resultado.",
    ref: "Lucas 5",
  },
  {
    slug: "ressurreicao",
    titulo: "A ressurreição de Jesus",
    personagens: ["Jesus", "Maria Madalena", "Discípulos"],
    resumo:
      "No terceiro dia, o túmulo estava vazio. Jesus ressuscitou, vencendo a morte.",
    licao: "A morte não tem a última palavra.",
    ref: "João 20",
  },
];
