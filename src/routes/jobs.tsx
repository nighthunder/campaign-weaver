import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, store, type Job } from "@/lib/mock-store";
import { StatusBadge } from "./dashboard";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
  head: () => ({ meta: [{ title: "Jobs & Queues — Mailburst" }] }),
});

function JobsPage() {
  const { jobs } = useStore();
  const [filter, setFilter] = useState<"all" | Job["status"]>("all");

  const counts = {
    pending: jobs.filter((j) => j.status === "pending").length,
    processing: jobs.filter((j) => j.status === "processing").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
    dlq: jobs.filter((j) => j.status === "dlq").length,
  };

  const filtered = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <AppShell title="Jobs & Queues">
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        {[
          { k: "pending", l: "Pending", c: "secondary" },
          { k: "processing", l: "Processing", c: "warning" },
          { k: "completed", l: "Completed", c: "success" },
          { k: "failed", l: "Failed", c: "destructive" },
          { k: "dlq", l: "Dead-letter", c: "destructive" },
        ].map((s) => (
          <button
            key={s.k}
            onClick={() => setFilter(s.k as Job["status"])}
            className={`rounded-xl border-2 border-ink p-4 text-left shadow-brutal-sm transition hover:-translate-y-0.5 ${
              filter === s.k ? "bg-primary" : "bg-card"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.l}</p>
            <p className="mt-1 font-display text-2xl font-bold">{counts[s.k as keyof typeof counts]}</p>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold">Filter:</span>
        {(["all", "pending", "processing", "completed", "failed", "dlq"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-bold capitalize transition ${
              filter === f ? "bg-ink text-cream" : "bg-card hover:bg-secondary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border-2 border-ink bg-card shadow-brutal-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink text-cream">
              <tr className="text-left text-xs font-bold uppercase tracking-wide">
                <th className="px-4 py-3">Job ID</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Queue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Attempts</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
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
                        onClick={() => { store.retryJob(j.id); toast.success(`Re-queued ${j.id}`); }}
                        className="border-2 border-ink h-7 text-xs"
                      >
                        <RefreshCw className="mr-1 h-3 w-3" /> Retry
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
            <p className="font-bold">You have {counts.dlq} job(s) in the dead-letter queue.</p>
            <p className="text-sm text-muted-foreground">These exhausted all retries. Inspect the payload, fix the root cause, and re-dispatch from above.</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
