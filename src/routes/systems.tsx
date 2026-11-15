import { createFileRoute } from "@tanstack/react-router";

import { Frame, NextPage, PageHero, Shell, delay, initials, useLightbox, useReveal } from "@/components/site/Shell";
import { architecture, groups, photoFor, slugOf } from "@/lib/siteData";
import heroImg from "@/assets/mech-drone-render.png";

export const Route = createFileRoute("/systems")({
  head: () => ({
    meta: [
      { title: "Systems — Team AeRoVe" },
      { name: "description", content: "Mechatronics, Aerodynamics, Motion Path & Controlling and Perception: the four subsystems behind every AeRoVe aircraft." },
      { property: "og:title", content: "Systems — Team AeRoVe" },
    ],
  }),
  component: Systems,
});

function Systems() {
  useReveal();
  const lightbox = useLightbox();

  return (
    <Shell current="systems">
      <PageHero index="01" kicker="System architecture" title={<>The what and how{" "}of the entire system.</>} image={heroImg}
        lede="Every aircraft is the sum of four subsystems that design, simulate and fly together. Structures carry the load, airflow keeps it efficient, control holds the line and vision tells it where to go.">
        <nav className="chip-row" aria-label="Jump to subsystem">
          {architecture.map((s, i) => <a key={s.name} className="chip" href={`#${slugOf(s.name)}`}><span>0{i + 1}</span>{s.name}</a>)}
        </nav>
      </PageHero>

      {architecture.map((s, i) => {
        const team = groups.find((g) => g.title === s.name)?.members ?? [];
        return (
          <section key={s.name} id={slugOf(s.name)} className={`band sys-section ${i % 2 ? "is-flipped" : ""}`}>
            <div className="sys-copy reveal">
              <p className="kicker"><span>0{i + 1}</span>{s.kicker}</p>
              <h2><span className="sys-icon"><s.icon /></span>{s.name}</h2>
              <p className="lede">{s.description}</p>
              <div className="tag-row">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
              {team.length > 0 && (
                <div className="sys-team">
                  <p className="kicker"><span>{String(team.length).padStart(2, "0")}</span>Crew</p>
                  <ul>
                    {team.map((m) => (
                      <li key={m.name} title={`${m.name} · ${m.role}`}>
                        <span className="avatar">{photoFor(m.name) ? <img src={photoFor(m.name)} alt="" loading="lazy" /> : initials(m.name)}</span>
                        <span><strong>{m.name}</strong><small>{m.role}</small></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="sys-gallery">
              {s.gallery.map((g, gi) => (
                <Frame key={g.src} src={g.src} alt={g.alt} className="reveal" onOpen={() => lightbox.open(s.gallery, gi)} />
              ))}
            </div>
            <span className="sys-ghost" aria-hidden="true" style={delay(0)}>0{i + 1}</span>
          </section>
        );
      })}

      <NextPage current="systems" />
      {lightbox.node}
    </Shell>
  );
}
