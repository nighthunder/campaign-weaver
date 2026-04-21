import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <Logo className="[&_span]:text-cream" />
          <p className="mt-3 text-sm text-cream/70">
            Send campaigns at scale. Without breaking a sweat — or your inbox.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Product</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>Campaigns</li><li>Automations</li><li>Audience</li><li>Analytics</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Built with</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>Laravel 11</li><li>Redis Queues</li><li>Horizon</li><li>Sanctum</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Company</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>About</li><li>Careers</li><li>Contact</li><li>Status</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-6 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Mailburst. Crafted for senior portfolios.
      </div>
    </footer>
  );
}
