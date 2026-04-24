import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/features/admin-field";
import { criarVideoAction } from "@/lib/auth/actions-admin";

export default function NovoVideoPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/videos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Nova mensagem
      </h1>
      <form action={criarVideoAction} className="flex flex-col gap-4">
        <Field label="Título">
          <Input name="titulo" required />
        </Field>
        <Field label="Descrição">
          <Textarea name="descricao" rows={2} />
        </Field>
        <Field label="Thumbnail URL">
          <Input name="thumbnail_url" placeholder="https://..." />
        </Field>
        <Field label="Vídeo URL (YouTube)">
          <Input
            name="video_url"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Duração (seg)">
            <Input type="number" name="duracao_seg" min={0} />
          </Field>
          <Field label="Publicar em">
            <Input type="date" name="publicado_em" />
          </Field>
        </div>
        <Button type="submit" size="lg">
          Criar mensagem
        </Button>
      </form>
    </div>
  );
}
