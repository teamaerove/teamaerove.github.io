import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { IconArrowOut, IconLayers, IconTarget, IconTrophy } from "@/components/icons";
import { CineHero } from "@/components/site/CineHero";
import { CountUp, SectionHead, Shell, delay, href, useInView, useReveal } from "@/components/site/Shell";
import { achievements, architecture, recruitmentHref, slugOf, stats } from "@/lib/siteData";

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

function Home() {
  useReveal();
  const [statsRef, statsSeen] = useInView<HTMLDivElement>();

  return (
    <Shell current="" overlayNav>
      <CineHero />

      <section className="band stats-band">
        <div ref={statsRef} className="stats-row">
          {stats.map(([n, l, Icon], i) => (
            <div key={l} className="stat reveal" style={delay(i * 80)}>
              <Icon className="stat-icon" />
              <div><strong><CountUp value={n} start={statsSeen} /></strong><span>{l}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="band motto">
        <div className="motto-grid">
          <div className="reveal">
            <p className="kicker">Our motto</p>
            <h2 className="motto-quote">“A drone is often preferred for missions that are too <em>dull, dirty, or dangerous</em> for manned aircraft.”</h2>
          </div>
          <div className="reveal">
            <p className="lede">Team AeRoVe of UMIC is on a never-ending pursuit of developing an ultimate system of autonomous fixed-wing as well as multirotor aircraft. Incorporating Mechatronics, Aerodynamics, Motion Path &amp; Controlling, Machine Learning and Perception, the team covers every aspect of a complete autonomous aerial vehicle.</p>
            <p className="lede">Our purpose is to push the boundaries of autonomous aerial technology through indigenous innovation — long-distance outdoor navigation, manipulation of large objects, interaction with moving frames of reference and 100% onboard computation.</p>
          </div>
        </div>
        <div className="principles">
          <article className="reveal"><IconTarget className="principle-icon" /><span>Mission</span><h3>Indigenous systems for fully autonomous flight.</h3></article>
          <article className="reveal" style={delay(90)}><IconLayers className="principle-icon" /><span>Approach</span><h3>Mechanics, airflow, control and vision as one aircraft.</h3></article>
        </div>
      </section>

      <section className="band">
        <SectionHead index="02" kicker="System architecture" title={<>Four subsystems.{" "}One aircraft.</>}>
          <a className="text-link" href={href("systems")}>All systems<IconArrowOut /></a>
        </SectionHead>
        <div className="sys-teaser">
          {architecture.map((s, i) => (
            <a key={s.name} className="sys-tile reveal" style={delay(i * 70)} href={`${href("systems")}#${slugOf(s.name)}`}>
              <img src={s.gallery[0]!.src} alt={s.gallery[0]!.alt} loading="lazy" />
              <span className="sys-tile-index">0{i + 1}</span>
              <span className="sys-tile-badge"><s.icon /></span>
              <span className="sys-tile-copy"><small>{s.kicker}</small><strong>{s.name}</strong></span>
              <IconArrowOut className="sys-tile-arrow" />
            </a>
          ))}
        </div>
      </section>

      <section className="band record">
        <SectionHead index="03" kicker="World stage" title={<>Proven in{" "}competition.</>}>
          <a className="text-link" href={href("achievements")}>Full record<IconArrowOut /></a>
        </SectionHead>
        <div className="marquee" aria-label="Competition record">
          <div className="marquee-track">
            {[...achievements, ...achievements].map((a, i) => (
              <a key={i} className="marquee-item" href={href("achievements")} aria-hidden={i >= achievements.length ? true : undefined} tabIndex={i >= achievements.length ? -1 : undefined}>
                <img src={a.photo} alt="" loading="lazy" />
                <span><IconTrophy /><b>{a.rank}</b>{a.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <a className="mega-cta reveal" href={recruitmentHref} target="_blank" rel="noreferrer">
          <span className="kicker"><span>04</span>Recruitment</span>
          <strong>Want to fly{" "}with us?</strong>
          <span className="mega-cta-sub"><MessageCircle />Join the AeRoVe recruitment group on WhatsApp<IconArrowOut /></span>
        </a>
      </section>
    </Shell>
  );
}
