import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MOTORS, getPartInfo, type PartInfo } from "@/lib/droneParts";

export const BLUE = "#1d4ed8";
export const BLUE_LIGHT = "#93b4f5";

export interface HoverState {
  info: PartInfo;
  x: number;
  y: number;
}

interface PartProps {
  name: string;
  hovered: string | null;
  setHovered: (h: HoverState | null) => void;
  children: React.ReactNode;
}

/** Wraps children in a group that reports hover with part metadata. */
export function Part({ name, hovered, setHovered, children }: PartProps) {
  const dim = hovered !== null && hovered !== name;
  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered({ info: getPartInfo(name), x: e.clientX, y: e.clientY });
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        setHovered({ info: getPartInfo(name), x: e.clientX, y: e.clientY });
      }}
      onPointerOut={() => setHovered(null)}
    >
      <group scale={dim ? 1 : 1}>{children}</group>
    </group>
  );
}

/** Blueprint material pair: faint fill + solid edge lines. */
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

export function EdgedMesh({
  geometry,
  position,
  rotation,
  dashed = false,
  fill,
}: {
  geometry: THREE.BufferGeometry;
  position?: [number, number, number] | undefined;
  rotation?: [number, number, number] | undefined;
  dashed?: boolean;
  fill: THREE.Material;
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 25), [geometry]);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} material={fill} renderOrder={0} />
      {dashed ? (
        <lineSegments geometry={edges} renderOrder={1}>
          <lineDashedMaterial color={BLUE_LIGHT} dashSize={0.02} gapSize={0.014} transparent opacity={0.7} />
        </lineSegments>
      ) : (
        <lineSegments geometry={edges} renderOrder={1}>
          <lineBasicMaterial color={BLUE} />
        </lineSegments>
      )}
    </group>
  );
}

