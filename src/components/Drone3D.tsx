import { useEffect, useRef } from "react";

/**
 * Real-time 3D render of the AeRoVe mothership (hexacopter) and its daughter
 * quad, drawn as flat-shaded SVG polygons. Geometry is rebuilt every frame,
 * projected with a perspective camera and painter-sorted — no WebGL needed.
 */

type V3 = [number, number, number];
type RGB = [number, number, number];
type Face = { pts: V3[]; color: RGB; alpha: number; double?: boolean; edge?: boolean; center: V3 };
type Frame = { faces: Face[]; shadows: { x: number; y: number; rx: number; ry: number; o: number }[]; leds: { x: number; y: number; c: string }[]; alt: number; yaw: number; phase: string };

const W = 600, H = 440, CX = W / 2, CY = H * 0.52, F = 860, D = 6.4, CAM_PITCH = 0.36, GROUND = -1.1;
const LIGHT = norm([-0.45, 0.8, -0.4]);

const C = {
  hull: [27, 44, 82] as RGB,
  canopy: [38, 132, 214] as RGB,
  arm: [30, 40, 62] as RGB,
  motor: [150, 170, 200] as RGB,
  blade: [18, 26, 44] as RGB,
  gear: [60, 76, 104] as RGB,
  lens: [10, 16, 30] as RGB,
  daughter: [226, 236, 248] as RGB,
  disc: [120, 210, 255] as RGB,
};

function norm(v: V3): V3 { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const rotY = (v: V3, a: number): V3 => { const c = Math.cos(a), s = Math.sin(a); return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; };
const rotX = (v: V3, a: number): V3 => { const c = Math.cos(a), s = Math.sin(a); return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; };
const rotZ = (v: V3, a: number): V3 => { const c = Math.cos(a), s = Math.sin(a); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]]; };
const smooth = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

/** Rigid transform: yaw, then pitch and roll, then translate. */
type Pose = { pos: V3; yaw: number; pitch: number; roll: number };
const apply = (p: Pose, v: V3): V3 => add(rotZ(rotX(rotY(v, p.yaw), p.pitch), p.roll), p.pos);

function box(out: Face[], pose: Pose, c: V3, s: V3, yaw: number, color: RGB, edge = true) {
  const h = mul(s, 0.5);
  const corners: V3[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) corners.push(apply(pose, add(rotY([x * h[0], y * h[1], z * h[2]], yaw), c)));
  const quads = [[0, 1, 3, 2], [4, 6, 7, 5], [0, 4, 5, 1], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]];
  const center = apply(pose, c);
  for (const q of quads) out.push({ pts: q.map((i) => corners[i]!), color, alpha: 1, edge, center });
}

function prism(out: Face[], pose: Pose, c: V3, r: number, h: number, n: number, color: RGB, twist = 0) {
  const ring = (y: number) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + twist; return apply(pose, add(c, [Math.cos(a) * r, y, Math.sin(a) * r])); });
  const top = ring(h / 2), bot = ring(-h / 2), center = apply(pose, c);
  out.push({ pts: top, color, alpha: 1, edge: true, center }, { pts: [...bot].reverse(), color, alpha: 1, edge: true, center });
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; out.push({ pts: [bot[i]!, bot[j]!, top[j]!, top[i]!], color, alpha: 1, edge: n <= 8, center }); }
}

function rotor(out: Face[], pose: Pose, c: V3, r: number, spin: number, blur: number) {
  const disc = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return apply(pose, add(c, [Math.cos(a) * r, 0, Math.sin(a) * r])); });
  out.push({ pts: disc, color: C.disc, alpha: 0.1 + 0.12 * blur, double: true, center: apply(pose, c) });
  const w = r * 0.12;
  const blade = (a: number) => [[-r, -w * 0.4], [-r * 0.15, -w], [r * 0.15, w], [r, w * 0.4], [r * 0.15, -w * 0.2], [-r * 0.15, w * 0.2]].map(([x, z]) => apply(pose, add(c, rotY([x!, 0.005, z!], a))));
  out.push({ pts: blade(spin), color: C.blade, alpha: 1 - 0.55 * blur, double: true, edge: true, center: apply(pose, add(c, [0, 0.01, 0])) });
}

