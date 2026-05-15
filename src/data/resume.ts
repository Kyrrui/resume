// Content sourced from Kyle's LinkedIn (May 2026). Edit freely.

export const profile = {
  name: "Kyle Bryant",
  role: "Builder · Crypto × AI",
  location: "Greater Boston",
  currently: "Fidelity Investments",
  blurb:
    "Senior Blockchain Data Engineer at Fidelity. I work where institutional finance meets Ethereum — building data infrastructure for on-chain analytics by day, accelerating personal projects with AI-assisted development and maintaining a home Ethereum validator by night.",
  links: {
    linkedin: "https://www.linkedin.com/in/kyle-c-bryant",
    // TODO: fill these in with your real handles
    github: "",
    twitter: "",
  },
};

export type FeaturedBuild = {
  title: string;
  tagline: string;
  description: string;
  year: string;
  stack: string[];
  highlights: string[];
  links?: { label: string; href: string }[];
  badge?: { label: string; tone: "violet" | "cyan" | "mint" | "amber" };
};

export const featuredBuilds: FeaturedBuild[] = [
  {
    title: "Brink — Intent-Based DeFi",
    tagline: "Signature-based DCA, stop-loss, and limit orders on Ethereum",
    description:
      "Lead backend engineer for a suite of decentralized apps pioneering intent-based interactions. Users sign typed messages; an off-chain executor network competes to fulfill them on-chain across Ethereum and L2s.",
    year: "2021 — 2024",
    stack: ["TypeScript", "Solidity", "Ethereum", "L2s", "EIP-712", "Node.js"],
    highlights: [
      "Owned backend, SDK, and execution infrastructure end-to-end",
      "Pioneered the intent-based pattern for trustless DCA, stop-loss, and limit orders",
      "Shipped on Ethereum mainnet and multiple Layer 2s",
    ],
    badge: { label: "Lead Eng", tone: "mint" },
  },
  {
    title: "Boomerang — Universal Login",
    tagline: "EIP-1077 / EIP-1078 Web3 UX, three years before AA was cool",
    description:
      "Lead Blockchain Architect on Skedaddle's Boomerang platform. Re-architected onboarding around the Universal Login Standard, contributed upstream to UniversalLoginSDK, and shipped the BoomerangSDK node library for integrators.",
    year: "2018 — 2019",
    stack: ["Solidity", "EIP-1077", "EIP-1078", "Node.js"],
    highlights: [
      "Caught a front-running vuln and rewrote the contracts from scratch — cheaper, safer, more flexible",
      "Open-source contributions to UniversalLoginSDK",
      "Best UX at ETHBerlin for the EIP-1077 integration",
    ],
    badge: { label: "Open Source", tone: "violet" },
  },
  {
    title: "Home Ethereum Validator",
    tagline: "Solo-staking on my own hardware",
    description:
      "Running a home validator keeps me close to the protocol-level realities of the network I engineer around — consensus dynamics, client diversity, MEV-Boost trade-offs, and slashing risk.",
    year: "ongoing",
    stack: ["Ethereum", "Consensus Clients", "Execution Clients", "MEV-Boost"],
    highlights: [
      "Solo-staked on residential hardware — no third-party operator in the loop",
      "Hands-on with the full client stack (execution + consensus)",
    ],
    badge: { label: "Personal", tone: "cyan" },
  },
  {
    title: "Claude Code Builds",
    tagline: "AI-assisted prototyping for blockchain & developer tooling",
    description:
      "Active experiments using Claude Code to compress the build cycle on smart-contract integrations, on-chain data tools, and developer-focused web apps. This site is one of them.",
    year: "2025 — present",
    stack: ["Claude Code", "Next.js", "TypeScript", "Anthropic SDK"],
    highlights: [
      "Tight iteration loop on greenfield ideas — ship the smallest credible version, then refine",
      "Pattern-spotting: which problems benefit from AI-in-the-loop vs. hand-rolled",
    ],
    badge: { label: "Active", tone: "amber" },
  },
];

export type Hackathon = {
  event: string;
  location: string;
  date: string;
  project: string;
  result: string;
  sponsors: string[];
  tone: "gold" | "silver" | "bronze" | "finalist";
};

export const hackathons: Hackathon[] = [
  {
    event: "ETHBerlin",
    location: "Berlin, DE",
    date: "Sep 2018",
    project: "Boomerang — EIP-1077 UX",
    result: "Winner · Best UX",
    sponsors: [],
    tone: "gold",
  },
  {
    event: "ETHBuenosAires",
    location: "Buenos Aires, AR",
    date: "—",
    project: "Hackathon Winner",
    result: "Winner",
    sponsors: [],
    tone: "gold",
  },
  {
    event: "ETHDenver",
    location: "Denver, CO",
    date: "—",
    project: "Spirit of Build",
    result: "Spirit of Build Award",
    sponsors: [],
    tone: "finalist",
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
