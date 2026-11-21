import { ChevronLeft, ChevronRight, Instagram, Linkedin, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { IconArrowOut, IconChevronUp, IconZoom } from "@/components/icons";
import type { Shot } from "@/lib/siteData";
import aeroveLogo from "@/assets/aerove-logo.png";
import umicLogo from "@/assets/umic-logo.png";
import iitbLogo from "@/assets/iitb-logo.svg";

/**
 * Pages are prerendered separately and linked with plain anchors (full page
 * loads): keeps three.js out of pages that don't need it and sidesteps a
 * router scroll-restoration bug between prerendered pages. Cross-document
 * view transitions (styles.css) smooth the hand-off.
 */
export const href = (path = "") => `${import.meta.env.BASE_URL}${path ? `${path}/` : ""}`;

export const pages = [
  { id: "", label: "Home", blurb: "The flight film" },
  { id: "systems", label: "Systems", blurb: "Four subsystems, one aircraft" },
  { id: "fleet", label: "Fleet", blurb: "The aircraft we fly" },
  { id: "team", label: "Team", blurb: "45+ minds, one airspace" },
  { id: "achievements", label: "Achievements", blurb: "Proven in competition" },
  { id: "gallery", label: "Gallery", blurb: "In the field" },
  { id: "contact", label: "Contact", blurb: "Build what flies next" },
] as const;
export type PageId = (typeof pages)[number]["id"];

/** Stagger offset for the scroll-reveal animation. */
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2);
}

