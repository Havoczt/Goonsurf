"use client";

import { signOut } from "@/app/actions";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-xs text-zinc-500 hover:text-white transition-colors"
      >
        logout
      </button>
    </form>
  );
}
