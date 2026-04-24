export type Tema = {
  slug: string;
  titulo: string;
  descricao: string;
  versiculos: { ref: string; texto: string }[];
};

export const TEMAS: Tema[] = [
  {
    slug: "ansiedade",
    titulo: "Ansiedade",
    descricao: "A Palavra que acalma.",
    versiculos: [
      { ref: "Filipenses 4:6-7", texto: "Não andeis ansiosos por coisa alguma..." },
      { ref: "Mateus 6:34", texto: "Não vos inquieteis pelo dia de amanhã..." },
      { ref: "1 Pedro 5:7", texto: "Lançando sobre ele toda a vossa ansiedade..." },
      { ref: "Salmos 94:19", texto: "Nas muitas preocupações do meu coração, as tuas consolações recriaram a minha alma." },
    ],
  },
  {
    slug: "fe",
    titulo: "Fé",
    descricao: "Versículos que sustentam.",
    versiculos: [
      { ref: "Hebreus 11:1", texto: "Ora, a fé é o firme fundamento..." },
      { ref: "Romanos 10:17", texto: "A fé é pelo ouvir..." },
      { ref: "Tiago 2:17", texto: "Assim também a fé, se não tiver as obras, é morta." },
      { ref: "Marcos 9:23", texto: "Tudo é possível ao que crê." },
    ],
  },
  {
    slug: "perdao",
    titulo: "Perdão",
    descricao: "Perdoando e sendo perdoado.",
    versiculos: [
      { ref: "Efésios 4:32", texto: "Perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo." },
      { ref: "Mateus 6:14", texto: "Se perdoardes aos homens as suas ofensas, também vosso Pai celestial vos perdoará." },
      { ref: "Colossenses 3:13", texto: "Suportando-vos uns aos outros, e perdoando-vos uns aos outros." },
    ],
  },
  {
    slug: "amor",
    titulo: "Amor",
    descricao: "O maior mandamento.",
    versiculos: [
      { ref: "1 Coríntios 13:4", texto: "O amor é sofredor, é benigno..." },
      { ref: "João 13:34", texto: "Um novo mandamento vos dou: que vos ameis uns aos outros." },
      { ref: "1 João 4:19", texto: "Nós o amamos porque ele nos amou primeiro." },
    ],
  },
  {
    slug: "esperanca",
    titulo: "Esperança",
    descricao: "O âncora da alma.",
    versiculos: [
      { ref: "Romanos 15:13", texto: "Ora, o Deus de esperança vos encha de todo o gozo e paz em crença." },
      { ref: "Jeremias 29:11", texto: "Porque eu bem sei os pensamentos que tenho a vosso respeito..." },
      { ref: "Lamentações 3:22-23", texto: "As misericórdias do Senhor são a causa de não sermos consumidos." },
    ],
  },
  {
    slug: "proposito",
    titulo: "Propósito",
    descricao: "Criado para mais.",
    versiculos: [
      { ref: "Efésios 2:10", texto: "Porque somos feitura sua, criados em Cristo Jesus para as boas obras." },
      { ref: "Romanos 8:28", texto: "E sabemos que todas as coisas contribuem juntamente para o bem..." },
      { ref: "Jeremias 1:5", texto: "Antes que te formasses no ventre te conheci." },
    ],
  },
  {
    slug: "disciplina",
    titulo: "Disciplina",
    descricao: "Forma o caráter.",
    versiculos: [
      { ref: "Hebreus 12:11", texto: "Toda a correção, ao presente, não parece ser de gozo, senão de tristeza." },
      { ref: "1 Coríntios 9:27", texto: "Antes subjugo o meu corpo, e o reduzo à servidão." },
      { ref: "Provérbios 12:1", texto: "O que ama a correção ama o conhecimento." },
    ],
  },
  {
    slug: "gratidao",
    titulo: "Gratidão",
    descricao: "Dai graças em tudo.",
    versiculos: [
      { ref: "1 Tessalonicenses 5:18", texto: "Em tudo dai graças, porque esta é a vontade de Deus..." },
      { ref: "Salmos 100:4", texto: "Entrai pelas suas portas com ação de graças." },
      { ref: "Colossenses 3:17", texto: "E, quanto fizerdes por palavras ou por obras, fazei tudo em nome do Senhor Jesus." },
    ],
  },
];
