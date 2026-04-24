"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Target,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Hoje", icon: Home },
  { href: "/biblia", label: "Bíblia", icon: BookOpen },
  { href: "/missoes", label: "Missões", icon: Target },
  { href: "/ia", label: "IA", icon: Sparkles },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <ul className="mx-auto flex max-w-xl items-center justify-between px-2 py-1 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
