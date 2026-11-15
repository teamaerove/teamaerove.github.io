import { createFileRoute } from "@tanstack/react-router";

import { Drone3D } from "@/components/Drone3D";
import { IconArrowOut, IconBlueprint } from "@/components/icons";
import { Frame, NextPage, PageHero, SectionHead, Shell, delay, href, useLightbox, useReveal } from "@/components/site/Shell";
import { fleet, missionSteps } from "@/lib/siteData";
import heroImg from "@/assets/gallery-vtol-runway.jpg";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet — Team AeRoVe" },
      { name: "description", content: "The aircraft Team AeRoVe flies: a hex mothership with a daughter drone, a fixed-wing VTOL, an air-drop multirotor and a CFD-shaped flying wing." },
      { property: "og:title", content: "Fleet — Team AeRoVe" },
    ],
  }),
  component: Fleet,
});

const specs: [string, string][] = [["Airframe", "Hex-6 + Quad-4"], ["Mission", "Carry · Launch · Recover"], ["Compute", "100% onboard"], ["Vision", "30 FPS depth-fused"]];

function Fleet() {
  useReveal();
  const lightbox = useLightbox();

  return (
    <Shell current="fleet">
      <PageHero index="02" kicker="Our drones" title={<>The aircraft<br />we fly.</>} image={heroImg}
        lede="Multirotors that carry and deploy, fixed wings that cover distance, and a hybrid that does both — each one designed, built and flown by the team." />

      <section className="band">
        <SectionHead index="A" kicker="Flagship" title={<>Mothership &amp;<br />daughter.</>} />
        <div className="flagship">
          <div className="flagship-brief reveal">
            <p className="lede">A hex-configured mothership carries a daughter drone to the target zone, holds a stable hover while the daughter launches from its back, and returns home as the daughter completes the mission — every stage computed on board.</p>
            <dl className="spec-grid">{specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <ol className="mission-steps">
              {missionSteps.map(([title, text, Icon], i) => (
                <li key={title} className="reveal" style={delay(i * 90)}>
                  <span className="mission-icon"><Icon /></span>
                  <div><strong><em>0{i + 1}</em>{title}</strong><p>{text}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <figure className="flagship-model reveal">
            <Drone3D />
            <figcaption>Live flight model · <span className="on-hover">move your cursor to steer</span><span className="on-touch">drag sideways to steer</span></figcaption>
          </figure>
        </div>
        <a href={href("blueprint")} className="blueprint-cta reveal">
          <span className="blueprint-cta-icon"><IconBlueprint /></span>
          <span><strong>Open the 3D blueprint</strong><small>Inspect 40+ components, fly it with on-screen sticks, explode the assembly</small></span>
          <IconArrowOut className="blueprint-cta-arrow" />
        </a>
      </section>

      <section className="band">
        <SectionHead index="B" kicker="Hangar" title={<>Built for<br />every mission.</>} />
        <div className="fleet-grid">
          {fleet.map((d, i) => (
            <article className="fleet-card reveal" style={delay(i * 80)} key={d.name}>
              <Frame src={d.src} alt={d.alt} onOpen={() => lightbox.open(fleet, i)} />
              <div className="fleet-copy">
                <span>{d.kind}</span>
                <h3>{d.name}</h3>
                <p>{d.text}</p>
              </div>
              <span className="fleet-index" aria-hidden="true">0{i + 1}</span>
            </article>
          ))}
        </div>
      </section>

      <NextPage current="fleet" />
      {lightbox.node}
    </Shell>
  );
}
