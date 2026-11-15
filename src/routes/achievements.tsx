import { createFileRoute } from "@tanstack/react-router";

import { IconTrophy } from "@/components/icons";
import { CountUp, Frame, NextPage, PageHero, Shell, delay, useInView, useLightbox, useReveal } from "@/components/site/Shell";
import { achievementShots, achievements } from "@/lib/siteData";
import heroImg from "@/assets/aerove-3.png";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Team AeRoVe" },
      { name: "description", content: "World titles and podiums: CUASC 2024, Ri4Rover 2024, RoboDrive 2024, UAS Challenge 2023 and ICUAS 2023." },
      { property: "og:title", content: "Achievements — Team AeRoVe" },
    ],
  }),
  component: Achievements,
});

const headline: [string, string][] = [["05", "Global titles & podiums"], ["03", "World #1 finishes"], ["03", "UAS Challenge awards"], ["#4", "RoboDrive world rank"]];
const year = (title: string) => title.match(/\d{4}/)?.[0] ?? "";

function Achievements() {
  useReveal();
  const lightbox = useLightbox();
  const [ref, seen] = useInView<HTMLDivElement>();

  return (
    <Shell current="achievements">
      <PageHero index="04" kicker="World stage" title={<>Proven in<br />competition.</>} image={heroImg}
        lede="From Purdue to the IMechE UAS Challenge and ICRA, AeRoVe's aircraft have been tested against the best student teams in the world — and flown the flag home." />

      <section className="band">
        <div ref={ref} className="stats-row">
          {headline.map(([n, l], i) => (
            <div key={l} className="stat reveal" style={delay(i * 80)}>
              <strong><CountUp value={n} start={seen} /></strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="band">
        <ol className="timeline">
          {achievements.map((a, i) => (
            <li key={a.title} className={`timeline-item reveal ${i % 2 ? "is-flipped" : ""}`}>
              <span className="timeline-dot" aria-hidden="true" />
              <div className="timeline-media"><Frame src={a.photo} alt={`${a.title} — ${a.rank}`} onOpen={() => lightbox.open(achievementShots, i)} /></div>
              <div className="timeline-copy">
                <span className="timeline-year">{year(a.title)}</span>
                <span className="badge"><IconTrophy />{a.rank}</span>
                <h2>{a.title.replace(/\s*\d{4}$/, "")}</h2>
                <p>{a.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <NextPage current="achievements" />
      {lightbox.node}
    </Shell>
  );
}
