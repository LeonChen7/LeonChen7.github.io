import type { DoodleDef } from "./Doodle";

export const arrow: DoodleDef = {
  width: 80,
  height: 56,
  strokeWidth: 2.25,
  strokes: [
    { d: "M4 10 C 26 2, 54 8, 62 46", accent: true },
    { d: "M50 37 L 62 48 L 70 32", accent: true },
  ],
};

export const sparkle: DoodleDef = {
  width: 60,
  height: 60,
  strokeWidth: 2.25,
  strokes: [
    { d: "M30 6 C 31 18, 30 22, 29 26", accent: true },
    { d: "M36 31 C 44 32, 50 30, 56 31", accent: true },
    { d: "M30 36 C 29 44, 31 50, 30 56", accent: true },
    { d: "M6 31 C 14 30, 20 32, 25 31", accent: true },
    { d: "M14 14 L 22 22", accent: true },
    { d: "M46 46 L 39 39", accent: true },
  ],
};