/** One motor + spinning propeller assembly. */
function MotorUnit({
  id,
  position,
  ccw,
  rpm,
  fill,
  hovered,
  setHovered,
}: {
  id: string;
  position: readonly [number, number, number];
  ccw: boolean;
  rpm: number; // 0..1
  fill: THREE.Material;
  hovered: string | null;
  setHovered: (h: HoverState | null) => void;
}) {
  const propRef = useRef<THREE.Group>(null);
  const angle = useRef(0);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    angle.current += (ccw ? 1 : -1) * (2 + rpm * 40) * dt;
    if (propRef.current) propRef.current.rotation.y = angle.current;
  });

  const geos = useMemo(
    () => ({
      base: new THREE.CylinderGeometry(0.09, 0.1, 0.03, 20),
      stator: new THREE.CylinderGeometry(0.055, 0.055, 0.06, 16),
      bell: new THREE.CylinderGeometry(0.075, 0.07, 0.055, 20),
      shaft: new THREE.CylinderGeometry(0.012, 0.012, 0.09, 8),
      hub: new THREE.CylinderGeometry(0.028, 0.028, 0.03, 12),
      blade: new THREE.BoxGeometry(0.42, 0.008, 0.045),
      screw: new THREE.CylinderGeometry(0.008, 0.008, 0.014, 6),
    }),
    []
  );

  return (
    <group position={[position[0], position[1], position[2]]}>
      <Part name={`motor ${id}`} hovered={hovered} setHovered={setHovered}>
        <EdgedMesh geometry={geos.base} position={[0, 0.015, 0]} fill={fill} />
        <EdgedMesh geometry={geos.stator} position={[0, 0.06, 0]} dashed fill={fill} />
        <EdgedMesh geometry={geos.bell} position={[0, 0.085, 0]} fill={fill} />
        <EdgedMesh geometry={geos.shaft} position={[0, 0.12, 0]} fill={fill} />
        {/* mounting screws */}
        {[-0.06, 0.06].map((sx) =>
          [-0.06, 0.06].map((sz) => (
            <EdgedMesh key={`${sx}${sz}`} geometry={geos.screw} position={[sx, 0.03, sz]} fill={fill} />
          ))
        )}
      </Part>
      <group ref={propRef} position={[0, 0.16, 0]}>
        <Part name={`propeller ${id}`} hovered={hovered} setHovered={setHovered}>
          <EdgedMesh geometry={geos.hub} fill={fill} />
          <EdgedMesh geometry={geos.blade} position={[0.22, 0, 0]} rotation={[0, 0.25, 0]} fill={fill} />
          <EdgedMesh geometry={geos.blade} position={[-0.22, 0, 0]} rotation={[0, 0.25, 0]} fill={fill} />
        </Part>
      </group>
      {/* blur disc when spinning fast */}
      {rpm > 0.55 && (
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.46, 32]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.05} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export interface Controls {
  throttle: number; // -1..1
  yaw: number;
  pitch: number;
  roll: number;
}

/** The full procedural blueprint quadcopter (quad-X). */
export function BlueprintDrone({
  controls,
  exploded,
  hovered,
  setHovered,
  onTelemetry,
}: {
  controls: React.MutableRefObject<Controls>;
  exploded: boolean;
  hovered: string | null;
  setHovered: (h: HoverState | null) => void;
  onTelemetry: (t: { alt: number; speed: number; heading: number; rpm: number[] }) => void;
}) {
  const { fill } = useBlueprintMats();
  const root = useRef<THREE.Group>(null);
  const state = useRef({ alt: 0, heading: 0, pitch: 0, roll: 0, speed: 0 });

  const geos = useMemo(
    () => ({
      plate: new THREE.CylinderGeometry(0.34, 0.34, 0.02, 8),
      plateLow: new THREE.CylinderGeometry(0.3, 0.3, 0.02, 8),
      arm: new THREE.BoxGeometry(0.62, 0.025, 0.06),
      battery: new THREE.BoxGeometry(0.34, 0.12, 0.16),
      strap: new THREE.BoxGeometry(0.36, 0.01, 0.05),
      fc: new THREE.BoxGeometry(0.14, 0.02, 0.14),
      grommet: new THREE.CylinderGeometry(0.012, 0.012, 0.03, 8),
      computer: new THREE.BoxGeometry(0.16, 0.025, 0.11),
      pdb: new THREE.CylinderGeometry(0.12, 0.12, 0.012, 8),
      gpsMast: new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8),
      gps: new THREE.CylinderGeometry(0.05, 0.05, 0.025, 16),
      camBody: new THREE.BoxGeometry(0.07, 0.05, 0.05),
      lens: new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12),
      leg: new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8),
      foot: new THREE.CylinderGeometry(0.02, 0.024, 0.02, 10),
      antenna: new THREE.CylinderGeometry(0.006, 0.004, 0.18, 6),
      esc: new THREE.BoxGeometry(0.12, 0.012, 0.05),
    }),
    []
  );

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
      v += m.ccw ? c.yaw * 0.3 : -c.yaw * 0.3; // yaw: CCW up for right yaw
      v += m.position[0] < 0 ? c.roll * 0.3 : -c.roll * 0.3; // roll right: left up
      v += m.position[2] > 0 ? c.pitch * 0.3 : -c.pitch * 0.3; // pitch fwd: rear up
      return Math.max(0, Math.min(1, v));
    });
    onTelemetry({ alt: Math.max(0, Math.min(120, 60 + s.alt * 60)), speed: s.speed, heading: ((s.heading * 180) / Math.PI) % 360, rpm });
    rpmRef.current = rpm;
  });

  const rpmRef = useRef([0.5, 0.5, 0.5, 0.5]);
  const ex = exploded ? 1 : 0;

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* arms */}
      {MOTORS.map((m) => {
        const angle = Math.atan2(m.position[2], m.position[0]);
        const mid: [number, number, number] = [m.position[0] * 0.42, 0, m.position[2] * 0.42];
        return (
          <group key={`arm-${m.id}`}>
            <Part name={`arm frame ${m.id}`} hovered={hovered} setHovered={setHovered}>
              <EdgedMesh geometry={geos.arm} position={mid} rotation={[0, -angle, 0]} fill={fill} />
            </Part>
            <group position={[m.position[0] * 0.62, ex * 0.03, m.position[2] * 0.62]}>
              <Part name={`esc ${m.id}`} hovered={hovered} setHovered={setHovered}>
                <EdgedMesh geometry={geos.esc} rotation={[0, -angle, 0]} fill={fill} />
              </Part>
            </group>
          </group>
        );
      })}

      {/* centre plates */}
      <Part name="frame top plate" hovered={hovered} setHovered={setHovered}>
        <EdgedMesh geometry={geos.plate} position={[0, 0.05 + ex * 0.25, 0]} fill={fill} />
      </Part>
      <Part name="frame bottom plate" hovered={hovered} setHovered={setHovered}>
        <EdgedMesh geometry={geos.plateLow} position={[0, -0.05 - ex * 0.2, 0]} fill={fill} />
      </Part>
      <Part name="pdb power distribution" hovered={hovered} setHovered={setHovered}>
        <EdgedMesh geometry={geos.pdb} position={[0, -0.02 - ex * 0.1, 0]} dashed fill={fill} />
      </Part>

      {/* flight controller on grommets */}
      <group position={[0, 0.09 + ex * 0.4, 0]}>
        <Part name="flight controller fc imu" hovered={hovered} setHovered={setHovered}>
          <EdgedMesh geometry={geos.fc} fill={fill} />
          {[-0.05, 0.05].map((x) =>
            [-0.05, 0.05].map((z) => (
              <EdgedMesh key={`${x}${z}`} geometry={geos.grommet} position={[x, -0.02, z]} fill={fill} />
            ))
          )}
        </Part>
      </group>

      {/* onboard computer */}
      <group position={[0, 0.14 + ex * 0.55, 0.08]}>
        <Part name="onboard computer board" hovered={hovered} setHovered={setHovered}>
          <EdgedMesh geometry={geos.computer} fill={fill} />
        </Part>
      </group>

      {/* battery + strap */}
      <group position={[0, -0.13 - ex * 0.35, 0]}>
        <Part name="battery lipo xt60" hovered={hovered} setHovered={setHovered}>
          <EdgedMesh geometry={geos.battery} fill={fill} />
          <EdgedMesh geometry={geos.strap} position={[0, 0.065, 0]} fill={fill} />
        </Part>
      </group>

      {/* GPS mast */}
      <group position={[0, 0.06 + ex * 0.7, 0.12]}>
        <Part name="gps mast" hovered={hovered} setHovered={setHovered}>
          <EdgedMesh geometry={geos.gpsMast} position={[0, 0.08, 0]} fill={fill} />
          <EdgedMesh geometry={geos.gps} position={[0, 0.17, 0]} fill={fill} />
        </Part>
      </group>

      {/* camera + gimbal */}
      <group position={[0, -0.12 - ex * 0.5, -0.22]}>
        <Part name="camera gimbal" hovered={hovered} setHovered={setHovered}>
          <EdgedMesh geometry={geos.camBody} fill={fill} />
          <EdgedMesh geometry={geos.lens} position={[0, 0, -0.035]} rotation={[Math.PI / 2, 0, 0]} fill={fill} />
        </Part>
      </group>

      {/* landing gear */}
      {[-0.2, 0.2].map((x) => (
        <group key={x} position={[x, -0.2 - ex * 0.15, 0]}>
          <Part name="landing gear leg" hovered={hovered} setHovered={setHovered}>
            <EdgedMesh geometry={geos.leg} fill={fill} />
            <EdgedMesh geometry={geos.foot} position={[0, -0.15, 0]} fill={fill} />
          </Part>
        </group>
      ))}

      {/* telemetry antenna */}
      <group position={[0.15, -0.1, 0.15]} rotation={[0.4, 0, 0.4]}>
        <Part name="telemetry antenna" hovered={hovered} setHovered={setHovered}>
          <EdgedMesh geometry={geos.antenna} position={[0, -0.09, 0]} fill={fill} />
        </Part>
      </group>

      {/* motors + props */}
      {MOTORS.map((m, i) => (
        <group
          key={m.id}
          position={[m.position[0] * (0.78 + ex * 0.18), 0.02 + ex * 0.12, m.position[2] * (0.78 + ex * 0.18)]}
        >
          <MotorUnit
            id={m.id}
            position={[0, 0, 0]}
            ccw={m.ccw}
            rpm={rpmRef.current[i] ?? 0.5}
            fill={fill}
            hovered={hovered}
            setHovered={setHovered}
          />
        </group>
      ))}
    </group>
  );
}
