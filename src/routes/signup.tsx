import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store } from "@/lib/mock-store";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Sign up — Mailburst" }] }),
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(6, "Min 6 characters").max(100),
});

function SignupPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ name, email, password });
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Invalid input"); return; }
    store.signIn(email, name);
    toast.success("Account created!");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-cream bg-grain">
      <SiteHeader />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl place-items-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border-2 border-ink bg-card p-8 shadow-brutal">
          <h1 className="font-display text-3xl font-bold">Start sending free</h1>
          <p className="mt-1 text-sm text-muted-foreground">2,000 emails/month — no card required.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 border-2 border-ink" placeholder="Jane Doe" />
            </div>
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 border-2 border-ink" placeholder="you@company.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 border-2 border-ink" placeholder="6+ characters" />
            </div>
            <Button type="submit" className="w-full h-11 bg-primary text-ink border-2 border-ink shadow-brutal-sm hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition font-bold">
              Create account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have one? <Link to="/login" className="font-bold text-ink underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
