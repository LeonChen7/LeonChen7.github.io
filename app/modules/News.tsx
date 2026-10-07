import news from "../content/news.json";
import { formatDate, withLinks } from "../lib/format";
import { Item } from "../motion/Reveal";

export const isEmpty = () => news.length === 0;

export function News() {
  return (
    <div className="rows">
      {news.map((entry) => (
        <Item key={entry.date + entry.text} className="row">
          <time dateTime={entry.date} className="row__meta">
            {formatDate(entry.date)}
          </time>
          <div className="row__main">{withLinks(entry.text)}</div>
        </Item>
      ))}
    </div>
  );
}
