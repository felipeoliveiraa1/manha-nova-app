"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function StickyCta({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(total > 0 && scrolled / total > 0.25);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Manhã Nova</p>
              <p className="text-sm font-semibold">
                R$29,90/mês · 7 dias de garantia
              </p>
            </div>
            <a
              href={href}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
            >
              Assinar <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
