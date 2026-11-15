import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Linkedin, MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { IconArrowOut } from "@/components/icons";
import { NextPage, PageHero, Shell, delay, initials, useReveal } from "@/components/site/Shell";
import { groups, photoFor, recruitmentHref } from "@/lib/siteData";
import heroImg from "@/assets/hero-full-squad.jpg";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Team AeRoVe" },
      { name: "description", content: "Meet the 45+ students of Team AeRoVe, IIT Bombay — leadership, management, four engineering subsystems and the business team." },
      { property: "og:title", content: "Team — Team AeRoVe" },
    ],
  }),
  component: Team,
});

const total = groups.reduce((n, g) => n + g.members.length, 0);

function Team() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  useReveal(`${filter}|${query}`);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => filter === "All" || g.title === filter)
      .map((g) => ({ ...g, members: q ? g.members.filter((m) => `${m.name} ${m.role}`.toLowerCase().includes(q)) : g.members }))
      .filter((g) => g.members.length > 0);
  }, [filter, query]);

  return (
    <Shell current="team">
      <PageHero index="03" kicker="The people" title={<>{total} minds.<br />One airspace.</>} image={heroImg}
        lede="Engineers, designers and organisers across every year of study. Find someone by name or role, or browse by subsystem." />

      <section className="band team-band">
        <div className="team-tools">
          <label className="search">
            <Search aria-hidden="true" />
            <input type="search" placeholder="Search by name or role" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search team members" />
          </label>
          <div className="filter-row" role="tablist" aria-label="Filter team by group">
            {["All", ...groups.map((g) => g.title)].map((t) => (
              <button key={t} type="button" role="tab" aria-selected={filter === t} className={`chip ${filter === t ? "is-on" : ""}`} onClick={() => setFilter(t)}>
                {t}<span>{t === "All" ? total : groups.find((g) => g.title === t)?.members.length}</span>
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 && <p className="empty">No one matches “{query}”.</p>}

        {shown.map((group) => (
          <div className="team-group" key={group.title}>
            <div className="team-group-head"><h2>{group.title}</h2><span>{String(group.members.length).padStart(2, "0")}</span></div>
            <div className="member-grid">
              {group.members.map((m, mi) => (
                <article className="member reveal" style={delay((mi % 5) * 50)} key={m.name}>
                  <div className="member-photo">
                    {photoFor(m.name) ? <img src={photoFor(m.name)} alt={m.name} loading="lazy" /> : <span>{initials(m.name)}</span>}
                    <div className="member-socials">
                      {m.instagram && <a href={m.instagram} target="_blank" rel="noreferrer" aria-label={`${m.name} on Instagram`}><Instagram /></a>}
                      {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`}><Linkedin /></a>}
                    </div>
                  </div>
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                </article>
              ))}
            </div>
          </div>
        ))}

        <a className="wide-cta reveal" href={recruitmentHref} target="_blank" rel="noreferrer">
          <span className="wide-cta-icon"><MessageCircle /></span>
          <span><strong>Want to fly with us?</strong><small>Join the AeRoVe recruitment group on WhatsApp</small></span>
          <IconArrowOut className="wide-cta-arrow" />
        </a>
      </section>

      <NextPage current="team" />
    </Shell>
  );
}
