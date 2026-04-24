import { AiChat } from "@/components/features/ai-chat";
import { requireActiveSubscription } from "@/lib/auth/guards";

export default async function IaPage() {
  await requireActiveSubscription();
  return (
    <div className="px-4 pt-6 pb-8">
      <header className="mb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          IA Espiritual
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold">
          Fale o que está sentindo
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          A resposta vem com versículo, aplicação e oração.
        </p>
      </header>

      <AiChat />
    </div>
  );
}
