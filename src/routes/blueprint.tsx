import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BlueprintCanvas, type Telemetry } from "@/components/blueprint/BlueprintCanvas";
import { ControllerPanel, TelemetryHUD } from "@/components/blueprint/ControllerPanel";
import type { Controls } from "@/components/blueprint/BlueprintDrone";
import type { HoverState } from "@/components/blueprint/BlueprintDrone";
import { teamGroups } from "@/data/team";
import { achievements } from "@/data/achievements";
import aeroveLogo from "@/assets/aerove-logo.png";
import umicLogo from "@/assets/umic-logo.png";
import iitbLogo from "@/assets/iitb-logo.png";

export const Route = createFileRoute("/blueprint")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team AeRoVe — Blueprint" },
      {
        name: "description",
        content:
          "Team AeRoVe of UMIC, IIT Bombay — autonomous aerial vehicles, explored as an interactive engineering blueprint.",
      },
      { property: "og:title", content: "Team AeRoVe — Blueprint" },
      {
        property: "og:description",
        content: "An interactive 3D blueprint of an autonomous drone by Team AeRoVe, UMIC, IIT Bombay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: BlueprintPage,
});

const NAV = [
  { href: "#about", label: "About" },
  { href: "#architecture", label: "System Architecture" },
  { href: "#team", label: "Team" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

function BlueprintPage() {
  const controls = useRef<Controls>({ throttle: 0, yaw: 0, pitch: 0, roll: 0 });
  const [exploded, setExploded] = useState(false);
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [telemetry, setTelemetry] = useState<Telemetry>({ alt: 60, speed: 0, heading: 0, rpm: [0.5, 0.5, 0.5, 0.5] });

  return (
    <div className="bp-root">
      {/* Top bar */}
      <header className="bp-topbar">
        <div className="bp-topbar-logos">
          <img src={aeroveLogo} alt="AeRoVe logo" className="bp-logo" />
          <img src={umicLogo} alt="UMIC logo" className="bp-logo" />
          <img src={iitbLogo} alt="IIT Bombay logo" className="bp-logo" />
        </div>
        <button className="bp-burger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /> <span /> <span />
        </button>
      </header>

      {/* Full-screen overlay nav */}
      {menuOpen && (
        <nav className="bp-overlay-nav" aria-label="Site navigation">
          <button className="bp-overlay-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            ×
          </button>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
      )}

      {/* Hero: 3D drone only */}
      <section className="bp-hero">
        <BlueprintCanvas
          controls={controls}
          exploded={exploded}
          hovered={hovered}
          setHovered={setHovered}
          onTelemetry={setTelemetry}
        />
        <TelemetryHUD telemetry={telemetry} />
        <ControllerPanel
          controls={controls}
          telemetry={telemetry}
          exploded={exploded}
          onToggleExploded={() => setExploded((v) => !v)}
          onResetView={() => window.location.reload()}
        />
        {hovered && (
          <div
            className="bp-hover-card"
            style={{
              left: Math.min(hovered.x + 16, window.innerWidth - 260),
              top: Math.max(hovered.y - 70, 8),
            }}
          >
            <b>{hovered.info.label}</b>
            <p>{hovered.info.description}</p>
            <span>{hovered.info.spec}</span>
          </div>
        )}
        <a className="bp-chevron" href="#about" aria-label="Scroll to About">
          ▾
        </a>
      </section>

      {/* About */}
      <section id="about" className="bp-section">
        <p className="bp-label">Our moto</p>
        <blockquote className="bp-quote">
          “A drone is often preferred for missions that are too <em>dull, dirty, or dangerous</em> for manned
          aircraft.”
        </blockquote>
        <div className="bp-stats">
          {[
            ["04", "Subsystems"],
            ["35+", "Members"],
            ["05", "Global titles"],
            ["#4", "World rank"],
          ].map(([n, l]) => (
            <div key={l} className="bp-stat">
              <b>{n}</b>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <p className="bp-body">
          Team AeRoVe of UMIC is on a never-ending pursuit of developing an ultimate system of autonomous fixed-wing
          as well as multirotor aircraft. Incorporating Mechatronics, Aerodynamics, Motion Path &amp; Controlling,
          Machine Learning and Perception, the team covers every aspect of a complete autonomous aerial vehicle.
        </p>
        <p className="bp-body">
          Our purpose is to push the boundaries of autonomous aerial technology and build cutting-edge systems through
          indigenous innovation: long-distance outdoor navigation, manipulation of large objects, interaction with
          moving frames of reference and 100% onboard computation.
        </p>
        <div className="bp-two-col">
          <div>
            <p className="bp-label">Mission</p>
            <p className="bp-body">Indigenous systems for fully autonomous flight.</p>
          </div>
          <div>
            <p className="bp-label">Approach</p>
            <p className="bp-body">Mechanics, airflow, control and vision as one aircraft.</p>
          </div>
        </div>
        <div className="bp-img-slot">Team photo collage — coming soon</div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="bp-section bp-section-alt">
        <h2>The what and how of the entire system.</h2>
        <p className="bp-body">
          A hex-configured mothership carries a daughter drone to the target zone, holds a stable hover while the
          daughter launches from its back, and returns home as the daughter completes the mission, with every stage
          computed on board.
        </p>
        <div className="bp-cards">
          {["Mechatronics", "Aerodynamics", "Motion Path & Controlling", "Perception"].map((t, i) => (
            <div key={t} className="bp-card" tabIndex={0}>
              <span className="bp-card-num">0{i + 1}</span>
              <h3>{t}</h3>
              <div className="bp-img-slot small">Image coming soon</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bp-section">
        <h2>35+ minds. One airspace.</h2>
        {teamGroups.map((g) => (
          <div key={g.title} className="bp-team-group">
            <h3>
              {g.title} <span className="bp-count">{g.members.length}</span>
            </h3>
            <div className="bp-team-grid">
              {g.members.map((m) => (
                <div key={m.name} className="bp-member">
                  <div className="bp-avatar">{m.name[0]}</div>
                  <b>{m.name}</b>
                  <span>{m.role}</span>
                  <div className="bp-member-links">
                    {m.instagram && <a href={m.instagram}>IG</a>}
                    {m.linkedin && <a href={m.linkedin}>in</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Achievements */}
      <section id="achievements" className="bp-section bp-section-alt">
        <h2>Proven in competition.</h2>
        <div className="bp-ach-row">
          {achievements.map((a) => (
            <div key={a.event} className="bp-ach-card">
              <div className="bp-img-slot small">Photo coming soon</div>
              <b>
                {a.event} {a.year}
              </b>
              <span>{a.result}</span>
              <span className="bp-ach-detail">{a.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bp-section">
        <h2>Let’s build what flies next.</h2>
        <p className="bp-body">
          Sponsors, research groups, companies and students: every aircraft we fly starts with a conversation. Reach
          the team directly and we reply within a couple of days.
        </p>
        <div className="bp-chips">
          {["Sponsorship", "Technology collaboration", "Campus visit", "Media & press", "Recruitment"].map((c) => (
            <span key={c} className="bp-chip">
              {c}
            </span>
          ))}
        </div>
        <div className="bp-cards three">
          <a className="bp-card" href="mailto:aerove@umic.iitb.ac.in">
            <h3>Sponsorship &amp; partnerships</h3>
            <p>aerove@umic.iitb.ac.in</p>
          </a>
          <a className="bp-card" href="mailto:aerove@umic.iitb.ac.in?subject=Joining%20Team%20AeRoVe">
            <h3>Join the team</h3>
            <p>Open recruitment each semester</p>
          </a>
          <a
            className="bp-card"
            href="https://maps.google.com/?q=UMIC,+IIT+Bombay,+Powai,+Mumbai+400076"
            target="_blank"
            rel="noreferrer"
          >
            <h3>Find us</h3>
            <p>UMIC, IIT Bombay, Powai, Mumbai 400076</p>
          </a>
        </div>
        <div className="bp-social">
          <a href="https://www.instagram.com/aerove_iitb/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://in.linkedin.com/company/unmesh-mashruwala-innovation-cell-iit-bombay" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bp-footer">
        <img src={aeroveLogo} alt="AeRoVe logo" className="bp-logo" />
        <p>Team AeRoVe · Aerial Robotics Vehicles · UMIC, IIT Bombay</p>
        <div className="bp-social">
          <img src={umicLogo} alt="UMIC logo" className="bp-logo small" />
          <a href="https://www.instagram.com/umic_iitb/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://in.linkedin.com/company/unmesh-mashruwala-innovation-cell-iit-bombay" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
        <p className="bp-motto">“A drone is often preferred for missions that are too dull, dirty, or dangerous for manned aircraft.”</p>
      </footer>
    </div>
  );
}
