import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/features/admin-field";
import { criarTrilhaAction } from "@/lib/auth/actions-admin";

export default function NovaTrilhaPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/trilhas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Nova trilha
      </h1>
      <form action={criarTrilhaAction} className="flex flex-col gap-4">
        <Field label="Título">
          <Input name="titulo" required />
        </Field>
        <Field label="Slug" hint="Deixe vazio pra gerar do título.">
          <Input name="slug" />
        </Field>
        <Field label="Descrição">
          <Textarea name="descricao" rows={3} />
        </Field>
        <Field label="Duração (dias)">
          <Input type="number" name="duracao_dias" defaultValue={7} min={1} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="publicado"
            className="accent-primary"
          />
          Publicada
        </label>
        <Button type="submit" size="lg">
          Criar trilha
        </Button>
      </form>
    </div>
  );
}
