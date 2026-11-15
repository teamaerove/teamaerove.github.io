import { useEffect, useRef, useState } from "react";

import { IconArrowOut } from "@/components/icons";
import { href } from "@/components/site/Shell";
import { recruitmentHref } from "@/lib/siteData";
import poster from "@/assets/gallery-vtol-runway.jpg";

const SHOT_MS = 7000;

const shots = [
  { label: "Cruise", caption: "The hex mothership in forward flight, carrying its daughter drone." },
  { label: "Airframe", caption: "Six arms, carbon structure and payload bay — designed and built in house." },
  { label: "Launch", caption: "Holding a stable hover while the daughter lifts off its back." },
  { label: "Autonomy", caption: "Onboard perception scans the ground; every decision is computed in flight." },
];

/**
 * Home hero: copy on the left, the live 3D model in a framed panel on the
 * right. The panel cycles through four camera shots on a timer (pausable,
 * clickable); the page itself scrolls normally.
 */
export function CineHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<{ setProgress: (p: number) => void; dispose: () => void } | null>(null);
  const altRef = useRef<HTMLElement>(null);
  const spdRef = useRef<HTMLElement>(null);
  const [shot, setShot] = useState(0);
  const [paused, setPaused] = useState(false);
  const [state, setState] = useState<"loading" | "live" | "fallback">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false;
    import("./heroScene")
      .then(({ createHeroScene }) => {
        if (dead) return;
        handleRef.current = createHeroScene(canvas, {
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onFirstFrame: () => setState("live"),
          onTelemetry: (t) => {
            if (altRef.current) altRef.current.textContent = `${t.alt.toFixed(1)} m`;
            if (spdRef.current) spdRef.current.textContent = `${t.spd.toFixed(1)} m/s`;
          },
        });
      })
      .catch(() => { if (!dead) setState("fallback"); });
    return () => { dead = true; handleRef.current?.dispose(); handleRef.current = null; };
  }, []);

  // Drive the camera to the selected shot; the scene eases between them.
  useEffect(() => { handleRef.current?.setProgress(shot / (shots.length - 1)); }, [shot, state]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => { if (!document.hidden) setShot((s) => (s + 1) % shots.length); }, SHOT_MS);
    return () => window.clearTimeout(id);
  }, [shot, paused]);

  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="hero-eyebrow">UMIC · IIT Bombay</p>
        <h1>Autonomous aircraft, built by students.</h1>
        <p className="hero-lede">Team AeRoVe — Aerial Robotics Vehicles — designs fixed-wing and multirotor drones that see, decide and fly on their own.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={href("systems")}>Explore our work<IconArrowOut /></a>
          <a className="btn btn-ghost" href={recruitmentHref} target="_blank" rel="noreferrer">Join the team</a>
        </div>
        <a className="hero-blueprint" href={href("blueprint")}>Open the interactive 3D blueprint<IconArrowOut /></a>
      </div>

      <figure className={`hero-visual is-${state}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="hero-screen">
          <img className="hero-poster" src={poster} alt="" />
          <canvas ref={canvasRef} className="hero-canvas" role="img" aria-label="Live 3D model of the AeRoVe hexacopter mothership launching its daughter drone" />
          <div className="hero-readout" aria-hidden="true">
            <span>Alt <b ref={altRef}>120.0 m</b></span>
            <span>Speed <b ref={spdRef}>15.0 m/s</b></span>
          </div>
        </div>
        <figcaption>
          <div className="hero-tabs" role="tablist" aria-label="Camera shots">
            {shots.map((s, i) => (
              <button key={s.label} type="button" role="tab" aria-selected={shot === i} className={shot === i ? "is-on" : ""} onClick={() => setShot(i)}
                style={shot === i && !paused ? { ["--dur" as string]: `${SHOT_MS}ms` } : undefined}>
                {s.label}
              </button>
            ))}
          </div>
          <p aria-live="polite">{shots[shot]!.caption}</p>
        </figcaption>
      </figure>
    </header>
  );
}
