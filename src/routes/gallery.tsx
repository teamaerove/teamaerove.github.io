import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { IconZoom } from "@/components/icons";
import { NextPage, PageHero, Shell, delay, useLightbox, useReveal } from "@/components/site/Shell";
import { achievements, architecture, gallery, slides, type Shot } from "@/lib/siteData";
import heroImg from "@/assets/gallery-airfield-crew.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Team AeRoVe" },
      { name: "description", content: "Photos from the field, the build bay and the world stage: Team AeRoVe's aircraft, competitions and engineering work." },
      { property: "og:title", content: "Gallery — Team AeRoVe" },
    ],
  }),
  component: Gallery,
});

type Item = Shot & { caption: string; cat: string };
const items: Item[] = [
  ...gallery.map((g) => ({ ...g, cat: "Field" })),
  ...slides.map((s) => ({ src: s.src, alt: s.alt, caption: s.caption, cat: "Team" })),
  ...achievements.map((a) => ({ src: a.photo, alt: `${a.title} — ${a.rank}`, caption: `${a.title} · ${a.rank}`, cat: "Competitions" })),
  ...architecture.flatMap((s) => s.gallery.map((g) => ({ ...g, caption: `${s.name} · ${g.alt}`, cat: "Engineering" }))),
].filter((x, i, arr) => arr.findIndex((y) => y.src === x.src) === i);

const cats = ["All", "Field", "Team", "Competitions", "Engineering"];

function Gallery() {
  const lightbox = useLightbox();
  const [cat, setCat] = useState("All");
  useReveal(cat);
  const shown = cat === "All" ? items : items.filter((x) => x.cat === cat);
  const shots = shown.map(({ src, caption }) => ({ src, alt: caption }));

  return (
    <Shell current="gallery">
      <PageHero index="05" kicker="Gallery" title={<>In the<br />field.</>} image={heroImg}
        lede="Airfields, hangars, simulators and podiums — a look at where the work actually happens." />
      <section className="band">
        <div className="filter-row" role="tablist" aria-label="Filter photos">
          {cats.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={cat === c} className={`chip ${cat === c ? "is-on" : ""}`} onClick={() => setCat(c)}>
              {c}<span>{c === "All" ? items.length : items.filter((x) => x.cat === c).length}</span>
            </button>
          ))}
        </div>
        <div className="masonry">
          {shown.map((g, i) => (
            <button type="button" key={g.src} className="masonry-item reveal" style={delay((i % 3) * 60)} onClick={() => lightbox.open(shots, i)} aria-label={`Enlarge photo: ${g.caption}`}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              <span className="masonry-caption"><em>{g.cat}</em>{g.caption}</span>
              <IconZoom className="masonry-zoom" />
            </button>
          ))}
        </div>
      </section>
      <NextPage current="gallery" />
      {lightbox.node}
    </Shell>
  );
}
