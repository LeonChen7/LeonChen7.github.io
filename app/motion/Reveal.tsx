import { motion, type Variants } from "motion/react";
import { createContext, useContext, type ReactNode } from "react";
import { presets, type Preset, type PresetName } from "./presets";

const ItemVariants = createContext<Variants | undefined>(undefined);

interface Props {
  className?: string;
  children: ReactNode;
}

/** Wraps a block and plays the named preset once when it scrolls into view. */
export function Reveal({ preset = "none", className, children }: Props & { preset?: PresetName }) {
  const p: Preset | null = presets[preset];
  if (!p) return <div className={className}>{children}</div>;
  return (
    <ItemVariants.Provider value={p.item}>
      <motion.div
        data-reveal
        className={className}
        variants={p.container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {children}
      </motion.div>
    </ItemVariants.Provider>
  );
}

/**
 * One row inside a <Reveal>. Modules wrap their entries in this and stay
 * unaware of what (if anything) the active preset does with them.
 */
export function Item({ className, children }: Props) {
  const variants = useContext(ItemVariants);
  if (!variants) return <div className={className}>{children}</div>;
  return (
    <motion.div data-reveal className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
