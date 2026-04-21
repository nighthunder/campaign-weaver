import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useStore, store } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { user } = useStore();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center"><Logo /></Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/pricing" className="hover:underline">Pricing</Link>
          {user && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
          {user && <Link to="/campaigns" className="hover:underline">Campaigns</Link>}
          {user && <Link to="/contacts" className="hover:underline">Contacts</Link>}
          {user && <Link to="/jobs" className="hover:underline">Jobs</Link>}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { store.signOut(); nav({ to: "/" }); }}
                className="border-2 border-ink shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="bg-ink text-cream border-2 border-ink shadow-brutal-sm hover:bg-ink hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition"
                >
                  Sign up free
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
