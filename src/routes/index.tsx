import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Instagram, Linkedin, Mail, MapPin, Maximize2, Menu, Send, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { MicroDrone } from "@/components/MicroDrone";
import { Button } from "@/components/ui/button";
import shot1 from "@/assets/aerove-5.png";
import shot2 from "@/assets/aerove-3.png";
import shot3 from "@/assets/aerove-2.png";
import shot4 from "@/assets/aerove-4.png";

import mechRender from "@/assets/mech-drone-render.png";
import mechAssembly from "@/assets/mech-assembly.png";
import mechFea from "@/assets/mech-shear-strain-fea.png";
import aeroWing from "@/assets/aero-flying-wing.png";
import aeroAirflow from "@/assets/aero-airflow-quadcopter.png";
import aeroCfd from "@/assets/aero-airfoil-cfd.png";
import motionPath from "@/assets/motion-path-planning-sim.png";
import motionMap from "@/assets/motion-occupancy-map.png";
import motionDynamics from "@/assets/motion-dynamics-model.png";
import perceptionFeature from "@/assets/perception-feature-detection.png";
import perceptionCrack from "@/assets/perception-crack-detection.png";
import perceptionAr from "@/assets/perception-ar-simulation.png";

import aeroveLogo from "@/assets/aerove-logo.png";
import umicLogo from "@/assets/umic-logo.png";
import iitbLogo from "@/assets/iitb-logo.png";
import cuascPhoto from "@/assets/cuasc-2024.png";
import roverPhoto from "@/assets/ri4rover-2024.png";
import roboTitle from "@/assets/robodrive-title.png";
import roboCollage from "@/assets/robodrive-collage.png";
import vijayPhoto from "@/assets/vijay-patekar.png";
import dhruvPhoto from "@/assets/dhruv-jadhav.png";
import uasPhoto from "@/assets/uas-challenge-2023.png";
import icuasPhoto from "@/assets/icuas-2023.png";


import team0 from "@/assets/AaravGupta.jpg";
import team1 from "@/assets/Abha.jpeg";
import team2 from "@/assets/AfnanAhmed.jpg";
import team3 from "@/assets/ArpitKumar.jpg";
import team4 from "@/assets/Basant.jpeg";
import team5 from "@/assets/BhavyaPatel.jpeg";
import team6 from "@/assets/Cheriyan.jpg";
import team7 from "@/assets/DakshSawke.jpg";
import team8 from "@/assets/Devangi.jpeg";
import team10 from "@/assets/Divyansh.jpeg";
import team11 from "@/assets/Durva.jpg";
import team12 from "@/assets/Gaurav.jpeg";
import team13 from "@/assets/Harsh.jpeg";
import team14 from "@/assets/Krutarth.jpeg";
import team15 from "@/assets/Manav.jpeg";
import team16 from "@/assets/Naman.jpeg";
import team17 from "@/assets/Narendra.jpeg";
import team18 from "@/assets/NavinyaDesai.jpg";
import team19 from "@/assets/Nipun.jpg";
import team20 from "@/assets/Nishit.png";
import team21 from "@/assets/ParthIngle.jpeg";
import team22 from "@/assets/ParthLohiya.jpeg";
import team23 from "@/assets/ParthRane.jpeg";
import team24 from "@/assets/Premansh.jpg";
import team25 from "@/assets/RaunakRaj.jpg";
import team26 from "@/assets/Rohan.jpeg";
import team27 from "@/assets/Sambhav.png";
import team28 from "@/assets/Satyam.webp";
import team29 from "@/assets/Shreeya.jpeg";
import team30 from "@/assets/Tathagata.png";
import team31 from "@/assets/Vidit.jpeg";
import team32 from "@/assets/VipulBansal.jpeg";

