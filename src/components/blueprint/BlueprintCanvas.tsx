import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BlueprintDrone, type Controls, type HoverState } from "./BlueprintDrone";

function GridFloor() {
  return (
    <group position={[0, -0.55, 0]}>
      <gridHelper args={[20, 40, "#dbe7ff", "#eef4ff"]} />
      {/* dashed circle + crosshair under the drone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.85, 0.86, 64]} />
        <meshBasicMaterial color="#93b4f5" transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.2, 0.004]} />
        <meshBasicMaterial color="#93b4f5" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.2, 0.004]} />
        <meshBasicMaterial color="#93b4f5" transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

export interface Telemetry {
  alt: number;
  speed: number;
  heading: number;
  rpm: number[];
}

export function BlueprintCanvas({
  controls,
  exploded,
  hovered,
  setHovered,
  onTelemetry,
}: {
  controls: React.MutableRefObject<Controls>;
  exploded: boolean;
  hovered: HoverState | null;
  setHovered: (h: HoverState | null) => void;
  onTelemetry: (t: Telemetry) => void;
}) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [2.2, 1.4, 2.2], fov: 45, near: 0.001, far: 100 }}
      style={{ background: "#ffffff" }}
      onPointerMissed={() => setHovered(null)}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <GridFloor />
        <BlueprintDrone
          controls={controls}
          exploded={exploded}
          hovered={hovered?.info.label ?? null}
          setHovered={setHovered}
          onTelemetry={onTelemetry}
        />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          zoomToCursor
          enablePan
          minDistance={0.05}
          maxDistance={12}
          autoRotate={!hovered}
          autoRotateSpeed={0.6}
        />
      </Suspense>
    </Canvas>
  );
}
