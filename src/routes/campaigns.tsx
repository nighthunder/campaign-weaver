import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, store } from "@/lib/mock-store";
import { Plus, Send } from "lucide-react";
import { StatusBadge } from "./dashboard";
import { toast } from "sonner";

export const Route = createFileRoute("/campaigns")({
  component: CampaignsPage,
  head: () => ({ meta: [{ title: "Campaigns — Mailburst" }] }),
});

function CampaignsPage() {
  const { campaigns } = useStore();
  const [creating, setCreating] = useState(false);

  return (
    <AppShell title="Campaigns">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">Compose, schedule, and dispatch to the queue.</p>
        <Button
          onClick={() => setCreating(true)}
          className="bg-primary text-ink border-2 border-ink shadow-brutal-sm hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-bold"
        >
          <Plus className="mr-1 h-4 w-4" /> New campaign
        </Button>
      </div>

      {creating && <NewCampaign onClose={() => setCreating(false)} />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <div key={c.id} className="rounded-xl border-2 border-ink bg-card p-5 shadow-brutal-sm transition hover:-translate-y-1 hover:shadow-brutal">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.audience}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <p className="mt-3 line-clamp-2 text-sm">{c.subject}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t-2 border-ink pt-3 text-center">
              <Stat label="Sent" value={c.delivered.toLocaleString()} />
              <Stat label="Opens" value={c.delivered ? `${((c.opened / c.delivered) * 100).toFixed(0)}%` : "—"} />
              <Stat label="Clicks" value={c.delivered ? `${((c.clicked / c.delivered) * 100).toFixed(0)}%` : "—"} />
            </div>
            {c.status === "draft" && (
              <Button
                onClick={() => {
                  store.enqueueCampaign(c.id);
                  toast.success("Dispatched to queue!");
                }}
                className="mt-4 w-full bg-ink text-cream border-2 border-ink hover:bg-ink shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-bold"
              >
                <Send className="mr-1 h-4 w-4" /> Dispatch
              </Button>
            )}
            <Link to="/jobs" className="mt-3 block text-center text-xs font-bold underline text-muted-foreground">View jobs →</Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-base font-bold">{value}</p>
    </div>
  );
}

function NewCampaign({ onClose }: { onClose: () => void }) {
  const { lists } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [fromName, setFromName] = useState("Acme Co.");
  const [fromEmail, setFromEmail] = useState("hello@acme.com");
  const [body, setBody] = useState("Hey {{first_name}},\n\nWe just dropped something new...\n\n— The team");
  const [audience, setAudience] = useState(lists[0]?.name ?? "");

  const create = (dispatch: boolean) => {
    if (!name || !subject) { toast.error("Name and subject are required"); return; }
    const list = lists.find((l) => l.name === audience);
    const c = store.addCampaign({
      name, subject, fromName, fromEmail, body, audience,
      status: dispatch ? "queued" : "draft",
      recipients: list?.count ?? 0,
    });
    if (dispatch) store.enqueueCampaign(c.id);
    toast.success(dispatch ? "Campaign dispatched!" : "Draft saved");
    onClose();
  };

  return (
    <div className="mb-6 rounded-2xl border-2 border-ink bg-card p-6 shadow-brutal">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">New campaign — Step {step} of 3</h2>
        <button onClick={onClose} className="text-sm font-bold underline">Cancel</button>
      </div>
      <div className="mb-4 flex gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-1.5 flex-1 rounded-full border border-ink ${n <= step ? "bg-primary" : "bg-secondary"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Campaign name"><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border-2 border-ink bg-cream px-3 py-2 outline-none" placeholder="Spring Launch 2025" /></Field>
          <Field label="Audience">
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-md border-2 border-ink bg-cream px-3 py-2 outline-none">
              {lists.map((l) => <option key={l.id}>{l.name}</option>)}
            </select>
          </Field>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="From name"><input value={fromName} onChange={(e) => setFromName(e.target.value)} className="w-full rounded-md border-2 border-ink bg-cream px-3 py-2 outline-none" /></Field>
            <Field label="From email"><input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="w-full rounded-md border-2 border-ink bg-cream px-3 py-2 outline-none" /></Field>
          </div>
          <Field label="Subject line"><input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-md border-2 border-ink bg-cream px-3 py-2 outline-none" placeholder="🌸 Something fresh just dropped" /></Field>
        </div>
      )}
      {step === 3 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Body (use {{first_name}}, {{email}} for merge tags)">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} className="w-full rounded-md border-2 border-ink bg-cream px-3 py-2 font-mono text-sm outline-none" />
          </Field>
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Preview</p>
            <div className="rounded-lg border-2 border-ink bg-cream p-4">
              <p className="text-xs text-muted-foreground">From: {fromName} &lt;{fromEmail}&gt;</p>
              <p className="font-bold">Subject: {subject || "(no subject)"}</p>
              <hr className="my-3 border-ink" />
              <pre className="whitespace-pre-wrap font-sans text-sm">{body.replace(/\{\{first_name\}\}/g, "Jane")}</pre>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)} className="border-2 border-ink">Back</Button>
        <div className="flex gap-2">
          {step === 3 ? (
            <>
              <Button variant="outline" onClick={() => create(false)} className="border-2 border-ink">Save as draft</Button>
              <Button onClick={() => create(true)} className="bg-primary text-ink border-2 border-ink shadow-brutal-sm hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-bold">
                <Send className="mr-1 h-4 w-4" /> Dispatch to queue
              </Button>
            </>
          ) : (
            <Button onClick={() => setStep(step + 1)} className="bg-primary text-ink border-2 border-ink shadow-brutal-sm hover:bg-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-bold">Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold">{label}</span>
      {children}
    </label>
  );
}