/** Fades `.reveal` elements in as they scroll into view; content stays visible without JS. */
export function useReveal(dep?: unknown) {
  useEffect(() => {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

/** Counts a stat like "45+" or "#4" up from zero once `start` flips true. */
export function CountUp({ value, start = true }: { value: string; start?: boolean }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const target = match ? Number(match[2]) : 0;
  const width = match?.[2]?.length ?? 0;
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!start || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    setN(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!match) return <>{value}</>;
  return <>{match[1]}{String(n).padStart(width, "0")}{match[3]}</>;
}

/** Flips true the first time the referenced element scrolls into view. */
export function useInView<T extends Element>() {
  const [el, setEl] = useState<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [el, seen]);
  return [setEl, seen] as const;
}

/* Lightbox ------------------------------------------------------------ */
export function useLightbox() {
  const [set, setSet] = useState<{ list: Shot[]; i: number } | null>(null);
  const open = useCallback((list: Shot[], i = 0) => setSet({ list, i }), []);
  const close = useCallback(() => setSet(null), []);
  const stepBy = useCallback((d: number) => setSet((s) => (s ? { ...s, i: (s.i + d + s.list.length) % s.list.length } : s)), []);

  useEffect(() => {
    if (!set) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") stepBy(1);
      if (e.key === "ArrowLeft") stepBy(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [set, close, stepBy]);

  const shot = set ? set.list[set.i] : null;
  const node = shot && set ? (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={shot.alt} onMouseDown={(e) => { if (e.currentTarget === e.target) close(); }}>
      <button type="button" className="icon-btn lightbox-close" onClick={close} aria-label="Close image" autoFocus><X /></button>
      {set.list.length > 1 && <>
        <button type="button" className="icon-btn lightbox-step prev" onClick={() => stepBy(-1)} aria-label="Previous image"><ChevronLeft /></button>
        <button type="button" className="icon-btn lightbox-step next" onClick={() => stepBy(1)} aria-label="Next image"><ChevronRight /></button>
      </>}
      <figure>
        <img src={shot.src} alt={shot.alt} />
        <figcaption>{shot.alt}{set.list.length > 1 && <span className="lightbox-count">{set.i + 1} / {set.list.length}</span>}</figcaption>
      </figure>
    </div>
  ) : null;
  return { open, node };
}

/** Photo tile; becomes a zoom button when `onOpen` is given. */
export function Frame({ src, alt, onOpen, className = "" }: { src: string; alt: string; onOpen?: () => void; className?: string }) {
  const img = <img src={src} alt={alt} loading="lazy" />;
  return onOpen
    ? <button type="button" className={`frame frame-zoom ${className}`} onClick={onOpen} aria-label={`Enlarge: ${alt}`}>{img}<IconZoom className="frame-zoom-icon" /></button>
    : <div className={`frame ${className}`}>{img}</div>;
}

/* Section heading ------------------------------------------------------ */
export function SectionHead({ index, kicker, title, children }: { index: string; kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="section-head reveal">
      <p className="kicker"><span>{index}</span>{kicker}</p>
      <h2>{title}</h2>
      {children && <div className="section-head-aside">{children}</div>}
    </div>
  );
}

/* Inner-page hero ------------------------------------------------------ */
export function PageHero({ index, kicker, title, lede, image, children }: { index: string; kicker: string; title: ReactNode; lede: string; image?: string; children?: ReactNode }) {
  return (
    <header className={`page-hero ${image ? "has-image" : ""}`}>
      <div className="page-hero-inner">
        <p className="hero-eyebrow" data-index={index}>{kicker}</p>
        <h1>{title}</h1>
        <p className="page-hero-lede">{lede}</p>
        {children}
      </div>
      {image && <div className="page-hero-media"><img src={image} alt="" fetchPriority="high" /></div>}
    </header>
  );
}

/** "Next page" band at the bottom of each inner page. */
export function NextPage({ current }: { current: PageId }) {
  const i = pages.findIndex((p) => p.id === current);
  const next = pages[(i + 1) % pages.length]!;
  return (
    <a className="next-page" href={href(next.id)}>
      <span className="kicker"><span>Next</span>{next.blurb}</span>
      <strong>{next.label}<IconArrowOut /></strong>
    </a>
  );
}

/* Shell: nav, footer, progress, back-to-top ---------------------------- */
export function Shell({ current, children, overlayNav = false }: { current: PageId | "404"; children: ReactNode; overlayNav?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  return (
    <div className={`site ${overlayNav ? "nav-overlay" : ""}`}>
      <a className="skip-link" href="#content">Skip to content</a>

      <nav className={`site-nav ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-menu" : ""}`} aria-label="Primary">
        <div className="nav-brands">
          <img className="nav-umic" src={umicLogo} alt="UMIC" />
          <a className="wordmark" href={href()} aria-label="Team AeRoVe home"><img src={aeroveLogo} alt="AeRoVe" /></a>
        </div>
        <div className="nav-links">
          {pages.slice(1).map((p) => <a key={p.id} href={href(p.id)} className={current === p.id ? "is-current" : ""} aria-current={current === p.id ? "page" : undefined}>{p.label}</a>)}
        </div>
        <div className="nav-end">
          <a className="btn btn-primary nav-cta" href={href("contact")}>Contact us</a>
          <img className="nav-iitb" src={iitbLogo} alt="IIT Bombay" />
          <button type="button" className="icon-btn menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        <span className="nav-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </nav>

      <div className={`mobile-nav ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        {pages.map((p, i) => (
          <a key={p.id} href={href(p.id)} tabIndex={menuOpen ? 0 : -1} style={{ transitionDelay: menuOpen ? `${60 + i * 45}ms` : "0ms" }} className={current === p.id ? "is-current" : ""}>
            <span>0{i}</span>{p.label}<small>{p.blurb}</small>
          </a>
        ))}
      </div>

      <main id="content">{children}</main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={aeroveLogo} alt="AeRoVe" />
            <p>Aerial Robotics Vehicles. Students of IIT Bombay building aircraft that see, decide and fly on their own.</p>
            <div className="footer-logos"><img src={umicLogo} alt="UMIC" /><img src={iitbLogo} alt="IIT Bombay" /></div>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            {pages.slice(1, 4).map((p) => <a key={p.id} href={href(p.id)}>{p.label}</a>)}
            <a href={href("blueprint")}>3D Blueprint</a>
          </div>
          <div className="footer-col">
            <h3>Team</h3>
            {pages.slice(4).map((p) => <a key={p.id} href={href(p.id)}>{p.label}</a>)}
          </div>
          <div className="footer-col">
            <h3>Reach us</h3>
            <a href="mailto:teamaerove@gmail.com">teamaerove@gmail.com</a>
            <a href="https://maps.google.com/?q=Desai+Sethi+School+of+Entrepreneurship+IIT+Bombay" target="_blank" rel="noreferrer">Desai Sethi School of Entrepreneurship, IIT Bombay</a>
            <div className="footer-socials">
              <a href="https://www.instagram.com/aerove_iitb/" target="_blank" rel="noreferrer" aria-label="Team AeRoVe on Instagram"><Instagram /></a>
              <a href="https://www.instagram.com/umic_iitb/" target="_blank" rel="noreferrer" aria-label="UMIC on Instagram"><Instagram /></a>
              <a href="https://in.linkedin.com/company/unmesh-mashruwala-innovation-cell-iit-bombay" target="_blank" rel="noreferrer" aria-label="UMIC on LinkedIn"><Linkedin /></a>
            </div>
          </div>
        </div>
        <p className="footer-giant" aria-hidden="true">AeRoVe</p>
        <div className="footer-base">
          <span>Team AeRoVe · UMIC · IIT Bombay</span>
          <span>Dull, dirty, dangerous — we fly it.</span>
        </div>
      </footer>

      <a className={`back-to-top ${progress > 0.12 ? "is-shown" : ""}`} href="#content" aria-label="Back to top" tabIndex={progress > 0.12 ? 0 : -1}><IconChevronUp /></a>
    </div>
  );
}
