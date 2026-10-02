import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * True-to-shape geometry for every blueprint component: extruded plate
 * profiles with real cut-outs, lathed bodies of revolution and assembled
 * sub-parts. Built once and shared by all instances (1 unit ≈ 257 mm).
 */

type XY = [number, number];

/* ---------- builders ---------- */

/** Rounded-rectangle outline centred on the origin. */
function roundedRect(w: number, h: number, r: number) {
  return traceRoundedRect(new THREE.Shape(), w, h, r);
}

/** Same outline as a hole path. */
function roundedRectPath(w: number, h: number, r: number) {
  return traceRoundedRect(new THREE.Path(), w, h, r);
}

function traceRoundedRect<T extends THREE.Path>(target: T, w: number, h: number, r: number): T {
  const x = -w / 2,
    y = -h / 2;
  target.moveTo(x + r, y);
  target.lineTo(x + w - r, y);
  target.quadraticCurveTo(x + w, y, x + w, y + r);
  target.lineTo(x + w, y + h - r);
  target.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  target.lineTo(x + r, y + h);
  target.quadraticCurveTo(x, y + h, x, y + h - r);
  target.lineTo(x, y + r);
  target.quadraticCurveTo(x, y, x + r, y);
  return target;
}

function rectHole(cx: number, cy: number, w: number, h: number, r: number) {
  const p = roundedRectPath(w, h, r);
  return translatePath(p, cx, cy);
}

function circleHole(cx: number, cy: number, r: number) {
  const p = new THREE.Path();
  p.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return p;
}

function translatePath(p: THREE.Path, dx: number, dy: number) {
  const out = new THREE.Path();
  p.getPoints(8).forEach((pt, i) =>
    i ? out.lineTo(pt.x + dx, pt.y + dy) : out.moveTo(pt.x + dx, pt.y + dy),
  );
  return out;
}

function polygon(points: XY[]) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}

/** Flat part: shape drawn in plan view (x, z), extruded upward by `t`, centred on y = 0. */
function plate(shape: THREE.Shape, t: number, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 1,
    curveSegments: 10,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -t / 2, 0);
  return g;
}

/** Profile drawn in the YZ cross-section, extruded along X by `len`, centred. */
function sectionX(shape: THREE.Shape, len: number) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: len,
    bevelEnabled: false,
    curveSegments: 12,
  });
  g.rotateY(Math.PI / 2);
  g.translate(-len / 2, 0, 0);
  return g;
}

/** Profile drawn in the XY front face, extruded along Z by `len`, centred. */
function sectionZ(shape: THREE.Shape, len: number) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: len,
    bevelEnabled: false,
    curveSegments: 10,
  });
  g.translate(0, 0, -len / 2);
  return g;
}

/** Body of revolution about Y from [radius, y] points. */
function lathe(profile: XY[], segments = 28) {
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
}

function merge(parts: THREE.BufferGeometry[]) {
  const flat = parts.map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    if (!n.getAttribute("uv"))
      n.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(n.getAttribute("position").count * 2), 2),
      );
    return n;
  });
  return mergeGeometries(flat) ?? flat[0]!;
}

const at = (g: THREE.BufferGeometry, x: number, y: number, z: number, ry = 0) => {
  const c = g.clone();
  if (ry) c.rotateY(ry);
  c.translate(x, y, z);
  return c;
};

/* ---------- frame ---------- */

function chamferedSquare(half: number, chamfer: number) {
  const a = half,
    c = half - chamfer;
  return polygon([
    [-c, -a],
    [c, -a],
    [a, -c],
    [a, c],
    [c, a],
    [-c, a],
    [-a, c],
    [-a, -c],
  ]);
}

function topPlate() {
  const s = chamferedSquare(0.27, 0.09);
  s.holes.push(
    rectHole(0, 0.11, 0.2, 0.05, 0.02),
    rectHole(0, -0.11, 0.2, 0.05, 0.02),
    circleHole(0, 0, 0.035),
  );
  for (const x of [-0.2, 0.2]) for (const y of [-0.2, 0.2]) s.holes.push(circleHole(x, y, 0.012));
  for (const x of [-0.05, 0.05])
    for (const y of [-0.05, 0.05]) s.holes.push(circleHole(x, y, 0.007));
  return plate(s, 0.016);
}

