import { Link, useParams } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import profile from "../content/profile.json";
import { formatDate } from "../lib/format";
import { findNote } from "../lib/notes";
import { activeModules } from "../modules/registry";
import NotFound from "./not-found";

export const meta = ({ params }: { params: { slug?: string } }) => {
  const note = findNote(params.slug);
  return [
    { title: note ? `${note.title} · ${profile.name}` : profile.name },
    ...(note?.summary ? [{ name: "description", content: note.summary }] : []),
  ];
};

export default function NotePage() {
  const note = findNote(useParams().slug);
  if (!note) return <NotFound />;
  return (
    <div className="page">
      <Header nav={activeModules()} />
      <main className="note">
        <Link to="/#notes" className="note__back">
          ← Notes
        </Link>
        <header>
          <time dateTime={note.date} className="row__meta">
            {formatDate(note.date)}
          </time>
          <h1>{note.title}</h1>
          {note.summary && <p className="note__summary">{note.summary}</p>}
        </header>
        <article className="prose">
          <note.Body />
        </article>
      </main>
      <Footer />
    </div>
  );
}