function copter(out: Face[], leds: V3[][], pose: Pose, o: { arms: number; armLen: number; bodyR: number; propR: number; spin: number; blur: number; hull: RGB; gear: boolean }) {
  const { arms, armLen, bodyR, propR } = o;
  prism(out, pose, [0, 0, 0], bodyR, bodyR * 0.42, arms === 6 ? 6 : 4, o.hull, arms === 6 ? 0 : Math.PI / 4);
  prism(out, pose, [0, bodyR * 0.3, 0], bodyR * 0.62, bodyR * 0.22, arms === 6 ? 6 : 4, C.canopy, arms === 6 ? 0 : Math.PI / 4);
  for (let i = 0; i < arms; i++) {
    const a = -((i + 0.5) / arms) * Math.PI * 2;
    const tip = rotY([armLen, 0, 0], a);
    box(out, pose, rotY([armLen / 2 + bodyR * 0.3, 0, 0], a), [armLen - bodyR * 0.4, bodyR * 0.09, bodyR * 0.11], a, C.arm);
    prism(out, pose, add(tip, [0, bodyR * 0.12, 0]), bodyR * 0.2, bodyR * 0.3, 8, C.motor, a);
    rotor(out, pose, add(tip, [0, bodyR * 0.3, 0]), propR, o.spin * (i % 2 ? 1 : -1) + i, o.blur);
    leds.push([apply(pose, add(tip, [0, -bodyR * 0.06, 0])), [Math.cos(a), 0, -Math.sin(a)]]);
  }
  if (o.gear) {
    for (const x of [-1, 1]) {
      box(out, pose, [x * bodyR * 0.7, -bodyR * 0.95, 0], [bodyR * 0.08, bodyR * 0.08, bodyR * 2.2], 0, C.gear);
      for (const z of [-1, 1]) box(out, pose, [x * bodyR * 0.6, -bodyR * 0.55, z * bodyR * 0.55], [bodyR * 0.06, bodyR * 0.75, bodyR * 0.06], 0, C.gear);
    }
    box(out, pose, [0, -bodyR * 0.36, -bodyR * 0.62], [bodyR * 0.36, bodyR * 0.28, bodyR * 0.3], 0, C.hull);
    prism(out, pose, [0, -bodyR * 0.36, -bodyR * 0.8], bodyR * 0.1, bodyR * 0.08, 10, C.lens);
  }
}

/** Mission cycle (seconds): docked → launch → orbit → recover → docked. */
const CYCLE = 14;
function daughterState(t: number) {
  const k = t % CYCLE;
  const up = smooth((k - 3) / 1.6) - smooth((k - 10) / 1.8);
  const orbit = smooth((k - 4.4) / 1) - smooth((k - 9) / 1);
  const phase = k < 3 ? "DOCKED · MOTHERSHIP CRUISE" : k < 4.6 ? "DAUGHTER LAUNCH" : k < 9.4 ? "DAUGHTER MISSION · ORBIT" : k < 11.8 ? "RECOVERY · DOCKING" : "DOCKED · MOTHERSHIP CRUISE";
  return { up, orbit, k, phase, spinning: k > 2.4 && k < 12.3 };
}

const toCam = (v: V3): V3 => { const c = Math.cos(CAM_PITCH), s = Math.sin(CAM_PITCH); return [v[0], v[1] * c + v[2] * s, -v[1] * s + v[2] * c + D]; };

function project(v: V3): [number, number, number] {
  const [x, y, z] = toCam(v);
  return [CX + (F * x) / z, CY - (F * y) / z, z];
}

