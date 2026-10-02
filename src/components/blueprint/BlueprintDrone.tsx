import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MOTORS, getPartInfo, type PartInfo } from "@/lib/droneParts";
import { partGeometry } from "./partGeometry";

export const BLUE = "#1d4ed8";
export const BLUE_LIGHT = "#5f8cf0";
const HOT = "#ea580c";

export interface HoverState {
  info: PartInfo;
  x: number;
  y: number;
}

type V3 = [number, number, number];
type SetHover = (h: HoverState | null) => void;

const HotCtx = createContext(false);

const HOT_FILL = new THREE.MeshBasicMaterial({
  color: HOT,
  transparent: true,
  opacity: 0.2,
  depthWrite: false,
  side: THREE.DoubleSide,
  polygonOffset: true,
  polygonOffsetFactor: 1,
});

/* ---------- hover wrapper ---------- */

interface PartProps {
  name: string;
  hovered?: string | null;
  setHovered: SetHover;
  children: React.ReactNode;
}

/** Wraps children, highlights them on hover and reports part metadata for the tooltip. */
export function Part({ name, setHovered, children }: PartProps) {
  const [hot, setHot] = useState(false);
  const info = useMemo(() => getPartInfo(name), [name]);
  const report = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHot(true);
    setHovered({ info, x: e.clientX, y: e.clientY });
  };
  return (
    <group
      onPointerOver={report}
      onPointerMove={report}
      onPointerOut={() => {
        setHot(false);
        setHovered(null);
      }}
    >
      <HotCtx.Provider value={hot}>{children}</HotCtx.Provider>
    </group>
  );
}

/* ---------- line helpers ---------- */

export function useBlueprintMats() {
  return useMemo(() => {
    const fill = new THREE.MeshBasicMaterial({
      color: BLUE,
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
    });
    return { fill };
  }, []);
}

/** Mesh with faint fill and edge lines. dashed = hidden/internal part drawn with dotted lines. */
export function EdgedMesh({
  geometry,
  position,
  rotation,
  dashed = false,
  fill,
}: {
  geometry: THREE.BufferGeometry;
  position?: V3 | undefined;
  rotation?: V3 | undefined;
  dashed?: boolean;
  fill: THREE.Material;
}) {
  const hot = useContext(HotCtx);
  const line = useMemo(() => {
    const edges = new THREE.EdgesGeometry(geometry, 25);
    const mat = dashed
      ? new THREE.LineDashedMaterial({ color: BLUE_LIGHT, dashSize: 0.016, gapSize: 0.011 })
      : new THREE.LineBasicMaterial({ color: BLUE });
    const l = new THREE.LineSegments(edges, mat);
    if (dashed) l.computeLineDistances();
    l.renderOrder = 1;
    l.raycast = () => {};
    return l;
  }, [geometry, dashed]);

  useEffect(() => {
    (line.material as THREE.LineBasicMaterial).color.set(hot ? HOT : dashed ? BLUE_LIGHT : BLUE);
  }, [hot, dashed, line]);

  return (
    <group {...(position && { position })} {...(rotation && { rotation })}>
      <mesh geometry={geometry} material={hot ? HOT_FILL : fill} />
      <primitive object={line} />
    </group>
  );
}

export function DashedLine({
  points,
  color = BLUE_LIGHT,
  dash = 0.02,
  gap = 0.014,
  loop = false,
  opacity = 0.9,
}: {
  points: V3[];
  color?: string;
  dash?: number;
  gap?: number;
  loop?: boolean;
  opacity?: number;
}) {
  const obj = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p)));
    const m = new THREE.LineDashedMaterial({
      color,
      dashSize: dash,
      gapSize: gap,
      transparent: true,
      opacity,
    });
    const l = loop ? new THREE.LineLoop(g, m) : new THREE.Line(g, m);
    l.computeLineDistances();
    l.raycast = () => {};
    return l;
  }, [points, color, dash, gap, loop, opacity]);
  return <primitive object={obj} />;
}

function Ring({
  r,
  y = 0,
  ...rest
}: {
  r: number;
  y?: number;
  color?: string;
  dash?: number;
  gap?: number;
  opacity?: number;
}) {
  const pts = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const a = (i / 72) * Math.PI * 2;
        return [Math.cos(a) * r, y, Math.sin(a) * r] as V3;
      }),
    [r, y],
  );
  return <DashedLine points={pts} loop {...rest} />;
}

