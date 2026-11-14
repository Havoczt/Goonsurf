import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function Navbar({ user }: { user: User | null }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #27272a",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

        <Link href="/" style={{ fontFamily: "var(--font-mono-loaded, monospace)", color: "#00e5ff", fontWeight: 500, fontSize: 13, letterSpacing: "0.18em", textDecoration: "none" }}>
          GOONSURF
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <span style={{ fontFamily: "var(--font-mono-loaded, monospace)", color: "#52525b", fontSize: 12 }}>
                {user.user_metadata?.username ?? user.email?.split("@")[0]}
              </span>
              <Link href="/submit" className="gs-btn" style={{ padding: "6px 14px", fontSize: 12 }}>
                + submit
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: "#71717a", fontSize: 13, textDecoration: "none", transition: "color 0.15s" }}>
                log in
              </Link>
              <Link href="/signup" className="gs-btn" style={{ padding: "6px 14px", fontSize: 12 }}>
                sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
