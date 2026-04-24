"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Target, Sparkles, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: typeof Home;
  /** Se true, exige assinatura ativa */
  requiresSub: boolean;
};

const items: Item[] = [
  { href: "/home", label: "Hoje", icon: Home, requiresSub: true },
  { href: "/biblia", label: "Bíblia", icon: BookOpen, requiresSub: false },
  { href: "/missoes", label: "Missões", icon: Target, requiresSub: true },
  { href: "/ia", label: "IA", icon: Sparkles, requiresSub: true },
  { href: "/perfil", label: "Perfil", icon: User, requiresSub: false },
];

export function BottomNav({ hasSubscription = true }: { hasSubscription?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <ul className="mx-auto flex max-w-xl items-center justify-between px-2 py-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map(({ href, label, icon: Icon, requiresSub }) => {
          const locked = requiresSub && !hasSubscription;
          const active = pathname === href || pathname.startsWith(href + "/");
          const target = locked ? "/assinatura-expirada" : href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={target}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-md py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : locked
                      ? "text-muted-foreground/60"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                  {locked && (
                    <Lock className="absolute -right-1 -bottom-1 h-3 w-3 text-muted-foreground" />
                  )}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
