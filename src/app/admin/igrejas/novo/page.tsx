import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/features/admin-field";
import { criarIgrejaAction } from "@/lib/auth/actions-admin";

export default function NovaIgrejaPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/igrejas"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Nova igreja
      </h1>
      <form action={criarIgrejaAction} className="flex flex-col gap-4">
        <Field label="Nome">
          <Input name="nome" required />
        </Field>
        <Field label="Denominação">
          <Input name="denominacao" />
        </Field>
        <Field label="Endereço">
          <Input name="endereco" />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Cidade">
            <Input name="cidade" />
          </Field>
          <Field label="Estado">
            <Input name="estado" maxLength={2} placeholder="SP" />
          </Field>
        </div>
        <Field label="Website">
          <Input name="website" placeholder="https://..." />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Lat">
            <Input type="number" name="lat" step="0.000001" />
          </Field>
          <Field label="Lng">
            <Input type="number" name="lng" step="0.000001" />
          </Field>
        </div>
        <Button type="submit" size="lg">
          Criar igreja
        </Button>
      </form>
    </div>
  );
}
