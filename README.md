# leonchen7.github.io

Personal site of Yiyu (Leon) Chen. A static React site: every page is rendered
to HTML at build time and deployed to GitHub Pages by a GitHub Actions workflow.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173, reloads as you edit
npm run build      # static site in build/client
npm run preview    # serve the built site at http://localhost:4173
npm run typecheck
```

## Where things live

| What you want to change | File |
| --- | --- |
| Name, bio, interests, links, photo, CV | `app/content/profile.json` |
| News, experience, publications | `app/content/*.json` |
| Off Hours: intro text, photos | `app/content/gallery.json`, files in `public/photos/` |
| Notes (blog posts) | `app/content/notes/*.mdx` (copy `_template.mdx`); the line shown while there are none is in `app/content/notes.json` |
| Which sections show, their order, their animation, accent colour | `app/site.config.ts` |
| Animations themselves | `app/motion/presets.ts` |
| Hand-drawn doodles, the dog | `app/components/doodles.ts`, `app/components/Shepherd.tsx` |
| Colours, type, layout | `app/styles/global.css` |

Photo and CV: put the files in `public/` (for example
`public/assets/img/me.jpg`) and set `"portrait": "/assets/img/me.jpg"` or
`"cv": "/assets/pdf/cv.pdf"` in `profile.json`.

## How it is put together

Three layers, so each can change without the others:

- **Content** (`app/content`): plain JSON and MDX. No layout in here.
- **Modules** (`app/modules`): one component per section. `registry.ts` lists
  them; `site.config.ts` picks which appear and in what order. A section with
  no content hides itself.
- **Motion** (`app/motion`): modules never contain animation code. They sit in
  a shared `Section` shell and wrap their rows in `<Item>`; the preset named in
  `site.config.ts` decides how those appear.

### Add a section

1. Write `app/modules/Projects.tsx` exporting a component (and `isEmpty`).
2. Register it in `app/modules/registry.ts`.
3. Add `{ id: "projects", motion: "stagger" }` to `modules` in `app/site.config.ts`.

### Add an animation

Add a preset to `app/motion/presets.ts`, then use its name in `site.config.ts`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes it. One-time setup on GitHub: **Settings → Pages → Build and
deployment → Source: GitHub Actions**.
