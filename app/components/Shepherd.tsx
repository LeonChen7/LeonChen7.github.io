import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * A small German Shepherd doodle.
 * - With `intro` on, it stands to the left of the portrait holding a rope in
 *   its mouth and leans back as if hauling the portrait in (the portrait's
 *   own slide-in lives in Hero.tsx).
 * - When `intro` turns off it drops the rope and trots up to its seat in the
 *   top-left corner of the header, where it stays.
 * - It turns to face the cursor. Touching it with the cursor (or tapping it,
 *   or pressing Enter on it) sends it running somewhere else: one of the
 *   spots around the portrait, or back to its seat.
 *
 * It is positioned inside the portrait box. `left`/`top` say where its feet
 * go, as a percentage of that box (0% = left/top edge, 100% = right/bottom).
 * The header seat lies outside the box, so its percentages are worked out
 * from where the seat actually is on the page.
 */
const SPOTS = [
  { left: "96%", top: "1%" }, // sitting on the top edge
  { left: "109%", top: "58%" }, // beside the right edge
  { left: "34%", top: "101%" }, // in front of the bottom edge
  { left: "-9%", top: "74%" }, // beside the left edge
];

// German Shepherd colouring, black & tan: black back, ears, crown and
// muzzle; tan face, chest and legs.
const COAT = {
  tan: "#c98a45",
  black: "#26211e",
  tongue: "#e58a95",
};

// How big it is in the header, relative to its size beside the portrait.
const SEATED_SCALE = 0.66;

// Where it stands while pulling.
const INTRO_SPOT = { left: "-42%", top: "74%" };

type Place = "home" | number;
type Position = { left: string; top: string };
type Facing = "left" | "right";

