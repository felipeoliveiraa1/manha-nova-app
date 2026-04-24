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

export function PaymentFailedEmail({
  nome,
  checkoutUrl,
}: {
  nome: string;
  checkoutUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Não conseguimos processar seu pagamento do Manhã Nova</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Manhã Nova</Heading>
          <Hr style={hr} />
          <Text style={greeting}>Oi, {nome}.</Text>
          <Text style={text}>
            Não conseguimos processar seu último pagamento. Seu acesso ainda
            está ativo por alguns dias, mas pra continuar a rotina sem
            interrupção, atualize seus dados:
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Button href={checkoutUrl} style={button}>
              Atualizar pagamento
            </Button>
          </Section>
          <Text style={text}>
            Se já resolveu do seu lado, ignore esse email — vai normalizar
            automaticamente.
          </Text>
          <Text style={footer}>© {new Date().getFullYear()} Manhã Nova</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PaymentFailedEmail;

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
