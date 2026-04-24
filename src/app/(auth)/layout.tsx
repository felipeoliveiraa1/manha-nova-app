import Link from "next/link";
import { Flame } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh mx-auto flex w-full max-w-sm flex-col px-6 py-10">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 self-start font-serif text-lg font-semibold"
      >
        <Flame className="h-4 w-4 text-primary" />
        Manhã Nova
      </Link>
      {children}
    </div>
  );
}
