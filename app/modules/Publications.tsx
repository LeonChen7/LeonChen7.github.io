import profile from "../content/profile.json";
import data from "../content/publications.json";
import { Item } from "../motion/Reveal";

/**
 * app/content/publications.json holds `items` (the papers) and `note`, a
 * line shown while there are no papers yet. With neither, the section hides.
 *
 * One entry in `items`, e.g.
 * { "title": "…", "authors": ["Yiyu Chen", "…"], "venue": "NeurIPS", "year": 2027,
 *   "links": { "PDF": "https://…", "Code": "https://…" } }
 */
interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year?: number;
  links?: Record<string, string>;
}

const publications = data.items as Publication[];

export const isEmpty = () => publications.length === 0 && !data.note;

export function Publications() {
  if (publications.length === 0) return <p className="empty-note">{data.note}</p>;
  return (
    <div className="rows rows--loose">
      {publications.map((pub) => (
        <Item key={pub.title}>
          <article className="entry">
            <h3>{pub.title}</h3>
            <div className="entry__org">
              {pub.authors.map((author, i) => (
                <span key={author}>
                  {i > 0 && ", "}
                  {author === profile.name ? <strong>{author}</strong> : author}
                </span>
              ))}
            </div>
            <div className="entry__links">
              <span>
                {pub.venue} {pub.year}
              </span>
              {Object.entries(pub.links ?? {}).map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </div>
          </article>
        </Item>
      ))}
    </div>
  );
}