/** Hoverable dashed wire (one or more strands). The first path is used as the hover target. */
function Wire({
  name,
  paths,
  setHovered,
  hitR = 0.025,
}: {
  name: string;
  paths: V3[][];
  setHovered: SetHover;
  hitR?: number;
}) {
  const curves = useMemo(
    () => paths.map((p) => new THREE.CatmullRomCurve3(p.map((v) => new THREE.Vector3(...v)))),
    [paths],
  );
  const hit = useMemo(() => new THREE.TubeGeometry(curves[0]!, 20, hitR, 5, false), [curves, hitR]);
  const lines = useMemo(
    () => curves.map((c) => c.getPoints(24).map((v) => [v.x, v.y, v.z] as V3)),
    [curves],
  );
  return (
    <Part name={name} setHovered={setHovered}>
      <WireBody hit={hit} lines={lines} />
    </Part>
  );
}

function WireBody({ hit, lines }: { hit: THREE.BufferGeometry; lines: V3[][] }) {
  const hot = useContext(HotCtx);
  return (
    <>
      <mesh geometry={hit}>
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {lines.map((l, i) => (
        <DashedLine
          key={i}
          points={l}
          color={hot ? HOT : BLUE_LIGHT}
          dash={0.016}
          gap={0.01}
          opacity={1}
        />
      ))}
    </>
  );
}

/* ---------- constants ---------- */

const ARM_R = 0.877; // radial motor distance (motors sit at ±0.62, ±0.62)
const MP = 0.62;

const POWER_PATHS: V3[][] = [
  [
    [0.1, 0, 0.015],
    [0.22, 0.02, 0.02],
    [0.37, 0.04, 0.015],
  ],
];
const PHASE_PATHS: V3[][] = [-0.02, 0, 0.02].map(
  (z) =>
    [
      [0.48, 0.04, z],
      [0.66, 0.065, z * 2],
      [0.84, 0.05, z],
    ] as V3[],
);
const MAIN_LEAD: V3[][] = [
  [
    [0, -0.13, 0.105],
    [0, -0.12, 0.2],
    [0, -0.05, 0.19],
    [0, -0.02, 0.11],
  ],
];
const BALANCE_LEAD: V3[][] = [
  [
    [0.13, -0.09, 0.08],
    [0.2, -0.1, 0.15],
    [0.17, -0.2, 0.1],
  ],
];
const FOV_LINES: V3[][] = [
  [
    [0, 0, -0.045],
    [0.14, 0.1, -0.45],
  ],
  [
    [0, 0, -0.045],
    [-0.14, 0.1, -0.45],
  ],
  [
    [0, 0, -0.045],
    [0.14, -0.1, -0.45],
  ],
  [
    [0, 0, -0.045],
    [-0.14, -0.1, -0.45],
  ],
];
const FOV_FRAME: V3[] = [
  [0.14, 0.1, -0.45],
  [-0.14, 0.1, -0.45],
  [-0.14, -0.1, -0.45],
  [0.14, -0.1, -0.45],
];
const SQUARE: V3[] = [
  [-MP, 0, -MP],
  [MP, 0, -MP],
  [MP, 0, MP],
  [-MP, 0, MP],
];
const DIAG_A: V3[] = [
  [-MP, 0, -MP],
  [MP, 0, MP],
];
const DIAG_B: V3[] = [
  [MP, 0, -MP],
  [-MP, 0, MP],
];

/** Blueprint floor plan: prop-disc footprints, frame outline, diagonals and wheelbase dimension. */
export function FloorPlan() {
  return (
    <group>
      {MOTORS.map((m) => (
        <group key={m.id} position={[m.position[0] * MP, 0.002, m.position[2] * MP]}>
          <Ring r={0.44} opacity={0.7} />
          <Ring r={0.03} opacity={0.9} />
        </group>
      ))}
      <DashedLine points={SQUARE} loop opacity={0.6} />
      <DashedLine points={DIAG_A} opacity={0.6} />
      <DashedLine points={DIAG_B} opacity={0.6} />
      <Html
        position={[0.38, 0.01, 0.38]}
        center
        zIndexRange={[5, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            font: "500 10px 'JetBrains Mono', monospace",
            color: BLUE,
            background: "#fff",
            border: "1px dashed #5f8cf0",
            padding: "1px 6px",
            whiteSpace: "nowrap",
          }}
        >
          WHEELBASE · 450 mm
        </div>
      </Html>
    </group>
  );
}

