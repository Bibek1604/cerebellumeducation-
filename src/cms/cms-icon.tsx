import { createElement } from "react";
import type { LucideProps } from "lucide-react";
import { getIcon } from "./icons";

/** Renders an admin-selected icon by its stored name. */
export function CmsIcon({ icon, ...props }: Omit<LucideProps, "name"> & { icon: unknown }) {
  return createElement(getIcon(icon), props);
}
