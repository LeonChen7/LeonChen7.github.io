import { Link } from "react-router";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { activeModules } from "../modules/registry";

export const meta = () => [{ title: "Page not found" }];

export default function NotFound() {
  return (
    <div className="page">
      <Header nav={activeModules()} />
      <main className="note">
        <h1>Page not found</h1>
        <p>
          There is nothing at this address. <Link to="/">Back to the home page</Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
