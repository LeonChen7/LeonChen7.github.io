import { motion, useReducedMotion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { Doodle } from "../components/Doodle";
import { Handwritten } from "../components/Handwritten";
import { arrow, sparkle } from "../components/doodles";
import { Shepherd } from "../components/Shepherd";
import profile from "../content/profile.json";
import { withLinks } from "../lib/format";
import { Item, Reveal } from "../motion/Reveal";
import { siteConfig } from "../site.config";

/** Hue for each interest chip: its group's base hue, nudged a little per chip. */
function chipHues(): (number | undefined)[] {
  const seen: Record<string, number> = {};
  const size: Record<string, number> = {};
  for (const { group } of profile.interests) size[group] = (size[group] ?? 0) + 1;
  return profile.interests.map(({ group }) => {
    const base = siteConfig.interestHues[group];
    if (base === undefined) return undefined;
    const k = seen[group] ?? 0;
    seen[group] = k + 1;
    return base + (k - (size[group] - 1) / 2) * 8;
  });
}

/**
 * A bio keyword that drops in from above and lands in its place in the
 * sentence. Its space is held open from the start, so nothing shifts when it
 * lands. Each word falls separately, so a keyword can still wrap across lines.
 */
function FallingKeyword({ text, index, trailing }: { text: string; index: number; trailing: string }) {
  const start = 1.1 + index * 0.35; // seconds after load; keywords land one after another
  return (
    <strong>
      {text.split(" ").map((word, w, words) => (
        // nowrap keeps the last word and its punctuation on one line
        <span key={w} style={{ whiteSpace: "nowrap" }}>
          <motion.span
            data-reveal
            className="hero__falling"
            initial={{ y: "-2.2em", opacity: 0, rotate: w % 2 ? 7 : -7 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            // The delay has to be repeated per property: a transition given
            // for one property does not pick up the outer delay.
            transition={{
              y: { type: "spring", stiffness: 420, damping: 14, mass: 0.9, delay: start + w * 0.1 },
              rotate: { type: "spring", stiffness: 300, damping: 12, delay: start + w * 0.1 },
              opacity: { duration: 0.12, delay: start + w * 0.1 },
            }}
          >
            {word}
          </motion.span>
          {w < words.length - 1 ? " " : <span className="hero__trailing">{trailing}</span>}
        </span>
      ))}
    </strong>
  );
}

// The opening animation plays once per page load, not again when coming
// back to the home page from a note.
let introPlayed = false;

// The portrait is hauled in from the right in three tugs.
const TUGS = ["75vw", "48vw", "51vw", "23vw", "26vw", "0vw"];

export function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  const [intro, setIntro] = useState(
    () => siteConfig.portraitIntro && siteConfig.portraitPet && !introPlayed,
  );
  const reduceMotion = useReducedMotion();
  const hues = chipHues();
  const [flipped, setFlipped] = useState(false);
  const endIntro = () => {
    introPlayed = true;
    setIntro(false);
  };
  return (
    <section id="top" className="hero">
      <Reveal preset={siteConfig.hero.motion} className="hero__text">
        {profile.kicker && <Item className="hero__kicker">{profile.kicker}</Item>}
        <Item>
          <h1 className="hero__name">
            {first} {profile.nickname && <span className="hero__nick">({profile.nickname})</span>}{" "}
            {rest.join(" ")}
          </h1>
        </Item>
        <Item>
          <p className="hero__bio">
            {withLinks(profile.bio, (text, index, trailing) => (
              <FallingKeyword text={text} index={index} trailing={trailing} />
            ))}
          </p>
          {/* A quieter line of its own, set apart from the introduction. */}
          {profile.bioNote && <p className="hero__note">{withLinks(profile.bioNote)}</p>}
        </Item>
        <Item>
          <ul aria-label="Research interests" className="chips">
            {profile.interests.map((interest, i) => (
              // Each chip slides in from beyond the left edge, one after
              // another, while the dog hauls the portrait in from the right.
              <motion.li
                key={interest.label}
                data-reveal
                className={hues[i] === undefined ? undefined : "chip--tinted"}
                style={hues[i] === undefined ? undefined : ({ "--hue": hues[i] } as CSSProperties)}
                initial={{ x: "-60vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.5 + i * 0.18 }}
              >
                {interest.label}
              </motion.li>
            ))}
          </ul>
        </Item>
        <Item className="hero__links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {profile.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </Item>
      </Reveal>

      <div className="portrait">
        <motion.div
          data-reveal
          className="portrait__rig"
          initial={intro ? { x: TUGS[0] } : false}
          animate={{ x: intro && !reduceMotion ? TUGS : "0vw" }}
          transition={
            intro && !reduceMotion
              ? { duration: 2.4, delay: 0.3, times: [0, 0.3, 0.38, 0.64, 0.72, 1], ease: "easeInOut" }
              : { duration: 0 }
          }
          onAnimationComplete={endIntro}
        >
        {profile.portraitNote && (
          <div aria-hidden="true" className="portrait__note">
            <span>{profile.portraitNote}</span>
            <Doodle def={arrow} />
          </div>
        )}
        {profile.portrait && profile.portraitSketch ? (
          // Two-sided print: the photo on the front, a pencil sketch on the
          // back. Clicking it turns it over.
          <button
            type="button"
            className="portrait__flip"
            aria-pressed={flipped}
            aria-label={flipped ? "Show the photo" : "Show the sketch"}
            onClick={() => setFlipped((f) => !f)}
          >
            <motion.span
              className="portrait__card"
              initial={false}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            >
              <img className="portrait__frame" src={profile.portrait} alt={`Portrait of ${profile.name}`} />
              <img
                className="portrait__frame portrait__back"
                src={profile.portraitSketch}
                alt={`Cartoon sketch of ${profile.name}`}
              />
            </motion.span>
          </button>
        ) : profile.portrait ? (
          <img className="portrait__frame portrait__frame--tilted" src={profile.portrait} alt={`Portrait of ${profile.name}`} />
        ) : (
          <div className="portrait__frame portrait__frame--tilted portrait__frame--empty" role="img" aria-label="Portrait placeholder">
            Add a photo: set "portrait" in app/content/profile.json
          </div>
        )}
        <Doodle def={sparkle} className="portrait__sparkle" />
        {profile.motto.length > 0 && (
          // Written out under the portrait once it has been pulled into place.
          <Handwritten
            lines={profile.motto}
            signature={profile.mottoBy}
            wait={intro}
            className="portrait__motto"
          />
        )}
        {siteConfig.portraitPet && <Shepherd intro={intro} />}
        </motion.div>
      </div>
    </section>
  );
}
