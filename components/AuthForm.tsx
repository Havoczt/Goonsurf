"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/types";

interface Props {
  action: (prev: ActionState, data: FormData) => Promise<ActionState>;
  type: "login" | "signup";
}

export default function AuthForm({ action, type }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-3">
      {type === "signup" && (
        <input
          name="username"
          placeholder="username"
          autoComplete="username"
          required
          minLength={2}
          maxLength={30}
          pattern="[a-zA-Z0-9_]+"
          title="Letters, numbers, underscores only"
          className="input"
        />
      )}
      <input
        name="email"
        type="email"
        placeholder="email"
        autoComplete="email"
        required
        className="input"
      />
      <input
        name="password"
        type="password"
        placeholder="password"
        autoComplete={type === "login" ? "current-password" : "new-password"}
        required
        minLength={6}
        className="input"
      />

      {state?.error && (
        <p className="text-red-400 text-xs">{state.error}</p>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full">
        {isPending ? "..." : type === "login" ? "log in" : "create account"}
      </button>
    </form>
  );
}
