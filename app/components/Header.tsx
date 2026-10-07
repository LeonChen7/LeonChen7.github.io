import { Link } from "react-router";
import profile from "../content/profile.json";

interface Props {
  nav: { id: string; title: string }[];
}

export function Header({ nav }: Props) {
  return (
    <header className="header">
      <Link to="/" className="header__name">
        {profile.name}
      </Link>
      <nav aria-label="Primary" className="header__nav">
        {nav.map((item) => (
          <a key={item.id} href={`/#${item.id}`}>
            {item.title}
          </a>
        ))}
        {profile.cv && (
          <a href={profile.cv} className="header__cv">
            CV ↗
          </a>
        )}
      </nav>
    </header>
  );
}
