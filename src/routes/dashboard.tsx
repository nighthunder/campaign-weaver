import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Send, Users, Workflow, TrendingUp, ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Mailburst" }] }),
});

const sendData = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  sent: Math.floor(2000 + Math.random() * 8000),
  opened: Math.floor(800 + Math.random() * 4000),
}));

const queueData = [
  { name: "emails", processed: 18420, failed: 24 },
  { name: "reports", processed: 312, failed: 1 },
  { name: "default", processed: 88, failed: 0 },
];

function Dashboard() {
  const { user, campaigns, lists, jobs } = useStore();
  const stats = [
    { label: "Emails sent (30d)", value: campaigns.reduce((s, c) => s + c.delivered, 0).toLocaleString(), icon: Send, color: "primary" },
    { label: "Active contacts", value: lists.reduce((s, l) => s + l.count, 0).toLocaleString(), icon: Users, color: "accent" },
    { label: "Jobs in queue", value: jobs.filter(j => j.status === "pending" || j.status === "processing").length.toString(), icon: Workflow, color: "warning" },
    { label: "Avg open rate", value: "43.2%", icon: TrendingUp, color: "success" },
  ];

  return (
    <AppShell title={`Hi ${user?.name ?? "there"} 👋`}>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border-2 border-ink bg-card p-5 shadow-brutal-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-${s.color}`}>
              <s.icon className="h-4 w-4 text-ink" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-brutal-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Sends vs Opens (last 14 days)</h2>
            <Link to="/reports"><Button variant="outline" size="sm" className="border-2 border-ink">Reports <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={sendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.01 90)" />
                <XAxis dataKey="day" stroke="oklch(0.4 0.01 90)" fontSize={12} />
                <YAxis stroke="oklch(0.4 0.01 90)" fontSize={12} />
                <Tooltip contentStyle={{ border: "2px solid var(--ink)", borderRadius: 8, background: "var(--cream)" }} />
                <Line type="monotone" dataKey="sent" stroke="var(--ink)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)", stroke: "var(--ink)", strokeWidth: 2 }} />
                <Line type="monotone" dataKey="opened" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: "var(--accent)", stroke: "var(--ink)", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border-2 border-ink bg-card p-5 shadow-brutal-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Queue throughput</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={queueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.85 0.01 90)" />
                <XAxis dataKey="name" stroke="oklch(0.4 0.01 90)" fontSize={12} />
                <YAxis stroke="oklch(0.4 0.01 90)" fontSize={12} />
                <Tooltip contentStyle={{ border: "2px solid var(--ink)", borderRadius: 8, background: "var(--cream)" }} />
                <Bar dataKey="processed" fill="var(--primary)" stroke="var(--ink)" strokeWidth={2} />
                <Bar dataKey="failed" fill="var(--destructive)" stroke="var(--ink)" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border-2 border-ink bg-card p-5 shadow-brutal-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent campaigns</h2>
          <Link to="/campaigns"><Button size="sm" className="bg-primary text-ink border-2 border-ink shadow-brutal-sm hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">+ New campaign</Button></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-ink text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Name</th><th className="pr-4">Audience</th><th className="pr-4">Status</th>
                <th className="pr-4">Recipients</th><th className="pr-4">Open rate</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 5).map((c) => (
                <tr key={c.id} className="border-b border-border">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="pr-4 text-muted-foreground">{c.audience}</td>
                  <td className="pr-4"><StatusBadge status={c.status} /></td>
                  <td className="pr-4">{c.recipients.toLocaleString()}</td>
                  <td className="pr-4">{c.delivered ? `${((c.opened / c.delivered) * 100).toFixed(1)}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: "bg-success text-success-foreground",
    sending: "bg-warning text-warning-foreground",
    queued: "bg-primary text-ink",
    draft: "bg-secondary text-secondary-foreground",
    failed: "bg-destructive text-destructive-foreground",
    pending: "bg-secondary text-secondary-foreground",
    processing: "bg-warning text-warning-foreground",
    completed: "bg-success text-success-foreground",
    dlq: "bg-destructive text-destructive-foreground",
  };
  return (
    <span className={`inline-block rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold capitalize ${map[status] ?? "bg-secondary"}`}>
      {status}
    </span>
  );
}
