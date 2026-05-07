import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const textoRaw = searchParams.get("texto") ?? "";
  const ref = searchParams.get("ref") ?? "";

  // Limita tamanho pra evitar imagem gigante / abuso
  const texto = textoRaw.slice(0, 400);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f1117 0%, #1a1f2e 55%, #2a1d18 100%)",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        {/* Top accent — sol nascendo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 60,
            color: "#f5d99a",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <span>✦</span>
          <span>Versículo do dia</span>
          <span>✦</span>
        </div>

        {/* Texto do versículo */}
        <div
          style={{
            display: "flex",
            color: "#fff",
            fontSize: texto.length > 200 ? 44 : texto.length > 120 ? 52 : 60,
            lineHeight: 1.25,
            textAlign: "center",
            fontStyle: "italic",
            maxWidth: "1000px",
            fontWeight: 500,
          }}
        >
          “{texto}”
        </div>

        {/* Referência */}
        <div
          style={{
            marginTop: 50,
            color: "#f5d99a",
            fontSize: 36,
            letterSpacing: 2,
            fontWeight: 600,
          }}
        >
          {ref}
        </div>

        {/* Branding bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(255,255,255,0.45)",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span>Manhã Nova</span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    },
  );
}
