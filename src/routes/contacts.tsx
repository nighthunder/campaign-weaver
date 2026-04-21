import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, store } from "@/lib/mock-store";
import { Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contacts")({
  component: ContactsPage,
  head: () => ({ meta: [{ title: "Contacts — Mailburst" }] }),
});

function ContactsPage() {
  const { lists } = useStore();
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) { toast.error(t("contacts.invalid")); return; }
    setUploading(true);
    setProgress(0);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      let p = 0;
      const tick = setInterval(() => {
        p += 7;
        setProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(tick);
          const count = Math.max(0, lines.length - 1);
          store.addList(f.name.replace(/\.csv$/i, ""), count);
          toast.success(t("contacts.imported", { n: count.toLocaleString() }));
          setUploading(false);
          if (fileRef.current) fileRef.current.value = "";
        }
      }, 80);
    };
    reader.readAsText(f);
  };

  return (
    <AppShell title={t("side.contacts")}>
      <div className="mb-6 rounded-2xl border-2 border-ink bg-primary p-6 shadow-brutal">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold">{t("contacts.bulk")}</h2>
            <p className="mt-1 text-sm text-ink/70">{t("contacts.bulk.desc")}</p>
          </div>
          <div>
            <input ref={fileRef} type="file" accept=".csv" onChange={onFile} className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload">
              <Button asChild className="bg-ink text-cream border-2 border-ink shadow-brutal-sm hover:bg-ink hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-bold">
                <span><Upload className="mr-1 h-4 w-4" /> {t("contacts.choose")}</span>
              </Button>
            </label>
          </div>
        </div>
        {uploading && (
          <div className="mt-4 rounded-lg border-2 border-ink bg-cream p-4">
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span>{t("contacts.streaming")}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-ink bg-secondary">
              <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((l) => (
          <div key={l.id} className="rounded-xl border-2 border-ink bg-card p-5 shadow-brutal-sm transition hover:-translate-y-1 hover:shadow-brutal">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-accent">
              <Users className="h-4 w-4 text-accent-foreground" />
            </div>
            <h3 className="font-display text-lg font-bold">{l.name}</h3>
            <p className="mt-1 font-display text-3xl font-bold text-accent">{l.count.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("contacts.count")}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
