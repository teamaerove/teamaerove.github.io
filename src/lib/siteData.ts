import type { ComponentType, SVGProps } from "react";
import { IconAero, IconDroneMark, IconHexCluster, IconCrew, IconLocation, IconMailWing, IconMechatronics, IconMotion, IconPerception, IconRank, IconTarget, IconTrophy } from "@/components/icons";
import shot1 from "@/assets/hero-full-squad.jpg";
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
import iitbLogo from "@/assets/iitb-logo.svg";
import cuascPhoto from "@/assets/cuasc-2024-hq.jpg";
import roverPhoto from "@/assets/ri4rover-2024.png";
import roboTitle from "@/assets/robodrive-title.png";
import vijayPhoto from "@/assets/vijay-patekar.png";
import dhruvPhoto from "@/assets/dhruv-jadhav.png";
import uasPhoto from "@/assets/uas-challenge-2023-hq.jpg";
import icuasPhoto from "@/assets/icuas-2023-hq.jpg";
import galleryAward from "@/assets/gallery-imeche-award.jpg";
import galleryAirdrop from "@/assets/gallery-airdrop-drone.jpg";
import galleryCrew from "@/assets/gallery-airfield-crew.jpg";
import galleryVtol from "@/assets/gallery-vtol-runway.jpg";
import galleryWiring from "@/assets/gallery-wiring.jpg";


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
import team33 from "@/assets/AayushKamble.jpg";
import team34 from "@/assets/AdityaYadav.jpg";
import team35 from "@/assets/AnjaliJogi.jpg";
import team36 from "@/assets/ArjunSharma.jpg";
import team37 from "@/assets/DhruvNarkhede.jpg";
import team38 from "@/assets/HetAkbari.jpg";
import team39 from "@/assets/NiravKhobragade.jpg";
import team40 from "@/assets/PragyJain.jpg";
import team41 from "@/assets/SamarthCharhate.jpg";
import team42 from "@/assets/SharvanPatil.jpg";

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
  AayushKamble: team33,
  AdityaYadav: team34,
  AnjaliJogi: team35,
  ArjunSharma: team36,
  DhruvNarkhede: team37,
  HetAkbari: team38,
  NiravKhobragade: team39,
  PragyJain: team40,
  SamarthCharhate: team41,
  SharvanPatil: team42,
};
export type Shot = { src: string; alt: string };
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;
export type Subsystem = { name: string; kicker: string; icon: IconType; description: string; tags: string[]; gallery: Shot[] };
export type Member = { name: string; role: string; instagram?: string; linkedin?: string };
export const photoFor = (name: string) => memberPhotos[name.replace(/[^A-Za-z0-9]/g, "")];
export const slides = [
  { src: shot1, alt: "Team AeRoVe assembled on the flight line with their multirotor aircraft", caption: "The full squad · IIT Bombay flight line" },
  { src: shot2, alt: "AeRoVe members holding the Indian flag beside their competition trophies", caption: "Flying the flag on the world stage" },
  { src: shot3, alt: "AeRoVe engineers preparing an aircraft inside the competition hangar", caption: "Build bay · pre-flight scrutineering" },
  { src: shot4, alt: "Three UAS Challenge trophies won by Team AeRoVe", caption: "UAS Challenge · three awards, one mission" },
];

