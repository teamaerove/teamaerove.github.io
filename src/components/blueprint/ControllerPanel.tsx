import { useCallback, useEffect, useRef, useState } from "react";
import type { Controls } from "./BlueprintDrone";
import type { Telemetry } from "./BlueprintCanvas";

function Stick({
  label,
  holdY = false,
  onChange,
}: {
  label: string;
  holdY?: boolean;
  onChange: (x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (clientY - (r.top + r.height / 2)) / (r.height / 2);
      const x = Math.max(-1, Math.min(1, dx));
      const y = Math.max(-1, Math.min(1, dy));
      setPos({ x, y });
      onChange(x, -y);
    },
    [onChange]
  );

  const release = useCallback(() => {
    dragging.current = false;
    setPos((p) => {
      const next = holdY ? { x: 0, y: p.y } : { x: 0, y: 0 };
      onChange(next.x, -next.y);
      return next;
    });
  }, [holdY, onChange]);

  return (
    <div className="bp-stick-wrap">
      <div
        ref={ref}
        className="bp-stick"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          update(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => dragging.current && update(e.clientX, e.clientY)}
        onPointerUp={release}
        onPointerCancel={release}
      >
        <div
          className="bp-stick-nub"
          style={{ transform: `translate(${pos.x * 26}px, ${pos.y * 26}px)` }}
        />
      </div>
      <span className="bp-stick-label">{label}</span>
    </div>
  );
}

export function ControllerPanel({
  controls,
  telemetry,
  exploded,
  onToggleExploded,
  onResetView,
}: {
  controls: React.MutableRefObject<Controls>;
  telemetry: Telemetry;
  exploded: boolean;
  onToggleExploded: () => void;
  onResetView: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // keyboard: W/S throttle, A/D yaw, arrows pitch/roll
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const c = controls.current;
      const step = 0.15;
      if (e.key === "w" || e.key === "W") c.throttle = Math.min(1, c.throttle + step);
      if (e.key === "s" || e.key === "S") c.throttle = Math.max(-1, c.throttle - step);
      if (e.key === "a" || e.key === "A") c.yaw = -1;
      if (e.key === "d" || e.key === "D") c.yaw = 1;
      if (e.key === "ArrowUp") c.pitch = 1;
      if (e.key === "ArrowDown") c.pitch = -1;
      if (e.key === "ArrowLeft") c.roll = -1;
      if (e.key === "ArrowRight") c.roll = 1;
    };
    const up = (e: KeyboardEvent) => {
      const c = controls.current;
      if (["a", "A", "d", "D"].includes(e.key)) c.yaw = 0;
      if (["ArrowUp", "ArrowDown"].includes(e.key)) c.pitch = 0;
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) c.roll = 0;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [controls]);

  if (collapsed) {
    return (
      <button className="bp-panel-collapsed" onClick={() => setCollapsed(false)} aria-label="Open flight controller">
        ✈
      </button>
    );
  }

  return (
    <aside className="bp-panel" aria-label="Flight controller">
      <div className="bp-panel-head">
        <span>FLIGHT CONTROLLER</span>
        <button onClick={() => setCollapsed(true)} aria-label="Collapse panel">
          –
        </button>
      </div>
      <div className="bp-sticks">
        <Stick
          label="THR · YAW"
          holdY
          onChange={(x, y) => {
            controls.current.yaw = x;
            controls.current.throttle = y;
          }}
        />
        <Stick
          label="PITCH · ROLL"
          onChange={(x, y) => {
            controls.current.roll = x;
            controls.current.pitch = y;
          }}
        />
      </div>
      <div className="bp-rpm">
        {telemetry.rpm.map((v, i) => (
          <div key={i} className="bp-rpm-row">
            <span>M{i + 1}</span>
            <div className="bp-rpm-bar">
              <div
                className="bp-rpm-fill"
                style={{
                  width: `${v * 100}%`,
                  opacity: v > 0.5 ? 1 : 0.45,
                }}
              />
            </div>
            <span className="bp-rpm-sign">{v > 0.52 ? "+" : v < 0.48 ? "−" : ""}</span>
          </div>
        ))}
      </div>
      <div className="bp-panel-actions">
        <button onClick={onToggleExploded} aria-label="Toggle exploded view" title="Exploded view">
          {exploded ? "Assemble" : "Explode"}
        </button>
        <button onClick={onResetView} aria-label="Reset view" title="Reset view">
          Reset
        </button>
      </div>
    </aside>
  );
}

export function TelemetryHUD({ telemetry }: { telemetry: Telemetry }) {
  return (
    <div className="bp-hud" aria-label="Telemetry">
      <div>
        ALTITUDE <b>{telemetry.alt.toFixed(1)} m</b>
      </div>
      <div>
        SPEED <b>{telemetry.speed.toFixed(1)} m/s</b>
      </div>
      <div>
        HEADING <b>{((telemetry.heading % 360) + 360) % 360 | 0}°</b>
      </div>
      <div className="bp-hud-rpm">
        {telemetry.rpm.map((v, i) => (
          <span key={i}>
            M{i + 1} {(v * 12000) | 0}
          </span>
        ))}
      </div>
    </div>
  );
}
