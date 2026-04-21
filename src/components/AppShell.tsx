import { Navigate } from "@tanstack/react-router";
import { useStore } from "@/lib/mock-store";
import { AppSidebar } from "./AppSidebar";
import { SiteHeader } from "./SiteHeader";

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-cream bg-grain">
      <div className="md:hidden"><SiteHeader /></div>
      <div className="flex">
        <AppSidebar />
        <main className="min-h-screen flex-1">
          <header className="border-b-2 border-ink bg-cream/95 px-6 py-4 backdrop-blur">
            <h1 className="font-display text-2xl font-bold">{title}</h1>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
