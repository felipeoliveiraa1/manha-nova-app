import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/features/admin-field";
import { criarMissaoAction } from "@/lib/auth/actions-admin";

export default function NovaMissaoPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/missoes"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Nova missão
      </h1>
      <form action={criarMissaoAction} className="flex flex-col gap-4">
        <Field label="Título">
          <Input name="titulo" required />
        </Field>
        <Field label="Descrição">
          <Textarea name="descricao" rows={3} />
        </Field>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Tipo">
            <select
              name="tipo"
              defaultValue="diaria"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="diaria">Diária</option>
              <option value="semanal">Semanal</option>
              <option value="desafio">Desafio</option>
            </select>
          </Field>
          <Field label="Duração (dias)" hint="Só para desafios">
            <Input type="number" name="duracao_dias" min={0} />
          </Field>
          <Field label="Pontos">
            <Input type="number" name="pontos" defaultValue={10} min={0} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked
            className="accent-primary"
          />
          Publicada
        </label>
        <Button type="submit" size="lg">
          Criar missão
        </Button>
      </form>
    </div>
  );
}
