import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/features/admin-field";
import { criarDevocionalAction } from "@/lib/auth/actions-admin";

export default function NovoDevocionalPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/devocionais"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Novo devocional
      </h1>

      <form action={criarDevocionalAction} className="flex flex-col gap-4">
        <Field label="Título">
          <Input name="titulo" required />
        </Field>
        <Field label="Slug" hint="Deixe vazio pra gerar do título.">
          <Input name="slug" />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Versículo (referência)">
            <Input name="versiculo_ref" placeholder="Ex: Salmos 23:1" required />
          </Field>
          <Field label="Tempo (min)">
            <Input type="number" name="tempo_min" defaultValue={3} min={1} />
          </Field>
        </div>
        <Field label="Versículo (texto)">
          <Textarea name="versiculo_texto" required />
        </Field>
        <Field label="Reflexão">
          <Textarea name="explicacao" rows={5} required />
        </Field>
        <Field label="Aplicação prática">
          <Textarea name="aplicacao" rows={4} required />
        </Field>
        <Field label="Oração">
          <Textarea name="oracao" rows={3} required />
        </Field>
        <Field label="Pergunta de reflexão (opcional)">
          <Input name="pergunta" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked
            className="accent-primary"
          />
          Publicado
        </label>

        <Button type="submit" size="lg">
          Criar devocional
        </Button>
      </form>
    </div>
  );
}
