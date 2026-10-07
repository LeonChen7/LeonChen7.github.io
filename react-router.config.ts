import { readdirSync } from "node:fs";
import type { Config } from "@react-router/dev/config";

// GitHub Pages has no server-side routing, so every page is rendered to
// static HTML at build time. Each note in app/content/notes becomes a page;
// files starting with "_" (e.g. _template.mdx) are skipped.
function notePaths(): string[] {
  return readdirSync("app/content/notes")
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => `/notes/${f.replace(/\.mdx$/, "")}`);
}

export default {
  ssr: false,
  prerender: () => ["/", ...notePaths()],
} satisfies Config;
