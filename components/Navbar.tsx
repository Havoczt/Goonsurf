import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-surface/90 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 h-11 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-accent tracking-tight hover:text-violet-400 transition-colors"
        >
          goonsurf
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-zinc-500 text-xs hidden sm:block">
                {user.user_metadata?.username ?? user.email?.split("@")[0]}
              </span>
              <Link
                href="/submit"
                className="text-xs bg-accent hover:bg-violet-700 px-3 py-1.5 rounded text-white font-medium transition-colors"
              >
                + submit
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-xs">
                log in
              </Link>
              <Link
                href="/signup"
                className="text-xs bg-accent hover:bg-violet-700 px-3 py-1.5 rounded text-white font-medium transition-colors"
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
