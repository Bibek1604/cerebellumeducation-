/** Turns the free-text contact details from the Admin Panel into the exact formats schema.org expects. */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayIndex = (word: string) => DAYS.findIndex((d) => word.length >= 3 && d.toLowerCase().startsWith(word.toLowerCase()));

/** "10:00", "9 am", "5:30 PM" → "10:00", "09:00", "17:30"; null when it is not a time. */
function toTime(text: string): string | null {
  const m = /^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/i.exec(text.trim());
  if (!m || (!m[2] && !m[3])) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  const half = m[3]?.toLowerCase();
  if (half && (h < 1 || h > 12)) return null;
  if (half) h = (h % 12) + (half === "pm" ? 12 : 0);
  return h > 23 || min > 59 ? null : `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** "Sunday – Friday: 10:00 – 17:00" → structured hours. Lines it cannot read (or "Closed") are left out, never guessed. */
export function openingHoursSpec(lines: string[]) {
  return lines.flatMap((line) => {
    const m = /^([a-z]+)(?:\s*(?:-|–|—|to)\s*([a-z]+))?\s*:\s*(.+?)\s*(?:-|–|—|to)\s*(.+)$/i.exec(line.trim());
    if (!m) return [];
    const from = dayIndex(m[1]!);
    const to = m[2] ? dayIndex(m[2]) : from;
    const opens = toTime(m[3]!);
    const closes = toTime(m[4]!);
    if (from < 0 || to < 0 || !opens || !closes) return [];
    const dayOfWeek = Array.from({ length: ((to - from + 7) % 7) + 1 }, (_, i) => DAYS[(from + i) % 7]);
    return [{ "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes }];
  });
}

/** Reads the pin position out of a Google Maps embed link. */
export function mapCoordinates(embedUrl: string | null) {
  const lng = /!2d(-?\d+(?:\.\d+)?)/.exec(embedUrl ?? "")?.[1];
  const lat = /!3d(-?\d+(?:\.\d+)?)/.exec(embedUrl ?? "")?.[1];
  return lat && lng ? { latitude: Number(lat), longitude: Number(lng) } : null;
}