function bottomPlate() {
  const s = chamferedSquare(0.25, 0.08);
  s.holes.push(
    rectHole(-0.12, 0, 0.035, 0.2, 0.012),
    rectHole(0.12, 0, 0.035, 0.2, 0.012),
    circleHole(0, 0, 0.03),
  );
  for (const x of [-0.2, 0.2]) for (const y of [-0.2, 0.2]) s.holes.push(circleHole(x, y, 0.012));
  return plate(s, 0.016);
}

function armClamp() {
  const s = roundedRect(0.08, 0.075, 0.014);
  s.holes.push(circleHole(0, 0, 0.027));
  const clamp = sectionX(s, 0.06);
  const slot = new THREE.BoxGeometry(0.06, 0.004, 0.03);
  slot.translate(0, 0, 0.045);
  const bolt = new THREE.CylinderGeometry(0.007, 0.007, 0.09, 6);
  return merge([clamp, at(bolt, -0.018, 0, 0.032), at(bolt, 0.018, 0, 0.032)]);
}

/* ---------- motor + propeller ---------- */

function motorMount() {
  const arm = 0.085,
    w = 0.022;
  const cross = polygon([
    [-w, -arm],
    [w, -arm],
    [w, -w],
    [arm, -w],
    [arm, w],
    [w, w],
    [w, arm],
    [-w, arm],
    [-w, w],
    [-arm, w],
    [-arm, -w],
    [-w, -w],
  ]);
  cross.holes.push(circleHole(0, 0, 0.014));
  for (const [x, y] of [
    [0, 0.065],
    [0, -0.065],
    [0.065, 0],
    [-0.065, 0],
  ] as XY[])
    cross.holes.push(circleHole(x, y, 0.006));
  const g = plate(cross, 0.01);
  g.rotateY(Math.PI / 4);
  return g;
}

function stator() {
  const teeth = 12,
    rOut = 0.05,
    rIn = 0.036,
    s = new THREE.Shape();
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2,
      span = (Math.PI * 2) / teeth;
    const pts: [number, number][] = [
      [rIn, a0 + span * 0.32],
      [rOut, a0 + span * 0.18],
      [rOut, a0 + span * 0.82],
      [rIn, a0 + span * 0.68],
    ];
    pts.forEach(([r, a], j) =>
      i === 0 && j === 0
        ? s.moveTo(Math.cos(a) * r, Math.sin(a) * r)
        : s.lineTo(Math.cos(a) * r, Math.sin(a) * r),
    );
  }
  s.closePath();
  s.holes.push(circleHole(0, 0, 0.016));
  return plate(s, 0.04);
}

const bell = () =>
  lathe(
    [
      [0.016, 0.03],
      [0.03, 0.03],
      [0.06, 0.026],
      [0.07, 0.02],
      [0.07, -0.025],
      [0.066, -0.027],
    ],
    32,
  );

/** Magnet ring bonded inside the bell (drawn as one ring to keep the motor legible). */
const magnets = () =>
  lathe(
    [
      [0.058, -0.018],
      [0.064, -0.018],
      [0.064, 0.018],
      [0.058, 0.018],
      [0.058, -0.018],
    ],
    28,
  );

function propeller() {
  const blade = new THREE.Shape();
  blade.moveTo(0.025, -0.012);
  blade.splineThru([
    new THREE.Vector2(0.025, 0.014),
    new THREE.Vector2(0.08, 0.03),
    new THREE.Vector2(0.17, 0.021),
    new THREE.Vector2(0.215, 0.008),
  ]);
  blade.quadraticCurveTo(0.226, 0, 0.215, -0.006);
  blade.splineThru([
    new THREE.Vector2(0.17, -0.011),
    new THREE.Vector2(0.09, -0.019),
    new THREE.Vector2(0.025, -0.012),
  ]);
  const one = plate(blade, 0.005, 0.0015);
  one.rotateX(0.22); // blade pitch
  const two = one.clone();
  two.rotateY(Math.PI);
  const hub = lathe(
    [
      [0, 0.018],
      [0.012, 0.016],
      [0.022, 0.006],
      [0.026, -0.008],
      [0, -0.008],
    ],
    20,
  );
  return merge([one, two, hub]);
}

