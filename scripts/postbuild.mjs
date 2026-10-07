// GitHub Pages serves 404.html for unknown URLs. Reuse the SPA fallback
// shell so those URLs land on the in-app "not found" page.
import { copyFileSync, existsSync, writeFileSync } from "node:fs";

const out = "build/client";
const fallback = `${out}/__spa-fallback.html`;
if (existsSync(fallback)) copyFileSync(fallback, `${out}/404.html`);
// Tell Pages not to run Jekyll over the output.
writeFileSync(`${out}/.nojekyll`, "");
