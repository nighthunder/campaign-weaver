import { useI18n, type Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const langs: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = langs.find((l) => l.code === locale) ?? langs[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border-2 border-ink bg-card px-2.5 py-1.5 text-xs font-bold shadow-brutal-sm transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline uppercase">{current.code}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-lg border-2 border-ink bg-card shadow-brutal">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition hover:bg-primary ${
                l.code === locale ? "bg-primary/40" : ""
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
              {l.code === locale && <span className="ml-auto text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
