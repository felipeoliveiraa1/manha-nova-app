import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function SubscriptionCanceledEmail({
  nome,
  checkoutUrl,
}: {
  nome: string;
  checkoutUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Sua assinatura do Manhã Nova foi cancelada</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Manhã Nova</Heading>
          <Text style={sub}>Sua rotina com Deus, todo dia.</Text>
          <Hr style={hr} />
          <Text style={greeting}>Oi, {nome}.</Text>
          <Text style={text}>
            Sua assinatura foi cancelada. A gente sente muito te ver indo —
            seus dados (devocionais, diário, notas) ficam salvos caso queira
            voltar depois.
          </Text>
          <Text style={text}>
            Se foi um engano ou você quiser reativar, é só clicar:
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button href={checkoutUrl} style={button}>
              Reativar assinatura
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={textSmall}>
            &ldquo;As misericórdias do Senhor são a causa de não sermos
            consumidos, porque as suas misericórdias não têm fim; novas são
            cada manhã&rdquo; — Lamentações 3:22-23
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} Manhã Nova
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SubscriptionCanceledEmail;

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
const sub: React.CSSProperties = { color: "#8a8a8a", fontSize: "13px", margin: "4px 0 0 0" };
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
  fontStyle: "italic",
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
const footer: React.CSSProperties = { color: "#5a5a5a", fontSize: "11px", margin: "24px 0 0 0" };
