import { getCurrentUser } from "@/lib/auth/user";
import { ConfigForm } from "@/components/features/config-form";
import { AlterarSenhaForm } from "@/components/features/alterar-senha-form";

export default async function ConfiguracoesPage() {
  const user = await getCurrentUser();

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Configurações</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Deixe o app do seu jeito.
      </p>

      <ConfigForm
        initial={{
          tema: user.profile.preferencia_tema,
          horario: user.profile.horario_notificacao,
          versao: user.profile.preferencia_versao_biblia,
        }}
      />

      {!user.isPreview && (
        <div className="mt-4">
          <AlterarSenhaForm />
        </div>
      )}
    </div>
  );
}
