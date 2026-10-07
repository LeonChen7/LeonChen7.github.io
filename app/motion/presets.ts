import type { Variants } from "motion/react";

/**
 * Entrance animations, kept apart from the modules so they can change
 * without touching any section's code. A preset has a `container` (the
 * section body) and optionally an `item` (each row inside it).
 *
 * To add an animation: add a preset here, then name it in site.config.ts.
 */
export interface Preset {
  container: Variants;
  item?: Variants;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const presets = {
  none: null,
  fadeUp: {
    container: {
      hidden: { opacity: 0, y: 18 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
    },
  },
  stagger: {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.09 } },
    },
    item: {
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
    },
  },
} satisfies Record<string, Preset | null>;

export type PresetName = keyof typeof presets;