export function Shepherd({ intro = false }: { intro?: boolean }) {
  const [place, setPlace] = useState<Place>("home");
  const [home, setHome] = useState<Position | null>(null);
  const [facing, setFacing] = useState<Facing>(intro ? "right" : "left");
  const [running, setRunning] = useState(false);
  // Whether the current run is to or from the header (a longer way to go).
  const [farTrip, setFarTrip] = useState(true);
  const ref = useRef<HTMLButtonElement>(null);
  const wasIntro = useRef(intro);
  const reduceMotion = useReducedMotion();

  // Find the header seat, as percentages of the portrait box. Measured once
  // the portrait is in its final place, and again whenever the window resizes.
  useLayoutEffect(() => {
    if (intro) return;
    const measure = () => {
      const box = ref.current?.offsetParent?.getBoundingClientRect();
      const seat = document.querySelector("[data-dog-home]")?.getBoundingClientRect();
      if (!box || !seat || !box.width || !box.height) return;
      setHome({
        left: `${(((seat.left + seat.width / 2 - box.left) / box.width) * 100).toFixed(2)}%`,
        top: `${(((seat.bottom - box.top) / box.height) * 100).toFixed(2)}%`,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [intro]);

  // Until the seat has been measured, wait beside the portrait.
  const positionOf = (p: Place): Position => (p === "home" ? (home ?? SPOTS[3]) : SPOTS[p]);
  const target = intro ? INTRO_SPOT : positionOf(place);
  // In the header it sits at logo size, so it matches the nav beside it.
  const seated = !intro && place === "home" && home !== null;

  // Intro over: head for the seat, facing the way it is going.
  useEffect(() => {
    if (wasIntro.current && !intro) {
      setFacing(home && parseFloat(home.left) > parseFloat(INTRO_SPOT.left) ? "right" : "left");
      setRunning(true);
    }
    wasIntro.current = intro;
  }, [intro, home]);

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
    // Anywhere except where it is now.
    const places: Place[] = ["home", 0, 1, 2, 3];
    const others = places.filter((p) => p !== place);
    const next = others[Math.floor(Math.random() * others.length)];
    setFacing(parseFloat(positionOf(next).left) < parseFloat(positionOf(place).left) ? "left" : "right");
    setFarTrip(next === "home" || place === "home");
    setRunning(true);
    setPlace(next);
  };

  const hop = running && !reduceMotion;
  const pull = intro && !reduceMotion;
  // Longer trips take more time and more hops.
  const trip = farTrip ? 1.3 : 0.7;

  return (
    <>
      {intro && <span aria-hidden="true" className="shepherd__rope" />}
      <motion.button
        ref={ref}
        type="button"
        className="shepherd"
        aria-label="A little German Shepherd. Touch it and it runs somewhere else."
        onPointerEnter={run}
        onClick={run}
        initial={false}
        animate={{ ...target, scale: seated ? SEATED_SCALE : 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: trip, ease: [0.45, 0, 0.25, 1] }}
        onAnimationComplete={() => setRunning(false)}
      >
        <motion.span
          className="shepherd__hop"
          animate={
            pull
              ? { y: 0, rotate: [-4, -14, -4, -14, -4, -14, -4] } // leaning back on the rope
              : hop
                ? farTrip
                  ? { y: [0, -12, 0, -10, 0, -10, 0, -8, 0, -6, 0], rotate: [0, -6, 4, -5, 4, -5, 3, -4, 3, -2, 0] }
                  : { y: [0, -12, 0, -9, 0, -6, 0], rotate: [0, -6, 4, -5, 3, -2, 0] }
                : { y: 0, rotate: 0 }
          }
          transition={{ duration: pull ? 2.4 : trip, ease: "easeInOut" }}
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
            {/* tail */}
            <path className="shepherd__tail" d="M59 62 C 69 63, 77 56, 73 45" stroke={COAT.black} strokeWidth="5.5" />
            {/* body: black back, tan chest and legs */}
            <path d="M27 39 C 24 48, 26 60, 27 70 L 60 70 C 63 44, 55 28, 44 21 Z" fill={COAT.black} stroke="none" />
            <path d="M28 40 C 26 50, 28 60, 30 68 C 34 58, 35 48, 34 40 Z" fill={COAT.tan} stroke="none" />
            <path d="M44 21 C 55 28, 63 44, 60 70" />
            <path
              d="M37 70 C 36 61, 37 54, 39 48 C 44 50, 50 52, 57 55 C 47 51, 39 60, 42 70 Z"
              fill={COAT.tan}
              stroke="none"
            />
            <path d="M42 70 C 39 60, 47 51, 57 55 C 60 60, 60 66, 60 70 Z" fill={COAT.tan} stroke="none" />
            <path d="M27 39 C 24 48, 26 60, 27 70 L 37 70" />
            <path d="M37 70 C 36 61, 37 54, 39 48" />
            <path d="M60 70 L 42 70 C 39 60, 47 51, 57 55" />
            {/* head: tan face, black ears, crown and muzzle */}
            <path d="M24 15 L 21 1 L 33 11" fill={COAT.black} />
            <path d="M35 11 L 43 0 L 46 16" fill={COAT.black} />
            <path d="M26 13 L 24.500 6 L 30 11 Z" fill={COAT.tan} stroke="none" />
            <path d="M37.500 12 L 42 5 L 43.500 14 Z" fill={COAT.tan} stroke="none" />
            <path
              d="M24 15 C 18 19, 11 24, 6 28 C 3 30, 4 35, 9 35 L 20 36 C 24 41, 34 42, 40 37 C 47 31, 49 22, 46 16 L 35 11 L 33 11 Z"
              fill={COAT.tan}
            />
            <path d="M33 11 L 35 11 L 46 16 C 48 21, 47 27, 44 32 C 40 26, 34 20, 27 16 Z" fill={COAT.black} stroke="none" />
            <path d="M6 28 C 3 30, 4 35, 9 35 L 17 35.700 C 19 30, 15 25, 11 24.500 Z" fill={COAT.black} stroke="none" />
            <circle cx="25" cy="23.500" r="2.200" fill="var(--ink)" stroke="none" />
            <path d="M14 35.500 C 13.500 41, 19.500 41.500, 20 36" fill={COAT.tongue} strokeWidth="1.5" />
          </svg>
        </motion.span>
      </motion.button>
    </>
  );
}
