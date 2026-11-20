import "server-only";
import { getDestinations } from "./destinations";
import { getProgrammes } from "./programmes";

/** Choices for admin dropdowns that follow the current content (programmes, countries). */
export async function runtimeOptions() {
  const [programmes, destinations] = await Promise.all([getProgrammes(), getDestinations()]);
  return {
    programmes: programmes.map((p) => ({ value: p.slug, label: p.name })),
    destinations: destinations.map((d) => ({ value: d.slug, label: d.name })),
  };
}
