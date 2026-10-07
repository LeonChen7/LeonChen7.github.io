import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * A small German Shepherd doodle that lives around the portrait.
 * - It turns to face the cursor.
 * - Touching it with the cursor (or tapping it, or pressing Enter on it)
 *   makes it run to another spot.
 *
 * With `intro` on, it first stands to the left of the portrait holding a
 * rope in its mouth and leans back as if hauling the portrait in (the
 * portrait's own slide-in lives in Hero.tsx); when `intro` turns off it drops
 * the rope and trots to its usual spot.
 *
 * Spots are given relative to the portrait box: `left`/`top` are where the
 * dog's feet go (0% = left/top edge, 100% = right/bottom edge).
 */
const SPOTS = [
  { left: "96%", top: "1%" }, // sitting on the top edge
  { left: "109%", top: "58%" }, // beside the right edge
  { left: "34%", top: "101%" }, // in front of the bottom edge
  { left: "-9%", top: "74%" }, // beside the left edge
];

// Where it stands while pulling, and where it settles afterwards.
const INTRO_SPOT = { left: "-42%", top: "74%" };
const AFTER_INTRO = 3;

type Facing = "left" | "right";

export function Shepherd({ intro = false }: { intro?: boolean }) {
  const [spot, setSpot] = useState(intro ? AFTER_INTRO : 0);
  const [facing, setFacing] = useState<Facing>(intro ? "right" : "left");
  const [running, setRunning] = useState(false);
  const wasIntro = useRef(intro);
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  // Intro over: trot from the pulling position to the resting spot.
  useEffect(() => {
    if (wasIntro.current && !intro) setRunning(true);
    wasIntro.current = intro;
  }, [intro]);

  // Idle: look towards the cursor.
  useEffect(() => {
    if (running || intro) return;
    const onMove = (e: PointerEvent) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const centre = box.left + box.width / 2;
      // Small dead zone so it doesn't flicker when the cursor is on the dog.
      if (Math.abs(e.clientX - centre) < box.width / 2) return;
      setFacing(e.clientX < centre ? "left" : "right");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [running, intro]);

  const run = () => {
    if (running || intro) return;
    // Any spot except the current one.
    const next = (spot + 1 + Math.floor(Math.random() * (SPOTS.length - 1))) % SPOTS.length;
    setFacing(parseFloat(SPOTS[next].left) < parseFloat(SPOTS[spot].left) ? "left" : "right");
    setRunning(true);
    setSpot(next);
  };

  const hop = running && !reduceMotion;
  const pull = intro && !reduceMotion;

  return (
    <>
      {intro && <span aria-hidden="true" className="shepherd__rope" />}
    <motion.button
      ref={ref}
      type="button"
      className="shepherd"
      aria-label="A little German Shepherd. Touch it and it runs to another spot."
      onPointerEnter={run}
      onClick={run}
      initial={false}
      animate={intro ? INTRO_SPOT : SPOTS[spot]}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.45, 0, 0.25, 1] }}
      onAnimationComplete={() => setRunning(false)}
    >
      <motion.span
        className="shepherd__hop"
        animate={
          pull
            ? { y: 0, rotate: [-4, -14, -4, -14, -4, -14, -4] } // leaning back on the rope
            : hop
              ? { y: [0, -12, 0, -9, 0, -6, 0], rotate: [0, -6, 4, -5, 3, -2, 0] }
              : { y: 0, rotate: 0 }
        }
        transition={{ duration: pull ? 2.4 : 0.7, ease: "easeInOut" }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 80 76"
          className="shepherd__art"
          style={{ transform: facing === "left" ? undefined : "scaleX(-1)" }}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path className="shepherd__tail" d="M59 62 C 69 63, 77 56, 73 45" />
          {/* body, with the dark saddle on the back */}
          <path d="M27 39 C 24 48, 26 60, 27 70 L 60 70 C 63 44, 55 28, 44 21 Z" fill="var(--bg)" stroke="none" />
          <path d="M44 21 C 55 28, 63 44, 60 70" />
          <path d="M45 22 C 55 29, 61 42, 60 58 C 55 48, 50 40, 43 35 Z" fill="var(--ink)" fillOpacity="0.82" stroke="none" />
          <path d="M27 39 C 24 48, 26 60, 27 70 L 37 70" />
          <path d="M37 70 C 36 61, 37 54, 39 48" />
          <path d="M60 70 L 42 70 C 39 60, 47 51, 57 55" />
          {/* head */}
          <path d="M24 15 L 21 1 L 33 11" fill="var(--bg)" />
          <path d="M35 11 L 43 0 L 46 16" fill="var(--bg)" />
          <path
            d="M24 15 C 18 19, 11 24, 6 28 C 3 30, 4 35, 9 35 L 20 36 C 24 41, 34 42, 40 37 C 47 31, 49 22, 46 16 L 35 11 L 33 11 Z"
            fill="var(--bg)"
          />
          <path d="M6 28 C 3 30, 4 35, 9 35 L 15 35.5 C 16 31, 13 27, 10 25.5 Z" fill="var(--ink)" fillOpacity="0.82" stroke="none" />
          <circle cx="25" cy="23.500" r="2" fill="var(--ink)" stroke="none" />
          <path d="M14 35.5 C 13.500 41, 19.500 41.500, 20 36" stroke="var(--accent)" fill="var(--accent)" fillOpacity="0.25" />
        </svg>
      </motion.span>
    </motion.button>
    </>
  );
}