const memberPhotos: Record<string, string> = {
  AaravGupta: team0,
  Abha: team1,
  AfnanAhmed: team2,
  ArpitKumar: team3,
  Basant: team4,
  BhavyaPatel: team5,
  Cheriyan: team6,
  DakshSawke: team7,
  Devangi: team8,
  DhruvJadhav: dhruvPhoto,
  VijayPatekar: vijayPhoto,
  Divyansh: team10,
  Durva: team11,
  Gaurav: team12,
  Harsh: team13,
  Krutarth: team14,
  Manav: team15,
  Naman: team16,
  Narendra: team17,
  NavinyaDesai: team18,
  Nipun: team19,
  Nishit: team20,
  ParthIngle: team21,
  ParthLohiya: team22,
  ParthRane: team23,
  Premansh: team24,
  RaunakRaj: team25,
  Rohan: team26,
  Sambhav: team27,
  Satyam: team28,
  Shreeya: team29,
  Tathagata: team30,
  Vidit: team31,
  VipulBansal: team32,
};

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
  component: Index,
});

type Shot = { src: string; alt: string };
type Subsystem = { name: string; kicker: string; description: string; tags: string[]; gallery: Shot[] };
type Member = { name: string; role: string; instagram?: string; linkedin?: string };
const photoFor = (name: string) => memberPhotos[name.replace(/[^A-Za-z0-9]/g, "")];

const slides = [
  { src: shot1, alt: "Team AeRoVe assembled on the flight line with their multirotor aircraft", caption: "The full squad · IIT Bombay flight line" },
  { src: shot2, alt: "AeRoVe members holding the Indian flag beside their competition trophies", caption: "Flying the flag on the world stage" },
  { src: shot3, alt: "AeRoVe engineers preparing an aircraft inside the competition hangar", caption: "Build bay · pre-flight scrutineering" },
  { src: shot4, alt: "Three UAS Challenge trophies won by Team AeRoVe", caption: "UAS Challenge · three awards, one mission" },
];

const architecture: Subsystem[] = [
  {
    name: "Mechatronics",
    kicker: "Structure / Hardware",
    description:
      "From CAD and structural analysis to carbon-fibre layups, the hex-configured mothership and its daughter drone are built to carry, deploy and recover payloads in flight. Gripper mechanisms, power distribution and flight-ready wiring are all designed and validated in house before a single motor spins.",
    tags: ["CAD", "FEA", "Carbon composite", "Gripper"],
    gallery: [
      { src: mechRender, alt: "CAD render of the AeRoVe multirotor airframe" },
      { src: mechAssembly, alt: "Exploded assembly view of the drone structure" },
      { src: mechFea, alt: "Shear strain finite element analysis of an airframe part" },
    ],
  },
  {
    name: "Aerodynamics",
    kicker: "Airflow / Efficiency",
    description:
      "Airfoil selection, flying-wing planforms and rotor downwash are studied with computational fluid dynamics so every aircraft carries more, flies longer and stays stable in gusty outdoor conditions. Simulation results drive the geometry that the structures team then builds.",
    tags: ["CFD", "Airfoil design", "Flying wing", "Rotor downwash"],
    gallery: [
      { src: aeroCfd, alt: "CFD pressure contours over an airfoil section" },
      { src: aeroAirflow, alt: "Airflow simulation around a quadcopter" },
      { src: aeroWing, alt: "Flying wing aircraft configuration" },
    ],
  },
  {
    name: "Motion Path & Controlling",
    kicker: "Planning / Flight stack",
    description:
      "Motion Path & Controlling, the MPC subsystem, plans where the aircraft goes and holds it there. Occupancy mapping turns sensor data into a navigable world, path planners find collision-free trajectories through it, and dynamic models with tuned controllers track those trajectories on the PX4 flight stack in Gazebo simulation before every real flight.",
    tags: ["Path planning", "Occupancy mapping", "PX4 SITL", "PID tuning"],
    gallery: [
      { src: motionPath, alt: "Path planning simulation for an autonomous drone" },
      { src: motionMap, alt: "Occupancy map built from onboard sensors" },
      { src: motionDynamics, alt: "Dynamics model used for flight control" },
    ],
  },
  {
    name: "Perception",
    kicker: "Vision / Intelligence",
    description:
      "Learning-based vision finds the target in camera data and computes its 3D position in the ground frame using depth. Feature detection handles visual localisation, defect and crack detection drives inspection missions, and augmented-reality simulation lets every model be validated before it flies — all at 30 frames per second on board.",
    tags: ["Feature detection", "Crack detection", "Depth fusion", "30 FPS onboard"],
    gallery: [
      { src: perceptionFeature, alt: "Visual feature detection on a camera frame" },
      { src: perceptionCrack, alt: "Automated crack detection on an inspected surface" },
      { src: perceptionAr, alt: "Augmented reality simulation for perception testing" },
    ],
  },
];

