import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Map, Church } from "lucide-react";

const LUGARES = [
  { nome: "Belém", desc: "Onde Jesus nasceu.", ref: "Lucas 2" },
  { nome: "Nazaré", desc: "Onde Jesus cresceu.", ref: "Lucas 4" },
  { nome: "Jerusalém", desc: "Onde Jesus morreu e ressuscitou.", ref: "Mateus 27-28" },
  { nome: "Mar da Galiléia", desc: "Cenário de muitos milagres e ensinos.", ref: "Mateus 4" },
  { nome: "Rio Jordão", desc: "Onde Jesus foi batizado.", ref: "Mateus 3" },
  { nome: "Getsêmani", desc: "Onde Jesus orou antes da crucificação.", ref: "Mateus 26" },
  { nome: "Emaús", desc: "Caminho onde Jesus apareceu aos discípulos.", ref: "Lucas 24" },
  { nome: "Antioquia", desc: "Onde os seguidores foram chamados 'cristãos' pela primeira vez.", ref: "Atos 11" },
];

export default function MapasPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Mapas bíblicos
      </h1>

      <Card className="mb-6 border-dashed">
        <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <Map className="h-5 w-5" />
          Mapas interativos (Mapbox) virão em breve. Por enquanto, veja os
          lugares-chave da história bíblica.
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {LUGARES.map((l) => (
          <Card key={l.nome}>
            <CardContent className="flex items-center gap-3 p-4">
              <Church className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h3 className="font-serif text-base font-semibold">
                  {l.nome}
                </h3>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
                <p className="mt-1 text-[11px] text-primary">{l.ref}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
