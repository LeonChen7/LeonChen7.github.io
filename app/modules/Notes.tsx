import { Link } from "react-router";
import settings from "../content/notes.json";
import { formatDate } from "../lib/format";
import { notes } from "../lib/notes";
import { Item } from "../motion/Reveal";

// app/content/notes.json holds `note`, a line shown while there are no
// notes yet. With no notes and no line, the section hides.
export const isEmpty = () => notes.length === 0 && !settings.note;

export function Notes() {
  if (notes.length === 0) return <p className="empty-note">{settings.note}</p>;
  return (
    <div className="note-list">
      {notes.map((note) => (
        <Item key={note.slug}>
          <Link to={`/notes/${note.slug}`} className="row note-list__row">
            <span className="row__meta">{formatDate(note.date)}</span>
            <span className="row__main note-list__title">{note.title}</span>
          </Link>
        </Item>
      ))}
    </div>
  );
}