const propNut = () =>
  merge([
    new THREE.CylinderGeometry(0.014, 0.014, 0.01, 6),
    at(
      lathe(
        [
          [0.012, 0],
          [0.01, 0.006],
          [0.005, 0.01],
          [0, 0.011],
        ],
        16,
      ),
      0,
      0.005,
      0,
    ),
  ]);

/* ---------- electronics ---------- */

function pcb(w: number, d: number, holes: XY[], t = 0.008, holeR = 0.006) {
  const s = roundedRect(w, d, 0.01);
  holes.forEach(([x, y]) => s.holes.push(circleHole(x, y, holeR)));
  return plate(s, t);
}

const chip = (w: number, h: number, d: number, x: number, y: number, z: number, ry = 0) =>
  at(new THREE.BoxGeometry(w, h, d), x, y, z, ry);

function esc() {
  const board = pcb(0.12, 0.05, [], 0.008);
  const fets = [-0.03, -0.01, 0.01, 0.03].map((x) => chip(0.014, 0.006, 0.012, x, 0.007, 0.012));
  const mcu = chip(0.016, 0.004, 0.016, 0.0, 0.006, -0.012, Math.PI / 4);
  const cap = at(new THREE.CylinderGeometry(0.011, 0.011, 0.028, 14), 0.05, 0.018, -0.008);
  return merge([board, ...fets, mcu, cap]);
}

const LED = () =>
  merge([
    pcb(0.03, 0.02, [], 0.004),
    at(
      lathe(
        [
          [0.008, 0],
          [0.007, 0.004],
          [0.004, 0.007],
          [0, 0.008],
        ],
        14,
      ),
      0,
      0.002,
      0,
    ),
  ]);

function flightController() {
  const board = pcb(
    0.14,
    0.14,
    [
      [-0.05, -0.05],
      [-0.05, 0.05],
      [0.05, -0.05],
      [0.05, 0.05],
    ],
    0.008,
    0.008,
  );
  const mcu = chip(0.034, 0.005, 0.034, 0, 0.0065, 0, Math.PI / 4);
  const usb = chip(0.022, 0.009, 0.016, 0, 0.008, 0.062);
  const header = chip(0.09, 0.008, 0.008, 0, 0.008, -0.062);
  return merge([board, mcu, usb, header]);
}

const grommet = () =>
  lathe(
    [
      [0.006, -0.015],
      [0.013, -0.015],
      [0.013, -0.009],
      [0.008, -0.004],
      [0.008, 0.004],
      [0.013, 0.009],
      [0.013, 0.015],
      [0.006, 0.015],
    ],
    16,
  );

function companionComputer() {
  const board = pcb(0.16, 0.11, [
    [-0.068, -0.043],
    [-0.068, 0.043],
    [0.068, -0.043],
    [0.068, 0.043],
  ]);
  const soc = chip(0.04, 0.005, 0.04, -0.02, 0.0065, 0);
  const usbA = chip(0.03, 0.03, 0.025, 0.065, 0.019, 0.025);
  const usbB = chip(0.03, 0.03, 0.025, 0.065, 0.019, -0.012);
  const eth = chip(0.03, 0.026, 0.03, 0.062, 0.017, -0.04);
  const gpio = chip(0.11, 0.009, 0.01, -0.01, 0.0085, 0.046);
  return merge([board, soc, usbA, usbB, eth, gpio]);
}

function heatsink() {
  const base = chip(0.08, 0.006, 0.07, 0, 0, 0);
  const fins = [-0.032, -0.016, 0, 0.016, 0.032].map((x) => chip(0.004, 0.026, 0.066, x, 0.016, 0));
  return merge([base, ...fins]);
}