function buildFrame(t: number, aim: { x: number; y: number }): Frame {
  const faces: Face[] = [];
  const leds: V3[][] = [];
  const yaw = t * 0.22 + aim.x * 0.9 + 0.5;
  const mother: Pose = { pos: [0, 0.12 + Math.sin(t * 1.3) * 0.07, 0], yaw, pitch: Math.cos(t * 0.7) * 0.05 + aim.y * 0.22, roll: Math.sin(t * 0.9) * 0.05 - aim.x * 0.12 };
  copter(faces, leds, mother, { arms: 6, armLen: 1.25, bodyR: 0.46, propR: 0.5, spin: t * 38, blur: 1, hull: C.hull, gear: true });

  const d = daughterState(t);
  const ang = t * 1.1;
  const local: V3 = [Math.cos(ang) * 1.05 * d.orbit, 0.25 + d.up * 0.8 + Math.sin(t * 2.1) * 0.04 * d.up, Math.sin(ang) * 0.8 * d.orbit];
  const dPos = apply(mother, local);
  const daughter: Pose = { pos: dPos, yaw: yaw + d.orbit * (ang + Math.PI / 2), pitch: mother.pitch * (1 - d.up), roll: mother.roll * (1 - d.up) + d.orbit * 0.12 };
  copter(faces, leds, daughter, { arms: 4, armLen: 0.42, bodyR: 0.16, propR: 0.19, spin: d.spinning ? t * 46 : 0.6, blur: d.spinning ? 1 : 0, hull: C.daughter, gear: false });

  const shadows = [
    { p: mother.pos, r: 1.55 },
    { p: dPos, r: 0.55 },
  ].map(({ p, r }) => {
    const [x, y] = project([p[0], GROUND, p[2]]);
    const [x2] = project([p[0] + r, GROUND, p[2]]);
    const h = p[1] - GROUND;
    return { x, y, rx: Math.abs(x2 - x), ry: Math.abs(x2 - x) * 0.32, o: Math.max(0.08, 0.5 - h * 0.12) };
  });

  const ledPts = leds.map(([p, dir], i) => {
    const [x, y] = project(p!);
    const front = dir![2] < 0;
    return { x, y, c: i >= 6 ? "#7dd3fc" : front ? "#4ade80" : "#f87171" };
  });

  return { faces, shadows, leds: ledPts, alt: mother.pos[1] - GROUND + d.up * 0.8, yaw: (((yaw * 180) / Math.PI) % 360 + 360) % 360, phase: d.phase };
}

type Drawn = { d: string; fill: string; opacity: number; stroke: string };
function shade(frame: Frame): Drawn[] {
  const out: (Drawn & { z: number })[] = [];
  for (const f of frame.faces) {
    const cam = f.pts.map(toCam);
    let n = norm(cross(sub(cam[1]!, cam[0]!), sub(cam[2]!, cam[0]!)));
    const centroid = mul(cam.reduce((a, b) => add(a, b), [0, 0, 0] as V3), 1 / cam.length);
    if (dot(n, sub(centroid, toCam(f.center))) < 0) n = mul(n, -1);
    if (!f.double && dot(n, centroid) > 0) continue;
    if (f.double && dot(n, centroid) > 0) n = mul(n, -1);
    const diff = Math.max(0, dot(n, LIGHT));
    const spec = Math.pow(Math.max(0, dot(norm(sub(LIGHT, norm(centroid))), n)), 24) * 0.5;
    const k = 0.32 + 0.78 * diff;
    const rgb = f.color.map((v) => Math.min(255, Math.round(v * k + 255 * spec)));
    const pts = f.pts.map(project);
    const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
    out.push({ d, fill: `rgb(${rgb.join(",")})`, opacity: f.alpha, stroke: f.edge ? "rgba(140,220,255,.55)" : "none", z: centroid[2] });
  }
  return out.sort((a, b) => b.z - a.z);
}

