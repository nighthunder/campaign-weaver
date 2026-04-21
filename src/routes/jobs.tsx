import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, store, type Job } from "@/lib/mock-store";
import { StatusBadge } from "./dashboard";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
  head: () => ({ meta: [{ title: "Jobs & Queues — Mailburst" }] }),
});

function JobsPage() {
  const { jobs } = useStore();
  const { t } = useI18n();
  const [filter, setFilter] = useState<"all" | Job["status"]>("all");

  const counts = {
    pending: jobs.filter((j) => j.status === "pending").length,
    processing: jobs.filter((j) => j.status === "processing").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
    dlq: jobs.filter((j) => j.status === "dlq").length,
  };

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const labels: Record<string, string> = {
    pending: t("jobs.s.pending"),
    processing: t("jobs.s.processing"),
    completed: t("jobs.s.completed"),
    failed: t("jobs.s.failed"),
    dlq: t("jobs.s.dlq"),
    all: t("jobs.s.all"),
  };

  return (
    <AppShell title={t("side.jobs")}>
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        {(["pending", "processing", "completed", "failed", "dlq"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-xl border-2 border-ink p-4 text-left shadow-brutal-sm transition hover:-translate-y-0.5 ${
              filter === k ? "bg-primary" : "bg-card"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels[k]}</p>
            <p className="mt-1 font-display text-2xl font-bold">{counts[k]}</p>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold">{t("jobs.filter")}</span>
        {(["all", "pending", "processing", "completed", "failed", "dlq"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-bold capitalize transition ${
              filter === f ? "bg-ink text-cream" : "bg-card hover:bg-secondary"
            }`}
          >
            {labels[f]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-brutal-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink text-cream">
              <tr className="text-left text-xs font-bold uppercase tracking-wide">
                <th className="px-4 py-3">{t("jobs.col.id")}</th>
                <th className="px-4 py-3">{t("jobs.col.campaign")}</th>
                <th className="px-4 py-3">{t("jobs.col.queue")}</th>
                <th className="px-4 py-3">{t("jobs.col.status")}</th>
                <th className="px-4 py-3">{t("jobs.col.attempts")}</th>
                <th className="px-4 py-3">{t("jobs.col.created")}</th>
                <th className="px-4 py-3">{t("jobs.col.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.id} className="border-b border-border last:border-0 hover:bg-cream">
                  <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                  <td className="px-4 py-3">{j.campaignName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border-2 border-ink bg-secondary px-2 py-0.5 text-xs font-bold">{j.queue}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
                  <td className="px-4 py-3">
                    <span className={j.attempts >= 3 ? "font-bold text-destructive" : ""}>{j.attempts}</span>
                    <span className="text-muted-foreground"> / {j.maxAttempts}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(j.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {(j.status === "failed" || j.status === "dlq") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { store.retryJob(j.id); toast.success(t("jobs.requeued", { id: j.id })); }}
                        className="border-2 border-ink h-7 text-xs"
                      >
                        <RefreshCw className="mr-1 h-3 w-3" /> {t("jobs.retry")}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {counts.dlq > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-ink bg-destructive/10 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-bold">{t("jobs.dlq.warn", { n: counts.dlq })}</p>
            <p className="text-sm text-muted-foreground">{t("jobs.dlq.help")}</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
