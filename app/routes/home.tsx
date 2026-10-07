import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Section } from "../components/Section";
import profile from "../content/profile.json";
import { plainText } from "../lib/format";
import { Hero } from "../modules/Hero";
import { activeModules } from "../modules/registry";

export const meta = () => [
  { title: profile.name },
  { name: "description", content: plainText(profile.bio) },
];

export default function Home() {
  const modules = activeModules();
  return (
    <div className="page">
      <Header nav={modules} />
      <main>
        <Hero />
        {modules.map(({ id, title, doodle, motion, Component }, i) => (
          <Section key={id} id={id} index={i + 1} title={title} doodle={doodle} motion={motion}>
            <Component />
          </Section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
