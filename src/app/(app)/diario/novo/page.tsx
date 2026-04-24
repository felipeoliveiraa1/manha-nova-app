import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DiarioForm } from "@/components/features/diario-form";

export default function NovoDiarioPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/diario"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Nova entrada
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold">
          Como foi seu dia com Deus?
        </h1>
      </header>

      <DiarioForm />
    </div>
  );
}
