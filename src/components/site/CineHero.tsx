import { useEffect, useRef, useState } from "react";

import { IconArrowOut } from "@/components/icons";
import { href } from "@/components/site/Shell";
import poster from "@/assets/gallery-vtol-runway.jpg";

const shots = ["Cruise", "Airframe", "Launch", "Autonomy"];

const chapters = [
  { tag: "Airframe", title: "The mothership", text: "A hex-configured mothership, designed and built in house — from CAD and structural analysis to carbon-fibre layups — ferries a daughter drone to the target zone.", link: { to: "fleet", label: "Meet the fleet" } },
  { tag: "Mission", title: "Launch, fly, recover", text: "It holds a stable hover while the daughter lifts off its back, completes the mission and docks again for the flight home.", link: { to: "fleet", label: "See the mission" } },
  { tag: "Autonomy", title: "Sees, decides, flies", text: "Perception finds the target, planning plots a collision-free path and control holds the line — every stage computed on board.", link: { to: "systems", label: "Explore the systems" } },
];

/**
 * Scroll-driven flight film. The section is several viewports tall; its sticky
 * stage holds the WebGL canvas, and scroll progress moves the camera through
 * four shots while the matching caption fades in.
 */
export function CineHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLElement>(null);
  const spdRef = useRef<HTMLElement>(null);
  const hdgRef = useRef<HTMLElement>(null);
  const [shot, setShot] = useState(0);
  const [state, setState] = useState<"loading" | "live" | "fallback">("loading");

  useEffect(() => {
    const section = sectionRef.current, canvas = canvasRef.current;
    if (!section || !canvas) return;
    let handle: { setProgress: (p: number) => void; dispose: () => void } | null = null;
    let dead = false;

    const onScroll = () => {
      const span = section.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / span)) : 0;
      handle?.setProgress(p);
      const f = p * 3, near = Math.round(f);
      setShot(Math.abs(f - near) < 0.34 ? near : -1);
      // Each of the four bars fills across its share of the scroll.
      progRef.current?.querySelectorAll<HTMLElement>("div").forEach((el, i) => {
        el.style.setProperty("--fill", String(Math.min(1, Math.max(0, p * 4 - i))));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    import("./heroScene")
      .then(({ createHeroScene }) => {
        if (dead) return;
        handle = createHeroScene(canvas, {
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onFirstFrame: () => setState("live"),
          onTelemetry: (t) => {
            if (altRef.current) altRef.current.textContent = `${t.alt.toFixed(1)} m`;
            if (spdRef.current) spdRef.current.textContent = `${t.spd.toFixed(1)} m/s`;
            if (hdgRef.current) hdgRef.current.textContent = `${String(Math.round(t.hdg)).padStart(3, "0")}°`;
          },
        });
        onScroll();
      })
      .catch(() => { if (!dead) setState("fallback"); });

    return () => { dead = true; handle?.dispose(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <header ref={sectionRef} className={`cine is-${state}`}>
      <div className="cine-stage">
        <img className="cine-poster" src={poster} alt="" />
        <canvas ref={canvasRef} className="cine-canvas" aria-label="3D film of the AeRoVe hexacopter mothership flying low over a valley and launching its daughter drone" role="img" />
        <div className="cine-shade" aria-hidden="true" />

        <div className="cine-meta" aria-hidden="true">
          <p>Real-time render · HEX-6 mothership with QUAD-4 daughter</p>
          <dl>
            <div><dt>Altitude</dt><dd ref={altRef}>120.0 m</dd></div>
            <div><dt>Ground speed</dt><dd ref={spdRef}>15.0 m/s</dd></div>
            <div><dt>Heading</dt><dd ref={hdgRef}>000°</dd></div>
          </dl>
        </div>

        <div className={`cine-title ${shot === 0 ? "is-on" : ""}`}>
          <h1><span>UMIC · IIT Bombay</span>Team AeRoVe</h1>
          <div className="cine-side">
            <p className="cine-tagline">Aerial Robotics Vehicles. Students building fully autonomous fixed-wing and multirotor aircraft that see, decide and fly on their own.</p>
            <div className="cine-actions">
              <a className="btn btn-primary" href={href("systems")}>Explore the system<IconArrowOut /></a>
              <a className="btn" href={href("blueprint")}>3D blueprint<IconArrowOut /></a>
            </div>
          </div>
        </div>

        {chapters.map((c, i) => (
          <article key={c.title} className={`cine-chapter side-${i % 2 ? "left" : "right"} ${shot === i + 1 ? "is-on" : ""}`} aria-hidden={shot === i + 1 ? undefined : true}>
            <p className="kicker"><span>0{i + 2} / 04</span>{c.tag}</p>
            <h2>{c.title}</h2>
            <p>{c.text}</p>
            <a className="text-link" href={href(c.link.to)} tabIndex={shot === i + 1 ? 0 : -1}>{c.link.label}<IconArrowOut /></a>
          </article>
        ))}

        <div ref={progRef} className="cine-progress" aria-hidden="true">
          {shots.map((s, i) => <div key={s} className={shot === i ? "is-on" : ""}><b>0{i + 1}</b><span>{s}</span></div>)}
        </div>
      </div>
    </header>
  );
}
