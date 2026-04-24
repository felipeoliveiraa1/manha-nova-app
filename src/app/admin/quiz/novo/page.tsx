import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/features/admin-field";
import { criarQuizAction } from "@/lib/auth/actions-admin";

export default function NovoQuizPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/quiz"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Nova pergunta
      </h1>
      <form action={criarQuizAction} className="flex flex-col gap-4">
        <Field label="Pergunta">
          <Textarea name="pergunta" rows={2} required />
        </Field>
        {["a", "b", "c", "d"].map((k) => (
          <Field key={k} label={`Alternativa ${k.toUpperCase()}`}>
            <Input name={`alt_${k}`} required />
          </Field>
        ))}
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Correta">
            <select
              name="correta"
              defaultValue="a"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              {["a", "b", "c", "d"].map((k) => (
                <option key={k} value={k}>
                  {k.toUpperCase()}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Categoria">
            <Input name="categoria" defaultValue="Geral" />
          </Field>
          <Field label="Nível (1-5)">
            <Input type="number" name="nivel" defaultValue={1} min={1} max={5} />
          </Field>
        </div>
        <Field label="Explicação (opcional)">
          <Textarea name="explicacao" rows={2} />
        </Field>
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
          Criar pergunta
        </Button>
      </form>
    </div>
  );
}
