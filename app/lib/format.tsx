import type { ReactNode } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-08-24" → "Aug 24, 2026" (no Date object, so no timezone drift). */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}

/**
 * Renders text containing Markdown-style [label](url) links and **bold**.
 * `renderBold` swaps in a custom element for the bold parts. It gets the
 * text, that part's position among the bold parts (0, 1, 2…), and any
 * punctuation that directly follows it, which it should keep attached.
 */
export function withLinks(
  text: string,
  renderBold?: (text: string, index: number, trailing: string) => ReactNode,
): ReactNode[] {
  let boldCount = 0;
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  if (renderBold) {
    // Hand the punctuation after each bold part to that part.
    for (let i = 0; i < parts.length - 1; i++) {
      if (!/^\*\*[^*]+\*\*$/.test(parts[i])) continue;
      const punct = /^[,.;:!?)]+/.exec(parts[i + 1])?.[0] ?? "";
      parts[i] += `\u0000${punct}`;
      parts[i + 1] = parts[i + 1].slice(punct.length);
    }
  }
  return parts.map((raw, i) => {
    const [part, trailing = ""] = raw.split("\u0000");
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <a key={i} href={link[2]}>
          {link[1]}
        </a>
      );
    }
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (!bold) return part;
    if (renderBold) return <span key={i}>{renderBold(bold[1], boldCount++, trailing)}</span>;
    return <strong key={i}>{bold[1]}</strong>;
  });
}

/** The same text with the link and bold markup removed. */
export function plainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
