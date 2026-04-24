import { Flame } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
      <Flame className="h-10 w-10 text-primary" />
      <h1 className="font-serif text-2xl font-semibold">Você está offline</h1>
      <p className="text-sm text-muted-foreground">
        Sem conexão agora, mas sua rotina não para. Quando voltar online,
        continuamos de onde parou.
      </p>
    </div>
  );
}
