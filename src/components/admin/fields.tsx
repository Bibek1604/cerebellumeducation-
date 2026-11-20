"use client";

import Image from "next/image";
import { createContext, useContext, useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImageUp, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { iconNames } from "@/cms/icons";
import { CmsIcon } from "@/cms/cms-icon";
import type { FieldSpec, ImageValue, LinkValue } from "@/cms/types";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-navy placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

type Obj = Record<string, unknown>;

export type RuntimeOptions = Record<string, { value: string; label: string }[]>;
/** Current programmes / countries, for selects with `optionsFrom`. */
export const RuntimeOptionsContext = createContext<RuntimeOptions>({});

/** Empty value for a new list item / object, following its field specs. */
export function blankFor(fields: FieldSpec[]): Obj {
  const out: Obj = {};
  for (const f of fields) {
    if (f.type === "text" || f.type === "textarea") out[f.key] = "";
    else if (f.type === "image") out[f.key] = { src: "", alt: "", position: "" };
    else if (f.type === "icon") out[f.key] = "star";
    else if (f.type === "link") out[f.key] = { label: "", href: "" };
    else if (f.type === "select") out[f.key] = f.options[0]?.value ?? "";
    else if (f.type === "object") out[f.key] = blankFor(f.fields);
    else if (f.type === "list") out[f.key] = [];
  }
  return out;
}

const newId = () => `i${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** "Show on website" tick for hideable elements. */
function ShowTick({ path, hidden, onHidden }: { path: string; hidden: string[]; onHidden: (h: string[]) => void }) {
  const on = !hidden.includes(path);
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-ink-soft select-none">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onHidden(e.target.checked ? hidden.filter((h) => h !== path) : [...hidden, path])}
        className="size-4 accent-[var(--brand-primary)]"
      />
      {on ? "Shown on website" : "Hidden"}
    </label>
  );
}

function FieldLabel({ id, spec, path, hidden, onHidden, extra }: { id: string; spec: FieldSpec; path: string; hidden: string[]; onHidden: (h: string[]) => void; extra?: string }) {
  return (
    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-navy">
        {spec.label}
        {extra && <span className="ml-1.5 font-normal text-ink-soft">{extra}</span>}
      </label>
      {spec.hideable && <ShowTick path={path} hidden={hidden} onHidden={onHidden} />}
    </div>
  );
}

export function FieldsEditor({
  fields,
  value,
  onChange,
  hidden,
  onHidden,
  prefix = "",
}: {
  fields: FieldSpec[];
  value: Obj;
  onChange: (v: Obj) => void;
  hidden: string[];
  onHidden: (h: string[]) => void;
  prefix?: string;
}) {
  if (fields.length === 0) return null;
  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <Field key={f.key} spec={f} value={value?.[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} hidden={hidden} onHidden={onHidden} path={prefix + f.key} />
      ))}
    </div>
  );
}

function Field({ spec, value, onChange, hidden, onHidden, path }: { spec: FieldSpec; value: unknown; onChange: (v: unknown) => void; hidden: string[]; onHidden: (h: string[]) => void; path: string }) {
  const id = useId();
  const dim = spec.hideable && hidden.includes(path) ? "opacity-50" : "";

  switch (spec.type) {
    case "text":
    case "textarea": {
      const v = typeof value === "string" ? value : "";
      return (
        <div className={dim}>
          <FieldLabel id={id} spec={spec} path={path} hidden={hidden} onHidden={onHidden} />
          {spec.type === "textarea" ? (
            <textarea id={id} rows={Math.min(8, Math.max(3, Math.ceil(v.length / 90)))} maxLength={spec.maxLength} value={v} placeholder={spec.placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
          ) : (
            <input id={id} type="text" maxLength={spec.maxLength} value={v} placeholder={spec.placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
          )}
          {(spec.highlight || spec.help) && (
            <p className="mt-1 text-xs text-ink-soft">
              {spec.highlight && <>Wrap words in *asterisks* to show them in the blue highlight. </>}
              {spec.help}
            </p>
          )}
        </div>
      );
    }

    case "image":
      return (
        <div className={dim}>
          <FieldLabel id={id} spec={spec} path={path} hidden={hidden} onHidden={onHidden} />
          <ImageInput id={id} value={(value as ImageValue) ?? { src: "", alt: "" }} onChange={onChange} />
          {spec.help && <p className="mt-1 text-xs text-ink-soft">{spec.help}</p>}
        </div>
      );

    case "icon": {
      return (
        <div className={dim}>
          <FieldLabel id={id} spec={spec} path={path} hidden={hidden} onHidden={onHidden} />
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
              <CmsIcon icon={value} className="size-5" />
            </span>
            <select id={id} value={typeof value === "string" ? value : "star"} onChange={(e) => onChange(e.target.value)} className={inputCls}>
              {iconNames.map((n) => (
                <option key={n} value={n}>
                  {n.replace(/-/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    case "link": {
      const v = (value as LinkValue) ?? { label: "", href: "" };
      return (
        <div className={dim}>
          <FieldLabel id={id} spec={spec} path={path} hidden={hidden} onHidden={onHidden} />
          <div className="grid gap-2 sm:grid-cols-2">
            <input id={id} type="text" aria-label={`${spec.label} text`} placeholder="Button / link text" maxLength={80} value={v.label} onChange={(e) => onChange({ ...v, label: e.target.value })} className={inputCls} />
            <input type="text" aria-label={`${spec.label} address`} placeholder="/book-counselling or https://…" maxLength={300} value={v.href} onChange={(e) => onChange({ ...v, href: e.target.value })} className={inputCls} />
          </div>
        </div>
      );
    }

    case "select":
      return <SelectField spec={spec} id={id} value={value} onChange={onChange} dim={dim} path={path} hidden={hidden} onHidden={onHidden} />;

    case "object":
      return (
        <fieldset className={cn("rounded-2xl border border-line bg-muted/40 p-4", dim)}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <legend className="text-sm font-bold text-navy">{spec.label}</legend>
            {spec.hideable && <ShowTick path={path} hidden={hidden} onHidden={onHidden} />}
          </div>
          {spec.help && <p className="-mt-1 mb-3 text-xs text-ink-soft">{spec.help}</p>}
          <FieldsEditor fields={spec.fields} value={(value as Obj) ?? {}} onChange={onChange} hidden={hidden} onHidden={onHidden} prefix={`${path}.`} />
        </fieldset>
      );

    case "list":
      return <ListField spec={spec} value={Array.isArray(value) ? (value as Obj[]) : []} onChange={onChange} hidden={hidden} onHidden={onHidden} path={path} />;
  }
}

function ListField({
  spec,
  value,
  onChange,
  hidden,
  onHidden,
  path,
}: {
  spec: Extract<FieldSpec, { type: "list" }>;
  value: Obj[];
  onChange: (v: Obj[]) => void;
  hidden: string[];
  onHidden: (h: string[]) => void;
  path: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const max = spec.max ?? 50;
  const simple = spec.fields.length === 1 && (spec.fields[0]!.type === "text" || spec.fields[0]!.type === "textarea");

  const move = (i: number, d: number) => {
    const next = [...value];
    const [it] = next.splice(i, 1);
    next.splice(i + d, 0, it!);
    onChange(next);
  };
  const update = (i: number, item: Obj) => onChange(value.map((v, j) => (j === i ? item : v)));

  return (
    <div className={cn(spec.hideable && hidden.includes(path) && "opacity-50")}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-navy">
          {spec.label} <span className="font-normal text-ink-soft">({value.length})</span>
        </p>
        {spec.hideable && <ShowTick path={path} hidden={hidden} onHidden={onHidden} />}
      </div>
      {spec.help && <p className="-mt-1 mb-2 text-xs text-ink-soft">{spec.help}</p>}

      <ol className="space-y-2">
        {value.map((item, i) => {
          const itemId = String(item._id ?? i);
          const enabled = item.enabled !== false;
          const title = spec.titleKey ? String(item[spec.titleKey] ?? "") : "";
          const isOpen = open === itemId;
          return (
            <li key={itemId} className={cn("rounded-2xl border bg-white", enabled ? "border-line" : "border-dashed border-line bg-muted/50")}>
              <div className="flex items-center gap-2 p-2.5">
                <label className="flex shrink-0 cursor-pointer items-center" title={enabled ? "Shown on website. Untick to hide." : "Hidden. Tick to show."}>
                  <input type="checkbox" checked={enabled} onChange={(e) => update(i, { ...item, enabled: e.target.checked })} className="size-4 accent-[var(--brand-primary)]" />
                  <span className="sr-only">Show this {spec.itemLabel} on the website</span>
                </label>
                {simple ? (
                  <textarea
                    rows={Math.min(5, Math.max(1, Math.ceil(String(item[spec.fields[0]!.key] ?? "").length / 80)))}
                    value={String(item[spec.fields[0]!.key] ?? "")}
                    maxLength={(spec.fields[0] as { maxLength?: number }).maxLength}
                    aria-label={`${spec.itemLabel} ${i + 1}`}
                    onChange={(e) => update(i, { ...item, [spec.fields[0]!.key]: e.target.value })}
                    className={cn(inputCls, "min-h-9 resize-y", !enabled && "text-ink-soft line-through")}
                  />
                ) : (
                  <button type="button" onClick={() => setOpen(isOpen ? null : itemId)} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-expanded={isOpen}>
                    <ChevronDown aria-hidden className={cn("size-4 shrink-0 text-ink-soft transition-transform", isOpen && "rotate-180")} />
                    <span className={cn("truncate text-sm font-semibold", enabled ? "text-navy" : "text-ink-soft line-through")}>
                      {title || `Untitled ${spec.itemLabel}`}
                    </span>
                  </button>
                )}
                <div className="flex shrink-0 items-center">
                  <IconBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                    <ArrowUp className="size-4" />
                  </IconBtn>
                  <IconBtn label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                    <ArrowDown className="size-4" />
                  </IconBtn>
                  <IconBtn label={`Remove ${spec.itemLabel}`} danger onClick={() => onChange(value.filter((_, j) => j !== i))}>
                    <Trash2 className="size-4" />
                  </IconBtn>
                </div>
              </div>
              {!simple && isOpen && (
                <div className="border-t border-line p-4">
                  <FieldsEditor fields={spec.fields} value={item} onChange={(v) => update(i, v)} hidden={hidden} onHidden={onHidden} prefix={`${path}.`} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {value.length < max && (
        <button
          type="button"
          onClick={() => {
            const item = { _id: newId(), enabled: true, ...blankFor(spec.fields) };
            onChange([...value, item]);
            setOpen(item._id);
          }}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 px-3.5 py-1.5 text-sm font-semibold text-primary hover:bg-primary-light"
        >
          <Plus className="size-4" /> Add {spec.itemLabel}
        </button>
      )}
    </div>
  );
}

export function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg text-ink-soft transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-muted hover:text-navy",
      )}
    >
      {children}
    </button>
  );
}

const POSITIONS = [
  { value: "", label: "Centre" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
  { value: "30% 50%", label: "Left of centre" },
  { value: "70% 50%", label: "Right of centre" },
  { value: "50% 30%", label: "Above centre" },
];

function ImageInput({ id, value, onChange }: { id: string; value: ImageValue; onChange: (v: ImageValue) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(f: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", f);
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const json = (await res.json()) as { src?: string; error?: string };
      if (!res.ok || !json.src) throw new Error(json.error ?? "Upload failed.");
      onChange({ ...value, src: json.src, alt: value.alt || f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-muted">
        {value.src ? (
          <Image src={value.src} alt="" fill unoptimized className="object-cover" style={{ objectPosition: value.position || undefined }} sizes="7rem" />
        ) : (
          <ImageUp aria-hidden className="size-7 text-ink-soft/50" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => file.current?.click()} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <ImageUp className="size-4" />} {value.src ? "Replace image" : "Upload image"}
          </button>
          {value.src && (
            <button type="button" onClick={() => onChange({ src: "", alt: "", position: "" })} className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-muted">
              Remove
            </button>
          )}
          <input ref={file} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </div>
        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        <input id={id} type="text" aria-label="Image path" placeholder="/images/… or upload" value={value.src} onChange={(e) => onChange({ ...value, src: e.target.value })} className={cn(inputCls, "font-mono text-xs")} />
        <div className="grid gap-2 sm:grid-cols-[1fr_11rem]">
          <input type="text" aria-label="Image description (alt text)" placeholder="Describe the image (for screen readers and Google)" maxLength={200} value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} className={inputCls} />
          <select aria-label="Focus point" value={value.position ?? ""} onChange={(e) => onChange({ ...value, position: e.target.value })} className={inputCls}>
            {POSITIONS.map((p) => (
              <option key={p.label} value={p.value}>
                Focus: {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  spec,
  id,
  value,
  onChange,
  dim,
  path,
  hidden,
  onHidden,
}: {
  spec: Extract<FieldSpec, { type: "select" }>;
  id: string;
  value: unknown;
  onChange: (v: unknown) => void;
  dim: string;
  path: string;
  hidden: string[];
  onHidden: (h: string[]) => void;
}) {
  const runtime = useContext(RuntimeOptionsContext);
  const options = spec.optionsFrom ? (runtime[spec.optionsFrom] ?? []) : spec.options;
  const current = String(value ?? "");
  const missing = current && !options.some((o) => o.value === current);
  return (
    <div className={dim}>
      <FieldLabel id={id} spec={spec} path={path} hidden={hidden} onHidden={onHidden} />
      <select id={id} value={current} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {spec.optionsFrom && !current && <option value="">Choose…</option>}
        {missing && <option value={current}>{current} (no longer available)</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
