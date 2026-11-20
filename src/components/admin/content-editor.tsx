"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check, ChevronDown, ExternalLink, LoaderCircle, Plus, RotateCcw, Save, Trash2, Undo2 } from "lucide-react";
import { resetContentAction, saveContentAction } from "@/app/admin/actions";
import { addableSpecs, getEntry, newSectionData, specFor, type PageEntry, type SettingsEntry } from "@/cms/schema";
import type { PageContent, Section, SettingsContent } from "@/cms/types";
import { cn } from "@/lib/utils";
import { FieldsEditor, IconBtn, RuntimeOptionsContext, inputCls, type RuntimeOptions } from "./fields";

type Status = { kind: "idle" } | { kind: "saved" } | { kind: "error"; message: string };

function useSaver<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, start] = useTransition();
  const dirty = useMemo(() => JSON.stringify(value) !== saved, [value, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const apply = (res: Awaited<ReturnType<typeof saveContentAction>>) => {
    if (res.ok) {
      setValue(res.content as T);
      setSaved(JSON.stringify(res.content));
      setStatus({ kind: "saved" });
    } else setStatus({ kind: "error", message: res.error });
  };

  return {
    value,
    setValue: (v: T) => {
      setValue(v);
      setStatus({ kind: "idle" });
    },
    dirty,
    status,
    pending,
    save: () => start(async () => apply(await saveContentAction(key, JSON.stringify(value)))),
    discard: () => {
      setValue(JSON.parse(saved));
      setStatus({ kind: "idle" });
    },
    reset: () => {
      if (!window.confirm("Restore the original website content for this item? Your saved changes here will be replaced.")) return;
      start(async () => apply(await resetContentAction(key)));
    },
  };
}

function Toolbar({ title, viewHref, s }: { title: string; viewHref?: string; s: ReturnType<typeof useSaver<unknown>> }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold sm:text-2xl">{title}</h1>
        <p className="text-xs text-ink-soft" aria-live="polite">
          {s.pending ? "Saving…" : s.status.kind === "saved" ? "All changes saved and live." : s.status.kind === "error" ? s.status.message : s.dirty ? "You have unsaved changes." : "No unsaved changes."}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {viewHref && (
          <Link href={viewHref} target="_blank" className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-light">
            View page <ExternalLink className="size-4" />
          </Link>
        )}
        <button type="button" onClick={s.reset} disabled={s.pending} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-muted disabled:opacity-50">
          <RotateCcw className="size-4" /> Restore original
        </button>
        <button type="button" onClick={s.discard} disabled={!s.dirty || s.pending} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-semibold text-navy hover:bg-muted disabled:opacity-40">
          <Undo2 className="size-4" /> Discard
        </button>
        <button type="button" onClick={s.save} disabled={!s.dirty || s.pending} className="bg-orange-fill inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold text-white shadow-soft disabled:opacity-50">
          {s.pending ? <LoaderCircle className="size-4 animate-spin" /> : s.status.kind === "saved" && !s.dirty ? <Check className="size-4" /> : <Save className="size-4" />}
          Save & publish
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────────── Page editor ───────────────────────────── */

export function PageEditor({ contentKey, initial, options = {} }: { contentKey: string; initial: PageContent; options?: RuntimeOptions }) {
  return (
    <RuntimeOptionsContext value={options}>
      <PageEditorInner contentKey={contentKey} initial={initial} />
    </RuntimeOptionsContext>
  );
}

function PageEditorInner({ contentKey, initial }: { contentKey: string; initial: PageContent }) {
  const entry = getEntry(contentKey) as PageEntry;
  const s = useSaver<PageContent>(contentKey, initial);
  const [open, setOpen] = useState<string | null>(initial.sections[0]?.id ?? null);
  const [addKind, setAddKind] = useState(addableSpecs(entry)[0]?.kind ?? "");
  const sections = s.value.sections;

  const setSections = (next: Section[]) => s.setValue({ ...s.value, sections: next });
  const update = (id: string, patch: Partial<Section>) => setSections(sections.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const move = (i: number, d: number) => {
    const next = [...sections];
    const [it] = next.splice(i, 1);
    next.splice(i + d, 0, it!);
    setSections(next);
  };

  return (
    <div>
      <Toolbar title={entry.title} viewHref={entry.path} s={s as never} />

      <p className="mb-5 max-w-3xl text-sm text-ink">
        Tick a section to show it on the website, untick to hide it. Open a section to edit its text, images, icons and links. Use the arrows to
        reorder sections. Nothing changes on the website until you press <strong>Save &amp; publish</strong>.
      </p>

      <ol className="space-y-3">
        {sections.map((sec, i) => {
          const spec = specFor(entry, sec.kind);
          if (!spec) return null;
          const isOpen = open === sec.id;
          return (
            <li key={sec.id} className={cn("rounded-2xl border bg-white shadow-soft", sec.enabled ? "border-line" : "border-dashed border-line opacity-80")}>
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <label className="flex shrink-0 cursor-pointer items-center gap-2" title={sec.enabled ? "Visible on the website" : "Hidden from the website"}>
                  <input type="checkbox" checked={sec.enabled} onChange={(e) => update(sec.id, { enabled: e.target.checked })} className="size-5 accent-[var(--brand-primary)]" />
                  <span className="sr-only">Show “{spec.label}” on the website</span>
                </label>
                <button type="button" onClick={() => setOpen(isOpen ? null : sec.id)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <ChevronDown aria-hidden className={cn("size-5 shrink-0 text-ink-soft transition-transform", isOpen && "rotate-180")} />
                  <span className="min-w-0">
                    <span className={cn("block truncate font-bold", sec.enabled ? "text-navy" : "text-ink-soft")}>
                      {spec.label}
                      {typeof sec.data.heading === "string" && sec.data.heading && (
                        <span className="font-semibold text-ink-soft"> · {sec.data.heading.replaceAll("*", "")}</span>
                      )}
                      {!sec.enabled && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-ink-soft">Hidden</span>}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">{spec.description}</span>
                  </span>
                </button>
                {!spec.fixed && (
                  <div className="flex shrink-0 items-center">
                    <IconBtn label="Move section up" disabled={i <= 1} onClick={() => move(i, -1)}>
                      <ArrowUp className="size-4" />
                    </IconBtn>
                    <IconBtn label="Move section down" disabled={i === sections.length - 1} onClick={() => move(i, 1)}>
                      <ArrowDown className="size-4" />
                    </IconBtn>
                    <IconBtn
                      label="Remove section"
                      danger
                      onClick={() => {
                        if (window.confirm(`Remove the “${spec.label}” section from this page? (Tip: untick it instead to hide it but keep its content.)`)) {
                          setSections(sections.filter((x) => x.id !== sec.id));
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </IconBtn>
                  </div>
                )}
              </div>
              {isOpen && (
                <div className="border-t border-line p-4 sm:p-6">
                  {spec.fields.length === 0 ? (
                    <p className="text-sm text-ink">This section has no text of its own. {spec.description}</p>
                  ) : (
                    <FieldsEditor
                      fields={spec.fields}
                      value={sec.data}
                      onChange={(data) => update(sec.id, { data })}
                      hidden={sec.hidden}
                      onHidden={(hidden) => update(sec.id, { hidden })}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-primary/30 bg-primary-light/40 p-4">
        <label htmlFor="add-kind" className="text-sm font-semibold text-navy">
          Add a section:
        </label>
        <select id="add-kind" value={addKind} onChange={(e) => setAddKind(e.target.value)} className={cn(inputCls, "w-auto")}>
          {addableSpecs(entry).map((sp) => (
            <option key={sp.kind} value={sp.kind}>
              {sp.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const id = `${addKind}-${Date.now().toString(36)}`;
            setSections([...sections, { id, kind: addKind, enabled: true, hidden: [], data: newSectionData(entry, addKind) }]);
            setOpen(id);
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="size-4" /> Add to end of page
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Settings editor ─────────────────────────── */

export function SettingsEditor({ contentKey, initial, options = {} }: { contentKey: string; initial: SettingsContent; options?: RuntimeOptions }) {
  const entry = getEntry(contentKey) as SettingsEntry;
  const s = useSaver<SettingsContent>(contentKey, initial);
  return (
    <RuntimeOptionsContext value={options}>
    <div>
      <Toolbar title={entry.title} s={s as never} />
      <p className="mb-5 max-w-3xl text-sm text-ink">{entry.description}</p>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-6">
        <FieldsEditor
          fields={entry.fields}
          value={s.value.data}
          onChange={(data) => s.setValue({ ...s.value, data })}
          hidden={s.value.hidden}
          onHidden={(hidden) => s.setValue({ ...s.value, hidden })}
        />
      </div>
    </div>
    </RuntimeOptionsContext>
  );
}
