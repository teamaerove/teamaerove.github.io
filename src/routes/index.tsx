import { createFileRoute } from "@tanstack/react-router";

import { IconArrowOut } from "@/components/icons";
import { BlueprintEmbed } from "@/components/site/BlueprintEmbed";
import { DroneVision } from "@/components/site/DroneVision";
import { CountUp, SectionHead, Shell, delay, href, useInView, useReveal } from "@/components/site/Shell";
import { achievements, architecture, missionSteps, slugOf, stats } from "@/lib/siteData";

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

function Home() {
  useReveal();
  const [statsRef, statsSeen] = useInView<HTMLDListElement>();

  return (
    <Shell current="" overlayNav>
      <header className="hero">
        <div className="hero-copy">
          <h1>Team AeRoVe</h1>
          <p className="hero-sub">Aerial Robotics Vehicles · UMIC, IIT Bombay</p>
          <p className="hero-lede">We are a student team that designs, builds and flies autonomous drones, from the airframe and flight controller to the onboard vision, and takes them to international competitions.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={href("systems")}>See our work<IconArrowOut /></a>
            <a className="btn btn-ghost" href={href("contact")}>Contact us</a>
          </div>
          <a className="hero-blueprint" href={href("blueprint")}>Explore a drone in 3D<IconArrowOut /></a>
        </div>
        <DroneVision />
      </header>

      <section className="band figures-band">
        <dl ref={statsRef} className="figures">
          {stats.map(([n, l]) => (
            <div key={l}><dt>{l}</dt><dd><CountUp value={n} start={statsSeen} /></dd></div>
          ))}
        </dl>
      </section>

      <section className="band">
        <SectionHead index="01" kicker="How our drone works" title="Explore the drone, part by part">
          <a className="text-link" href={href("blueprint")}>Open full screen<IconArrowOut /></a>
        </SectionHead>
        <p className="lede bp-lede">Hover any component to see what it does and its spec. Use Explode to separate the assembly, drag to turn it, and fly it with the on-screen sticks.</p>
        <BlueprintEmbed />
        <ol className="mission-steps mission-row">
          {missionSteps.map(([title, text, Icon], i) => (
            <li key={title}>
              <span className="mission-icon"><Icon /></span>
              <div><strong><em>0{i + 1}</em>{title}</strong><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="band">
        <div className="motto-grid">
          <div className="reveal">
            <p className="kicker">Our motto</p>
            <h2 className="motto-quote">“A drone is often preferred for missions that are too <em>dull, dirty, or dangerous</em> for manned aircraft.”</h2>
          </div>
          <div className="reveal">
            <p className="lede">Team AeRoVe of UMIC works on autonomous fixed-wing and multirotor aircraft. With subsystems for Mechatronics, Aerodynamics, Motion Path &amp; Controlling and Perception, the team covers every part of a complete autonomous aerial vehicle.</p>
            <p className="lede">Our focus areas are long-distance outdoor navigation, handling large payloads, interacting with moving frames of reference, and running every computation on board.</p>
          </div>
        </div>
      </section>

      <section className="band">
        <SectionHead index="02" kicker="What we work on" title="Four subsystems, one aircraft">
          <a className="text-link" href={href("systems")}>All systems<IconArrowOut /></a>
        </SectionHead>
        <div className="sys-teaser">
          {architecture.map((s, i) => (
            <a key={s.name} className="sys-tile reveal" style={delay(i * 60)} href={`${href("systems")}#${slugOf(s.name)}`}>
              <img src={s.gallery[0]!.src} alt={s.gallery[0]!.alt} loading="lazy" />
              <span className="sys-tile-copy"><strong>{s.name}</strong><small>{s.kicker}</small></span>
            </a>
          ))}
        </div>
      </section>

      <section className="band">
        <SectionHead index="03" kicker="Competitions" title="Recent results">
          <a className="text-link" href={href("achievements")}>Full record<IconArrowOut /></a>
        </SectionHead>
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
      </section>

      <section className="band">
        <div className="closing reveal">
          <div>
            <h2>Work with us</h2>
            <p>We partner with sponsors, labs and companies on hardware, testing and research. Write to <a href="mailto:teamaerove@gmail.com">teamaerove@gmail.com</a>.</p>
          </div>
          <a className="btn btn-primary" href={href("contact")}>Get in touch<IconArrowOut /></a>
        </div>
      </section>
    </Shell>
  );
}
