import { useRef, useState } from "react";
import { BlueprintCanvas, type Telemetry } from "./BlueprintCanvas";
import { ControllerPanel, TelemetryHUD } from "./ControllerPanel";
import type { Controls, HoverState } from "./BlueprintDrone";
import "./blueprint.css";

/**
 * Drop-in 3D blueprint. No router, no logos, no page chrome.
 * Usage:  <BlueprintViewer height="100vh" />   or   <BlueprintViewer height={600} />
 * Browser-only (uses WebGL). In SSR frameworks, load it client-side (see INTEGRATION.md).
 */
/** `topInset`: height of any fixed header overlapping the viewer, so the hint stays visible. */
export default function BlueprintViewer({
  height = "100vh",
  topInset = 0,
}: {
  height?: number | string;
  topInset?: number;
}) {
  const controls = useRef<Controls>({ throttle: 0, yaw: 0, pitch: 0, roll: 0 });
  const [exploded, setExploded] = useState(false);
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    alt: 60,
    speed: 0,
    heading: 0,
    rpm: [0.5, 0.5, 0.5, 0.5],
  });

  return (
    <div className="bp-root">
      <section className="bp-hero" style={{ height }}>
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
        <p className="bp-hint" style={{ top: 12 + topInset }}>
          Hover any part to inspect it · drag to orbit · scroll to zoom
        </p>
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
      </section>
    </div>
  );
}
