import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
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

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          className="stack__text"
          aria-live="polite"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {photo.meta && <div className="stack__meta">{photo.meta}</div>}
          {photo.title && <h3>{photo.title}</h3>}
          {photo.description && <p>{photo.description}</p>}
        </motion.div>
      </AnimatePresence>
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
