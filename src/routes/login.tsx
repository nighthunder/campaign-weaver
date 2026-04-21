import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/mock-store";
import { z } from "zod";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Log in — Mailburst" }] }),
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
});

function LoginPage() {
  const nav = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email, password });
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Invalid input"); return; }
    store.signIn(email);
    toast.success(t("login.welcome"));
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-cream bg-grain">
      <SiteHeader />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl place-items-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border-2 border-ink bg-card p-8 shadow-brutal">
          <h1 className="font-display text-3xl font-bold">{t("login.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("login.desc")}</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-2 border-ink" placeholder="you@company.com" />
            </div>
            <div>
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-2 border-ink" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full h-11 bg-primary text-ink border-2 border-ink shadow-brutal-sm hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition font-bold">
              {t("login.submit")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("login.noaccount")} <Link to="/signup" className="font-bold text-ink underline">{t("login.signup")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
