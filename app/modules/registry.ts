import type { ComponentType } from "react";
import type { DoodleDef } from "../components/Doodle";
import type { PresetName } from "../motion/presets";
import { siteConfig } from "../site.config";
import * as experience from "./Experience";
import * as gallery from "./Gallery";
import * as news from "./News";
import * as notes from "./Notes";
import * as publications from "./Publications";

/**
 * Every module the site knows about. To add one: write a component in this
 * folder, register it here, then list its id in site.config.ts.
 */
export interface SiteModule {
  title: string;
  Component: ComponentType;
  doodle?: DoodleDef;
  /** When true the section is skipped (unless showEmptyModules is on). */
  isEmpty?: () => boolean;
}

export const registry: Record<string, SiteModule> = {
  news: { title: "News", Component: news.News, isEmpty: news.isEmpty },
  experience: {
    title: "Research & Experience",
    Component: experience.Experience,
    isEmpty: experience.isEmpty,
  },
  publications: {
    title: "Publications",
    Component: publications.Publications,
    isEmpty: publications.isEmpty,
  },
  notes: { title: "Notes", Component: notes.Notes, isEmpty: notes.isEmpty },
  gallery: { title: "Off Hours", Component: gallery.Gallery, isEmpty: gallery.isEmpty },
};

export interface ActiveModule extends SiteModule {
  id: string;
  motion: PresetName;
}

/** The modules to render, in config order, with unknown/hidden ones dropped. */
export function activeModules(): ActiveModule[] {
  return siteConfig.modules.flatMap((entry) => {
    const mod = registry[entry.id];
    if (!mod || entry.enabled === false) return [];
    if (!siteConfig.showEmptyModules && mod.isEmpty?.()) return [];
    return [{ ...mod, id: entry.id, motion: entry.motion ?? "none" }];
  });
}
