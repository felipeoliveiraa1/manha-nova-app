export type VersiculoDoDia = { ref: string; texto: string };

/**
 * 40 versículos para rotacionar como "versículo do dia".
 * Mesmo dia = mesmo versículo (deterministico pelo dia do ano).
 */
export const VERSICULOS_SEED: VersiculoDoDia[] = [
  { ref: "Salmos 23:1", texto: "O Senhor é o meu pastor, nada me faltará." },
  {
    ref: "Filipenses 4:13",
    texto: "Posso todas as coisas em Cristo que me fortalece.",
  },
  {
    ref: "Jeremias 29:11",
    texto:
      "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal.",
  },
  {
    ref: "Provérbios 3:5-6",
    texto:
      "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.",
  },
  {
    ref: "Mateus 6:33",
    texto:
      "Buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.",
  },
  {
    ref: "Isaías 41:10",
    texto:
      "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.",
  },
  {
    ref: "Romanos 8:28",
    texto:
      "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.",
  },
  { ref: "Salmos 46:1", texto: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia." },
  { ref: "Josué 1:9", texto: "Esforça-te e tem bom ânimo; não temas, nem te espantes." },
  { ref: "João 3:16", texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito." },
  { ref: "Mateus 11:28", texto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei." },
  { ref: "Tiago 1:5", texto: "E, se algum de vós tem falta de sabedoria, peça-a a Deus." },
  { ref: "1 Coríntios 13:4", texto: "O amor é sofredor, é benigno; o amor não é invejoso." },
  { ref: "Gálatas 5:22", texto: "Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade." },
  { ref: "Hebreus 11:1", texto: "Ora, a fé é o firme fundamento das coisas que se esperam." },
  { ref: "Salmos 37:4", texto: "Deleita-te também no Senhor, e ele te concederá o que deseja o teu coração." },
  { ref: "Romanos 12:2", texto: "E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento." },
  { ref: "Filipenses 4:6-7", texto: "Não andeis ansiosos por coisa alguma; antes em tudo sejam conhecidas diante de Deus as vossas petições." },
  { ref: "2 Coríntios 5:17", texto: "Assim que, se alguém está em Cristo, nova criatura é." },
  { ref: "Efésios 2:8", texto: "Porque pela graça sois salvos, por meio da fé." },
  { ref: "Mateus 5:8", texto: "Bem-aventurados os limpos de coração, porque eles verão a Deus." },
  { ref: "Salmos 91:1", texto: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará." },
  { ref: "Mateus 28:20", texto: "Eis que eu estou convosco todos os dias, até à consumação dos séculos." },
  { ref: "1 Pedro 5:7", texto: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós." },
  { ref: "Salmos 34:18", texto: "Perto está o Senhor dos que têm o coração quebrantado." },
  { ref: "Lucas 6:31", texto: "E como vós quereis que os homens vos façam, da mesma maneira lhes fazei vós também." },
  { ref: "Mateus 5:16", texto: "Assim resplandeça a vossa luz diante dos homens." },
  { ref: "Romanos 10:17", texto: "De sorte que a fé é pelo ouvir, e o ouvir pela palavra de Deus." },
  { ref: "Salmos 119:105", texto: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." },
  { ref: "Êxodo 14:14", texto: "O Senhor pelejará por vós, e vos calareis." },
  { ref: "Números 6:24-25", texto: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti." },
  { ref: "Mateus 7:7", texto: "Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á." },
  { ref: "Salmos 27:1", texto: "O Senhor é a minha luz e a minha salvação; a quem temerei?" },
  { ref: "Provérbios 16:3", texto: "Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos." },
  { ref: "1 João 4:19", texto: "Nós o amamos porque ele nos amou primeiro." },
  { ref: "Apocalipse 3:20", texto: "Eis que estou à porta, e bato; se alguém ouvir a minha voz, e abrir a porta, entrarei em sua casa." },
  { ref: "Salmos 139:14", texto: "Eu te louvarei, porque de um modo assombroso, e tão maravilhoso fui feito." },
  { ref: "2 Timóteo 1:7", texto: "Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação." },
  { ref: "Hebreus 12:2", texto: "Olhando para Jesus, autor e consumador da fé." },
  { ref: "Eclesiastes 3:1", texto: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu." },
];

export function versiculoDoDia(): VersiculoDoDia {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return VERSICULOS_SEED[dayOfYear % VERSICULOS_SEED.length];
}
