import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Send, Users, Workflow, BarChart3 } from "lucide-react";
import { Logo } from "./Logo";
import { useStore } from "@/lib/mock-store";
import { useI18n } from "@/lib/i18n";

export function AppSidebar() {
  const loc = useLocation();
  const { user } = useStore();
  const { t } = useI18n();

  const items = [
    { to: "/dashboard", label: t("side.overview"), icon: LayoutDashboard },
    { to: "/campaigns", label: t("side.campaigns"), icon: Send },
    { to: "/contacts", label: t("side.contacts"), icon: Users },
    { to: "/jobs", label: t("side.jobs"), icon: Workflow },
    { to: "/reports", label: t("side.reports"), icon: BarChart3 },
  ] as const;

  return (
    <aside className="hidden w-64 shrink-0 border-r-2 border-ink bg-cream md:flex md:flex-col">
      <div className="border-b-2 border-ink p-5">
        <Link to="/"><Logo /></Link>
      </div>
      <nav className="flex-1 p-3">
        {items.map((it) => {
          const active = loc.pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`mb-1 flex items-center gap-3 rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                active
                  ? "border-ink bg-primary text-ink shadow-brutal-sm"
                  : "border-transparent text-foreground hover:border-ink hover:bg-card"
              }`}
            >
              <it.icon className="h-4 w-4" /> {it.label}
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="border-t-2 border-ink p-4">
          <div className="rounded-lg border-2 border-ink bg-card p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("side.plan")}</p>
            <p className="font-display text-lg font-bold capitalize">{user.plan}</p>
            <Link to="/pricing" className="mt-1 inline-block text-xs font-bold underline">{t("side.upgrade")}</Link>
          </div>
        </div>
      )}
    </aside>
  );
}
