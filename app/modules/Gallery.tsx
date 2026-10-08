import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import gallery from "../content/gallery.json";
import { withLinks } from "../lib/format";
import { Item } from "../motion/Reveal";

/**
 * A short paragraph, then photographs as a stack of prints with a description.
 *
 * Content lives in app/content/gallery.json:
 * - `intro`: a short paragraph shown first ([label](url) links and **bold**
 *   work). Leave "" to hide it.
 * - `photos`: { src, width, height, alt, title, meta, description } — files
 *   go in public/photos/. `width`/`height` are the image's pixel size (so
 *   each print keeps its shape); `alt` says what is in the picture, for
 *   screen readers.
 */
const { photos } = gallery;

export const isEmpty = () => !gallery.intro && photos.length === 0;

/**
 * A photo's caption, told rather than shown: the place and year fade in, the
 * title rises into place, then the description is typed out (Typewriter).
 */
const TELL: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
};
const LINE: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Types `text` out like a typewriter once `start` is on: one character at a
 * time with a blinking caret, a slightly uneven rhythm, and a short pause after
 * punctuation. The untyped rest is already laid out (invisibly), so the
 * paragraph never reflows while it types. Screen readers get the whole text.
 */
function Typewriter({ text, start, delay = 550 }: { text: string; start: boolean; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(0);
  const done = shown >= text.length;

  useEffect(() => {
    if (!start || reduceMotion) return;
    let i = 0;
    let timer = window.setTimeout(function tick() {
      i += 1;
      setShown(i);
      if (i >= text.length) return;
      const ch = text[i - 1];
      const pause = /[.,;:!?]/.test(ch) ? 260 : ch === " " ? 55 : 0;
      timer = window.setTimeout(tick, 26 + Math.random() * 30 + pause);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [start, text, delay, reduceMotion]);

  if (reduceMotion) return <p>{text}</p>;
  return (
    <p className="typewriter">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        <span className={done ? "typewriter__caret typewriter__caret--done" : "typewriter__caret"} />
        <span className="typewriter__rest">{text.slice(shown)}</span>
      </span>
    </p>
  );
}

/**
 * The photo stack: photos lie on top of one another like a pile of prints,
 * with the top one's description beside it. Clicking the pile puts the top
 * photo at the back and shows the next one.
 */
const VISIBLE = 3; // how many photos show in the pile at once
const PILE_RATIO = 5 / 4; // shape of the box the pile sits in (see .stack__pile)

function PhotoStack() {
  const [current, setCurrent] = useState(0);
  const count = photos.length;
  const next = () => setCurrent((c) => (c + 1) % count);
  const photo = photos[current];
  // The first caption is told once the stack scrolls into view.
  const textRef = useRef<HTMLDivElement>(null);
  const inView = useInView(textRef, { once: true, amount: 0.5 });

  return (
    <div className="stack">
      <div className="stack__pile">
        {photos.map((p, i) => {
          // 0 = on top, 1 = next underneath, …
          const depth = (i - current + count) % count;
          const shown = depth < VISIBLE;
          const top = depth === 0;
          return (
            <motion.button
              key={i}
              type="button"
              className="stack__card"
              // Only the top photo is a real control; the ones under it are
              // decoration until their turn comes.
              tabIndex={top ? 0 : -1}
              aria-hidden={!top}
              aria-label={top ? `${p.alt}. Show the next photo.` : undefined}
              disabled={count < 2}
              onClick={next}
              style={{
                zIndex: count - depth,
                // Each print keeps its own shape: landscape ones fill the
                // pile's width, portrait ones its height.
                aspectRatio: `${p.width} / ${p.height}`,
                ...(p.width >= p.height * PILE_RATIO ? { width: "100%" } : { height: "100%" }),
              }}
              initial={false}
              animate={{
                y: shown ? -depth * 16 : -VISIBLE * 16,
                scale: 1 - Math.min(depth, VISIBLE) * 0.06,
                rotate: top ? 0 : depth % 2 ? 1.5 : -1.5,
                opacity: shown ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <img src={p.src} alt="" loading="lazy" draggable={false} />
            </motion.button>
          );
        })}
      </div>

      <div ref={textRef} className="stack__text" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="stack__tell"
            variants={TELL}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            // Leaving is quick, so the next story is not kept waiting.
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
          >
            {photo.meta && (
              <motion.div className="stack__meta" variants={LINE}>
                {photo.meta}
              </motion.div>
            )}
            {photo.title && <motion.h3 variants={LINE}>{photo.title}</motion.h3>}
            {photo.description && (
              <Typewriter text={photo.description} start={inView} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <div className="gallery">
      {gallery.intro && (
        <Item>
          <p className="gallery__intro">{withLinks(gallery.intro)}</p>
        </Item>
      )}

      {photos.length > 0 && (
        <Item>
          <PhotoStack />
        </Item>
      )}
    </div>
  );
}
