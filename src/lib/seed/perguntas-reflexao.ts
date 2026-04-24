export const PERGUNTAS_REFLEXAO = [
  "O que você precisa entregar para Deus hoje?",
  "Pelo que você é grato agora?",
  "O que te afasta de Deus nessa semana?",
  "Onde você viu Deus agir nos últimos dias?",
  "O que você tem adiado obedecer?",
  "Quem precisa da sua oração hoje?",
  "Qual promessa de Deus você precisa lembrar?",
];

export function perguntaDoDia() {
  const dia = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  return PERGUNTAS_REFLEXAO[dia % PERGUNTAS_REFLEXAO.length];
}
