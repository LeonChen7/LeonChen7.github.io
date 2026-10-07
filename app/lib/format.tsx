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
 * `renderBold` swaps in a custom element for the bold parts (it gets the
 * text and that part's position among the bold parts: 0, 1, 2…).
 */
export function withLinks(
  text: string,
  renderBold?: (text: string, index: number) => ReactNode,
): ReactNode[] {
  let boldCount = 0;
  return text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((part, i) => {
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
    if (renderBold) return <span key={i}>{renderBold(bold[1], boldCount++)}</span>;
    return <strong key={i}>{bold[1]}</strong>;
  });
}

/** The same text with the link and bold markup removed. */
export function plainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
