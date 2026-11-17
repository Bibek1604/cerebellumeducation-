"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MenuLink = { label: string; href: string; description?: string };

type Props = {
  logo: React.ReactNode;
  nav: NavItem[];
  menus: Record<NonNullable<NavItem["menu"]>, { links: MenuLink[]; allLabel: string; allHref: string }>;
  phone: { label: string; href: string } | null;
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderClient({ logo, nav, menus, phone }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close menus on route change (derived-state pattern; no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setOpenMenu(null);
    };
    const sync = () => setScrolled(window.scrollY > 8);
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close an open dropdown on outside click / tap.
  useEffect(() => {
    if (!openMenu) return;
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [openMenu]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-[box-shadow,border-color] duration-300",
        scrolled ? "border-line shadow-[0_6px_24px_-16px_rgb(12_31_61/0.35)]" : "border-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 transition-[height] duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-[4.25rem]" : "h-20",
        )}
      >
        {logo}

        <nav ref={navRef} aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0">
            {nav.map((item) =>
              item.menu ? (
                <DesktopDropdown
                  key={item.href}
                  item={item}
                  menu={menus[item.menu]}
                  active={isActive(pathname, item.href)}
                  open={openMenu === item.href}
                  setOpen={(v) => setOpenMenu(v ? item.href : null)}
                />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-2.5 py-2 text-[0.875rem] font-semibold whitespace-nowrap transition-colors 2xl:px-3 2xl:text-[0.9rem]",
                      isActive(pathname, item.href) ? "text-primary" : "text-navy hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/book-counselling" className={buttonClasses("primary", "md", "hidden sm:inline-flex")}>
            Book Free Counselling
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line text-navy transition-colors hover:border-primary hover:text-primary xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            nav={nav}
            menus={menus}
            pathname={pathname}
            phone={phone}
            onNavigate={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

function DesktopDropdown({
  item,
  menu,
  active,
  open,
  setOpen,
}: {
  item: NavItem;
  menu: Props["menus"][keyof Props["menus"]];
  active: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const panelId = useId();
  const ref = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  useEffect(() => cancelClose, []);

  const focusFirstLink = () =>
    requestAnimationFrame(() => ref.current?.querySelector<HTMLAnchorElement>(`#${CSS.escape(panelId)} a`)?.focus());

  return (
    <li
      ref={ref}
      className="relative"
      // Hover only for real mice — on touch, pointerenter + click would open and immediately close.
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") scheduleClose();
      }}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          const links = [...(ref.current?.querySelectorAll<HTMLAnchorElement>(`#${CSS.escape(panelId)} a`) ?? [])];
          if (!links.length) return;
          e.preventDefault();
          const i = links.indexOf(document.activeElement as HTMLAnchorElement);
          const next = e.key === "ArrowDown" ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
          links[i === -1 && e.key === "ArrowUp" ? links.length - 1 : next].focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
            focusFirstLink();
          }
        }}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-[0.875rem] font-semibold whitespace-nowrap transition-colors 2xl:px-3 2xl:text-[0.9rem]",
          active || open ? "text-primary" : "text-navy hover:text-primary",
        )}
      >
        {item.label}
        <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 w-[22rem] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift">
              <ul>
                {menu.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-muted focus-visible:bg-muted"
                    >
                      <span className="block text-sm font-bold text-navy">{l.label}</span>
                      {l.description && <span className="mt-0.5 line-clamp-1 block text-xs text-ink-soft">{l.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={menu.allHref}
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-between rounded-xl bg-primary-light px-4 py-3 text-sm font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
              >
                {menu.allLabel}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function MobileMenu({
  nav,
  menus,
  pathname,
  phone,
  onNavigate,
}: Pick<Props, "nav" | "menus" | "phone"> & { pathname: string; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "calc(100dvh - 4.25rem)" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-y-auto border-t border-line bg-white xl:hidden"
    >
      <nav aria-label="Mobile" className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6">
        <ul className="divide-y divide-line">
          {nav.map((item) => {
            const menu = item.menu ? menus[item.menu] : null;
            const isOpen = expanded === item.href;
            return (
              <li key={item.href} className="py-1">
                {menu ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className={cn(
                        "flex w-full items-center justify-between py-3.5 text-left font-display text-lg font-bold",
                        isActive(pathname, item.href) ? "text-primary" : "text-navy",
                      )}
                    >
                      {item.label}
                      <ChevronDown aria-hidden className={cn("size-5 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <ul className="mb-3 grid grid-cols-2 gap-2">
                        {menu.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              onClick={onNavigate}
                              className="block rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold text-navy"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                        <li className="col-span-2">
                          <Link
                            href={menu.allHref}
                            onClick={onNavigate}
                            className="flex items-center justify-between rounded-xl bg-primary-light px-3.5 py-2.5 text-sm font-bold text-primary-dark"
                          >
                            {menu.allLabel}
                            <ArrowRight aria-hidden className="size-4" />
                          </Link>
                        </li>
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "block py-3.5 font-display text-lg font-bold",
                      isActive(pathname, item.href) ? "text-primary" : "text-navy",
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 grid gap-3">
          <Link href="/book-counselling" onClick={onNavigate} className={buttonClasses("primary", "lg", "w-full")}>
            Book Free Counselling
          </Link>
          {phone && (
            <a href={phone.href} className={buttonClasses("outline", "lg", "w-full")}>
              <Phone aria-hidden className="size-4" /> {phone.label}
            </a>
          )}
        </div>
      </nav>
    </motion.div>
  );
}
