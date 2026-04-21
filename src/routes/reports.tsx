import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/mock-store";
import { StatusBadge } from "./dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports — Mailburst" }] }),
});

function ReportsPage() {
  const { campaigns } = useStore();

  return (
    <AppShell title="Delivery reports">
      <div className="grid gap-4">
        {campaigns.map((c) => {
          const data = [
            { name: "Delivered", value: c.delivered, color: "var(--success)" },
            { name: "Opened", value: c.opened, color: "var(--primary)" },
            { name: "Clicked", value: c.clicked, color: "var(--accent)" },
            { name: "Bounced", value: c.bounced, color: "var(--destructive)" },
          ].filter((d) => d.value > 0);

          return (
            <div key={c.id} className="rounded-xl border-2 border-ink bg-card p-6 shadow-brutal-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">{c.name}</h2>
                  <p className="text-sm text-muted-foreground">{c.subject}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid grid-cols-2 gap-3">
                  <Metric label="Recipients" value={c.recipients.toLocaleString()} />
                  <Metric label="Delivered" value={c.delivered.toLocaleString()} pct={c.recipients ? (c.delivered / c.recipients) * 100 : 0} />
                  <Metric label="Opens" value={c.opened.toLocaleString()} pct={c.delivered ? (c.opened / c.delivered) * 100 : 0} />
                  <Metric label="Clicks" value={c.clicked.toLocaleString()} pct={c.delivered ? (c.clicked / c.delivered) * 100 : 0} />
                  <Metric label="Bounced" value={c.bounced.toLocaleString()} pct={c.recipients ? (c.bounced / c.recipients) * 100 : 0} tone="bad" />
                  <Metric label="CTR" value={`${c.opened ? ((c.clicked / c.opened) * 100).toFixed(1) : "0"}%`} />
                </div>
                <div className="h-56">
                  {data.length > 0 ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} stroke="var(--ink)" strokeWidth={2}>
                          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ border: "2px solid var(--ink)", borderRadius: 8, background: "var(--cream)" }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      Send the campaign to see metrics.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

function Metric({ label, value, pct, tone }: { label: string; value: string; pct?: number; tone?: "bad" }) {
  return (
    <div className="rounded-lg border-2 border-ink bg-cream p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-bold">{value}</p>
      {pct !== undefined && (
        <p className={`text-xs ${tone === "bad" ? "text-destructive" : "text-success"}`}>
          {pct.toFixed(1)}%
        </p>
      )}
    </div>
  );
}
