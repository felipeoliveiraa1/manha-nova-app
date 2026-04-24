// Capitulos-chave da Biblia em ACF (Almeida Corrigida Fiel - dominio publico).
// Estes capitulos ficam disponiveis mesmo sem Supabase, para demo do leitor.
// A ingestao completa (31k+ versiculos) sera feita via script separado.

export type SeededChapter = {
  book_abbrev: string;
  capitulo: number;
  versos: { v: number; t: string }[];
};

export const CAPITULOS_ACF: SeededChapter[] = [
  {
    book_abbrev: "sl",
    capitulo: 23,
    versos: [
      { v: 1, t: "O SENHOR é o meu pastor, nada me faltará." },
      {
        v: 2,
        t: "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.",
      },
      {
        v: 3,
        t: "Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.",
      },
      {
        v: 4,
        t: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.",
      },
      {
        v: 5,
        t: "Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.",
      },
      {
        v: 6,
        t: "Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do SENHOR por longos dias.",
      },
    ],
  },
  {
    book_abbrev: "sl",
    capitulo: 91,
    versos: [
      {
        v: 1,
        t: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.",
      },
      {
        v: 2,
        t: "Direi do SENHOR: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.",
      },
      {
        v: 3,
        t: "Porque ele te livrará do laço do passarinheiro, e da peste perniciosa.",
      },
      {
        v: 4,
        t: "Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel.",
      },
      {
        v: 5,
        t: "Não terás medo do terror de noite nem da seta que voe de dia,",
      },
      {
        v: 6,
        t: "Nem da peste que anda na escuridão, nem da mortandade que assola ao meio-dia.",
      },
      {
        v: 7,
        t: "Mil cairão ao teu lado, e dez mil à tua direita, mas não chegará a ti.",
      },
      {
        v: 8,
        t: "Somente com os teus olhos contemplarás, e verás a recompensa dos ímpios.",
      },
      {
        v: 9,
        t: "Porque tu, ó SENHOR, és o meu refúgio! No Altíssimo fizeste a tua habitação.",
      },
      {
        v: 10,
        t: "Nenhum mal te sucederá, nem praga alguma chegará à tua tenda.",
      },
      {
        v: 11,
        t: "Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos.",
      },
      {
        v: 12,
        t: "Eles te sustentarão nas suas mãos, para que não tropeces com o teu pé em pedra.",
      },
      {
        v: 13,
        t: "Pisarás o leão e a cobra; calcarás aos pés o filho do leão e a serpente.",
      },
      {
        v: 14,
        t: "Pois que tão encarecidamente me amou, também eu o livrarei; pô-lo-ei num alto retiro, porque conheceu o meu nome.",
      },
      {
        v: 15,
        t: "Ele me invocará, e eu lhe responderei; estarei com ele na angústia; dela o retirarei, e o glorificarei.",
      },
      {
        v: 16,
        t: "Fartá-lo-ei com longura de dias, e lhe mostrarei a minha salvação.",
      },
    ],
  },
  {
    book_abbrev: "jo",
    capitulo: 3,
    versos: [
      {
        v: 16,
        t: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      },
      {
        v: 17,
        t: "Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.",
      },
    ],
  },
  {
    book_abbrev: "rm",
    capitulo: 8,
    versos: [
      {
        v: 28,
        t: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.",
      },
      {
        v: 31,
        t: "Que diremos, pois, a estas coisas? Se Deus é por nós, quem será contra nós?",
      },
      {
        v: 37,
        t: "Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.",
      },
      {
        v: 38,
        t: "Porque estou certo de que, nem a morte, nem a vida, nem os anjos, nem os principados, nem as potestades, nem o presente, nem o porvir,",
      },
      {
        v: 39,
        t: "Nem a altura, nem a profundidade, nem qualquer outra criatura nos poderá separar do amor de Deus, que está em Cristo Jesus nosso Senhor.",
      },
    ],
  },
  {
    book_abbrev: "1co",
    capitulo: 13,
    versos: [
      {
        v: 1,
        t: "Ainda que eu falasse as línguas dos homens e dos anjos, e não tivesse amor, seria como o metal que soa ou como o sino que tine.",
      },
      {
        v: 4,
        t: "O amor é sofredor, é benigno; o amor não é invejoso; o amor não trata com leviandade, não se ensoberbece,",
      },
      {
        v: 5,
        t: "Não se porta com indecência, não busca os seus interesses, não se irrita, não suspeita mal,",
      },
      { v: 6, t: "Não folga com a injustiça, mas folga com a verdade," },
      {
        v: 7,
        t: "Tudo sofre, tudo crê, tudo espera, tudo suporta.",
      },
      {
        v: 13,
        t: "Agora, pois, permanecem a fé, a esperança e o amor, estes três, mas o maior destes é o amor.",
      },
    ],
  },
  {
    book_abbrev: "fp",
    capitulo: 4,
    versos: [
      {
        v: 4,
        t: "Regozijai-vos sempre no Senhor; outra vez digo, regozijai-vos.",
      },
      {
        v: 6,
        t: "Não andeis ansiosos por coisa alguma; antes em tudo sejam conhecidas diante de Deus as vossas petições, pela oração e súplica, com ações de graças.",
      },
      {
        v: 7,
        t: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.",
      },
      {
        v: 8,
        t: "Quanto ao mais, irmãos, tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai.",
      },
      {
        v: 13,
        t: "Posso todas as coisas em Cristo que me fortalece.",
      },
    ],
  },
  {
    book_abbrev: "mt",
    capitulo: 5,
    versos: [
      {
        v: 3,
        t: "Bem-aventurados os pobres de espírito, porque deles é o reino dos céus;",
      },
      {
        v: 4,
        t: "Bem-aventurados os que choram, porque eles serão consolados;",
      },
      { v: 5, t: "Bem-aventurados os mansos, porque eles herdarão a terra;" },
      {
        v: 6,
        t: "Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos;",
      },
      {
        v: 7,
        t: "Bem-aventurados os misericordiosos, porque eles alcançarão misericórdia;",
      },
      {
        v: 8,
        t: "Bem-aventurados os limpos de coração, porque eles verão a Deus;",
      },
      {
        v: 9,
        t: "Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus;",
      },
    ],
  },
  {
    book_abbrev: "mt",
    capitulo: 6,
    versos: [
      {
        v: 9,
        t: "Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome;",
      },
      {
        v: 10,
        t: "Venha o teu reino, seja feita a tua vontade, assim na terra como no céu;",
      },
      { v: 11, t: "O pão nosso de cada dia nos dá hoje;" },
      {
        v: 12,
        t: "E perdoa-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores;",
      },
      {
        v: 13,
        t: "E não nos induzas à tentação; mas livra-nos do mal; porque teu é o reino, e o poder, e a glória, para sempre. Amém.",
      },
      {
        v: 33,
        t: "Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.",
      },
      {
        v: 34,
        t: "Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.",
      },
    ],
  },
  {
    book_abbrev: "gn",
    capitulo: 1,
    versos: [
      { v: 1, t: "No princípio criou Deus os céus e a terra." },
      {
        v: 2,
        t: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.",
      },
      { v: 3, t: "E disse Deus: Haja luz. E houve luz." },
      { v: 4, t: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas." },
      {
        v: 26,
        t: "E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra, e sobre todo o réptil que se move sobre a terra.",
      },
      {
        v: 27,
        t: "E criou Deus o homem à sua imagem; à imagem de Deus o criou; macho e fêmea os criou.",
      },
    ],
  },
  {
    book_abbrev: "ap",
    capitulo: 21,
    versos: [
      {
        v: 1,
        t: "E vi um novo céu, e uma nova terra. Porque já o primeiro céu e a primeira terra passaram, e o mar já não existe.",
      },
      {
        v: 3,
        t: "E ouvi uma grande voz do céu, que dizia: Eis aqui o tabernáculo de Deus com os homens, pois com eles habitará, e eles serão o seu povo, e o mesmo Deus estará com eles, e será o seu Deus.",
      },
      {
        v: 4,
        t: "E Deus limpará de seus olhos toda a lágrima; e não haverá mais morte, nem pranto, nem clamor, nem dor; porque já as primeiras coisas são passadas.",
      },
    ],
  },
  {
    book_abbrev: "mt",
    capitulo: 11,
    versos: [
      {
        v: 28,
        t: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      },
      {
        v: 29,
        t: "Tomai sobre vós o meu jugo, e aprendei de mim, que sou manso e humilde de coração; e encontrareis descanso para as vossas almas.",
      },
      { v: 30, t: "Porque o meu jugo é suave e o meu fardo é leve." },
    ],
  },
  {
    book_abbrev: "hb",
    capitulo: 11,
    versos: [
      {
        v: 1,
        t: "Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.",
      },
      {
        v: 6,
        t: "Ora, sem fé é impossível agradar-lhe; porque é necessário que aquele que se aproxima de Deus creia que ele existe, e que é galardoador dos que o buscam.",
      },
    ],
  },
  {
    book_abbrev: "pv",
    capitulo: 3,
    versos: [
      {
        v: 5,
        t: "Confia no SENHOR de todo o teu coração, e não te estribes no teu próprio entendimento.",
      },
      {
        v: 6,
        t: "Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.",
      },
    ],
  },
];

export function findChapter(bookAbbrev: string, cap: number) {
  return CAPITULOS_ACF.find(
    (c) => c.book_abbrev === bookAbbrev.toLowerCase() && c.capitulo === cap,
  );
}

export function getAllSeededVerses() {
  const out: Array<{
    book_abbrev: string;
    capitulo: number;
    versiculo: number;
    texto: string;
  }> = [];
  for (const cap of CAPITULOS_ACF) {
    for (const v of cap.versos) {
      out.push({
        book_abbrev: cap.book_abbrev,
        capitulo: cap.capitulo,
        versiculo: v.v,
        texto: v.t,
      });
    }
  }
  return out;
}
