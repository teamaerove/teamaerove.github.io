import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import "@/components/blueprint/blueprint.css";
import aeroveLogo from "@/assets/aerove-logo.png";
import umicLogo from "@/assets/umic-logo.png";
import iitbLogo from "@/assets/iitb-logo.svg";

export const Route = createFileRoute("/blueprint")({
  head: () => ({
    meta: [
      { title: "Team AeRoVe — 3D Blueprint" },
      {
        name: "description",
        content:
          "Explore an interactive 3D blueprint of an AeRoVe quadcopter: hover any of 40+ components for its function and spec, fly it with on-screen sticks, or explode the assembly.",
      },
      { property: "og:title", content: "Team AeRoVe — 3D Blueprint" },
      {
        property: "og:description",
        content:
          "An interactive 3D blueprint of an autonomous drone by Team AeRoVe, UMIC, IIT Bombay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: BlueprintPage,
});

// WebGL cannot render on the server: the page shell is prerendered and the
// three.js viewer is loaded and mounted only in the browser.
const BlueprintViewer = lazy(() => import("@/components/blueprint/BlueprintViewer"));

const TOPBAR_HEIGHT = 62;

function BlueprintPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bp-root">
      <header className="bp-topbar">
        <div className="bp-topbar-logos">
          <img src={aeroveLogo} alt="AeRoVe logo" className="bp-logo bp-logo-invert" />
          <img src={umicLogo} alt="UMIC logo" className="bp-logo" />
          <img src={iitbLogo} alt="IIT Bombay logo" className="bp-logo" />
        </div>
        <a href={import.meta.env.BASE_URL} className="bp-back">
          ← Back to main site
        </a>
      </header>

      {mounted ? (
        <Suspense fallback={<BlueprintLoading />}>
          <BlueprintViewer height="100svh" topInset={TOPBAR_HEIGHT} />
        </Suspense>
      ) : (
        <BlueprintLoading />
      )}
    </div>
  );
}

function BlueprintLoading() {
  return (
    <section className="bp-hero bp-loading" aria-busy="true">
      <p>Loading 3D blueprint…</p>
    </section>
  );
}
