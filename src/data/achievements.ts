export interface Achievement {
  event: string;
  year: number;
  result: string;
  detail: string;
}

export const achievements: Achievement[] = [
  {
    event: "CUASC",
    year: 2024,
    result: "World Champions",
    detail: "Design & Innovation Award",
  },
  {
    event: "Ri4Rover",
    year: 2024,
    result: "World Champions",
    detail: "Purdue University",
  },
  {
    event: "RoboDrive",
    year: 2024,
    result: "Global #4",
    detail: "1st nationally · ICRA",
  },
  {
    event: "UAS Challenge",
    year: 2023,
    result: "Triple award",
    detail: "Advancement · Design · Scrutineers",
  },
  {
    event: "ICUAS",
    year: 2023,
    result: "World #1, Simulation",
    detail: "Hardware #3",
  },
];
