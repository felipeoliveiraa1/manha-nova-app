import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";
import { Shield } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/devocionais", label: "Devocionais" },
  { href: "/admin/missoes", label: "Missões" },
  { href: "/admin/quiz", label: "Quiz" },
  { href: "/admin/trilhas", label: "Trilhas" },
  { href: "/admin/videos", label: "Mensagens do dia" },
  { href: "/admin/igrejas", label: "Igrejas" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user.isPreview && user.profile.role !== "admin") {
    redirect("/home");
  }

  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-b border-border bg-card/50 p-4 md:border-b-0 md:border-r">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 font-serif text-lg font-semibold"
        >
          <Shield className="h-4 w-4 text-primary" /> Admin
        </Link>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/home"
            className="mt-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            ← Voltar ao app
          </Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
