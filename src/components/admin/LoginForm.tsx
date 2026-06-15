"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={formAction} className="grid gap-4">
      <label>
        <span className="mb-2 block text-sm font-semibold text-white/70">Admin Email</span>
        <Input autoComplete="username" name="email" type="email" placeholder="admin@thumbrush.local" required suppressHydrationWarning />
      </label>
      <label>
        <span className="mb-2 block text-sm font-semibold text-white/70">Password</span>
        <Input autoComplete="current-password" name="password" type="password" placeholder="Password" required suppressHydrationWarning />
      </label>
      {state.error ? <p className="rounded-lg border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-100">{state.error}</p> : null}
      <Button disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
