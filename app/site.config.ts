import type { PresetName } from "./motion/presets";

/**
 * The one place that decides what the home page shows.
 *
 * - `modules`: which sections appear and in what order. Remove a line (or set
 *   `enabled: false`) to hide one; reorder lines to reorder the page. The
 *   nav and the title-bar colours follow automatically.
 * - `motion`: the entrance animation for that section, by preset name
 *   (see app/motion/presets.ts). "none" turns it off.
 */
export interface ModuleEntry {
  id: string;
  enabled?: boolean;
  motion?: PresetName;
}

export const siteConfig = {
  accent: "#2b4fc2",
  /**
   * Background tint of the research-interest chips. Each interest in
   * profile.json names a `group`; a group has one base hue (0–360 on the
   * colour wheel) and its chips get close shades of it, so related topics
   * look related.
   */
  interestHues: { reasoning: 268, agents: 228 } as Record<string, number>,
  /** Colour of the bar beside each section title, in page order. */
  sectionColors: ["#2b4fc2", "#c2571a", "#1f7a5a", "#7a3fb8", "#b03a6e"],
  /** Sections with no content (e.g. no publications yet) stay hidden. */
  showEmptyModules: false,
  /** Doodles draw themselves stroke by stroke when scrolled into view. */
  drawDoodles: true,
  /** The German Shepherd doodle that runs around the portrait. */
  portraitPet: true,
  /** Opening animation: the dog drags the portrait in from off-screen. */
  portraitIntro: true,
  hero: { motion: "stagger" as PresetName },
  modules: [
    { id: "news", motion: "fadeUp" },
    { id: "experience", motion: "stagger" },
    { id: "publications", motion: "stagger" },
    { id: "notes", motion: "stagger" },
    { id: "gallery", motion: "stagger" },
  ] as ModuleEntry[],
};
