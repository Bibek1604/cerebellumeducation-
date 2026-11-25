import Link from "next/link";
import type { ReactNode } from "react";

/** [text](link) inside an article. Only pages of this website and https:// addresses become links. */
const LINK = /\[([^\]\n]+)\]\((\/(?![\/\\])[^\s)]*|https:\/\/[^\s)]+)\)/g;

function withLinks(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const [whole, label = "", href = ""] = m;
    out.push(text.slice(last, m.index));
    out.push(
      href.startsWith("/") ? (
        <Link key={m.index} href={href}>
          {label}
        </Link>
      ) : (
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ),
    );
    last = m.index + whole.length;
  }
  out.push(text.slice(last));
  return out;
}

/** Article text from the Admin Panel: blank lines separate paragraphs, lines starting with "- " make a list. */
export function PostText({ text }: { text: string }) {
  return text.split(/\n{2,}/).map((para, i) => {
    const lines = para.split("\n").filter((l) => l.trim());
    if (lines.length > 0 && lines.every((l) => l.startsWith("- "))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{withLinks(l.slice(2))}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mt-3 whitespace-pre-line first:mt-0">
        {withLinks(para)}
      </p>
    );
  });
}
