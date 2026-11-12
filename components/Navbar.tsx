import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <nav className="border-b border-zinc-800 sticky top-0 z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(8,8,8,0.95)" }}>
      <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between gap-4">

        <Link href="/" className="text-sm font-medium shrink-0 tracking-widest transition-colors hover:text-white" style={{ fontFamily: "var(--font-mono)", color: "#00e5ff", letterSpacing: "0.18em" }}>
          GOONSURF
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-zinc-500 text-xs hidden sm:block truncate max-w-[120px]" style={{ fontFamily: "var(--font-mono)" }}>
                {user.user_metadata?.username ?? user.email?.split("@")[0]}
              </span>
              <Link href="/submit" className="shrink-0 text-xs font-bold text-black px-3 py-1.5 rounded transition-colors" style={{ backgroundColor: "#00e5ff" }}>
                + submit
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-zinc-500 hover:text-white text-xs transition-colors">log in</Link>
              <Link href="/signup" className="shrink-0 text-xs font-bold text-black px-3 py-1.5 rounded transition-colors" style={{ backgroundColor: "#00e5ff" }}>
                sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
