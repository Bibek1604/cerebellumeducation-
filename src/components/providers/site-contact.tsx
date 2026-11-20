"use client";

import { createContext, useContext } from "react";

/** Contact details for client components (set in Admin → Contact details & company). */
export type ClientContact = { phone: string | null; phoneHref: string | null; email: string | null; whatsapp: string | null };

const Ctx = createContext<ClientContact>({ phone: null, phoneHref: null, email: null, whatsapp: null });

export function SiteContactProvider({ value, children }: { value: ClientContact; children: React.ReactNode }) {
  return <Ctx value={value}>{children}</Ctx>;
}

export function useSiteContact() {
  return useContext(Ctx);
}

export function whatsappHref(whatsapp: string | null, message?: string) {
  if (!whatsapp) return null;
  return `https://wa.me/${whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
