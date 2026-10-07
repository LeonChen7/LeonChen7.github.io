import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface Props {
  /** One string per line; each later line is indented a bit further. */
  lines: string[];
  /** Hold the writing back (e.g. until the portrait has landed). */
  wait?: boolean;
  className?: string;
}

const PER_LETTER = 0.07; // seconds between letters
const LINE_PAUSE = 0.35; // extra pause before starting the next line

/**
 * Text that appears as if being written: each letter is uncovered from left
 * to right, one after another, line by line. It starts once the text is on
 * screen (and `wait` is off), and plays once.
 */
export function Handwritten({ lines, wait = false, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const writing = inView && !wait;

  let written = 0; // letters before the current one, for the delay
  return (
    <p ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, l) => {
        const lineStart = written * PER_LETTER + l * LINE_PAUSE;
        written += line.length;
        return (
          <span key={l} aria-hidden="true" className="handwritten__line" style={{ marginLeft: `${l * 2.75}em` }}>
            {[...line].map((char, c) =>
              char === " " ? (
                " "
              ) : (
                <motion.span
                  key={c}
                  data-reveal
                  className="handwritten__letter"
                  initial={{ clipPath: "inset(-20% 100% -20% 0%)", opacity: 0 }}
                  animate={
                    writing
                      ? { clipPath: "inset(-20% -10% -20% 0%)", opacity: 1 }
                      : { clipPath: "inset(-20% 100% -20% 0%)", opacity: 0 }
                  }
                  transition={{
                    clipPath: { duration: 0.16, ease: "easeOut", delay: lineStart + c * PER_LETTER },
                    opacity: { duration: 0.01, delay: lineStart + c * PER_LETTER },
                  }}
                >
                  {char}
                </motion.span>
              ),
            )}
          </span>
        );
      })}
    </p>
  );
}
