import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { siteConfig } from "../site.config";

/**
 * Hand-drawn doodles, stored as stroke data rather than fixed SVG markup so
 * the same drawing can be shown as-is or animated stroke by stroke.
 */
export interface Stroke {
  d: string;
  /** Drawn in the accent colour instead of ink. */
  accent?: boolean;
  /** Dash pattern, e.g. "3 6". Dashed strokes fade in instead of drawing. */
  dash?: string;
  /** Light accent fill behind the stroke. */
  tint?: boolean;
}

export interface DoodleDef {
  width: number;
  height: number;
  strokeWidth?: number;
  strokes: Stroke[];
}

interface Props {
  def: DoodleDef;
  /** Display size relative to the drawing's own size. */
  scale?: number;
  className?: string;
  style?: CSSProperties;
}

export function Doodle({ def, scale = 1, className, style }: Props) {
  const draw = siteConfig.drawDoodles;
  const shared = {
    fill: "none",
    strokeWidth: def.strokeWidth ?? 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths = def.strokes.map((s, i) => {
    const props = {
      ...shared,
      d: s.d,
      stroke: s.accent ? "var(--accent)" : "var(--ink)",
      strokeDasharray: s.dash,
      ...(s.tint ? { fill: "var(--accent)", fillOpacity: 0.18 } : {}),
    };
    if (!draw) return <path key={i} {...props} />;
    // Motion animates pathLength through the dash pattern, so strokes that
    // already have one fade in instead.
    const variants = s.dash
      ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5 } } }
      : {
          hidden: { pathLength: 0, opacity: 0 },
          show: {
            pathLength: 1,
            opacity: 1,
            transition: { pathLength: { duration: 0.7, ease: "easeInOut" as const }, opacity: { duration: 0.1 } },
          },
        };
    return <motion.path key={i} {...props} variants={variants} />;
  });

  const svgProps = {
    "aria-hidden": true,
    viewBox: `0 0 ${def.width} ${def.height}`,
    className: ["doodle", className].filter(Boolean).join(" "),
    style: { width: def.width * scale, height: def.height * scale, ...style },
  };
  if (!draw) return <svg {...svgProps}>{paths}</svg>;
  return (
    <motion.svg
      {...svgProps}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
    >
      {paths}
    </motion.svg>
  );
}
