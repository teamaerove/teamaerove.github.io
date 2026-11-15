import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/**
 * The home-page flight film: a procedural hex mothership and its daughter quad
 * flying down a valley at dusk. Scroll progress (0..1) drives a four-shot
 * camera move; everything else (terrain, sky, rotors, dust) animates on time.
 * Browser-only — loaded with a dynamic import from CineHero.
 */

export type HeroTelemetry = { alt: number; spd: number; hdg: number; time: number };
export type HeroHandle = { setProgress: (p: number) => void; dispose: () => void };
type Options = { reducedMotion: boolean; onTelemetry?: (t: HeroTelemetry) => void; onFirstFrame?: () => void };

const SCAN = 0x0b7fc0;
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Shots: camera orbits the drone (angle from +z, radius, height). `shift` slides the drone off-centre to leave room for copy. */
const SHOTS = [
  { ang: 0.5, r: 7.0, y: -0.35, look: [0, 0.35, 0], fov: 36, shift: 1 },
  { ang: 3.9, r: 4.9, y: 1.0, look: [0, 0.15, 0], fov: 32, shift: -1 },
  { ang: 6.9, r: 5.0, y: 4.4, look: [0, 0.9, 0], fov: 40, shift: 1 },
  { ang: Math.PI * 2, r: 9.5, y: 2.3, look: [0, -1.6, -14], fov: 52, shift: 0 },
] as const;

const SKY_GLSL = /* glsl */ `
  const vec3 SUN = vec3(0.0, 0.0698, -0.9976);
  vec3 skyBase(vec3 d) {
    float h = clamp(d.y, 0.0, 1.0);
    float sunAmt = max(dot(d, SUN), 0.0);
    // Overcast daylight: pale haze at the horizon, cool grey-blue overhead.
    vec3 top = vec3(0.20, 0.27, 0.34);
    vec3 hor = vec3(0.56, 0.58, 0.58) + vec3(0.06, 0.05, 0.03) * pow(sunAmt, 4.0);
    vec3 c = mix(hor, top, smoothstep(0.0, 0.6, h));
    c += vec3(1.0, 0.97, 0.9) * pow(sunAmt, 20.0) * 0.12;
    return c;
  }
`;