const groups: { title: string; members: Member[] }[] = [
  { title: "Leadership", members: [
    { name: "Manav", role: "Overall Coordinator", instagram: "https://www.instagram.com/_manav_1405__/", linkedin: "https://www.linkedin.com/in/manav-parmar-675544293/" },
    { name: "Rohan", role: "Team Lead", instagram: "https://www.instagram.com/rohanjoshi_2105/", linkedin: "https://www.linkedin.com/in/rohan-joshi-845a16330/" },
    { name: "Daksh Sawke", role: "Team Lead", linkedin: "https://www.linkedin.com/in/daksh-sawke" },
  ]},
  { title: "Management", members: [
    { name: "Nishit", role: "Manager", instagram: "https://www.instagram.com/nishitdharamshi", linkedin: "https://www.linkedin.com/in/nishit-dharamshi-31886333a" },
    { name: "Premansh", role: "Manager", instagram: "https://www.instagram.com/43premansh", linkedin: "https://www.linkedin.com/in/43premansh" },
    { name: "Vijay Patekar", role: "Manager", linkedin: "https://www.linkedin.com/in/vijay-patekar-91598b372?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { name: "Dhruv Jadhav", role: "Manager", instagram: "https://www.instagram.com/dhruv_jadhav_45", linkedin: "https://www.linkedin.com/in/dhruv-jadhav-b95407318/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BbdAY%2F%2FqbTgqqQJKShuYlVg%3D%3D" },
  ]},
  { title: "Subsystem Leads", members: [
    { name: "Sambhav", role: "Mechatronics Lead", instagram: "https://www.instagram.com/polestar2025", linkedin: "https://www.linkedin.com/in/sambhav-jha-22445b262" },
    { name: "Nipun", role: "Mechatronics Lead", instagram: "https://www.instagram.com/nipun.nistane", linkedin: "https://www.linkedin.com/in/nipun-nistane-7a0bb5312" },
    { name: "Durva", role: "Aerodynamics Lead", instagram: "https://www.instagram.com/dpg_1937", linkedin: "https://www.linkedin.com/in/durva-gandharva-164405388" },
    { name: "Arpit Kumar", role: "Motion Path & Controlling Lead" },
    { name: "Narendra", role: "Perception Lead", instagram: "https://www.instagram.com/n_r_ndr_/", linkedin: "https://www.linkedin.com/in/narendra-aironi/" },
    { name: "Aarav Gupta", role: "Perception Lead", linkedin: "https://www.linkedin.com/in/aarav-gupta-128282202/" },
  ]},
  { title: "Senior Engineers", members: [
    { name: "Basant", role: "Motion Path & Controlling" }, { name: "Naman", role: "Motion Path & Controlling" }, { name: "Krutarth", role: "Motion Path & Controlling" },
    { name: "Devangi", role: "Aerodynamics", instagram: "https://www.instagram.com/devi.lilvelcro", linkedin: "https://www.linkedin.com/in/devangi-chaudhuri-0a584b242/" },
  ]},
  { title: "Junior Engineers", members: [
    { name: "Vipul Bansal", role: "Motion Path & Controlling", instagram: "https://www.instagram.com/_vipul_957_/", linkedin: "https://www.linkedin.com/in/vipul-bansal-8b1344289" },
    { name: "Abha", role: "Motion Path & Controlling", instagram: "https://www.instagram.com/abhas_2007/", linkedin: "https://www.linkedin.com/in/abha-shelke-835430390/" },
    { name: "Cheriyan", role: "Perception", linkedin: "https://www.linkedin.com/in/cheriyanr200779" }, { name: "Vidit", role: "Perception", linkedin: "https://www.linkedin.com/in/vidit-nagpurkar/" },
    { name: "Afnan Ahmed", role: "Phase 2", instagram: "https://www.instagram.com/afnanahmed450", linkedin: "https://www.linkedin.com/in/afnan-ahmed-449680374" },
    { name: "Tathagata", role: "Phase 2", linkedin: "https://www.linkedin.com/in/tathagata-roy-0a1b1a20a" },
    { name: "Bhavya Patel", role: "Phase 2", instagram: "https://www.instagram.com/_.bhavya.patel_", linkedin: "https://www.linkedin.com/in/bhavya-patel-64014b377/" },
    { name: "Shreeya", role: "Phase 2", instagram: "https://www.instagram.com/nair_shreeya/", linkedin: "https://www.linkedin.com/in/shreeya-nair-780a63417" },
    { name: "Parth Rane", role: "Phase 2", instagram: "https://www.instagram.com/parthrane4/", linkedin: "https://www.linkedin.com/in/parth-rane-982622372/" },
    { name: "Raunak Raj", role: "Phase 2", instagram: "https://www.instagram.com/__newton_raunak", linkedin: "https://www.linkedin.com/in/raunak-raj-89888a313" },
    { name: "Gaurav", role: "Phase 2", instagram: "https://www.instagram.com/gaurav.m_08/", linkedin: "https://www.linkedin.com/in/gaurav-maharana-377453418" },
    { name: "Parth Lohiya", role: "Phase 2", instagram: "https://www.instagram.com/lohiya_parth/", linkedin: "https://www.linkedin.com/in/parthlohiya" },
  ]},
  { title: "Business Team", members: [
    { name: "Satyam", role: "Finance & Logistics", instagram: "https://www.instagram.com/satyamyeola/", linkedin: "https://www.linkedin.com/in/satyamyeola/" },
    { name: "Divyansh", role: "Finance & Logistics", instagram: "https://www.instagram.com/divyansh.singh_38", linkedin: "https://www.linkedin.com/in/divyansh-singh-788491393" },
    { name: "Navinya Desai", role: "Finance & Logistics", instagram: "https://www.instagram.com/navinya_27", linkedin: "https://www.linkedin.com/in/navinya-desai-a76086376" },
    { name: "Parth Ingle", role: "Media & PR", instagram: "https://www.instagram.com/_parth_i7_/", linkedin: "https://www.linkedin.com/in/parth-ingle-84961a374/" },
    { name: "Harsh", role: "Web Developer", instagram: "https://www.instagram.com/harsh_.prjpt/", linkedin: "https://www.linkedin.com/in/harsh-prajapat-a39341386/" },
  ]},
];

const achievements = [
  { title: "CUASC 2024", rank: "World Champions", detail: "Design & Innovation Award", badge: "01", photo: cuascPhoto },
  { title: "Ri4Rover 2024", rank: "World Champions", detail: "Purdue University", badge: "01", photo: roverPhoto },
  { title: "RoboDrive 2024", rank: "Global #4", detail: "1st nationally · ICRA", badge: "04", photo: roboTitle },
  { title: "UAS Challenge 2023", rank: "Triple award", detail: "Advancement · Design · Scrutineers", badge: "03", photo: uasPhoto },
  { title: "ICUAS 2023", rank: "World #1", detail: "Simulation · Hardware #3", badge: "01", photo: icuasPhoto },
];

const contactRoutes = [
  { label: "Sponsorship & partnerships", value: "aerove@umic.iitb.ac.in", href: "mailto:aerove@umic.iitb.ac.in", icon: Mail },
  { label: "Join the team", value: "Open recruitment each semester", href: "mailto:aerove@umic.iitb.ac.in?subject=Joining%20Team%20AeRoVe", icon: Send },
  { label: "Find us", value: "UMIC, IIT Bombay, Powai, Mumbai 400076", href: "https://maps.google.com/?q=UMIC+IIT+Bombay+Powai", icon: MapPin },
];

const enquiryTags = ["Sponsorship", "Technology collaboration", "Campus visit", "Media & press", "Recruitment"];

function Frame({ src, alt, label, compact = false, onOpen }: { src?: string | null; alt?: string; label: string; compact?: boolean; onOpen?: () => void }) {
  const img = src ? <img src={src} alt={alt ?? label} loading="lazy" /> : <div className="frame-empty"><span>{label}</span></div>;
  return (
    <div className={`frame ${compact ? "frame-compact" : ""}`}>
      {onOpen && src ? <button type="button" className="frame-zoom" onClick={onOpen} aria-label={`Enlarge: ${alt ?? label}`}>{img}<Maximize2 className="frame-zoom-icon" /></button> : img}
      <i className="frame-glow" />
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2);
}

/** Stagger offset for the scroll-reveal animation. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** Counts a stat like "35+" or "#4" up from zero once it scrolls into view. */
function CountUp({ value, start }: { value: string; start: boolean }) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const target = match ? Number(match[2]) : 0;
  const width = match?.[2]?.length ?? 0;
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!start || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1200);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    setN(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!match) return <>{value}</>;
  return <>{match[1]}{String(n).padStart(width, "0")}{match[3]}</>;
}

