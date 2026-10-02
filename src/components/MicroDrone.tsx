import { useEffect, useRef } from "react";

/** A small wireframe drone that glides after the cursor with spring damping. */
export function MicroDrone() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let tx = window.innerWidth * 0.5;
    let ty = window.innerHeight * 0.45;
    let x = tx;
    let y = ty;
    let vx = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      const nx = x + (tx - x) * 0.08;
      const ny = y + (ty - y) * 0.08;
      vx = nx - x;
      x = nx;
      y = ny;
      const roll = Math.max(-22, Math.min(22, vx * 1.6));
      el.style.transform = `translate3d(${x - 44}px, ${y - 30}px, 0) rotate(${roll}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="micro-drone" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 220 130" fill="none" stroke="currentColor" strokeWidth="3">
        <ellipse className="md-rotor" cx="36" cy="34" rx="32" ry="8" />
        <ellipse className="md-rotor md-rev" cx="184" cy="34" rx="32" ry="8" />
        <ellipse className="md-rotor md-rev" cx="36" cy="96" rx="32" ry="8" />
        <ellipse className="md-rotor" cx="184" cy="96" rx="32" ry="8" />
        <path d="M44 42 92 58M176 42 128 58M44 88 92 72M176 88 128 72" />
        <rect x="90" y="52" width="40" height="26" rx="5" />
        <circle cx="110" cy="65" r="5" className="md-eye" />
        <circle cx="36" cy="34" r="3" />
        <circle cx="184" cy="34" r="3" />
        <circle cx="36" cy="96" r="3" />
        <circle cx="184" cy="96" r="3" />
      </svg>
    </div>
  );
}
