/**
 * Content model shared by the public pages and the Admin Panel editor.
 * Pure types and data only — safe to import from client components.
 */

export type ImageValue = { src: string; alt: string; position?: string };
export type LinkValue = { label: string; href: string };

/** Every list item carries a stable id and its own visibility tick. */
export type ListItem<T = Record<string, unknown>> = T & { _id: string; enabled: boolean };

type FieldBase = {
  key: string;
  label: string;
  help?: string;
  /** Shows a "Show on website" tick for this element. */
  hideable?: boolean;
};

export type FieldSpec =
  | (FieldBase & {
      type: "text" | "textarea";
      maxLength?: number;
      placeholder?: string;
      /** Allows *asterisks* to highlight words in the brand gradient. */
      highlight?: boolean;
      /** Extra validation applied when saving. */
      format?: "href" | "https" | "phone" | "digits" | "email" | "date" | "video" | "slug" | "color";
    })
  | (FieldBase & { type: "image" })
  | (FieldBase & { type: "icon" })
  | (FieldBase & { type: "link" })
  | (FieldBase & {
      type: "select";
      options: { value: string; label: string }[];
      /** Options filled in at runtime from the current programmes or countries. */
      optionsFrom?: "programmes" | "destinations";
    })
  | (FieldBase & { type: "object"; fields: FieldSpec[] })
  | (FieldBase & {
      type: "list";
      fields: FieldSpec[];
      /** Field shown as the item's title in the editor. */
      titleKey?: string;
      itemLabel: string;
      max?: number;
    });

export type SectionSpec = {
  kind: string;
  label: string;
  description: string;
  fields: FieldSpec[];
  /** Fixed sections cannot be moved or deleted (e.g. the page header). */
  fixed?: boolean;
};

export type Section = {
  id: string;
  kind: string;
  enabled: boolean;
  /** Keys of elements switched off with their "Show on website" tick. */
  hidden: string[];
  data: Record<string, unknown>;
};

export type PageContent = { version: 1; sections: Section[] };
export type SettingsContent = { version: 1; hidden: string[]; data: Record<string, unknown> };

export type ContentKey =
  | "page:home"
  | "page:about"
  | "page:admission-process"
  | "page:contact"
  | "page:destinations"
  | "page:programmes"
  | "page:faqs"
  | "page:scholarships"
  | "page:book-counselling"
  | "page:success-stories"
  | "page:privacy-policy"
  | "page:terms-and-conditions"
  | "settings:programmes"
  | "settings:programme-page"
  | "settings:destinations"
  | "settings:destination-page"
  | "settings:site"
  | "settings:team"
  | "settings:steps"
  | "settings:guidance";