function receiver() {
  const s = roundedRect(0.05, 0.03, 0.008);
  const body = plate(s, 0.012, 0.002);
  const whip = new THREE.CylinderGeometry(0.0025, 0.0025, 0.1, 6);
  const sleeve = new THREE.CylinderGeometry(0.005, 0.005, 0.03, 8);
  const w1 = merge([at(whip, 0, 0.05, 0), at(sleeve, 0, 0.085, 0)]);
  w1.rotateZ(0.5);
  const w2 = merge([at(whip, 0, 0.05, 0), at(sleeve, 0, 0.085, 0)]);
  w2.rotateZ(-0.5);
  return merge([body, at(w1, -0.02, 0.006, 0), at(w2, 0.02, 0.006, 0)]);
}

function videoTx() {
  const board = pcb(0.05, 0.04, [], 0.006);
  const shield = chip(0.03, 0.008, 0.026, -0.004, 0.007, 0);
  const sma = merge([
    new THREE.CylinderGeometry(0.006, 0.006, 0.006, 6),
    at(new THREE.CylinderGeometry(0.004, 0.004, 0.016, 10), 0, 0.011, 0),
  ]);
  const mast = at(new THREE.CylinderGeometry(0.0035, 0.0035, 0.07, 8), 0, 0.054, 0);
  const clover = at(
    lathe(
      [
        [0.004, 0],
        [0.016, 0.004],
        [0.017, 0.012],
        [0.01, 0.018],
        [0, 0.019],
      ],
      16,
    ),
    0,
    0.088,
    0,
  );
  return merge([
    board,
    shield,
    at(sma, 0.018, 0.006, 0),
    at(mast, 0.018, 0, 0),
    at(clover, 0.018, 0, 0),
  ]);
}

const buzzer = () =>
  lathe(
    [
      [0.006, 0.0125],
      [0.02, 0.0125],
      [0.021, 0.008],
      [0.021, -0.0125],
      [0, -0.0125],
    ],
    24,
  );

function pdb() {
  const s = roundedRect(0.24, 0.24, 0.03);
  s.holes.push(circleHole(0, 0, 0.03));
  const board = plate(s, 0.008);
  const pads = [0.085, -0.085].flatMap((x) =>
    [0.085, -0.085].map((z) => chip(0.03, 0.003, 0.02, x, 0.0055, z)),
  );
  return merge([board, ...pads]);
}

/* ---------- power ---------- */

function battery() {
  const pack = plate(roundedRect(0.33, 0.15, 0.025), 0.11, 0.008);
  return pack;
}

const cell = () => new THREE.BoxGeometry(0.072, 0.1, 0.13);

function strap() {
  // Loop sized to the pack's YZ cross-section (≈0.166 deep × 0.126 tall).
  const s = roundedRect(0.182, 0.142, 0.03);
  s.holes.push(roundedRectPath(0.17, 0.13, 0.024));
  const band = sectionZ(s, 0.05);
  band.rotateY(Math.PI / 2);
  const buckle = chip(0.05, 0.008, 0.06, 0, 0.073, 0);
  return merge([band, buckle]);
}

function xt60() {
  const housing = polygon([
    [-0.0155, -0.0085],
    [0.0155, -0.0085],
    [0.0155, 0.0035],
    [0.0105, 0.0085],
    [-0.0105, 0.0085],
    [-0.0155, 0.0035],
  ]);
  housing.holes.push(circleHole(-0.0072, 0, 0.0038), circleHole(0.0072, 0, 0.0038));
  return sectionZ(housing, 0.025);
}

/* ---------- sensors, payload, gear ---------- */

function gpsMast() {
  const base = plate(roundedRect(0.04, 0.04, 0.006), 0.006);
  const tube = at(new THREE.CylinderGeometry(0.007, 0.007, 0.15, 12), 0, 0.078, 0);
  const hinge = chip(0.022, 0.018, 0.018, 0, 0.03, 0);
  return merge([base, tube, hinge]);
}

function gpsPuck() {
  const dome = lathe(
    [
      [0, -0.012],
      [0.05, -0.012],
      [0.052, -0.004],
      [0.048, 0.006],
      [0.036, 0.013],
      [0.018, 0.017],
      [0, 0.018],
    ],
    32,
  );
  const arrow = plate(
    polygon([
      [0, 0.022],
      [0.012, 0.004],
      [0.005, 0.004],
      [0.005, -0.016],
      [-0.005, -0.016],
      [-0.005, 0.004],
      [-0.012, 0.004],
    ]),
    0.002,
  );
  return merge([dome, at(arrow, 0, 0.019, 0)]);
}

