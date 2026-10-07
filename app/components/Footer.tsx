import profile from "../content/profile.json";

export function Footer() {
  return (
    <footer className="footer">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>{profile.location}</span>
    </footer>
  );
}
