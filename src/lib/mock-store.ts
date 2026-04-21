// Lightweight client-side mock store to demo the platform UI.
// In production, all of this is backed by the Laravel API (see /mnt/documents).

export type Campaign = {
  id: string;
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  body: string;
  audience: string;
  status: "draft" | "queued" | "sending" | "sent" | "failed";
  createdAt: string;
  sentAt?: string;
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
};

export type ContactList = {
  id: string;
  name: string;
  count: number;
  createdAt: string;
};

export type Job = {
  id: string;
  campaignId: string;
  campaignName: string;
  queue: "default" | "emails" | "reports";
  status: "pending" | "processing" | "completed" | "failed" | "dlq";
  attempts: number;
  maxAttempts: number;
  payload: string;
  error?: string;
  createdAt: string;
  finishedAt?: string;
};

const KEY = "mailburst_state_v1";

type State = {
  user: { name: string; email: string; plan: "free" | "growth" | "scale" } | null;
  campaigns: Campaign[];
  lists: ContactList[];
  jobs: Job[];
};

const seed: State = {
  user: null,
  campaigns: [
    {
      id: "c1",
      name: "Spring Launch 2025",
      subject: "🌸 Something fresh just dropped",
      fromName: "Acme Co.",
      fromEmail: "hello@acme.com",
      body: "Hey {{first_name}}, our spring collection is live...",
      audience: "Newsletter Subscribers",
      status: "sent",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      recipients: 12480,
      delivered: 12301,
      opened: 5421,
      clicked: 1243,
      bounced: 179,
    },
    {
      id: "c2",
      name: "Weekly Digest #42",
      subject: "Your weekly roundup is here",
      fromName: "Acme Co.",
      fromEmail: "hello@acme.com",
      body: "Top stories this week...",
      audience: "All Contacts",
      status: "sending",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      recipients: 8200,
      delivered: 4112,
      opened: 1820,
      clicked: 422,
      bounced: 38,
    },
  ],
  lists: [
    { id: "l1", name: "Newsletter Subscribers", count: 12480, createdAt: new Date().toISOString() },
    { id: "l2", name: "VIP Customers", count: 842, createdAt: new Date().toISOString() },
    { id: "l3", name: "Trial Users", count: 3201, createdAt: new Date().toISOString() },
  ],
  jobs: generateMockJobs(),
};

function generateMockJobs(): Job[] {
  const statuses: Job["status"][] = ["completed", "completed", "completed", "completed", "processing", "pending", "failed", "dlq"];
  const queues: Job["queue"][] = ["emails", "emails", "emails", "reports", "default"];
  const out: Job[] = [];
  for (let i = 0; i < 24; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const attempts = status === "dlq" ? 5 : status === "failed" ? Math.floor(Math.random() * 3) + 1 : 1;
    out.push({
      id: `job_${1000 + i}`,
      campaignId: Math.random() > 0.5 ? "c1" : "c2",
      campaignName: Math.random() > 0.5 ? "Spring Launch 2025" : "Weekly Digest #42",
      queue: queues[Math.floor(Math.random() * queues.length)],
      status,
      attempts,
      maxAttempts: 5,
      payload: JSON.stringify({ batch: i, size: 250 }),
      error: status === "failed" || status === "dlq" ? "SMTP timeout after 30s" : undefined,
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
      finishedAt: status === "completed" || status === "dlq" ? new Date(Date.now() - i * 60000 + 5000).toISOString() : undefined,
    });
  }
  return out;
}

function load(): State {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

function save(s: State) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

let state: State = load();
const listeners = new Set<() => void>();

function notify() {
  save(state);
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  signIn(email: string, name?: string) {
    state = { ...state, user: { email, name: name || email.split("@")[0], plan: "free" } };
    notify();
  },
  signOut() {
    state = { ...state, user: null };
    notify();
  },
  setPlan(plan: "free" | "growth" | "scale") {
    if (!state.user) return;
    state = { ...state, user: { ...state.user, plan } };
    notify();
  },
  addCampaign(c: Omit<Campaign, "id" | "createdAt" | "delivered" | "opened" | "clicked" | "bounced">) {
    const campaign: Campaign = {
      ...c,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString(),
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
    };
    state = { ...state, campaigns: [campaign, ...state.campaigns] };
    notify();
    return campaign;
  },
  enqueueCampaign(id: string) {
    state = {
      ...state,
      campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, status: "queued" as const } : c)),
    };
    // simulate jobs being created
    const c = state.campaigns.find((x) => x.id === id);
    if (c) {
      const batches = Math.max(1, Math.ceil(c.recipients / 250));
      const newJobs: Job[] = Array.from({ length: Math.min(batches, 8) }).map((_, i) => ({
        id: `job_${Date.now()}_${i}`,
        campaignId: c.id,
        campaignName: c.name,
        queue: "emails",
        status: "pending",
        attempts: 0,
        maxAttempts: 5,
        payload: JSON.stringify({ batch: i, size: 250 }),
        createdAt: new Date().toISOString(),
      }));
      state = { ...state, jobs: [...newJobs, ...state.jobs] };
    }
    notify();
  },
  retryJob(id: string) {
    state = {
      ...state,
      jobs: state.jobs.map((j) =>
        j.id === id ? { ...j, status: "pending", attempts: 0, error: undefined } : j,
      ),
    };
    notify();
  },
  addList(name: string, count: number) {
    const l: ContactList = {
      id: `l${Date.now()}`,
      name,
      count,
      createdAt: new Date().toISOString(),
    };
    state = { ...state, lists: [l, ...state.lists] };
    notify();
    return l;
  },
};

import { useSyncExternalStore } from "react";
export function useStore() {
  return useSyncExternalStore(
    (cb) => store.subscribe(cb),
    () => store.get(),
    () => seed,
  );
}
