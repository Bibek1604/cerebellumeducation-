"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import { loginAction, type LoginState } from "../actions";
import { inputCls } from "@/components/admin/fields";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-navy">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="bg-orange-fill flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-bold text-white disabled:opacity-60">
        {pending && <LoaderCircle className="size-4 animate-spin" />} Sign in
      </button>
    </form>
  );
}
