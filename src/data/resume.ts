// Content sourced from Kyle's LinkedIn (May 2026). Edit freely.

export const profile = {
  name: "Kyle Bryant",
  role: "Builder · Crypto × AI",
  location: "Greater Boston",
  currently: "Fidelity Investments",
  blurb:
    "Senior Blockchain Data Engineer at Fidelity. I work where institutional finance meets Ethereum — building data infrastructure for on-chain analytics by day, building personal projects with AI-accelerated development and maintaining a home Ethereum validator by night.",
  links: {
    linkedin: "https://www.linkedin.com/in/kyle-c-bryant",
    // TODO: fill these in with your real handles
    github: "",
    twitter: "",
  },
};

export type Hackathon = {
  event: string;
  location: string;
  date: string;
  project: string;
  result: string;
  description?: string;
  sponsors: string[];
  tone: "gold" | "silver" | "bronze" | "finalist";
};

export const hackathons: Hackathon[] = [
  {
    event: "Fidelity Hackathon",
    location: "Boston, MA",
    date: "July 2025",
    project: "Traderoute Multi-Dex",
    result: "Winner",
    sponsors: [],
    tone: "gold",
  },
  {
    event: "ETHDenver",
    location: "Denver, CO",
    date: "February 2019",
    project: "Universal Wallet",
    result: "Spirit of Build Award",
    description:
      "Co-created 'Universal Wallet' at the ETHDenver Hackathon. Recognized as the most complete end-to-end product. Built using Solidity, React, Create2, Universal Logins, and Wyre. The Universal Wallet is an Ethereum web browser wallet with a cutting edge user experience.",
    sponsors: ["Solidity", "React", "Create2", "Universal Logins", "Wyre"],
    tone: "silver",
  },
  {
    event: "ETHBerlin",
    location: "Berlin, DE",
    date: "September 2018",
    project: "AllAboard.xyz",
    result: "Best UX",
    description:
      "Co-created 'All Aboard!' at the ETHBerlin Hackathon. Recognized as the winner for best UX in a hackathon project. Built using Solidity, React, and new concepts such as Universal Login by Alex Van de Sande, and Meta Transactions by Austin Thomas Griffith.",
    sponsors: ["Solidity", "React", "Universal Login", "Meta Transactions"],
    tone: "gold",
  },
  {
    event: "ETHBuenosAires",
    location: "Buenos Aires, AR",
    date: "May 2018",
    project: "CryptoAgainstHumanity.io",
    result: "Overall Winner",
    description:
      "Co-founded Crypto Against Humanity at the ETHBuenosAires Hackathon. Recognized as an overall winner. Built using Solidity, React, IPFS, and bleeding edge crypto-economic primitives such as Token Curated Registries and Bonding Curves.",
    sponsors: ["Solidity", "React", "IPFS", "Token Curated Registries", "Bonding Curves"],
    tone: "gold",
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  blurb: string;
  bullets: string[];
  stack: string[];
};

export const work: Role[] = [
  {
    company: "Fidelity Investments",
    title: "Senior Blockchain Data Engineer",
    period: "Dec 2024 — Present",
    location: "Boston, MA",
    blurb:
      "Building data infrastructure at the intersection of traditional finance and decentralized systems — bridging institutional rigor with on-chain analytics and Ethereum data.",
    bullets: [
      "On-chain data platform work supporting institutional analytics on Ethereum.",
      "Bridging the gap between institutional infrastructure and decentralized data sources.",
    ],
    stack: ["Ethereum", "Data Engineering", "AWS"],
  },
  {
    company: "Brink",
    title: "Lead Backend Engineer",
    period: "May 2021 — Dec 2024",
    location: "Remote",
    blurb:
      "Backend, SDK, and execution infrastructure for multiple decentralized web apps pioneering intent-based interactions on Ethereum and L2s.",
    bullets: [
      "Pioneered intent-based applications enabling trustless DCA, stop-loss, and limit orders.",
      "Designed signature-based execution flows across Ethereum and various Layer 2s.",
      "Shipped both customer-facing SDKs and the executor infrastructure that fulfilled the intents.",
    ],
    stack: ["TypeScript", "Solidity", "Ethereum", "L2s", "Node.js"],
  },
  {
    company: "Reggora",
    title: "Lead Software Engineer",
    period: "Oct 2019 — May 2021",
    location: "Greater Boston",
    blurb:
      "Promoted from Senior to Lead. Ran the technical integrations team (5 engineers) handling third-party business APIs and the event-driven backbone of the product.",
    bullets: [
      "Led architecture and quality for a team of 5 on partner API integrations.",
      "Designed and shipped an event-sourcing rewrite — consumer nodes, SQS, SNS, event forks, DynamoDB — enabling horizontal scaling and recovery from a critical DB failure.",
      "Shipped features end-to-end across React, Flask, and MongoDB.",
    ],
    stack: ["Python", "Flask", "React", "AWS", "DynamoDB", "MongoDB"],
  },
  {
    company: "Skedaddle",
    title: "Senior Smart Contract Engineer",
    period: "Aug 2018 — Oct 2019",
    location: "Boston, MA",
    blurb:
      "Lead Blockchain Architect on Boomerang. Built the platform around the Universal Login Standard (EIP-1077 / EIP-1078) — a then-novel Web3 UX paradigm.",
    bullets: [
      "Caught a front-running vuln in the original contracts and rewrote them from scratch — cheaper, more versatile, more secure.",
      "Open-source contributions to UniversalLoginSDK to support Boomerang's requirements.",
      "Designed and built the BoomerangSDK node library for third-party integrators.",
      "Represented the project at ETHBerlin (Best UX winner), the Status Cryptolife Hackathon, and Devcon 4.",
    ],
    stack: ["Solidity", "EIP-1077", "EIP-1078", "Node.js"],
  },
  {
    company: "Hitachi Vantara",
    title: "Software Engineer",
    period: "Jan 2017 — Aug 2018",
    location: "Waltham, MA",
    blurb:
      "Migrated and maintained internal projects; contributed to the design of worker nodes for Hitachi's ETL tool.",
    bullets: [
      "Updated internal projects from Ant to Maven.",
      "Worked on high-level design of horizontally-scaling ETL worker nodes.",
      "Contributed to an internal application platform.",
    ],
    stack: ["Java", "Maven", "ETL"],
  },
  {
    company: "Amazon Robotics",
    title: "Software Development Engineer",
    period: "May 2015 — Jan 2017",
    location: "Westborough, MA",
    blurb:
      "Internal tooling for the Enterprise Data Warehousing team — comparative metrics, extraction/aggregation, and cross-shard SQL execution.",
    bullets: [
      "Built data-accuracy tooling that surfaced discrepancies across the EDW.",
      "Designed a web UI + backend for executing SQL across all database shards with failure reporting.",
      "Heavy AWS day-to-day.",
    ],
    stack: ["Java", "AWS", "SQL"],
  },
];

export type Education = {
  school: string;
  degree: string;
  notes?: string;
  period: string;
  honors?: string[];
};

export const education: Education[] = [
  {
    school: "Worcester Polytechnic Institute",
    degree: "B.S. Interactive Media and Game Development",
    notes: "Minor in Computer Science",
    period: "2011 — 2015",
    honors: [
      "Best 3D Video Game",
      "Honorable Mention — Best Major Qualifying Project (Video Game)",
    ],
  },
];

export const skills = {
  Languages: ["TypeScript", "Solidity", "Python", "Java"],
  Blockchain: [
    "Ethereum",
    "Layer 2s",
    "EIP-1077",
    "EIP-1078",
    "EIP-712",
    "Account Abstraction",
    "Validator Operations",
  ],
  Backend: ["Node.js", "Flask", "Event Sourcing", "SDK Design"],
  Frontend: ["React", "Next.js"],
  Data: [
    "On-chain Analytics",
    "Data Engineering",
    "ETL",
    "MongoDB",
    "DynamoDB",
  ],
  Infra: ["AWS", "SQS", "SNS", "MEV-Boost", "Beacon Chain"],
  "AI / Tooling": ["Claude Code", "Anthropic SDK", "AI-Assisted Dev"],
};

export const skillsFlat = Object.values(skills).flat();
