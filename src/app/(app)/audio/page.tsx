import { Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { requireActiveSubscription } from "@/lib/auth/guards";

export default async function AudioPage() {
  await requireActiveSubscription();

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Áudio</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Orações guiadas, devocionais narrados e sons pra acalmar.
      </p>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <Headphones className="h-10 w-10 text-muted-foreground/60" />
          <h2 className="font-serif text-lg font-semibold">Em breve</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Estamos gravando os áudios com carinho. Em alguns dias você terá
            aqui orações guiadas, devocionais narrados e sons de ambiente
            pra acompanhar sua rotina com Deus.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
