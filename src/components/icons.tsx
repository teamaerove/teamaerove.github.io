import type { SVGProps } from "react";

/**
 * Custom AeRoVe line icons. 48-unit grid, currentColor strokes, with
 * `ic-*` classes on the parts that animate (see styles.css).
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className = "", ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`aero-icon ${className}`} {...rest}>
      {children}
    </svg>
  );
}

/** Rotor ring used inside several icons. */
const Rotor = ({ cx, cy, r = 6 }: { cx: number; cy: number; r?: number }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.32} opacity=".55" />
    <path className="ic-blade" style={{ transformOrigin: `${cx}px ${cy}px` }} d={`M${cx - r * 0.85} ${cy}h${r * 1.7}`} strokeWidth="2.4" />
  </g>
);

export const IconDroneMark = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 18 20 22M34 18 28 22M14 32 20 28M34 32 28 28" />
    <rect x="19" y="21" width="10" height="8" rx="2" />
    <circle cx="24" cy="25" r="1.4" fill="currentColor" className="ic-pulse" />
    <Rotor cx={12} cy={16} r={6} /><Rotor cx={36} cy={16} r={6} /><Rotor cx={12} cy={34} r={6} /><Rotor cx={36} cy={34} r={6} />
  </Icon>
);

export const IconMechatronics = (p: IconProps) => (
  <Icon {...p}>
    <g className="ic-spin-slow" style={{ transformOrigin: "17px 31px" }}>
      <circle cx="17" cy="31" r="5" />
      <path d="M17 22.5v3M17 36.5v3M8.5 31h3M22.5 31h3M11 25l2.1 2.1M20.9 34.9 23 37M11 37l2.1-2.1M20.9 27.1 23 25" />
    </g>
    <path d="M27 10h13v13H27z" />
    <path d="M27 10l4-4h13l-4 4M40 23l4-4V6" />
    <path d="M31 16h5M33.5 13.5v5" className="ic-accent" />
    <path d="M24 31h4l3-8" strokeDasharray="2 2.5" />
  </Icon>
);

export const IconAero = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 27c6-7 18-9 34-4-12 1-24 4-34 4Z" />
    <path className="ic-flow" d="M4 17c10-4 22-5 40 0M4 36c12 2 24 1 40-6M4 11c12-2 26-1 40 3" />
    <path d="M14 25.5 38 23" strokeWidth="1" opacity=".55" />
  </Icon>
);

export const IconMotion = (p: IconProps) => (
  <Icon {...p}>
    <path className="ic-flow" d="M8 38c4-10 10-4 14-12s4-14 12-14 6 8 6 8" />
    <circle cx="8" cy="38" r="2.6" />
    <circle cx="22" cy="26" r="2" fill="currentColor" />
    <path d="M37 21.5 40 20l1.5 3" />
    <path d="M6 8h6M9 5v6" className="ic-accent" />
    <path d="M30 40h12M36 34v12" strokeWidth="1" opacity=".45" />
  </Icon>
);

export const IconPerception = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 14V8h6M36 8h6v6M42 34v6h-6M12 40H6v-6" />
    <path d="M10 24s5-9 14-9 14 9 14 9-5 9-14 9-14-9-14-9Z" />
    <circle cx="24" cy="24" r="4.5" />
    <circle cx="24" cy="24" r="1.4" fill="currentColor" className="ic-pulse" />
    <path className="ic-scan" d="M8 24h32" strokeWidth="1" opacity=".7" />
  </Icon>
);

export const IconHexCluster = (p: IconProps) => (
  <Icon {...p}>
    {[[24, 13], [15, 28], [33, 28]].map(([x, y]) => (
      <path key={`${x}-${y}`} d={`M${x} ${y! - 8}l7 4v8l-7 4-7-4v-8z`} />
    ))}
    <circle cx="24" cy="23" r="1.6" fill="currentColor" className="ic-pulse" />
  </Icon>
);

export const IconCrew = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="24" cy="15" r="5" />
    <path d="M14 38c0-6 4.5-10 10-10s10 4 10 10" />
    <circle cx="11" cy="19" r="3.5" opacity=".7" />
    <circle cx="37" cy="19" r="3.5" opacity=".7" />
    <path d="M4 36c0-4 3-7 7-7M44 36c0-4-3-7-7-7" opacity=".7" />
  </Icon>
);

export const IconTrophy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M16 8h16v10a8 8 0 0 1-16 0V8Z" />
    <path d="M16 11H9v3a6 6 0 0 0 7 6M32 11h7v3a6 6 0 0 1-7 6" />
    <path d="M24 26v6M18 40h12M20 40l1-8h6l1 8" />
    <path d="m24 11 1.4 2.8 3 .4-2.2 2.1.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.1 3-.4Z" fill="currentColor" className="ic-pulse" strokeWidth="1" />
  </Icon>
);

export const IconRank = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 40V28h11v12M17 40V20h14v20M31 40V32h11v8M4 40h40" />
    <path d="m24 8 1.8 3.6 4 .6-2.9 2.8.7 4L24 17.1 20.4 19l.7-4-2.9-2.8 4-.6Z" className="ic-accent" />
  </Icon>
);

export const IconTarget = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="24" cy="24" r="16" />
    <circle cx="24" cy="24" r="9" opacity=".7" />
    <circle cx="24" cy="24" r="2.2" fill="currentColor" className="ic-pulse" />
    <path d="M24 2v8M24 38v8M2 24h8M38 24h8" />
  </Icon>
);

export const IconLayers = (p: IconProps) => (
  <Icon {...p}>
    <path d="m24 8 18 9-18 9-18-9 18-9Z" />
    <path d="m6 24 18 9 18-9" className="ic-accent" />
    <path d="m6 31 18 9 18-9" opacity=".6" />
  </Icon>
);

export const IconMailWing = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="12" width="30" height="22" rx="3" />
    <path d="m6 14 14 10 14-10" />
    <path className="ic-fly" d="m30 30 14-8-6 14-3-5-5-1Z" fill="var(--ic-fill, transparent)" />
  </Icon>
);

export const IconRecruit = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 18 16 22M30 18 24 22M10 32 16 28M30 32 24 28" />
    <rect x="15" y="21" width="10" height="8" rx="2" />
    <Rotor cx={9} cy={16} r={5} /><Rotor cx={31} cy={16} r={5} /><Rotor cx={9} cy={34} r={5} /><Rotor cx={31} cy={34} r={5} />
    <circle cx="39" cy="10" r="6" className="ic-accent" />
    <path d="M39 7v6M36 10h6" />
  </Icon>
);

export const IconLocation = (p: IconProps) => (
  <Icon {...p}>
    <path d="M24 42s13-12.5 13-23a13 13 0 0 0-26 0c0 10.5 13 23 13 23Z" />
    <circle cx="24" cy="19" r="4.5" />
    <ellipse cx="24" cy="42" rx="10" ry="2.4" opacity=".5" className="ic-ripple" />
  </Icon>
);

export const IconZoom = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 18V8h10M30 8h10v10M40 30v10H30M18 40H8V30" />
    <path d="m8 8 10 10M40 8 30 18M40 40 30 30M8 40l10-10" opacity=".6" />
  </Icon>
);

export const IconArrowOut = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 34 34 14M18 14h16v16" />
  </Icon>
);

export const IconChevronUp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M24 38V12M12 24l12-12 12 12" />
  </Icon>
);
