import type { ComponentType } from "react";

interface NoteFile {
  default: ComponentType;
  frontmatter?: { title?: string; date?: unknown; summary?: string };
}

export interface Note {
  slug: string;
  title: string;
  date: string;
  summary: string;
  Body: ComponentType;
}

// Every .mdx file in app/content/notes, except ones starting with "_".
const files = import.meta.glob<NoteFile>(
  ["../content/notes/*.mdx", "!../content/notes/_*.mdx"],
  { eager: true },
);

function isoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}

export const notes: Note[] = Object.entries(files)
  .map(([path, file]) => {
    const slug = path.split("/").pop()!.replace(/\.mdx$/, "");
    return {
      slug,
      title: file.frontmatter?.title ?? slug,
      date: isoDate(file.frontmatter?.date),
      summary: file.frontmatter?.summary ?? "",
      Body: file.default,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function findNote(slug: string | undefined): Note | undefined {
  return notes.find((n) => n.slug === slug);
}
