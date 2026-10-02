/**
 * Maps node-name keywords → part metadata for hover/inspect labels.
 * Anything unmatched falls back to "Frame component".
 * When a real drone.glb is uploaded, its node names are matched against
 * these keywords so the same labels work without code changes.
 */

export type PartGroup =
  | "propeller"
  | "motor"
  | "esc"
  | "battery"
  | "flight-controller"
  | "gps"
  | "camera"
  | "frame"
  | "landing-gear"
  | "antenna"
  | "fastener"
  | "wire"
  | "computer"
  | "pdb";

export interface PartInfo {
  label: string;
  description: string;
  spec: string;
  group: PartGroup;
}

const RULES: Array<{ keywords: string[]; info: PartInfo }> = [
  {
    keywords: ["motor phase wire"],
    info: { label: "Motor phase wires", description: "Three wires carrying switched current from the ESC to the motor windings.", spec: "3 × 16 AWG silicone", group: "wire" },
  },
  {
    keywords: ["power wire"],
    info: { label: "Power leads", description: "Carry battery current from the PDB to each ESC.", spec: "12 AWG silicone", group: "wire" },
  },
  {
    keywords: ["xt60 connector"],
    info: { label: "XT60 connector", description: "Main plug joining the battery to the power distribution board.", spec: "60 A continuous", group: "battery" },
  },
  {
    keywords: ["balance lead"],
    info: { label: "Balance lead", description: "Lets the charger and flight controller read every cell voltage.", spec: "5-pin JST-XH · 4S", group: "wire" },
  },
  {
    keywords: ["plate standoff"],
    info: { label: "Frame standoff", description: "Spaces the two plates apart and carries load between them.", spec: "M3 · 30 mm aluminium", group: "frame" },
  },
  {
    keywords: ["arm clamp"],
    info: { label: "Arm clamp", description: "Clamps each carbon arm tube between the frame plates.", spec: "CNC aluminium · M3", group: "frame" },
  },
  {
    keywords: ["arm tube"],
    info: { label: "Carbon arm tube", description: "Hollow tube carrying motor thrust to the frame and routing wires.", spec: "Ø16 mm · 3K carbon", group: "frame" },
  },
  {
    keywords: ["rc receiver"],
    info: { label: "RC receiver", description: "Receives pilot stick commands and passes them to the flight controller.", spec: "2.4 GHz · ELRS", group: "antenna" },
  },
  {
    keywords: ["vtx"],
    info: { label: "Video transmitter", description: "Streams the camera feed to the ground station in real time.", spec: "5.8 GHz · 600 mW", group: "antenna" },
  },
  {
    keywords: ["heatsink"],
    info: { label: "Heatsink", description: "Pulls heat off the onboard computer so it does not throttle.", spec: "Aluminium · 5 fins", group: "computer" },
  },
  {
    keywords: ["buzzer"],
    info: { label: "Buzzer", description: "Beeps to signal arming, low battery or to help find a lost drone.", spec: "5 V active · 85 dB", group: "fastener" },
  },
  {
    keywords: ["nav led"],
    info: { label: "Navigation LED", description: "Shows orientation and arming state from the air.", spec: "WS2812 addressable RGB", group: "fastener" },
  },
  {
    keywords: ["motor mount"],
    info: { label: "Motor mount", description: "Plate that bolts the motor to the arm tube end.", spec: "CNC 6061 · 4 × M3", group: "frame" },
  },
  {
    keywords: ["prop nut"],
    info: { label: "Prop nut", description: "Self-tightening nut locking the propeller onto the shaft.", spec: "M5 · nylock", group: "fastener" },
  },
  {
    keywords: ["prop", "blade"],
    info: {
      label: "Propeller",
      description: "Twisted airfoil blade that pushes air downward to create lift.",
      spec: '10" two-blade · CW/CCW pairs',
      group: "propeller",
    },
  },
  {
    keywords: ["stator", "winding", "coil"],
    info: {
      label: "Stator",
      description: "Fixed copper-wound core that creates the rotating magnetic field.",
      spec: "12-slot laminated core",
      group: "motor",
    },
  },
  {
    keywords: ["magnet", "bell", "rotor"],
    info: {
      label: "Rotor magnets",
      description: "14 neodymium magnets the stator pulls on to spin the bell.",
      spec: "14-pole N52 neodymium",
      group: "motor",
    },
  },
  {
    keywords: ["motor"],
    info: {
      label: "Brushless motor",
      description: "Spins the propeller; speed set by the flight controller via the ESC.",
      spec: "920 KV · 3–4S",
      group: "motor",
    },
  },
  {
    keywords: ["esc", "mosfet"],
    info: {
      label: "ESC MOSFET",
      description: "Switches battery current to the motor phases thousands of times a second.",
      spec: "30 A · BLHeli_32",
      group: "esc",
    },
  },
  {
    keywords: ["battery", "lipo", "cell", "xt60"],
    info: {
      label: "LiPo battery",
      description: "Powers motors, flight controller and onboard computer.",
      spec: "4S 5300 mAh · XT60",
      group: "battery",
    },
  },
  {
    keywords: ["fc", "flight", "imu", "controller"],
    info: {
      label: "Flight controller",
      description: "Stabilises the drone by adjusting each motor hundreds of times a second.",
      spec: "F7 · ICM-42688 IMU",
      group: "flight-controller",
    },
  },
  {
    keywords: ["gps", "mast"],
    info: {
      label: "GPS",
      description: "Position for navigation and autonomous waypoint flight.",
      spec: "M10 · 25 Hz update",
      group: "gps",
    },
  },
  {
    keywords: ["camera", "gimbal"],
    info: {
      label: "Camera + gimbal",
      description: "Stabilised vision feed for perception and inspection missions.",
      spec: "4K · 3-axis gimbal",
      group: "camera",
    },
  },
  {
    keywords: ["computer", "companion", "jetson", "board"],
    info: {
      label: "Onboard computer",
      description: "Runs perception and path planning, 100% onboard.",
      spec: "ARM SBC · ROS 2",
      group: "computer",
    },
  },
  {
    keywords: ["pdb", "distribution"],
    info: {
      label: "Power distribution board",
      description: "Routes battery power to all four ESCs and the electronics rail.",
      spec: "4×30 A · 5 V/12 V BEC",
      group: "pdb",
    },
  },
  {
    keywords: ["antenna", "telemetry"],
    info: {
      label: "Telemetry antenna",
      description: "Radio link to the ground station for live telemetry and commands.",
      spec: "915 MHz · 2 dBi",
      group: "antenna",
    },
  },
  {
    keywords: ["leg", "gear", "skid", "landing"],
    info: {
      label: "Landing gear",
      description: "Keeps the frame and gimbal clear of the ground on touchdown.",
      spec: "Carbon strut · rubber foot",
      group: "landing-gear",
    },
  },
  {
    keywords: ["screw", "bolt", "nut", "washer", "standoff", "fastener"],
    info: {
      label: "M3×8 socket-head screw",
      description: "Clamps the motor to the arm; nylock hardware resists vibration loosening.",
      spec: "M3 · class 10.9",
      group: "fastener",
    },
  },
  {
    keywords: ["wire", "cable", "lead"],
    info: {
      label: "Signal wire",
      description: "Carries power and control signals along the arm to the PDB.",
      spec: "20 AWG silicone",
      group: "wire",
    },
  },
  {
    keywords: ["arm", "plate", "frame", "body"],
    info: {
      label: "Frame component",
      description: "Carbon-fibre structure that holds motors, electronics and payload together.",
      spec: "3K carbon · 450 mm wheelbase",
      group: "frame",
    },
  },
];

const FALLBACK: PartInfo = {
  label: "Frame component",
  description: "Structural part of the airframe.",
  spec: "3K carbon fibre",
  group: "frame",
};

export function getPartInfo(nodeName: string): PartInfo {
  const n = nodeName.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => n.includes(k))) return rule.info;
  }
  return FALLBACK;
}

/** Motor layout for quad-X: M1 FR (CCW), M2 RL (CCW), M3 FL (CW), M4 RR (CW). */
export const MOTORS = [
  { id: "M1", position: [1, 0, -1] as const, ccw: true },
  { id: "M2", position: [-1, 0, 1] as const, ccw: true },
  { id: "M3", position: [-1, 0, -1] as const, ccw: false },
  { id: "M4", position: [1, 0, 1] as const, ccw: false },
];
