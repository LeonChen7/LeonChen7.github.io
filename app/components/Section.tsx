import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "../motion/Reveal";
import type { PresetName } from "../motion/presets";
import { siteConfig } from "../site.config";
import { Doodle, type DoodleDef } from "./Doodle";

interface Props {
  id: string;
  index: number;
  title: string;
  doodle?: DoodleDef;
  motion?: PresetName;
  children: ReactNode;
}

/** The shell every module sits in: title with a coloured bar, animated body. */
export function Section({ id, index, title, doodle, motion, children }: Props) {
  // Sections take the bar colours in turn, wrapping around if there are more.
  const colors = siteConfig.sectionColors;
  const bar = colors[(index - 1) % colors.length];
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="section__label">
        <h2 id={`${id}-title`} style={{ "--bar": bar } as CSSProperties}>
          {title}
        </h2>
        {doodle && <Doodle def={doodle} scale={0.62} />}
      </div>
      <Reveal preset={motion} className="section__body">
        {children}
      </Reveal>
    </section>
  );
}