const POOL = 300;
const GRID = (() => {
  const lines: string[] = [];
  for (let i = -6; i <= 6; i++) {
    const a = project([i * 0.5, GROUND, -3]), b = project([i * 0.5, GROUND, 3]);
    const c = project([-3, GROUND, i * 0.5]), e = project([3, GROUND, i * 0.5]);
    lines.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`, `M${c[0].toFixed(1)} ${c[1].toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}`);
  }
  return lines.join("");
})();

export function Drone3D({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const initial = buildFrame(0, { x: 0, y: 0 });
  const drawn = shade(initial);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = [...svg.querySelectorAll<SVGPathElement>(".d3-face")];
    const shadows = [...svg.querySelectorAll<SVGEllipseElement>(".d3-shadow")];
    const leds = [...svg.querySelectorAll<SVGCircleElement>(".d3-led")];
    const alt = svg.querySelector(".d3-alt"), yawEl = svg.querySelector(".d3-yaw"), phase = svg.querySelector(".d3-phase");
    const aim = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    let raf = 0, visible = true, last = performance.now(), t = 0, n = 0;

    const draw = () => {
      const frame = buildFrame(t, aim);
      const faces = shade(frame);
      for (let i = 0; i < paths.length; i++) {
        const p = paths[i]!, f = faces[i];
        if (!f) { p.setAttribute("d", ""); continue; }
        p.setAttribute("d", f.d); p.setAttribute("fill", f.fill); p.setAttribute("fill-opacity", String(f.opacity)); p.setAttribute("stroke", f.stroke);
      }
      frame.shadows.forEach((s, i) => { const e = shadows[i]; if (!e) return; e.setAttribute("cx", s.x.toFixed(1)); e.setAttribute("cy", s.y.toFixed(1)); e.setAttribute("rx", s.rx.toFixed(1)); e.setAttribute("ry", s.ry.toFixed(1)); e.setAttribute("opacity", s.o.toFixed(2)); });
      frame.leds.forEach((l, i) => { const e = leds[i]; if (!e) return; e.setAttribute("cx", l.x.toFixed(1)); e.setAttribute("cy", l.y.toFixed(1)); e.setAttribute("fill", l.c); });
      if (n++ % 6 === 0) {
        if (alt) alt.textContent = `${frame.alt.toFixed(2)} m`;
        if (yawEl) yawEl.textContent = `${frame.yaw.toFixed(0).padStart(3, "0")}°`;
        if (phase && phase.textContent !== frame.phase) phase.textContent = frame.phase;
      }
    };

    const loop = (now: number) => {
      t += Math.min(0.05, (now - last) / 1000); last = now;
      aim.x += (target.x - aim.x) * 0.05; aim.y += (target.y - aim.y) * 0.05;
      draw();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    const onLeave = () => { target.x = 0; target.y = 0; };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { t = 5.6; draw(); return; }
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(svg);
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerleave", onLeave);
    return () => { io.disconnect(); cancelAnimationFrame(raf); svg.removeEventListener("pointermove", onMove); svg.removeEventListener("pointerleave", onLeave); };
  }, []);

  return (
    <svg ref={svgRef} className={`drone3d ${className}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Animated 3D model of the AeRoVe hexacopter mothership launching and recovering its daughter drone">
      <defs>
        <radialGradient id="d3-floor" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#7dd3fc" stopOpacity=".35" /><stop offset="1" stopColor="#7dd3fc" stopOpacity="0" /></radialGradient>
        <radialGradient id="d3-shadow"><stop offset="0" stopColor="#000814" stopOpacity=".9" /><stop offset="1" stopColor="#000814" stopOpacity="0" /></radialGradient>
        <mask id="d3-grid-mask"><ellipse cx={CX} cy={project([0, GROUND, 0])[1]} rx={W * 0.48} ry={H * 0.22} fill="url(#d3-floor)" /></mask>
        <filter id="d3-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <path d={GRID} className="d3-grid" mask="url(#d3-grid-mask)" />
      {initial.shadows.map((s, i) => <ellipse key={i} className="d3-shadow" cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} opacity={s.o} fill="url(#d3-shadow)" />)}
      <g className="d3-mesh" strokeWidth=".7" strokeLinejoin="round">
        {Array.from({ length: POOL }, (_, i) => { const f = drawn[i]; return <path key={i} className="d3-face" d={f?.d ?? ""} fill={f?.fill} fillOpacity={f?.opacity} stroke={f?.stroke} />; })}
      </g>
      <g filter="url(#d3-glow)">{initial.leds.map((l, i) => <circle key={i} className="d3-led" cx={l.x} cy={l.y} r="4" fill={l.c} />)}</g>
      <g className="d3-hud">
        <path d="M14 34V14h20M566 14h20v20M586 406v20h-20M34 426H14v-20" />
        <text x="26" y="44">ALT <tspan className="d3-alt">{initial.alt.toFixed(2)} m</tspan></text>
        <text x="26" y="62">HDG <tspan className="d3-yaw">{initial.yaw.toFixed(0).padStart(3, "0")}°</tspan></text>
        <text x="574" y="396" textAnchor="end">HEX-6 MOTHERSHIP</text>
        <text x="574" y="414" textAnchor="end">+ QUAD DAUGHTER</text>
        <text x="26" y="414" className="d3-phase">{initial.phase}</text>
      </g>
    </svg>
  );
}