const NOISE_GLSL = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
`;

function makeMaterials() {
  return {
    carbon: new THREE.MeshStandardMaterial({ color: 0x15181d, metalness: 0.65, roughness: 0.34 }),
    plate: new THREE.MeshStandardMaterial({ color: 0x262b33, metalness: 0.9, roughness: 0.28 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xaab3c0, metalness: 1, roughness: 0.22 }),
    accent: new THREE.MeshPhysicalMaterial({ color: 0x0b6fa8, metalness: 0.25, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.12 }),
    shell: new THREE.MeshPhysicalMaterial({ color: 0xe9edf2, metalness: 0.1, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2 }),
    lens: new THREE.MeshPhysicalMaterial({ color: 0x05070a, metalness: 0.9, roughness: 0.05, clearcoat: 1 }),
    blade: new THREE.MeshBasicMaterial({ color: 0x0b0d10, transparent: true, opacity: 0.45, depthWrite: false }),
    disc: new THREE.MeshBasicMaterial({ color: 0x1a1c1e, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }),
    ledFront: new THREE.MeshBasicMaterial({ color: new THREE.Color(0x22b85a), toneMapped: false }),
    ledRear: new THREE.MeshBasicMaterial({ color: new THREE.Color(0xd8261a), toneMapped: false }),
  };
}
type Mats = ReturnType<typeof makeMaterials>;

function buildCopter(arms: 4 | 6, s: number, m: Mats, hull: THREE.Material, canopy: THREE.Material) {
  const g = new THREE.Group();
  const props: THREE.Object3D[] = [];
  const armLen = 1.25 * s, bodyR = 0.46 * s, propR = 0.52 * s;
  const seg = arms === 6 ? 6 : 8;
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D = g) => { const mesh = new THREE.Mesh(geo, mat); parent.add(mesh); return mesh; };

  add(new THREE.CylinderGeometry(bodyR, bodyR * 0.9, bodyR * 0.42, seg), hull);
  add(new THREE.CylinderGeometry(bodyR * 1.1, bodyR * 1.1, bodyR * 0.05, seg), m.plate).position.y = bodyR * 0.23;
  add(new THREE.CylinderGeometry(bodyR * 0.96, bodyR * 0.96, bodyR * 0.04, seg), m.plate).position.y = -bodyR * 0.23;
  const dome = add(new THREE.SphereGeometry(bodyR * 0.62, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), canopy);
  dome.scale.set(1, 0.5, 1.2); dome.position.y = bodyR * 0.25;

  for (let i = 0; i < arms; i++) {
    const a = ((i + 0.5) / arms) * Math.PI * 2;
    const pivot = new THREE.Group(); pivot.rotation.y = a; g.add(pivot);
    const arm = add(new THREE.CylinderGeometry(bodyR * 0.075, bodyR * 0.095, armLen - bodyR * 0.5, 12), m.carbon, pivot);
    arm.rotation.z = Math.PI / 2; arm.position.x = armLen / 2 + bodyR * 0.25;
    add(new THREE.CylinderGeometry(bodyR * 0.2, bodyR * 0.23, bodyR * 0.32, 20), m.metal, pivot).position.set(armLen, bodyR * 0.1, 0);
    add(new THREE.CylinderGeometry(bodyR * 0.24, bodyR * 0.24, bodyR * 0.06, 20), m.carbon, pivot).position.set(armLen, -bodyR * 0.08, 0);
    const prop = new THREE.Group(); prop.position.set(armLen, bodyR * 0.3, 0); pivot.add(prop);
    add(new THREE.CircleGeometry(propR, 48), m.disc, prop).rotation.x = -Math.PI / 2;
    add(new THREE.BoxGeometry(propR * 2, bodyR * 0.012, propR * 0.14), m.blade, prop);
    add(new THREE.CylinderGeometry(bodyR * 0.07, bodyR * 0.07, bodyR * 0.1, 12), m.metal, prop);
    prop.userData['dir'] = i % 2 ? 1 : -1; prop.rotation.y = i;
    props.push(prop);
    // Local +x maps to world (cos a, 0, -sin a): the nose points down -z.
    add(new THREE.SphereGeometry(bodyR * 0.075, 12, 8), Math.sin(a) > 0 ? m.ledFront : m.ledRear, pivot).position.set(armLen, -bodyR * 0.16, 0);
  }

  if (arms === 6) {
    for (const x of [-1, 1]) {
      const skid = add(new THREE.CylinderGeometry(bodyR * 0.05, bodyR * 0.05, bodyR * 2.5, 10), m.carbon);
      skid.rotation.x = Math.PI / 2; skid.position.set(x * bodyR * 0.85, -bodyR * 1.05, 0);
      for (const z of [-1, 1]) {
        const strut = add(new THREE.CylinderGeometry(bodyR * 0.04, bodyR * 0.04, bodyR * 0.95, 8), m.carbon);
        strut.position.set(x * bodyR * 0.68, -bodyR * 0.62, z * bodyR * 0.55); strut.rotation.z = x * -0.38;
      }
    }
    add(new THREE.BoxGeometry(bodyR * 0.4, bodyR * 0.3, bodyR * 0.34), m.carbon).position.set(0, -bodyR * 0.42, -bodyR * 0.62);
    const lens = add(new THREE.CylinderGeometry(bodyR * 0.11, bodyR * 0.11, bodyR * 0.1, 20), m.lens);
    lens.rotation.x = Math.PI / 2; lens.position.set(0, -bodyR * 0.42, -bodyR * 0.82);
    add(new THREE.TorusGeometry(bodyR * 0.12, bodyR * 0.012, 8, 24), m.ledRear).position.set(0, -bodyR * 0.42, -bodyR * 0.875);
  }
  return { group: g, props, bodyR };
}

export function createHeroScene(canvas: HTMLCanvasElement, opts: Options): HeroHandle {
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 900);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  /* Sky ------------------------------------------------------------- */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(600, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: /* glsl */ `varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `${SKY_GLSL}
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec3 c = skyBase(d);
          float sunAmt = max(dot(d, SUN), 0.0);
          c *= smoothstep(-0.3, 0.0, d.y) * 0.4 + 0.6;
          gl_FragColor = vec4(c, 1.0);
        }`,
    }),
  );
  scene.add(sky);

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(700 * 3);
  for (let i = 0; i < 700; i++) {
    const u = Math.random() * Math.PI * 2, v = 0.16 + Math.random() * 0.84;
    const r = Math.sqrt(1 - v * v);
    starPos.set([Math.cos(u) * r * 500, v * 500, Math.sin(u) * r * 500], i * 3);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false }));
  

  /* Terrain: an endless scrolling valley drawn as a lit survey grid --- */
  const terrainGeo = new THREE.PlaneGeometry(360, 360, mobile ? 150 : 240, mobile ? 150 : 240);
  terrainGeo.rotateX(-Math.PI / 2);
  const terrainUniforms = { uOffset: { value: new THREE.Vector2() }, uScan: { value: 0 }, uTime: { value: 0 } };
  const terrain = new THREE.Mesh(
    terrainGeo,
    new THREE.ShaderMaterial({
      uniforms: terrainUniforms,
      vertexShader: /* glsl */ `${NOISE_GLSL}
        uniform vec2 uOffset;
        varying vec3 vWorld; varying vec2 vMap; varying float vH;
        void main() {
          vec3 p = position;
          vec2 w = p.xz + uOffset;
          float valley = smoothstep(5.0, 46.0, abs(p.x + sin(w.y * 0.02) * 6.0));
          float h = fbm(w * 0.034) * 34.0 * valley + fbm(w * 0.16) * 1.1;
          p.y += h;
          vH = h; vMap = w;
          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }`,
      fragmentShader: /* glsl */ `${SKY_GLSL}
        uniform float uScan; uniform float uTime;
        varying vec3 vWorld; varying vec2 vMap; varying float vH;
        float grid(vec2 p, float cell) {
          vec2 g = abs(fract(p / cell - 0.5) - 0.5) / fwidth(p / cell);
          return 1.0 - min(min(g.x, g.y), 1.0);
        }
        void main() {
          vec3 toFrag = vWorld - cameraPosition;
          float dist = length(toFrag);
          vec3 dir = toFrag / dist;
          // Muted valley floor, darker ridges, a faint survey grid.
          vec3 base = mix(vec3(0.075, 0.085, 0.065), vec3(0.15, 0.15, 0.13), smoothstep(0.0, 28.0, vH));
          float lines = grid(vMap, 4.0) * 0.35 + grid(vMap, 20.0) * 0.55;
          vec3 col = mix(base, vec3(0.03, 0.035, 0.03), lines * 0.45 * smoothstep(110.0, 8.0, dist));
          // Perception sweep: a ring that expands across the valley floor.
          float ring = abs(length(vWorld.xz) - mod(uTime * 9.0, 46.0));
          col = mix(col, vec3(0.02, 0.32, 0.55), uScan * smoothstep(1.2, 0.0, ring) * 0.8);
          float fog = 1.0 - exp(-dist * dist * 0.00006);
          col = mix(col, skyBase(normalize(vec3(dir.x, 0.012, dir.z))), fog);
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  terrain.position.y = -7.5;
  scene.add(terrain);

  /* Aircraft ---------------------------------------------------------- */
  const mats = makeMaterials();
  const mother = buildCopter(6, 1, mats, mats.carbon, mats.accent);
  const daughter = buildCopter(4, 0.36, mats, mats.shell, mats.accent);
  const rig = new THREE.Group();
  rig.add(mother.group); scene.add(rig); scene.add(daughter.group);
  const dockY = mother.bodyR * 0.25 + mother.bodyR * 0.31 + daughter.bodyR * 0.24;

  const sunLight = new THREE.DirectionalLight(0xfff3e4, 2.1); sunLight.position.set(-18, 30, -24);
  const fill = new THREE.DirectionalLight(0xd2dde6, 0.6); fill.position.set(8, 5, 12);
  scene.add(sunLight, fill, new THREE.HemisphereLight(0xc4ced6, 0x3c3d35, 1.2));

  // Perception cone under the mothership (shot 4).
  const coneMat = new THREE.MeshBasicMaterial({ color: SCAN, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(3.4, 7, 40, 1, true), coneMat);
  cone.position.y = -3.7; scene.add(cone);

  /* Dust streaming past ------------------------------------------------ */
  const DUST = mobile ? 160 : 320;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) dustPos.set([(Math.random() - 0.5) * 30, Math.random() * 12 - 5.5, Math.random() * 70 - 45], i * 3);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xe9ebec, size: 0.03, transparent: true, opacity: 0.35, depthWrite: false }));
  scene.add(dust);

  /* Post ---------------------------------------------------------------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.12, 0.4, 0.97);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let width = 1, height = 1;
  const resize = () => {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    if (w === width && h === height) return;
    width = w; height = h;
    renderer.setSize(w, h, false); composer.setSize(w, h);
    camera.aspect = w / h;
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  /* Loop ---------------------------------------------------------------- */
  let target = 0, p = 0, t = opts.reducedMotion ? 4 : 0, last = performance.now(), raf = 0, visible = true, frames = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const look = new THREE.Vector3();
  const SPEED = 15;

  const frame = (now: number) => {
    raf = 0;
    // rAF timestamps can predate the performance.now() taken in kick(): clamp to >= 0.
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = Math.max(last, now);
    if (!opts.reducedMotion) t += dt;
    p += (target - p) * Math.min(1, dt * 5.5);
    mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;

    // Camera: blend between neighbouring shots.
    const f = Math.min(SHOTS.length - 1.0001, Math.max(0, p * (SHOTS.length - 1)));
    const i = Math.floor(f), k = smoother(f - i);
    const a = SHOTS[i]!, b = SHOTS[i + 1]!;
    const ang = lerp(a.ang, b.ang, k) + mouse.x * 0.09 + Math.sin(t * 0.21) * 0.035;
    const r = lerp(a.r, b.r, k) * (camera.aspect < 0.8 ? 1.5 : 1);
    camera.position.set(Math.sin(ang) * r, lerp(a.y, b.y, k) - mouse.y * 0.3 + Math.sin(t * 0.33) * 0.08, Math.cos(ang) * r);
    look.set(lerp(a.look[0], b.look[0], k), lerp(a.look[1], b.look[1], k), lerp(a.look[2], b.look[2], k));
    camera.lookAt(look);
    camera.fov = lerp(a.fov, b.fov, k);
    const shift = lerp(a.shift, b.shift, k);
    if (camera.aspect > 1.05) camera.setViewOffset(width, height, -shift * width * 0.17, height * 0.02, width, height);
    else camera.setViewOffset(width, height, 0, height * 0.14, width, height);
    camera.updateProjectionMatrix();

    // Mothership: forward-pitched cruise with a slow hover drift.
    const bob = Math.sin(t * 1.25) * 0.09;
    rig.position.set(Math.sin(t * 0.5) * 0.12, bob, 0);
    rig.rotation.set(-0.1 + Math.cos(t * 0.7) * 0.025, Math.sin(t * 0.3) * 0.06, Math.sin(t * 0.9) * 0.05 - mouse.x * 0.06);
    for (const prop of mother.props) prop.rotation.y += dt * 46 * prop.userData['dir'];

    // Daughter: docked → lifts off (shot 3) → runs ahead (shot 4).
    const launch = smooth(0.38, 0.6, p), ahead = smooth(0.74, 0.98, p);
    const orbit = t * 0.85;
    const docked = new THREE.Vector3(0, dockY, 0).applyEuler(rig.rotation).add(rig.position);
    const flying = new THREE.Vector3(Math.cos(orbit) * 1.15 * (1 - ahead * 0.6) + ahead * 1.4, 1.55 + Math.sin(t * 1.9) * 0.07 - ahead * 2.4, Math.sin(orbit) * 0.9 * (1 - ahead) - ahead * 6.5);
    daughter.group.position.lerpVectors(docked, flying, launch);
    daughter.group.rotation.set(lerp(rig.rotation.x, -0.16 - ahead * 0.1, launch), lerp(rig.rotation.y, Math.sin(orbit) * 0.5 * (1 - ahead), launch), lerp(rig.rotation.z, Math.cos(orbit) * 0.16 * (1 - ahead), launch));
    for (const prop of daughter.props) prop.rotation.y += dt * (8 + 50 * smooth(0.3, 0.42, p)) * prop.userData['dir'];

    // World streaming past.
    terrainUniforms.uOffset.value.y = -t * SPEED;
    terrainUniforms.uTime.value = t;
    const scan = smooth(0.78, 0.96, p);
    terrainUniforms.uScan.value = scan;
    coneMat.opacity = scan * (0.05 + Math.sin(t * 3) * 0.01);
    cone.position.x = rig.position.x; cone.rotation.y = t * 0.4;
    const pos = dustGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let d = 0; d < DUST; d++) { let z = pos.getZ(d) + dt * SPEED * 1.25; if (z > 25) z -= 70; pos.setZ(d, z); }
    pos.needsUpdate = true;
    stars.rotation.y = t * 0.002;

    composer.render();
    if (frames === 1) opts.onFirstFrame?.();
    if (frames++ % 6 === 0) opts.onTelemetry?.({ alt: 120 + bob * 4 + lerp(a.y, b.y, k) * 0, spd: SPEED + Math.sin(t * 0.8) * 0.4, hdg: ((Math.sin(t * 0.3) * 3.4 + 360) % 360), time: t });
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; kick(); });
  io.observe(canvas);
  const onMove = (e: PointerEvent) => { if (e.pointerType === "touch") return; mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", kick);
  kick();

  return {
    setProgress: (v) => { target = Math.min(1, Math.max(0, v)); },
    dispose: () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", kick);
      scene.traverse((o) => { const mesh = o as THREE.Mesh; mesh.geometry?.dispose?.(); });
      Object.values(mats).forEach((m) => m.dispose());
      pmrem.dispose(); composer.dispose(); renderer.dispose();
    },
  };
}
