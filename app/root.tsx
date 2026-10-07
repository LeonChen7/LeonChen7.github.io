import { MotionConfig } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { siteConfig } from "./site.config";
import stylesheet from "./styles/global.css?url";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Caveat:wght@500;600&display=swap";

export const links = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
  { rel: "stylesheet", href: FONTS },
  { rel: "stylesheet", href: stylesheet },
];

// Animated blocks start hidden in the static HTML; without JavaScript they
// would stay hidden, so show them outright in that case.
const NO_JS = "[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ "--accent": siteConfig.accent } as CSSProperties}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_JS }} />
        </noscript>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // reducedMotion="user": people who ask their system for less motion get
  // fades only, no movement.
  return (
    <MotionConfig reducedMotion="user">
      <Outlet />
    </MotionConfig>
  );
}
