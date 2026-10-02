export interface TeamMember {
  name: string;
  role: string;
  instagram?: string;
  linkedin?: string;
}

export interface TeamGroup {
  title: string;
  members: TeamMember[];
}

export const teamGroups: TeamGroup[] = [
  {
    title: "Leadership",
    members: [
      { name: "Manav", role: "Overall Coordinator" },
      { name: "Rohan", role: "Team Lead" },
      { name: "Daksh Sawke", role: "Team Lead" },
    ],
  },
  {
    title: "Management",
    members: [
      {
        name: "Nishit",
        role: "Manager",
      },
      { name: "Premansh", role: "Manager" },
      {
        name: "Vijay Patekar",
        role: "Manager",
        linkedin: "https://www.linkedin.com/in/vijay-patekar-91598b372",
      },
      {
        name: "Dhruv Jadhav",
        role: "Manager",
        linkedin: "https://www.linkedin.com/in/dhruv-jadhav-b95407318/",
      },
    ],
  },
  {
    title: "Subsystem Leads",
    members: [
      { name: "Sambhav", role: "Mechatronics Lead" },
      { name: "Nipun", role: "Mechatronics Lead" },
      { name: "Durva", role: "Aerodynamics Lead" },
      { name: "Arpit Kumar", role: "Motion Path & Controlling Lead" },
      { name: "Narendra", role: "Perception Lead" },
      { name: "Aarav Gupta", role: "Perception Lead" },
    ],
  },
  {
    title: "Senior Engineers",
    members: [
      { name: "Basant", role: "Motion Path & Controlling" },
      { name: "Naman", role: "Motion Path & Controlling" },
      { name: "Krutarth", role: "Motion Path & Controlling" },
      { name: "Devangi", role: "Aerodynamics" },
    ],
  },
  {
    title: "Junior Engineers",
    members: [
      { name: "Vipul Bansal", role: "Motion Path & Controlling" },
      { name: "Abha", role: "Motion Path & Controlling" },
      { name: "Cheriyan", role: "Perception" },
      { name: "Vidit", role: "Perception" },
      { name: "Afnan Ahmed", role: "Phase 2" },
      { name: "Tathagata", role: "Phase 2" },
      { name: "Bhavya Patel", role: "Phase 2" },
      { name: "Shreeya", role: "Phase 2" },
      { name: "Parth Rane", role: "Phase 2" },
      { name: "Raunak Raj", role: "Phase 2" },
      { name: "Gaurav", role: "Phase 2" },
      { name: "Parth Lohiya", role: "Phase 2" },
    ],
  },
  {
    title: "Business Team",
    members: [
      { name: "Satyam", role: "Finance & Logistics" },
      { name: "Divyansh", role: "Finance & Logistics" },
      { name: "Navinya Desai", role: "Finance & Logistics" },
      { name: "Parth Ingle", role: "Media & PR" },
      { name: "Harsh", role: "Web Developer" },
    ],
  },
];
