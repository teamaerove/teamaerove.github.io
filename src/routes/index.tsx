import { createFileRoute } from "@tanstack/react-router";

import { IconArrowOut } from "@/components/icons";
import { BlueprintEmbed } from "@/components/site/BlueprintEmbed";
import { DroneVision } from "@/components/site/DroneVision";
import { CountUp, Shell, delay, href, useInView, useReveal } from "@/components/site/Shell";
import { achievements, architecture, missionSteps, slugOf, stats } from "@/lib/siteData";
import heroImg from "@/assets/hero-full-squad.jpg";
import closingImg from "@/assets/aerove-2.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Team AeRoVe — Aerial Robotics Vehicles | IIT Bombay" },
      { name: "description", content: "Team AeRoVe, Aerial Robotics Vehicles at UMIC, IIT Bombay, builds autonomous fixed-wing and multirotor aircraft that see, decide and fly on their own." },
      { property: "og:title", content: "Team AeRoVe — Aerial Robotics Vehicles | IIT Bombay" },
      { property: "og:description", content: "Autonomous aerial systems engineered end to end by students of IIT Bombay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const year = (title: string) => title.match(/\d{4}/)?.[0] ?? "";
const eventName = (title: string) => title.replace(/\s*\d{4}$/, "");

const focus: [string, string][] = [
  ["Long-range navigation", "Outdoor missions flown beyond line of sight, with planning and control on board."],
  ["Heavy payloads", "Airframes and grippers designed to carry, drop and recover large objects."],
  ["Moving platforms", "Launching from and landing on frames of reference that are themselves in motion."],
  ["Onboard compute", "Perception, planning and control run on the aircraft. Nothing is offloaded."],
];

function Home() {
  useReveal();
  const [statsRef, statsSeen] = useInView<HTMLDListElement>();

  return (
    <Shell current="" overlayNav>
      <header className="hero">
        <img className="hero-bg" src={heroImg} alt="Team AeRoVe on the flight line with their multirotor aircraft" fetchPriority="high" />
        <div className="hero-inner">
          <p className="hero-eyebrow">UMIC · IIT Bombay</p>
          <h1>Team AeRoVe</h1>
          <p className="hero-sub">Aerial Robotics Vehicles</p>
          <p className="hero-lede">A student team that designs, builds and flies autonomous drones, and takes them to international competitions.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={href("systems")}>See our work</a>
            <a className="btn btn-ghost" href={href("contact")}>Contact us</a>
          </div>
        </div>
        <a className="hero-cue" href="#impact" aria-label="Scroll to content"><span /></a>
      </header>

      <section id="impact" className="band impact">
        <dl ref={statsRef} className="figures">
          {stats.map(([n, l]) => (
            <div key={l}><dd><CountUp value={n} start={statsSeen} /></dd><dt>{l}</dt></div>
          ))}
        </dl>
      </section>

      <section className="band">
        <div className="split">
          <div className="reveal">
            <p className="kicker">Our mission</p>
            <h2>Aircraft that see, decide and fly on their own</h2>
            <p className="lede">“A drone is often preferred for missions that are too <em>dull, dirty, or dangerous</em> for manned aircraft.” With subsystems for Mechatronics, Aerodynamics, Motion Path &amp; Controlling and Perception, the team covers every part of a complete autonomous aerial vehicle.</p>
          </div>
          <ul className="focus">
            {focus.map(([t, d], i) => (
              <li key={t} className="reveal" style={delay(i * 70)}><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band">
        <div className="section-title reveal">
          <p className="kicker">How our drone works</p>
          <h2>Explore the drone, part by part</h2>
          <p className="lede">Hover any component to see what it does and its spec. Use Explode to separate the assembly, drag to turn it, and fly it with the on-screen sticks. <a className="text-link" href={href("blueprint")}>Open full screen<IconArrowOut /></a></p>
        </div>
        <BlueprintEmbed />
        <ol className="steps">
          {missionSteps.map(([title, text], i) => (
            <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className="band">
        <div className="split split-vision">
          <div className="reveal">
            <p className="kicker">Perception</p>
            <h2>What our drones see</h2>
            <p className="lede">Learning-based vision finds people, aircraft and targets in the camera feed and places them in 3D using depth, at 30 frames per second on board.</p>
            <a className="text-link" href={`${href("systems")}#perception`}>Perception subsystem<IconArrowOut /></a>
          </div>
          <DroneVision />
        </div>
      </section>

      <section className="band">
        <div className="section-title reveal">
          <p className="kicker">Our subsystems</p>
          <h2>Four teams, one aircraft</h2>
        </div>
        <div className="subsystems">
          {architecture.map((s, i) => (
            <a key={s.name} className="subsystem reveal" style={delay(i * 60)} href={`${href("systems")}#${slugOf(s.name)}`}>
              <img src={s.gallery[0]!.src} alt={s.gallery[0]!.alt} loading="lazy" />
              <h3>{s.name}</h3>
              <p>{s.kicker}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-title reveal">
          <p className="kicker">Competitions</p>
          <h2>Recent results</h2>
        </div>
        <ol className="results reveal">
          {achievements.map((a) => (
            <li key={a.title}>
              <span className="results-year">{year(a.title)}</span>
              <strong>{eventName(a.title)}</strong>
              <span className="results-rank">{a.rank}</span>
              <span className="results-detail">{a.detail}</span>
            </li>
          ))}
        </ol>
        <a className="text-link results-more" href={href("achievements")}>Full record<IconArrowOut /></a>
      </section>

      <section className="closing">
        <img className="closing-bg" src={closingImg} alt="" loading="lazy" />
        <div className="closing-inner reveal">
          <h2>Join our journey</h2>
          <p>We partner with sponsors, labs and companies on hardware, testing and research.</p>
          <a className="btn btn-primary" href={href("contact")}>Partner with us</a>
        </div>
      </section>
    </Shell>
  );
}
