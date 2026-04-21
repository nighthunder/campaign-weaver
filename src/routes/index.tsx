import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Repeat, Shield, BarChart3, Upload, Workflow } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

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
  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-brutal-sm"
          >
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Powered by Laravel Queues
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            Send <span className="squiggle">millions</span><br />
            of emails.<br />
            Sweat <em className="not-italic text-accent">zero</em> drops.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            Mailburst is a campaign platform built on Redis-backed Laravel queues with retry,
            dead-letter routing, and a real-time job dashboard. No HTTP timeouts. No lost messages.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/signup">
              <Button size="lg" className="h-12 bg-primary text-ink border-2 border-ink shadow-brutal hover:bg-primary hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm transition text-base font-bold">
                Start sending free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="h-12 border-2 border-ink bg-cream shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition text-base font-bold">
                See pricing
              </Button>
            </Link>
          </motion.div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card. 2,000 free emails/month forever.</p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
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
            { l: "Throughput", v: "12,480/min", c: "primary" },
            { l: "Workers", v: "32", c: "accent" },
            { l: "Failed", v: "0.02%", c: "success" },
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
        Retry × 5 → DLQ
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -bottom-4 -left-4 hidden rounded-xl border-2 border-ink bg-success px-3 py-2 text-sm font-bold text-success-foreground shadow-brutal-sm md:block"
      >
        99.97% delivered ✓
      </motion.div>
    </div>
  );
}

function LogoBar() {
  return (
    <section className="border-b-2 border-ink bg-ink py-8 text-cream">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-cream/50">Built on</span>
        {["Laravel 11", "Redis", "Horizon", "Sanctum", "Stripe", "Docker"].map((t) => (
          <span key={t} className="font-display text-lg font-bold text-cream/90">{t}</span>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Upload, title: "Bulk import contacts", desc: "Drop a CSV with 500k rows. Streamed and chunked into the queue without blocking the request." },
    { icon: Workflow, title: "Async campaign sends", desc: "Each batch is a dispatched Job. No 30-second timeouts, no lost recipients." },
    { icon: Repeat, title: "Retry with backoff", desc: "Configurable tries + exponential backoff. Transient SMTP failures auto-recover." },
    { icon: Shield, title: "Dead-letter queue", desc: "Permanently-failed jobs land in a DLQ for inspection and manual replay." },
    { icon: BarChart3, title: "Delivery reports", desc: "Opens, clicks, bounces, complaints — aggregated per campaign in real time." },
    { icon: Zap, title: "Horizon dashboard", desc: "Watch workers, throughput, and failed jobs live. Built-in to every install." },
  ];
  return (
    <section className="border-b-2 border-ink py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">The toolkit</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
            Concurrency, resilience, observability — out of the box.
          </h2>
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
  const steps = [
    { n: "01", t: "Upload your list", d: "Stream CSV → contacts table. Background job parses millions of rows." },
    { n: "02", t: "Compose & schedule", d: "Visual editor with merge tags. Personalize per-recipient." },
    { n: "03", t: "Dispatch to Redis", d: "Campaign chunked into 250-recipient batches, each a Laravel Job." },
    { n: "04", t: "Workers fan out", d: "Horizon balances workers across emails / reports / default queues." },
    { n: "05", t: "Retry or DLQ", d: "Failures retry up to 5× with exponential backoff. Then dead-letter." },
    { n: "06", t: "Track everything", d: "Webhooks update delivery, opens, clicks. Dashboards in real time." },
  ];
  return (
    <section className="border-b-2 border-ink bg-primary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-12 font-display text-4xl font-bold md:text-5xl">From upload to inbox in 6 steps.</h2>
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
  return (
    <section className="border-b-2 border-ink py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Architecture</p>
          <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">A backend that scales the way it should.</h2>
          <p className="mt-4 text-muted-foreground">
            Mailburst is built on Laravel 11, Redis, and Horizon. The HTTP layer never sends an email itself —
            it dispatches Jobs that workers process concurrently. Failed jobs auto-retry, then graduate to a
            dead-letter queue you can inspect and replay.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            {[
              "Laravel Queue (Redis driver)",
              "Horizon for monitoring & autoscaling",
              "Sanctum for SPA + token auth",
              "Stripe for subscriptions",
              "Pest for tests, Pint for lint",
              "Docker Compose for one-command boot",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent" /> {t}
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
  return (
    <section className="bg-accent py-20 text-accent-foreground">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl font-bold md:text-6xl">Ready to launch your first campaign?</h2>
        <p className="mt-4 text-lg opacity-90">Free forever for up to 2,000 emails per month.</p>
        <Link to="/signup">
          <Button size="lg" className="mt-8 h-14 bg-cream text-ink border-2 border-ink shadow-brutal hover:bg-cream hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm transition text-base font-bold">
            Create your account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
