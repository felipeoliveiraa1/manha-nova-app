import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function PasswordResetEmail({
  nome,
  resetUrl,
}: {
  nome: string;
  resetUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Redefina sua senha do Manhã Nova</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Manhã Nova</Heading>
          <Text style={sub}>Sua rotina com Deus, todo dia.</Text>
          <Hr style={hr} />
          <Text style={greeting}>Oi, {nome}.</Text>
          <Text style={text}>
            Recebemos uma solicitação pra redefinir sua senha. Clique no
            botão abaixo pra criar uma nova (o link vale por 1 hora):
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button href={resetUrl} style={button}>
              Redefinir senha
            </Button>
          </Section>
          <Text style={textSmall}>
            Se o botão não funcionar, cole este link no navegador:
            <br />
            <Link href={resetUrl} style={linkStyle}>
              {resetUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={textSmall}>
            Se não foi você que pediu, pode ignorar esse email — sua senha
            continua a mesma.
          </Text>
          <Text style={footer}>© {new Date().getFullYear()} Manhã Nova</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordResetEmail;

const body: React.CSSProperties = {
  backgroundColor: "#0f1117",
  margin: 0,
  padding: "40px 0",
  fontFamily: "Inter, -apple-system, sans-serif",
};
const container: React.CSSProperties = {
  backgroundColor: "#1a1f2e",
  border: "1px solid #2a2f3e",
  borderRadius: "12px",
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px",
  color: "#f5e5cc",
};
const h1: React.CSSProperties = {
  color: "#e8b968",
  fontSize: "28px",
  fontFamily: "Fraunces, Georgia, serif",
  fontWeight: 600,
  margin: 0,
};
const sub: React.CSSProperties = {
  color: "#8a8a8a",
  fontSize: "13px",
  margin: "4px 0 0 0",
};
const hr: React.CSSProperties = { borderColor: "#2a2f3e", margin: "24px 0" };
const greeting: React.CSSProperties = {
  color: "#f5e5cc",
  fontSize: "16px",
  fontWeight: 600,
  margin: "0 0 12px 0",
};
const text: React.CSSProperties = {
  color: "#d4c5b0",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px 0",
};
const textSmall: React.CSSProperties = {
  color: "#8a8a8a",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "8px 0",
};
const button: React.CSSProperties = {
  backgroundColor: "#e8b968",
  color: "#0f1117",
  padding: "14px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "15px",
  display: "inline-block",
};
const linkStyle: React.CSSProperties = {
  color: "#e8b968",
  wordBreak: "break-all" as const,
};
const footer: React.CSSProperties = {
  color: "#5a5a5a",
  fontSize: "11px",
  margin: "24px 0 0 0",
};
