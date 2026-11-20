import type { Metadata } from "next";

/** The Admin Panel is signed-in, per-request UI; it doesn't need a prerendered shell. */
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin Panel", template: "%s | Admin Panel" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div data-admin-root className="min-h-dvh bg-muted">
      {children}
    </div>
  );
}
