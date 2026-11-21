import { useEffect, useState, type CSSProperties } from "react";

import vtol from "@/assets/gallery-vtol-runway.jpg";
import airdrop from "@/assets/gallery-airdrop-drone.jpg";
import crew from "@/assets/gallery-airfield-crew.jpg";

/**
 * "Drone vision": real team photographs shown as an onboard camera feed, with
 * perception-style detection boxes drawn over people and aircraft.
 * Boxes are hand-placed for illustration (image-space percentages), not live
 * inference, and the caption says so.
 */

type Box = { x: number; y: number; w: number; h: number; cls: "person" | "uav" | "payload" | "vehicle"; conf: number };
type Frame = { src: string; w: number; h: number; caption: string; boxes: Box[] };

const FRAMES: Frame[] = [
  {
    src: vtol, w: 551, h: 390, caption: "Fixed-wing VTOL on the runway",
    boxes: [
      { x: 13.6, y: 57.5, w: 43.6, h: 31, cls: "uav", conf: 0.98 },
      { x: 8, y: 16.5, w: 17, h: 69.5, cls: "person", conf: 0.97 },
      { x: 44.5, y: 21, w: 12.2, h: 48, cls: "person", conf: 0.93 },
      { x: 60, y: 19.5, w: 12.4, h: 58.5, cls: "person", conf: 0.95 },
      { x: 70.8, y: 15.8, w: 17.4, h: 77.8, cls: "person", conf: 0.96 },
    ],
  },
  {
    src: airdrop, w: 594, h: 380, caption: "Air-drop multirotor before a payload run",
    boxes: [
      { x: 1, y: 13, w: 95, h: 74, cls: "uav", conf: 0.99 },
      { x: 27, y: 55, w: 24.3, h: 27, cls: "payload", conf: 0.94 },
      { x: 70, y: 1, w: 30, h: 48, cls: "person", conf: 0.81 },
    ],
  },
  {
    src: crew, w: 586, h: 390, caption: "With fellow teams at the airfield",
    boxes: [
      { x: 35, y: 0.5, w: 33, h: 34, cls: "uav", conf: 0.91 },
      { x: 4.8, y: 51, w: 13.6, h: 41, cls: "person", conf: 0.96 },
      { x: 18.8, y: 48.5, w: 14.5, h: 40, cls: "person", conf: 0.95 },
      { x: 42.5, y: 48, w: 14, h: 30, cls: "person", conf: 0.92 },
      { x: 80, y: 35.5, w: 9.6, h: 37.5, cls: "person", conf: 0.9 },
    ],
  },
];

const FRAME_MS = 6500;
const STAGE_RATIO = 3 / 2; // must match .vision-stage aspect-ratio

/** Map an image-space box to stage space for object-fit: cover at a fixed stage ratio. */
function toStage(b: Box, f: Frame) {
  const ri = f.w / f.h;
  if (ri < STAGE_RATIO) {
    const vis = ri / STAGE_RATIO, off = (1 - vis) / 2; // image cropped top/bottom
    const y = (b.y / 100 - off) / vis, h = b.h / 100 / vis;
    return clip(b.x / 100, y, b.w / 100, h);
  }
  const vis = STAGE_RATIO / ri, off = (1 - vis) / 2; // image cropped left/right
  return clip((b.x / 100 - off) / vis, b.y / 100, b.w / 100 / vis, b.h / 100);
}
function clip(x: number, y: number, w: number, h: number) {
  const x0 = Math.max(0, x), y0 = Math.max(0, y), x1 = Math.min(1, x + w), y1 = Math.min(1, y + h);
  return { style: { left: `${x0 * 100}%`, top: `${y0 * 100}%`, width: `${(x1 - x0) * 100}%`, height: `${(y1 - y0) * 100}%` }, labelInside: y0 < 0.07 };
}

export function DroneVision() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const frame = FRAMES[i]!;
  const counts = frame.boxes.reduce<Record<string, number>>((m, b) => ({ ...m, [b.cls]: (m[b.cls] ?? 0) + 1 }), {});

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => { if (!document.hidden) setI((n) => (n + 1) % FRAMES.length); }, FRAME_MS);
    return () => window.clearTimeout(id);
  }, [i, paused]);

  return (
    <figure className="vision" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="vision-stage">
        {FRAMES.map((f, n) => (
          <div key={f.src} className={`vision-frame ${n === i ? "is-on" : ""}`} aria-hidden={n === i ? undefined : true}>
            <img src={f.src} alt={n === i ? f.caption : ""} fetchPriority={n === 0 ? "high" : undefined} loading={n === 0 ? undefined : "lazy"} />
            <div className="vision-boxes">
              {f.boxes.map((b, k) => {
                const { style, labelInside } = toStage(b, f);
                return (
                <span key={k} className={`vision-box is-${b.cls} ${labelInside ? "label-in" : ""}`} style={{ ...style, "--k": k } as CSSProperties}>
                  <em>{b.cls}<small> {b.conf.toFixed(2)}</small></em>
                </span>
                );
              })}
            </div>
          </div>
        ))}
        <div className="vision-hud" aria-hidden="true">
          <span className="vision-tag"><i />Onboard camera</span>
          <span className="vision-reticle" />
        </div>
      </div>
      <figcaption>
        <div className="vision-meta">
          <span>{frame.caption}</span>
          <span className="vision-counts">
            {Object.entries(counts).map(([c, n]) => <b key={c}>{n} {c}</b>)}
          </span>
        </div>
        <div className="vision-dots" role="tablist" aria-label="Camera frames">
          {FRAMES.map((f, n) => (
            <button key={f.src} type="button" role="tab" aria-selected={n === i} aria-label={f.caption} className={n === i ? "is-on" : ""} onClick={() => setI(n)}
              style={n === i && !paused ? ({ "--dur": `${FRAME_MS}ms` } as CSSProperties) : undefined} />
          ))}
        </div>
        <p className="vision-note">Perception overlay shown for illustration.</p>
      </figcaption>
    </figure>
  );
}