const nav = ["about", "architecture", "team", "achievements", "contact"];
const label = (item: string) => (item === "architecture" ? "System Architecture" : item === "contact" ? "Contact us" : item);
const stats = [["04", "Subsystems"], ["35+", "Members"], ["05", "Global titles"], ["#4", "World rank"]] as const;

function Index() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx === null ? null : architecture[activeIdx] ?? null;
  const [lightbox, setLightbox] = useState<Shot | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [booted, setBooted] = useState(false);
  const [skipBoot, setSkipBoot] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState("");
  const [teamFilter, setTeamFilter] = useState("All");
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const overlayOpen = !!active || !!lightbox || menuOpen;

  // Lock page scroll behind the modal, lightbox and mobile menu.
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlayOpen]);

  // Boot intro plays once per browser session.
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("aerove-booted") === "1"; sessionStorage.setItem("aerove-booted", "1"); } catch { /* storage unavailable */ }
    if (seen) { setSkipBoot(true); setBooted(true); return; }
    const boot = window.setTimeout(() => setBooted(true), 1000);
    return () => window.clearTimeout(boot);
  }, []);

  // Slideshow pauses on hover and while the tab is hidden.
  useEffect(() => {
    if (paused) return;
    const loop = window.setInterval(() => { if (!document.hidden) setSlide((s) => (s + 1) % slides.length); }, 5000);
    return () => window.clearInterval(loop);
  }, [paused]);

  // Nav state, reading progress and back-to-top.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav link of the section in view.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setSection(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    nav.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Fade elements in as they scroll into view; content stays visible without JS.
  useEffect(() => {
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [teamFilter]);

  // Keyboard: Esc closes overlays, arrows step through subsystems / slides.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (lightbox) setLightbox(null); else if (active) setActiveIdx(null); else setMenuOpen(false); return; }
      if (lightbox) return;
      if (activeIdx !== null && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        const d = e.key === "ArrowRight" ? 1 : -1;
        setActiveIdx((i) => (i === null ? i : (i + d + architecture.length) % architecture.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, active, lightbox]);

  // Move focus into the dialog, and back to the trigger when it closes.
  useEffect(() => {
    if (active) { if (!lastFocus.current) lastFocus.current = document.activeElement as HTMLElement; closeRef.current?.focus(); }
    else if (lastFocus.current) { lastFocus.current.focus(); lastFocus.current = null; }
  }, [active]);

  const step = (d: number) => setActiveIdx((i) => (i === null ? i : (i + d + architecture.length) % architecture.length));
  const teamTabs = ["All", ...groups.map((g) => g.title)];
  const shownGroups = teamFilter === "All" ? groups : groups.filter((g) => g.title === teamFilter);

  return <main className="site-shell">
    <a className="skip-link" href="#about">Skip to content</a>
    <MicroDrone />

    <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Primary">
      <div className="nav-brands"><a href="#top" aria-label="UMIC home"><img className="nav-umic" src={umicLogo} alt="UMIC" /></a><a className="wordmark" href="#top" aria-label="Team AeRoVe home"><img src={aeroveLogo} alt="AeRoVe" /></a></div>
      <div className="nav-links">{nav.map((item) => <a key={item} href={`#${item}`} className={section === item ? "is-current" : ""} aria-current={section === item ? "location" : undefined}>{label(item)}</a>)}</div>
      <img className="nav-iitb" src={iitbLogo} alt="IIT Bombay" />
      <Button variant="ghost" size="icon" className="menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      <span className="nav-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
    </nav>
    <div className={`mobile-nav ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
      {nav.map((item, i) => <a key={item} href={`#${item}`} tabIndex={menuOpen ? 0 : -1} style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : "0ms" }} className={section === item ? "is-current" : ""} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{label(item)}</a>)}
    </div>

    <header id="top" className={`hero-section ${booted ? "is-booted" : ""} ${skipBoot ? "skip-boot" : ""}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero-stage">
        <div className="hero-slides">
          {slides.map((s, i) => (
            <figure key={s.src} className={`hero-slide ${i === slide ? "is-active" : ""}`} aria-hidden={i === slide ? undefined : true}>
              <img src={s.src} alt={s.alt} fetchPriority={i === 0 ? "high" : undefined} />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
          <div className="hero-veil" />
        </div>
      </div>

      <div className="boot-screen" aria-hidden="true">
        <span className="boot-line">SYSTEM ONLINE</span>
        <span className="boot-bar" />
      </div>

      <div className="hero-copy">
        <h1>TEAM AEROVE</h1>
        <p className="hero-expansion">AERIAL ROBOTICS VEHICLES</p>
      </div>

      <div className="hero-dots">{slides.map((s, i) => <Button key={s.src} variant="ghost" size="icon" className={i === slide ? "is-on" : ""} onClick={() => setSlide(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={i === slide} />)}</div>

      <div className="hero-stats">{stats.map(([n, l]) => <div key={l}><strong><CountUp value={n} start={booted} /></strong><span>{l}</span></div>)}</div>
      <a className="scroll-cue" href="#about"><ChevronDown /><span>Explore</span></a>
    </header>

    <section id="about" className="about-section">
      <div className="section-marker reveal"><span>01</span><p>Our motto</p></div>
      <div className="about-statement reveal">
        <h2>“A drone is often preferred for missions that are too <em>dull, dirty, or dangerous</em> for manned aircraft.”</h2>
        <p>Team AeRoVe of UMIC is on a never-ending pursuit of developing an ultimate system of autonomous fixed-wing as well as multirotor aircraft. Incorporating Mechatronics, Aerodynamics, Motion Path &amp; Controlling, Machine Learning and Perception, the team covers every aspect of a complete autonomous aerial vehicle.</p>
        <p>Our purpose is to push the boundaries of autonomous aerial technology and build cutting-edge systems through indigenous innovation — long-distance outdoor navigation, manipulation of large objects, interaction with moving frames of reference and 100% onboard computation.</p>
      </div>
      <div className="about-visual reveal"><Frame src={roboCollage} alt="RoboDrive 2024 team, aircraft, award ceremony and engineering work" label="Team AeRoVe at RoboDrive" onOpen={() => setLightbox({ src: roboCollage, alt: "RoboDrive 2024 team, aircraft, award ceremony and engineering work" })} /></div>
      <div className="principles reveal">
        <article><span>Mission</span><h3>Indigenous systems for fully autonomous flight.</h3></article>
        <article><span>Approach</span><h3>Mechanics, airflow, control and vision as one aircraft.</h3></article>
      </div>
    </section>

    <section id="architecture" className="work-section">
      <div className="section-intro light reveal"><div className="section-marker"><span>02</span><p>System architecture</p></div><h2>The what and how<br/>of the entire system.</h2></div>
      <p className="arch-lede reveal">A hex-configured mothership carries a daughter drone to the target zone, holds a stable hover while the daughter launches from its back, and returns home as the daughter completes the mission — every stage computed on board.</p>
      <div className="subsystem-grid">{architecture.map((s, i) => (
        <Button variant="ghost" className="subsystem-card reveal" style={delay(i * 70)} key={s.name} onClick={() => setActiveIdx(i)} aria-label={`Open ${s.name} details`} aria-haspopup="dialog">
          {s.gallery[0] && <Frame src={s.gallery[0].src} alt={s.gallery[0].alt} label={s.name} />}
          <span className="subsystem-index">0{i + 1}</span>
          <span className="subsystem-copy"><span className="subsystem-kicker">{s.kicker}</span><h3>{s.name}</h3></span>
          <ExternalLink className="card-arrow" />
        </Button>
      ))}</div>
    </section>

    <section id="team" className="team-section">
      <div className="section-intro light reveal"><div className="section-marker"><span>03</span><p>The people</p></div><h2>35+ minds.<br/>One airspace.</h2></div>
      <div className="team-filter reveal" role="tablist" aria-label="Filter team by group">
        {teamTabs.map((t) => <button key={t} type="button" role="tab" aria-selected={teamFilter === t} className={teamFilter === t ? "is-on" : ""} onClick={() => setTeamFilter(t)}>{t}<span>{t === "All" ? groups.reduce((n, g) => n + g.members.length, 0) : groups.find((g) => g.title === t)?.members.length}</span></button>)}
      </div>
      {shownGroups.map((group) => <div className="team-group" key={group.title}>
        <div className="team-group-heading"><h3>{group.title}</h3><span>{String(group.members.length).padStart(2,"0")}</span></div>
        <div className="team-row">{group.members.map((m, mi) => <article className="member-card reveal" style={delay((mi % 4) * 60)} key={m.name}>
          <div className="member-photo">{photoFor(m.name) ? <img src={photoFor(m.name)} alt={m.name} loading="lazy" /> : <span>{initials(m.name)}</span>}</div>
          <div className="member-info">
            <h4>{m.name}</h4>
            <p>{m.role}</p>
            <div className="socials">
              {m.instagram && <a href={m.instagram} target="_blank" rel="noreferrer" aria-label={`${m.name} on Instagram`}><Instagram /></a>}
              {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" aria-label={`${m.name} on LinkedIn`}><Linkedin /></a>}
            </div>
          </div>
        </article>)}</div>
      </div>)}
    </section>

    <section id="achievements" className="achievements-section">
      <div className="section-intro light reveal"><div className="section-marker"><span>04</span><p>World stage</p></div><h2>Proven in<br/>competition.</h2></div>
      <div className="achievement-grid">{achievements.map((a, i) => <article className={`achievement-card achievement-${i + 1} reveal`} style={delay(i * 70)} key={a.title}>
        <Frame src={a.photo} alt={`${a.title} team and achievement`} label={a.title} onOpen={() => setLightbox({ src: a.photo, alt: `${a.title} — ${a.rank}, ${a.detail}` })} />
        <span className="achievement-badge" aria-hidden="true">{a.badge}</span>
        <div className="achievement-copy"><span>{a.rank}</span><h3>{a.title}</h3><p>{a.detail}</p></div>
      </article>)}</div>
    </section>

    <section id="contact" className="contact-section">
      <div className="section-intro light reveal"><div className="section-marker"><span>05</span><p>Contact us</p></div><h2>Let&rsquo;s build<br/>what flies next.</h2></div>
      <div className="contact-layout">
        <div className="contact-lede reveal">
          <p>Sponsors, research groups, companies and students — every aircraft we fly starts with a conversation. Reach the team directly and we reply within a couple of days.</p>
          <div className="tag-row">{enquiryTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="contact-socials">
            <a href="https://www.instagram.com/aerove_iitb/" target="_blank" rel="noreferrer" aria-label="Team AeRoVe on Instagram"><Instagram /></a>
            <a href="https://in.linkedin.com/company/unmesh-mashruwala-innovation-cell-iit-bombay" target="_blank" rel="noreferrer" aria-label="UMIC on LinkedIn"><Linkedin /></a>
          </div>
        </div>
        <div className="contact-cards">{contactRoutes.map(({ label: l, value, href, icon: Icon }, i) => (
          <a className="contact-card reveal" style={delay(i * 70)} key={l} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            <Icon />
            <div><span>{l}</span><strong>{value}</strong></div>
            <ArrowUpRight className="contact-card-arrow" />
          </a>
        ))}</div>
      </div>
    </section>

    <footer>
      <a className="wordmark" href="#top" aria-label="AeRoVe home"><img src={aeroveLogo} alt="AeRoVe" /></a>
      <p>Team AeRoVe · Aerial Robotics Vehicles · UMIC, IIT Bombay</p>
      <div className="footer-connect"><img src={umicLogo} alt="UMIC" /><a href="https://www.instagram.com/umic_iitb/reels/?__d=1%3F%2F" target="_blank" rel="noreferrer" aria-label="UMIC Instagram"><Instagram /></a><a href="https://in.linkedin.com/company/unmesh-mashruwala-innovation-cell-iit-bombay" target="_blank" rel="noreferrer" aria-label="UMIC LinkedIn"><Linkedin /></a></div>
    </footer>
    <section className="closing-motto" aria-label="Our motto"><span>OUR MOTTO</span><p>“A drone is often preferred for missions that are too <em>dull, dirty, or dangerous</em> for manned aircraft.”</p></section>

    <a className={`back-to-top ${progress > 0.12 ? "is-shown" : ""}`} href="#top" aria-label="Back to top" tabIndex={progress > 0.12 ? 0 : -1}><ArrowUp /></a>

    {active && activeIdx !== null && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.currentTarget === e.target) setActiveIdx(null); }}>
      <div className="subsystem-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" key={active.name}>
        <Button ref={closeRef} variant="ghost" size="icon" className="modal-close" onClick={() => setActiveIdx(null)} aria-label="Close details"><X /></Button>
        <p className="eyebrow">0{activeIdx + 1} / 0{architecture.length} · {active.kicker}</p>
        <h2 id="modal-title">{active.name}</h2>
        <div className="modal-gallery">{active.gallery.map((g) => <Frame key={g.src} src={g.src} alt={g.alt} label="Gallery" compact onOpen={() => setLightbox(g)} />)}</div>
        <p className="modal-description">{active.description}</p>
        <div className="tag-row">{active.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <div className="modal-pager">
          <Button variant="ghost" className="modal-step" onClick={() => step(-1)}><ChevronLeft />{architecture[(activeIdx - 1 + architecture.length) % architecture.length]?.name}</Button>
          <Button variant="ghost" className="modal-step" onClick={() => step(1)}>{architecture[(activeIdx + 1) % architecture.length]?.name}<ChevronRight /></Button>
        </div>
      </div>
    </div>}

    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.alt} onMouseDown={(e) => { if (e.currentTarget === e.target) setLightbox(null); }}>
      <Button variant="ghost" size="icon" className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close image" autoFocus><X /></Button>
      <figure><img src={lightbox.src} alt={lightbox.alt} /><figcaption>{lightbox.alt}</figcaption></figure>
    </div>}
  </main>;
}