/* ---------- motor + propeller ---------- */

function MotorUnit({
  id,
  ccw,
  rpm,
  fill,
  setHovered,
}: {
  id: string;
  ccw: boolean;
  rpm: number;
  fill: THREE.Material;
  setHovered: SetHover;
}) {
  const propRef = useRef<THREE.Group>(null);
  const angle = useRef(0);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    angle.current += (ccw ? 1 : -1) * (2 + rpm * 40) * dt;
    if (propRef.current) propRef.current.rotation.y = angle.current;
  });

  const g = partGeometry();

  return (
    <group>
      <Part name={`motor mount ${id}`} setHovered={setHovered}>
        <EdgedMesh geometry={g.motorMount} position={[0, 0.006, 0]} fill={fill} />
      </Part>
      <Part name={`motor stator ${id}`} setHovered={setHovered}>
        <EdgedMesh geometry={g.stator} position={[0, 0.034, 0]} dashed fill={fill} />
      </Part>
      <Part name={`motor rotor bell ${id}`} setHovered={setHovered}>
        <EdgedMesh geometry={g.bell} position={[0, 0.052, 0]} fill={fill} />
        <EdgedMesh geometry={g.magnets} position={[0, 0.05, 0]} dashed fill={fill} />
      </Part>
      <Part name={`motor shaft ${id}`} setHovered={setHovered}>
        <EdgedMesh geometry={g.shaft} position={[0, 0.1, 0]} fill={fill} />
      </Part>
      <group ref={propRef} position={[0, 0.155, 0]}>
        <Part name={`propeller ${id}`} setHovered={setHovered}>
          <EdgedMesh geometry={g.propeller} fill={fill} />
        </Part>
        <Part name={`prop nut ${id}`} setHovered={setHovered}>
          <EdgedMesh geometry={g.propNut} position={[0, 0.023, 0]} fill={fill} />
        </Part>
      </group>
      <Ring r={0.44} y={0.155} opacity={0.5} />
      {rpm > 0.55 && (
        <mesh position={[0, 0.155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.46, 32]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.05} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- arm (tube, clamp, ESC, wires, LED, motor) ---------- */

function Arm({
  m,
  ex,
  rpm,
  fill,
  setHovered,
}: {
  m: (typeof MOTORS)[number];
  ex: number;
  rpm: number;
  fill: THREE.Material;
  setHovered: SetHover;
}) {
  const angle = Math.atan2(m.position[2], m.position[0]);
  const g = partGeometry();

  return (
    <group rotation={[0, -angle, 0]}>
      <Part name={`arm tube ${m.id}`} setHovered={setHovered}>
        <EdgedMesh
          geometry={g.tube}
          position={[0.5, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          fill={fill}
        />
      </Part>
      <Part name={`arm clamp ${m.id}`} setHovered={setHovered}>
        <EdgedMesh geometry={g.clamp} position={[0.22, 0, 0]} fill={fill} />
      </Part>
      <group position={[0.42, 0.04 + ex * 0.12, 0]}>
        <Part name={`esc ${m.id}`} setHovered={setHovered}>
          <EdgedMesh geometry={g.esc} fill={fill} />
        </Part>
      </group>
      <Part name={`nav led ${m.id}`} setHovered={setHovered}>
        <EdgedMesh
          geometry={g.led}
          position={[0.78, -0.03, 0]}
          rotation={[Math.PI, 0, 0]}
          fill={fill}
        />
      </Part>
      {!ex && (
        <>
          <Wire name={`power wire ${m.id}`} paths={POWER_PATHS} setHovered={setHovered} />
          <Wire
            name={`motor phase wire ${m.id}`}
            paths={PHASE_PATHS}
            setHovered={setHovered}
            hitR={0.03}
          />
        </>
      )}
      <group position={[ARM_R + ex * 0.18, 0.03 + ex * 0.12, 0]}>
        <MotorUnit id={m.id} ccw={m.ccw} rpm={rpm} fill={fill} setHovered={setHovered} />
      </group>
    </group>
  );
}

/* ---------- the drone ---------- */

export interface Controls {
  throttle: number; // -1..1
  yaw: number;
  pitch: number;
  roll: number;
}

export function BlueprintDrone({
  controls,
  exploded,
  setHovered,
  onTelemetry,
}: {
  controls: React.MutableRefObject<Controls>;
  exploded: boolean;
  hovered?: string | null;
  setHovered: SetHover;
  onTelemetry: (t: { alt: number; speed: number; heading: number; rpm: number[] }) => void;
}) {
  const { fill } = useBlueprintMats();
  const root = useRef<THREE.Group>(null);
  const state = useRef({ alt: 0, heading: 0, pitch: 0, roll: 0, speed: 0 });
  const rpmRef = useRef([0.5, 0.5, 0.5, 0.5]);

  const g = partGeometry();

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const c = controls.current;
    const s = state.current;
    const k = 1 - Math.exp(-3 * dt);
    s.alt += (c.throttle * 0.8 - s.alt * 0.4) * k;
    s.heading += c.yaw * dt * 1.2;
    s.pitch += (c.pitch * 0.35 - s.pitch) * k;
    s.roll += (-c.roll * 0.35 - s.roll) * k;
    s.speed += (Math.hypot(c.pitch, c.roll) * 15 - s.speed) * k;
    if (root.current) {
      root.current.position.y = s.alt;
      root.current.rotation.set(s.pitch, s.heading, s.roll);
    }
    // quad-X mixing, additive and clamped
    const base = 0.5 + c.throttle * 0.5;
    const rpm = MOTORS.map((m) => {
      let v = base;
      v += m.ccw ? c.yaw * 0.3 : -c.yaw * 0.3;
      v += m.position[0] < 0 ? c.roll * 0.3 : -c.roll * 0.3;
      v += m.position[2] > 0 ? c.pitch * 0.3 : -c.pitch * 0.3;
      return Math.max(0, Math.min(1, v));
    });
    onTelemetry({
      alt: Math.max(0, Math.min(120, 60 + s.alt * 60)),
      speed: s.speed,
      heading: ((s.heading * 180) / Math.PI) % 360,
      rpm,
    });
    rpmRef.current = rpm;
  });

  const ex = exploded ? 1 : 0;
  const P = (name: string, children: React.ReactNode) => (
    <Part name={name} setHovered={setHovered}>
      {children}
    </Part>
  );

  return (
    <group ref={root}>
      {/* arms, ESCs, wires, motors, props */}
      {MOTORS.map((m, i) => (
        <Arm
          key={m.id}
          m={m}
          ex={ex}
          rpm={rpmRef.current[i] ?? 0.5}
          fill={fill}
          setHovered={setHovered}
        />
      ))}

      {/* plates + standoffs */}
      {P(
        "frame top plate",
        <EdgedMesh geometry={g.plate} position={[0, 0.05 + ex * 0.25, 0]} fill={fill} />,
      )}
      {P(
        "frame bottom plate",
        <EdgedMesh geometry={g.plateLow} position={[0, -0.05 - ex * 0.2, 0]} fill={fill} />,
      )}
      {[-0.2, 0.2].map((x) =>
        [-0.2, 0.2].map((z) => (
          <group key={`${x}${z}`} position={[x, ex * 0.025, z]} scale={[1, 1 + ex * 4.5, 1]}>
            {P("plate standoff", <EdgedMesh geometry={g.standoff} fill={fill} />)}
          </group>
        )),
      )}
      {P(
        "pdb power distribution",
        <EdgedMesh geometry={g.pdb} position={[0, -0.02 - ex * 0.1, 0]} dashed fill={fill} />,
      )}

      {/* flight controller on grommets */}
      <group position={[0, 0.09 + ex * 0.4, 0]}>
        {P(
          "flight controller fc imu",
          <>
            <EdgedMesh geometry={g.fc} fill={fill} />
            <EdgedMesh geometry={g.imu} position={[0, 0.016, 0]} dashed fill={fill} />
            {[-0.05, 0.05].map((x) =>
              [-0.05, 0.05].map((z) => (
                <EdgedMesh
                  key={`${x}${z}`}
                  geometry={g.grommet}
                  position={[x, -0.02, z]}
                  fill={fill}
                />
              )),
            )}
          </>,
        )}
      </group>

      {/* onboard computer + heatsink */}
      <group position={[0, 0.14 + ex * 0.55, 0.08]}>
        {P("onboard computer board", <EdgedMesh geometry={g.computer} fill={fill} />)}
        {P(
          "heatsink",
          <EdgedMesh geometry={g.heatsink} position={[-0.02, 0.012, 0]} fill={fill} />,
        )}
      </group>

      {/* RC receiver + video transmitter (rear of the top plate) */}
      <group position={[-0.13, 0.075 + ex * 0.45, 0.2]}>
        {P("rc receiver", <EdgedMesh geometry={g.rx} fill={fill} />)}
      </group>
      <group position={[0.13, 0.075 + ex * 0.45, 0.2]}>
        {P("vtx video transmitter", <EdgedMesh geometry={g.vtx} fill={fill} />)}
      </group>

      {/* buzzer */}
      <group position={[-0.2, 0.075 + ex * 0.3, -0.2]}>
        {P("buzzer", <EdgedMesh geometry={g.buzzer} fill={fill} />)}
      </group>

      {/* battery, strap, XT60, cells (dotted) */}
      <group position={[0, -0.13 - ex * 0.35, 0]}>
        {P(
          "battery lipo pack",
          <>
            <EdgedMesh geometry={g.battery} fill={fill} />
            {[-0.1275, -0.0425, 0.0425, 0.1275].map((x) => (
              <EdgedMesh key={x} geometry={g.cell} position={[x, 0, 0]} dashed fill={fill} />
            ))}
            <EdgedMesh geometry={g.strap} fill={fill} />
          </>,
        )}
        <group position={[0, 0, 0.095]}>
          {P("xt60 connector", <EdgedMesh geometry={g.xt60} fill={fill} />)}
        </group>
      </group>
      {!ex && (
        <>
          <Wire name="power wire main lead" paths={MAIN_LEAD} setHovered={setHovered} />
          <Wire name="balance lead" paths={BALANCE_LEAD} setHovered={setHovered} />
        </>
      )}

      {/* GPS mast + compass */}
      <group position={[0, 0.06 + ex * 0.7, 0.27]}>
        {P(
          "gps mast",
          <>
            <EdgedMesh geometry={g.gpsMast} fill={fill} />
            <EdgedMesh geometry={g.gps} position={[0, 0.172, 0]} fill={fill} />
            <EdgedMesh geometry={g.gpsPatch} position={[0, 0.172, 0]} dashed fill={fill} />
          </>,
        )}
      </group>

      {/* camera + 3-axis gimbal, with dotted field-of-view */}
      <group position={[0, -0.12 - ex * 0.5, -0.22]}>
        {P(
          "camera gimbal",
          <>
            <EdgedMesh geometry={g.gimbalMount} position={[0, 0.088, 0]} fill={fill} />
            <EdgedMesh geometry={g.gimbalYoke} position={[0, 0.05, 0]} fill={fill} />
            <EdgedMesh geometry={g.camera} fill={fill} />
          </>,
        )}
        {FOV_LINES.map((l, i) => (
          <DashedLine key={i} points={l} opacity={0.5} />
        ))}
        <DashedLine points={FOV_FRAME} loop opacity={0.5} />
      </group>

      {/* landing gear */}
      {[-1, 1].map((sx) => (
        <group key={sx}>
          {[-1, 1].map((sz) => (
            <group
              key={sz}
              position={[sx * 0.24, -0.24 - ex * 0.15, sz * 0.2]}
              rotation={[0, 0, sx * 0.245]}
            >
              {P("landing gear strut", <EdgedMesh geometry={g.strut} fill={fill} />)}
            </group>
          ))}
          <group position={[sx * 0.28, -0.4 - ex * 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            {P("landing gear skid", <EdgedMesh geometry={g.skid} fill={fill} />)}
          </group>
        </group>
      ))}

      {/* telemetry antenna */}
      <group position={[-0.12, -0.04, 0.3]} rotation={[0.3, 0, 0.35]}>
        {P("telemetry antenna", <EdgedMesh geometry={g.antenna} fill={fill} />)}
      </group>
    </group>
  );
}
