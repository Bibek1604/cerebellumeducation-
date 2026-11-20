import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-lift">
        <Image src="/logos/cerebellum-logo-full.png" alt="Cerebellum Education Network" width={812} height={242} className="mx-auto h-12 w-auto" priority />
        <h1 className="mt-6 text-center text-2xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-center text-sm text-ink-soft">Sign in to manage the website content.</p>
        <LoginForm />
      </div>
    </div>
  );
}
