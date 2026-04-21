export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="var(--ink)" />
        <circle cx="14" cy="17" r="3" fill="var(--primary)" />
        <circle cx="26" cy="17" r="3" fill="var(--primary)" />
        <path
          d="M12 26 Q 20 32 28 26"
          stroke="var(--primary)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight">Mailburst</span>
    </div>
  );
}
