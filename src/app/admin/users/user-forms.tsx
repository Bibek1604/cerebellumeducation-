"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { changePasswordAction, createAdminAction, deleteAdminAction, type UserFormState } from "../actions";
import { inputCls } from "@/components/admin/fields";

function Msg({ state }: { state: UserFormState }) {
  if (state.error) return <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{state.error}</p>;
  if (state.success) return <p role="status" className="rounded-xl bg-primary-light px-3 py-2 text-sm font-semibold text-navy">{state.success}</p>;
  return null;
}

function Input({ label, ...props }: React.ComponentProps<"input"> & { label: string }) {
  return (
    <div>
      <label htmlFor={props.id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      <input className={inputCls} required {...props} />
    </div>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60">
      {pending && <LoaderCircle className="size-4 animate-spin" />} {children}
    </button>
  );
}

export function AddAdminForm() {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<UserFormState, FormData>(createAdminAction, {});
  useEffect(() => {
    if (state.success) {
      form.current?.reset();
      router.refresh();
    }
  }, [state, router]);
  return (
    <form ref={form} action={action} className="mt-4 space-y-4">
      <Input id="new-name" name="name" label="Name" autoComplete="off" maxLength={80} />
      <Input id="new-email" name="email" type="email" label="Email" autoComplete="off" />
      <Input id="new-password" name="password" type="password" label="Temporary password" autoComplete="new-password" minLength={10} />
      <p className="text-xs text-ink-soft">At least 10 characters with letters and numbers. Share it privately and ask them to change it after signing in.</p>
      <Msg state={state} />
      <Submit pending={pending}>Add admin</Submit>
    </form>
  );
}

export function ChangePasswordForm() {
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<UserFormState, FormData>(changePasswordAction, {});
  useEffect(() => {
    if (state.success) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="mt-4 space-y-4">
      <Input id="cur-password" name="current" type="password" label="Current password" autoComplete="current-password" />
      <Input id="next-password" name="next" type="password" label="New password" autoComplete="new-password" minLength={10} />
      <Msg state={state} />
      <Submit pending={pending}>Change password</Submit>
    </form>
  );
}

export function RemoveAdminButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Remove ${name}? They will no longer be able to sign in.`)) return;
        start(async () => {
          const res = await deleteAdminAction(id);
          if (res.error) window.alert(res.error);
          router.refresh();
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="size-4" /> Remove
    </button>
  );
}
