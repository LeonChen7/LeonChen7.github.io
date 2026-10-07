import experience from "../content/experience.json";
import { Item } from "../motion/Reveal";

export const isEmpty = () => experience.length === 0;

export function Experience() {
  return (
    <div className="rows rows--loose timeline">
      {experience.map((entry) => (
        <Item key={entry.title + entry.period} className="row timeline__item">
          <div className="row__meta">{entry.period}</div>
          <article className="row__main entry">
            <h3>{entry.title}</h3>
            <div className="entry__org">{entry.org}</div>
            {entry.summary && <p>{entry.summary}</p>}
          </article>
        </Item>
      ))}
    </div>
  );
}
