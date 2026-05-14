// Placeholder content — swap with real data later.

export const profile = {
  handle: "kyrrui.eth",
  name: "Kyrrui",
  role: "Builder · Crypto × AI",
  status: "open to interesting collaborations",
  location: "Remote / Worldwide",
  blurb:
    "Engineer working at the intersection of Ethereum, autonomous agents, and AI infrastructure. I ship at hackathons, contribute to protocols, and prototype the weird ideas.",
  email: "hello@example.com",
  links: {
    github: "https://github.com/Kyrrui",
    twitter: "https://x.com/kyrrui",
    farcaster: "https://warpcast.com/kyrrui",
    lens: "https://hey.xyz/u/kyrrui",
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
    title: "Synapse Protocol",
    tagline: "On-chain coordination layer for autonomous AI agents",
    description:
      "A smart-contract framework that lets LLM agents register intents, post bonded commitments, and settle outcomes trustlessly. Built around an ERC-7683-inspired intents primitive.",
    year: "2025",
    stack: ["Solidity", "Foundry", "TypeScript", "Viem", "LangGraph", "OpenAI"],
    highlights: [
      "$24k in grants from a major L2 ecosystem fund",
      "Live on three testnets; ~3k agent runs in pilot",
      "Open-source — 480 stars in the first month",
    ],
    badge: { label: "Active", tone: "mint" },
  },
  {
    title: "Hypercube",
    tagline: "ZK proof aggregation playground",
    description:
      "Interactive explorer for Halo2 and Plonky3 circuits. Generates proofs in the browser via WASM and visualizes constraint systems as navigable graphs.",
    year: "2024",
    stack: ["Rust", "WASM", "Halo2", "Next.js", "WebGL"],
    highlights: [
      "Featured in a popular ZK research newsletter",
      "Used in two cryptography courses as teaching material",
    ],
    badge: { label: "Open Source", tone: "violet" },
  },
  {
    title: "Mempool Mirror",
    tagline: "Real-time MEV visibility for L2s",
    description:
      "A streaming pipeline that ingests sequencer mempools across Base, Optimism, and Arbitrum, classifies tx archetypes with a small transformer model, and surfaces MEV opportunities in a live dashboard.",
    year: "2024",
    stack: ["Go", "Kafka", "Postgres", "PyTorch", "React", "D3"],
    highlights: [
      "Sub-200ms classification latency at p99",
      "Processed 4M+ transactions during private beta",
    ],
    badge: { label: "Beta", tone: "cyan" },
  },
  {
    title: "Onchain Oracle",
    tagline: "LLM-powered Chainlink-style price feed",
    description:
      "A research prototype that aggregates DEX prices, news sentiment, and on-chain liquidity signals into a single feed with cryptoeconomic guarantees on its reasoning trace.",
    year: "2023",
    stack: ["Solidity", "Chainlink", "Anthropic", "TypeScript"],
    highlights: [
      "Top 5 at ETHGlobal Brussels",
      "Selected for an a16z crypto research showcase",
    ],
    badge: { label: "Research", tone: "amber" },
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
    event: "ETHGlobal",
    location: "Bangkok",
    date: "Nov 2024",
    project: "Synapse Agents",
    result: "1st — Grand Prize",
    sponsors: ["Optimism", "Worldcoin", "Anthropic"],
    tone: "gold",
  },
  {
    event: "ETHDenver",
    location: "Denver, CO",
    date: "Mar 2024",
    project: "Hypercube",
    result: "Top 10 Finalist",
    sponsors: ["Polygon zkEVM", "Scroll"],
    tone: "silver",
  },
  {
    event: "ETHGlobal",
    location: "Brussels",
    date: "Jul 2024",
    project: "Onchain Oracle",
    result: "1st — Chainlink Track",
    sponsors: ["Chainlink", "ENS"],
    tone: "gold",
  },
  {
    event: "ETHGlobal",
    location: "New York",
    date: "Sep 2023",
    project: "Mempool Mirror",
    result: "2nd — Infra Track",
    sponsors: ["Base", "Alchemy"],
    tone: "silver",
  },
  {
    event: "Devfolio HackFS",
    location: "Online",
    date: "Aug 2023",
    project: "ProofPostbox",
    result: "Best Use of Filecoin",
    sponsors: ["Filecoin", "Lighthouse"],
    tone: "bronze",
  },
  {
    event: "AI Engineer World's Fair",
    location: "San Francisco",
    date: "Jun 2024",
    project: "AgentRouter",
    result: "Finalist — Autonomous Agents",
    sponsors: ["LangChain", "Pinecone"],
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
    company: "Glyph Protocol",
    title: "Senior Smart Contract Engineer",
    period: "2023 — Present",
    location: "Remote",
    blurb:
      "Lead engineer on an account-abstraction-native L2 stack used by ~40k weekly active wallets.",
    bullets: [
      "Owned the smart wallet stack: ERC-4337 bundler integration, paymaster economics, and recovery flows.",
      "Cut average gas per user op by 38% via storage layout overhaul and assembly micro-optimizations.",
      "Designed the audit-ready upgrade path that shipped without an incident across three major releases.",
    ],
    stack: ["Solidity", "Foundry", "TypeScript", "Viem", "ERC-4337"],
  },
  {
    company: "Pulse Labs",
    title: "Founding Engineer",
    period: "2021 — 2023",
    location: "Remote",
    blurb:
      "Second hire at a seed-stage applied-ML startup serving inference workloads to fintech customers.",
    bullets: [
      "Built the multi-tenant inference router serving 60M+ requests/month with 99.95% availability.",
      "Designed the feature store and offline → online parity tests that became the team's debugging backbone.",
      "Shipped customer-facing eval tooling that closed a six-figure renewal in week one.",
    ],
    stack: ["Python", "Go", "PyTorch", "Kafka", "Postgres", "AWS"],
  },
  {
    company: "Northwind Systems",
    title: "Software Engineer",
    period: "2019 — 2021",
    location: "New York, NY",
    blurb:
      "Backend platform team supporting trading desks at a mid-sized quant fund.",
    bullets: [
      "Refactored the order routing service from a single binary into a typed, observable, fan-out pipeline.",
      "Authored the team's first end-to-end latency SLO framework still in use today.",
    ],
    stack: ["Go", "C++", "Redis", "Kubernetes"],
  },
];

export const skills = {
  Languages: ["TypeScript", "Rust", "Solidity", "Python", "Go"],
  "Smart Contracts": ["Foundry", "Hardhat", "Viem", "Wagmi", "ERC-4337", "ERC-7683"],
  Frontend: ["Next.js", "React", "Tailwind", "RainbowKit", "Motion"],
  "AI / ML": ["PyTorch", "LangChain", "LangGraph", "Anthropic SDK", "RAG", "Evals"],
  Infra: ["AWS", "Postgres", "Redis", "Kafka", "Docker", "Terraform"],
  Cryptography: ["Halo2", "Plonky3", "Circom", "Poseidon", "BLS"],
};

export const skillsFlat = Object.values(skills).flat();
