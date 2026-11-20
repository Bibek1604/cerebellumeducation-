/**
 * Wraps the public site chrome (top bar, header, footer, floating buttons).
 * Inside the Admin Panel it is hidden by CSS (see `[data-admin-root]` in
 * globals.css), so no client-side URL check is needed.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  return (
    <div data-site-chrome className="contents">
      {children}
    </div>
  );
}
