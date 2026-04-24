import { BottomNav } from "@/components/layout/bottom-nav";
import { MiniPlayer } from "@/components/layout/mini-player";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { InstallPrompt } from "@/components/features/install-prompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh mx-auto w-full max-w-xl pb-24">
      {children}
      <MiniPlayer />
      <BottomNav />
      <InstallPrompt />
      <ServiceWorkerRegister />
    </div>
  );
}
