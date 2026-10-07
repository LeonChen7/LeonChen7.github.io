import { Link } from "react-router";
import profile from "../content/profile.json";

interface Props {
  nav: { id: string; title: string }[];
  /**
   * On the home page the top-left corner is where the live dog comes to sit
   * (see Shepherd.tsx), so only its place is kept free. Elsewhere a still
   * picture of the dog sits there as the link back home.
   */
  liveDog?: boolean;
}

export function Header({ nav, liveDog = false }: Props) {
  return (
    <header className="header">
      {liveDog ? (
        <span className="header__home" data-dog-home aria-hidden="true" />
      ) : (
        <Link to="/" className="header__home" aria-label="Home">
          <img src="/favicon.svg" alt="" width={44} height={44} />
        </Link>
      )}
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
