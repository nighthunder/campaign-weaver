import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { store, useStore } from "@/lib/mock-store";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Mailburst" },
      { name: "description", content: "Simple, queue-powered pricing. Free to start." },
    ],
  }),
});

const plans = [
  {
    id: "free" as const,
    name: "Starter",
    price: "$0",
    cadence: "forever",
    desc: "Test the queue. Send your first newsletter.",
    features: ["2,000 emails / month", "1 contact list", "Basic delivery report", "Community support"],
    cta: "Get started",
    accent: false,
  },
  {
    id: "growth" as const,
    name: "Growth",
    price: "$29",
    cadence: "/ month",
    desc: "For serious senders with retry & DLQ insights.",
    features: ["50,000 emails / month", "Unlimited lists", "Open & click tracking", "Retry + dead-letter dashboard", "Priority queue", "Email support"],
    cta: "Upgrade to Growth",
    accent: true,
  },
  {
    id: "scale" as const,
    name: "Scale",
    price: "$149",
    cadence: "/ month",
    desc: "Horizon autoscaling. Webhooks. SLA.",
    features: ["1,000,000 emails / month", "Dedicated workers", "Custom webhooks", "99.99% SLA", "SAML SSO", "Slack support"],
    cta: "Go Scale",
    accent: false,
  },
];

function PricingPage() {
  const { user } = useStore();

  const onChoose = (id: "free" | "growth" | "scale") => {
    if (!user) { toast.info("Sign up first to choose a plan."); return; }
    store.setPlan(id);
    toast.success(`You're on the ${id.charAt(0).toUpperCase()}${id.slice(1)} plan!`);
  };

  return (
    <div className="min-h-screen bg-cream bg-grain">
      <SiteHeader />
      <section className="border-b-2 border-ink py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Pricing</p>
          <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">Pay for what you send.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Start free. Scale when your queue does.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl border-2 border-ink p-8 transition hover:-translate-y-1 ${
                p.accent ? "bg-primary shadow-brutal-lg" : "bg-card shadow-brutal-sm hover:shadow-brutal"
              }`}
            >
              {p.accent && (
                <span className="inline-block rounded-full border-2 border-ink bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-cream">
                  Most popular
                </span>
              )}
              <h3 className="mt-2 font-display text-2xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <p className="mt-6 font-display text-5xl font-bold">
                {p.price}
                <span className="text-base font-normal text-muted-foreground"> {p.cadence}</span>
              </p>
              <Button
                onClick={() => onChoose(p.id)}
                className={`mt-6 w-full h-11 border-2 border-ink font-bold transition ${
                  p.accent
                    ? "bg-ink text-cream hover:bg-ink shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    : "bg-cream text-ink hover:bg-cream shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                }`}
              >
                {user?.plan === p.id ? "Current plan" : p.cta}
              </Button>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
