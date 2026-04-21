import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Repeat, Shield, BarChart3, Upload, Workflow } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Mailburst — Send campaigns at scale, with built-in queues" },
      { name: "description", content: "A Mailchimp-style campaign platform powered by Laravel queues, Redis, and Horizon. Retry-safe, dead-letter aware, ready for millions." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-cream bg-grain">
      <SiteHeader />
      <Hero />
      <LogoBar />
      <Features />
      <HowItWorks />
      <StackSection />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-brutal-sm"
          >
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            {t("hero.badge")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            {t("hero.title.1")} <span className="squiggle">{t("hero.title.2")}</span><br />
            {t("hero.title.3")}<br />
            {t("hero.title.4")} <em className="not-italic text-accent">{t("hero.title.5")}</em> {t("hero.title.6")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            {t("hero.desc")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/signup">
              <Button size="lg" className="h-12 bg-primary text-ink border-2 border-ink shadow-brutal hover:bg-primary hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm transition text-base font-bold">
                {t("hero.cta.start")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="h-12 border-2 border-ink bg-cream shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition text-base font-bold">
                {t("hero.cta.pricing")}
              </Button>
            </Link>
          </motion.div>
          <p className="mt-4 text-xs text-muted-foreground">{t("hero.cta.note")}</p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const { t } = useI18n();
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl border-2 border-ink bg-card p-5 shadow-brutal-lg"
      >
        <div className="flex items-center gap-2 border-b-2 border-ink pb-3">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <div className="h-3 w-3 rounded-full bg-warning" />
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">horizon.mailburst.io</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { l: t("hero.visual.throughput"), v: "12,480/min" },
            { l: t("hero.visual.workers"), v: "32" },
            { l: t("hero.visual.failed"), v: "0.02%" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border-2 border-ink bg-cream p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{s.l}</p>
              <p className="mt-1 font-display text-xl font-bold">{s.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {["emails", "emails", "reports", "emails", "default"].map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-center justify-between rounded-md border border-ink/20 bg-cream/60 px-3 py-2 text-xs font-mono"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                SendCampaignBatchJob
              </span>
              <span className="rounded bg-primary px-2 py-0.5 font-bold">{q}</span>
              <span className="text-muted-foreground">{(120 + i * 13)}ms</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -right-4 -top-6 hidden rounded-xl border-2 border-ink bg-accent px-3 py-2 text-sm font-bold text-accent-foreground shadow-brutal-sm md:block"
      >
        {t("hero.visual.retry")}
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -bottom-4 -left-4 hidden rounded-xl border-2 border-ink bg-success px-3 py-2 text-sm font-bold text-success-foreground shadow-brutal-sm md:block"
      >
        {t("hero.visual.delivered")}
      </motion.div>
    </div>
  );
}

function LogoBar() {
  const { t } = useI18n();
  return (
    <section className="border-b-2 border-ink bg-ink py-8 text-cream">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-cream/50">{t("logobar.builton")}</span>
        {["Laravel 11", "Redis", "Horizon", "Sanctum", "Stripe", "Docker"].map((x) => (
          <span key={x} className="font-display text-lg font-bold text-cream/90">{x}</span>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const { t } = useI18n();
  const items = [
    { icon: Upload, title: t("features.bulk.t"), desc: t("features.bulk.d") },
    { icon: Workflow, title: t("features.async.t"), desc: t("features.async.d") },
    { icon: Repeat, title: t("features.retry.t"), desc: t("features.retry.d") },
    { icon: Shield, title: t("features.dlq.t"), desc: t("features.dlq.d") },
    { icon: BarChart3, title: t("features.reports.t"), desc: t("features.reports.d") },
    { icon: Zap, title: t("features.horizon.t"), desc: t("features.horizon.d") },
  ];
  return (
    <section className="border-b-2 border-ink py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">{t("features.eyebrow")}</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">{t("features.title")}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border-2 border-ink bg-card p-6 shadow-brutal-sm transition hover:-translate-y-1 hover:shadow-brutal"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 border-ink bg-primary">
                <it.icon className="h-5 w-5 text-ink" />
              </div>
              <h3 className="font-display text-xl font-bold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { n: "01", t: t("how.1.t"), d: t("how.1.d") },
    { n: "02", t: t("how.2.t"), d: t("how.2.d") },
    { n: "03", t: t("how.3.t"), d: t("how.3.d") },
    { n: "04", t: t("how.4.t"), d: t("how.4.d") },
    { n: "05", t: t("how.5.t"), d: t("how.5.d") },
    { n: "06", t: t("how.6.t"), d: t("how.6.d") },
  ];
  return (
    <section className="border-b-2 border-ink bg-primary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-12 font-display text-4xl font-bold md:text-5xl">{t("how.title")}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border-2 border-ink bg-cream p-6 shadow-brutal-sm">
              <p className="font-display text-3xl font-bold text-accent">{s.n}</p>
              <h3 className="mt-2 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StackSection() {
  const { t } = useI18n();
  return (
    <section className="border-b-2 border-ink py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent">{t("stack.eyebrow")}</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">{t("stack.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("stack.desc")}</p>
          <ul className="mt-6 space-y-2 text-sm">
            {[
              "Laravel Queue (Redis driver)",
              "Horizon for monitoring & autoscaling",
              "Sanctum for SPA + token auth",
              "Stripe for subscriptions",
              "Pest for tests, Pint for lint",
              "Docker Compose for one-command boot",
            ].map((x) => (
              <li key={x} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <pre className="overflow-x-auto rounded-xl border-2 border-ink bg-ink p-6 text-sm leading-relaxed text-cream shadow-brutal">
{`<?php
namespace App\\Jobs;

class SendCampaignBatchJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;
    public array $backoff = [10, 30, 60, 120, 300];

    public function __construct(
        public Campaign $campaign,
        public array $contactIds
    ) {}

    public function handle(MailService $mail): void {
        foreach ($this->contactIds as $id) {
            $mail->send($this->campaign, $id);
        }
    }

    public function failed(\\Throwable $e): void {
        DeadLetter::record($this->job, $e);
    }
}`}
        </pre>
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useI18n();
  return (
    <section className="bg-accent py-20 text-accent-foreground">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl font-bold md:text-6xl">{t("cta.title")}</h2>
        <p className="mt-4 text-lg opacity-90">{t("cta.desc")}</p>
        <Link to="/signup">
          <Button size="lg" className="mt-8 h-14 bg-cream text-ink border-2 border-ink shadow-brutal hover:bg-cream hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm transition text-base font-bold">
            {t("cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
