import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-surface/95 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between gap-4">

        <Link href="/" className="font-mono text-accent font-medium text-sm tracking-widest shrink-0">
          GOONSURF
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-muted text-xs font-mono hidden sm:block truncate max-w-[120px]">
                {user.user_metadata?.username ?? user.email?.split("@")[0]}
              </span>
              <Link
                href="/submit"
                className="shrink-0 text-xs font-semibold text-black bg-accent hover:bg-accent-dim px-3 py-1.5 rounded transition-colors"
              >
                + submit
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-white text-xs transition-colors">
                log in
              </Link>
              <Link
                href="/signup"
                className="shrink-0 text-xs font-semibold text-black bg-accent hover:bg-accent-dim px-3 py-1.5 rounded transition-colors"
              >
                sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