export const architecture: Subsystem[] = [
  {
    name: "Mechatronics",
    icon: IconMechatronics,
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
    icon: IconAero,
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
    icon: IconMotion,
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
    icon: IconPerception,
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

export const groups: { title: string; members: Member[] }[] = [
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
  // Subsystem groups share their title with the matching `architecture` entry.
  { title: "Mechatronics", members: [
    { name: "Sambhav", role: "Subsystem Lead", instagram: "https://www.instagram.com/polestar2025", linkedin: "https://www.linkedin.com/in/sambhav-jha-22445b262" },
    { name: "Nipun", role: "Subsystem Lead", instagram: "https://www.instagram.com/nipun.nistane", linkedin: "https://www.linkedin.com/in/nipun-nistane-7a0bb5312" },
    { name: "Sharvan Patil", role: "Junior Engineer", instagram: "https://www.instagram.com/sharvan_2987", linkedin: "https://www.linkedin.com/in/sharvan-chand-patil-97793238a" },
    { name: "Het Akbari", role: "Junior Engineer", instagram: "https://www.instagram.com/hetbuoy", linkedin: "https://www.linkedin.com/in/het-akbari-2bbba0416" },
    { name: "Anjali Jogi", role: "Junior Engineer", instagram: "https://www.instagram.com/anjali_.4477", linkedin: "https://www.linkedin.com/in/anjali-jogi-501b12368" },
    { name: "Dhruv Narkhede", role: "Junior Engineer", instagram: "https://www.instagram.com/dhruv_onthemove" },
    { name: "Aditya Yadav", role: "Junior Engineer", instagram: "https://www.instagram.com/adityay_2006", linkedin: "https://www.linkedin.com/in/aditya-yadav-877b12270" },
  ]},
  { title: "Aerodynamics", members: [
    { name: "Durva", role: "Subsystem Lead", instagram: "https://www.instagram.com/dpg_1937", linkedin: "https://www.linkedin.com/in/durva-gandharva-164405388" },
    { name: "Poorvansh Jain", role: "Senior Engineer", instagram: "https://www.instagram.com/poorvansh_jain/", linkedin: "https://www.linkedin.com/in/poorvansh-jain-0a696b317/" },
    { name: "Devangi", role: "Junior Engineer", instagram: "https://www.instagram.com/devi.lilvelcro", linkedin: "https://www.linkedin.com/in/devangi-chaudhuri-0a584b242/" },
    { name: "Nirav Khobragade", role: "Junior Engineer", instagram: "https://www.instagram.com/nirav_khobragade_01", linkedin: "https://www.linkedin.com/in/nirav-khobragade-5b89723a2" },
    { name: "Aayush Kamble", role: "Junior Engineer", instagram: "https://www.instagram.com/aayushkamble4579", linkedin: "https://www.linkedin.com/in/aayush-kamble-9aa730381" },
    { name: "Pragy Jain", role: "Junior Engineer", linkedin: "https://www.linkedin.com/in/pragy-jain-4a6105387" },
    { name: "Rishit Shejul", role: "Junior Engineer", instagram: "https://www.instagram.com/rishittt._._", linkedin: "https://www.linkedin.com/in/rishit-shejul/" },
  ]},
  { title: "Motion Path & Controlling", members: [
    { name: "Arpit Kumar", role: "Subsystem Lead" },
    { name: "Basant", role: "Senior Engineer" }, { name: "Naman", role: "Senior Engineer" }, { name: "Krutarth", role: "Senior Engineer" },
    { name: "Vipul Bansal", role: "Junior Engineer", instagram: "https://www.instagram.com/_vipul_957_/", linkedin: "https://www.linkedin.com/in/vipul-bansal-8b1344289" },
    { name: "Abha", role: "Junior Engineer", instagram: "https://www.instagram.com/abhas_2007/", linkedin: "https://www.linkedin.com/in/abha-shelke-835430390/" },
    { name: "Tathagata", role: "Junior Engineer", linkedin: "https://www.linkedin.com/in/tathagata-roy-0a1b1a20a" },
    { name: "Shreeya", role: "Junior Engineer", instagram: "https://www.instagram.com/nair_shreeya/", linkedin: "https://www.linkedin.com/in/shreeya-nair-780a63417" },
    { name: "Parth Lohiya", role: "Junior Engineer", instagram: "https://www.instagram.com/lohiya_parth/", linkedin: "https://www.linkedin.com/in/parthlohiya" },
    { name: "Arjun Sharma", role: "Junior Engineer", instagram: "https://www.instagram.com/arjun_sharma_20122007/", linkedin: "https://www.linkedin.com/in/arjun-sharma-a5920137a/" },
  ]},
  { title: "Perception", members: [
    { name: "Narendra", role: "Subsystem Lead", instagram: "https://www.instagram.com/n_r_ndr_/", linkedin: "https://www.linkedin.com/in/narendra-aironi/" },
    { name: "Aarav Gupta", role: "Subsystem Lead", linkedin: "https://www.linkedin.com/in/aarav-gupta-128282202/" },
    { name: "Cheriyan", role: "Junior Engineer", linkedin: "https://www.linkedin.com/in/cheriyanr200779" }, { name: "Vidit", role: "Junior Engineer", linkedin: "https://www.linkedin.com/in/vidit-nagpurkar/" },
    { name: "Afnan Ahmed", role: "Junior Engineer", instagram: "https://www.instagram.com/afnanahmed450", linkedin: "https://www.linkedin.com/in/afnan-ahmed-449680374" },
    { name: "Bhavya Patel", role: "Junior Engineer", instagram: "https://www.instagram.com/_.bhavya.patel_", linkedin: "https://www.linkedin.com/in/bhavya-patel-64014b377/" },
    { name: "Raunak Raj", role: "Junior Engineer", instagram: "https://www.instagram.com/__newton_raunak", linkedin: "https://www.linkedin.com/in/raunak-raj-89888a313" },
    { name: "Samarth Charhate", role: "Junior Engineer", linkedin: "https://www.linkedin.com/in/samarth-charhate-0a3491387" },
  ]},
  { title: "Junior Engineers", members: [
    { name: "Parth Rane", role: "Junior Engineer", instagram: "https://www.instagram.com/parthrane4/", linkedin: "https://www.linkedin.com/in/parth-rane-982622372/" },
    { name: "Gaurav", role: "Junior Engineer", instagram: "https://www.instagram.com/gaurav.m_08/", linkedin: "https://www.linkedin.com/in/gaurav-maharana-377453418" },
  ]},
  { title: "Business Team", members: [
    { name: "Satyam", role: "Finance & Logistics", instagram: "https://www.instagram.com/satyamyeola/", linkedin: "https://www.linkedin.com/in/satyamyeola/" },
    { name: "Divyansh", role: "Finance & Logistics", instagram: "https://www.instagram.com/divyansh.singh_38", linkedin: "https://www.linkedin.com/in/divyansh-singh-788491393" },
    { name: "Navinya Desai", role: "Finance & Logistics", instagram: "https://www.instagram.com/navinya_27", linkedin: "https://www.linkedin.com/in/navinya-desai-a76086376" },
    { name: "Parth Ingle", role: "Media & PR", instagram: "https://www.instagram.com/_parth_i7_/", linkedin: "https://www.linkedin.com/in/parth-ingle-84961a374/" },
    { name: "Harsh", role: "Web Developer", instagram: "https://www.instagram.com/harsh_.prjpt/", linkedin: "https://www.linkedin.com/in/harsh-prajapat-a39341386/" },
  ]},
];

export const achievements = [
  { title: "CUASC 2024", rank: "World Champions", detail: "Design & Innovation Award", badge: "01", photo: cuascPhoto },
  { title: "Ri4Rover 2024", rank: "World Champions", detail: "Purdue University", badge: "01", photo: roverPhoto },
  { title: "RoboDrive 2024", rank: "Global #4", detail: "1st nationally · ICRA", badge: "04", photo: roboTitle },
  { title: "UAS Challenge 2023", rank: "Triple award", detail: "Advancement · Design · Scrutineers", badge: "03", photo: uasPhoto },
  { title: "ICUAS 2023", rank: "World #1", detail: "Simulation · Hardware #3", badge: "01", photo: icuasPhoto },
];

export const achievementShots: Shot[] = achievements.map((a) => ({ src: a.photo, alt: `${a.title} — ${a.rank}, ${a.detail}` }));

export type GalleryShot = Shot & { caption: string };
export const gallery: GalleryShot[] = [
  { src: galleryAward, alt: "Team AeRoVe in hi-vis vests holding a trophy in front of the Institution of Mechanical Engineers backdrop", caption: "Award ceremony · IMechE UAS Challenge" },
  { src: galleryVtol, alt: "Four AeRoVe engineers in hi-vis vests with the fixed-wing VTOL on the runway", caption: "Fixed-wing VTOL on the runway" },
  { src: galleryAirdrop, alt: "AeRoVe multirotor with the Air Drop Box payload mounted under its frame", caption: "Air-drop payload system" },
  { src: galleryWiring, alt: "AeRoVe member routing wiring on the drone airframe before flight", caption: "Pre-flight wiring checks" },
  { src: galleryCrew, alt: "AeRoVe with fellow competing teams in front of a large aircraft at the airfield", caption: "With fellow teams at the airfield" },
];


export const contactRoutes = [
  { label: "Sponsorship & partnerships", value: "teamaerove@gmail.com", href: "mailto:teamaerove@gmail.com", icon: IconMailWing },
  { label: "Find us", value: "Desai Sethi School of Entrepreneurship, IIT Bombay", href: "https://maps.google.com/?q=Desai+Sethi+School+of+Entrepreneurship+IIT+Bombay", icon: IconLocation },
];

export const enquiryTags = ["Sponsorship", "Technology collaboration", "Campus visit", "Media & press"];
export const stats: [string, string, IconType][] = [["04", "Subsystems", IconHexCluster], ["45+", "Members", IconCrew], ["05", "Global titles", IconTrophy], ["#4", "World rank", IconRank]];

export const fleet: (Shot & { name: string; kind: string; text: string })[] = [
  { src: galleryVtol, alt: "AeRoVe fixed-wing VTOL aircraft on the runway", name: "Fixed-wing VTOL", kind: "Hybrid · long range", text: "Takes off and lands vertically like a multirotor, then cruises on its wing for long-distance outdoor missions." },
  { src: galleryAirdrop, alt: "AeRoVe multirotor with the Air Drop Box payload mounted under its frame", name: "Air-drop multirotor", kind: "Multirotor · payload", text: "Carries a payload box under its frame and releases it precisely over the drop zone." },
  { src: aeroWing, alt: "Flying wing aircraft configuration", name: "Flying wing", kind: "Fixed wing · efficiency", text: "A tailless planform shaped with CFD to carry more and fly longer on the same battery." },
];

export const missionSteps: [string, string, IconType][] = [
  ["Carry", "The hex mothership ferries the daughter drone to the target zone.", IconHexCluster],
  ["Launch", "It holds a stable hover while the daughter lifts off its back.", IconDroneMark],
  ["Recover", "The daughter completes the mission and docks for the flight home.", IconTarget],
];

/** URL fragment for a subsystem, e.g. "Motion Path & Controlling" → "motion-path-controlling". */
export const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