function gimbalMount() {
  const s = roundedRect(0.1, 0.1, 0.015);
  for (const x of [-0.035, 0.035])
    for (const y of [-0.035, 0.035]) s.holes.push(circleHole(x, y, 0.006));
  const p = plate(s, 0.008);
  const balls = [-0.035, 0.035].flatMap((x) =>
    [-0.035, 0.035].map((z) => at(new THREE.SphereGeometry(0.009, 8, 6), x, -0.01, z)),
  );
  const yawMotor = at(new THREE.CylinderGeometry(0.022, 0.022, 0.016, 18), 0, -0.026, 0);
  return merge([p, ...balls, yawMotor]);
}

function gimbalYoke() {
  const l = polygon([
    [-0.05, 0.004],
    [0.05, 0.004],
    [0.05, -0.06],
    [0.042, -0.06],
    [0.042, -0.004],
    [-0.042, -0.004],
    [-0.042, -0.06],
    [-0.05, -0.06],
  ]);
  const yoke = sectionZ(l, 0.012);
  const rollMotor = new THREE.CylinderGeometry(0.016, 0.016, 0.01, 16);
  rollMotor.rotateZ(Math.PI / 2);
  return merge([yoke, at(rollMotor, 0.054, -0.042, 0), at(rollMotor, -0.054, -0.042, 0)]);
}

function camera() {
  const body = sectionZ(roundedRect(0.07, 0.048, 0.008), 0.05);
  const barrel = lathe(
    [
      [0.02, 0],
      [0.02, 0.008],
      [0.017, 0.01],
      [0.017, 0.022],
      [0.019, 0.024],
      [0.019, 0.03],
      [0.012, 0.03],
    ],
    24,
  );
  barrel.rotateX(-Math.PI / 2);
  barrel.translate(0, 0, -0.025);
  return merge([body, barrel]);
}

const strut = () => new THREE.CylinderGeometry(0.01, 0.01, 0.33, 12);

function skid() {
  const tube = new THREE.CapsuleGeometry(0.014, 0.68, 4, 12);
  const tee = new THREE.CylinderGeometry(0.019, 0.019, 0.05, 12);
  return merge([tube, at(tee, 0, -0.2, 0), at(tee, 0, 0.2, 0)]);
}

function telemetryAntenna() {
  const base = new THREE.CylinderGeometry(0.008, 0.008, 0.02, 10);
  const whip = at(new THREE.CylinderGeometry(0.004, 0.0055, 0.16, 8), 0, -0.09, 0);
  return merge([base, whip]);
}

/* ---------- catalogue ---------- */

let cache: ReturnType<typeof build> | null = null;
function build() {
  return {
    plate: topPlate(),
    plateLow: bottomPlate(),
    standoff: new THREE.CylinderGeometry(0.011, 0.011, 0.1, 6),
    pdb: pdb(),
    fc: flightController(),
    imu: new THREE.BoxGeometry(0.025, 0.008, 0.025),
    grommet: grommet(),
    computer: companionComputer(),
    heatsink: heatsink(),
    rx: receiver(),
    vtx: videoTx(),
    battery: battery(),
    cell: cell(),
    strap: strap(),
    xt60: xt60(),
    gpsMast: gpsMast(),
    gps: gpsPuck(),
    gpsPatch: new THREE.BoxGeometry(0.05, 0.004, 0.05),
    gimbalMount: gimbalMount(),
    gimbalYoke: gimbalYoke(),
    camera: camera(),
    strut: strut(),
    skid: skid(),
    antenna: telemetryAntenna(),
    buzzer: buzzer(),
    // arm
    tube: new THREE.CylinderGeometry(0.026, 0.026, 0.76, 8),
    clamp: armClamp(),
    esc: esc(),
    led: LED(),
    // motor
    motorMount: motorMount(),
    stator: stator(),
    bell: bell(),
    magnets: magnets(),
    shaft: new THREE.CylinderGeometry(0.008, 0.008, 0.05, 10),
    propeller: propeller(),
    propNut: propNut(),
  };
}

export function partGeometry() {
  return (cache ??= build());
}
