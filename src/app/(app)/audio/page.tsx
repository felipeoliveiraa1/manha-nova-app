import { listAudios } from "@/lib/repo/audios";
import { AudioList } from "@/components/features/audio-list";

export default async function AudioPage() {
  const [devocionais, oracoes, ambiente] = await Promise.all([
    listAudios("devocional"),
    listAudios("oracao"),
    listAudios("ambiente"),
  ]);

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Áudio</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Orações guiadas, devocionais narrados e sons pra acalmar.
      </p>

      <AudioList
        sections={[
          { titulo: "Orações guiadas", itens: oracoes },
          { titulo: "Devocionais narrados", itens: devocionais },
          { titulo: "Sons de ambiente", itens: ambiente },
        ]}
      />
    </div>
  );
}
