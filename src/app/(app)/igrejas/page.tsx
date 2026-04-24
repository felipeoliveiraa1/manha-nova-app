import { IgrejasList } from "@/components/features/igrejas-list";
import { listIgrejas } from "@/lib/repo/igrejas";
import { requireActiveSubscription } from "@/lib/auth/guards";

export default async function IgrejasPage() {
  await requireActiveSubscription();
  const igrejas = await listIgrejas();

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Igrejas próximas</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Encontre uma comunidade para se plantar.
      </p>

      <IgrejasList igrejas={igrejas} />
    </div>
  );
}
