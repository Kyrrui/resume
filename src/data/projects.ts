// Curated project details for the "Currently Building" section.
//
// Keys are the GitHub repo name (case-sensitive) — the same value as
// `name` (NOT `nameWithOwner`) in src/data/recent-repos.json. Any repo
// listed here renders a flippable card: the curated content from this
// file on the FRONT, and the live GitHub repo data (commits, language,
// stars, topics) on the BACK. Repos without an entry here render as
// the plain GitHub-data card.
//
// Drop in new repos by adding a key/value pair below.

export type ProjectDetails = {
  /** Human-readable display name, e.g. "The Quinfall Crafting Workshop" */
  title: string;
  /** Subtitle line — usually "Role · Period", shown muted under the title */
  subtitle?: string;
  /** Public live-site URL. Adds a "↗ Live" link in the card corner. */
  url?: string;
  /** Image src under /public, e.g. "/quinfall-crafting-no-background.png" */
  logo?: string;
  /** Logo crop shape. "tile" (default) renders inside a rounded-square
   * tile — good for app icons or product marks. "circle" renders as a
   * full circle — good for avatar-style identities (Discord bots, etc.). */
  logoShape?: "tile" | "circle";
  /** Short pitch paragraph */
  description: string;
  /** Resume-grade bullets — punchy, quantified, ~3–5 of them. Always visible. */
  highlights?: string[];
  /** Optional deeper dive (specific tactics, architectural notes). Hidden
   * behind a "Deep dive" expander on the card so the surface stays clean. */
  details?: string[];
  /** Tech stack pills */
  stack?: string[];
};

export const projects: Record<string, ProjectDetails> = {
  QuinfallCrafting: {
    title: "QuinfallCrafting.com",
    subtitle: "Creator & Maintainer · 2026–Present",
    url: "https://quinfallcrafting.com",
    logo: "/quinfall-crafting-no-background.png",
    description:
      "Live, revenue-generating companion tool for The Quinfall MMO. Sole engineer, designer, and operator. ~2,600 MAU across 70+ countries, fully localized into 13 languages.",
    highlights: [
      "Sole engineer on a production app with ~2,600 MAU across 70+ countries, ~50k pageviews / 60 days, fully localized into 13 languages.",
      "Migrated a 6,650-line monolithic SPA to Next.js with zero user-state loss via a versioned localStorage migration path.",
      "Shipped Workshop Premium ($4.99 one-time, Stripe) and a self-serve sponsorship platform (Stripe subscriptions + Resend approvals).",
      "Hand-rolled Discord OAuth2 + signed sessions in ~100 lines, and a Netlify Edge Function that injects per-page OG + JSON-LD for ~2,200 crawlable URLs.",
    ],
    details: [
      "Cloud-synced inventory with 5 per-user profiles: optimistic UI, debounced writes, conflict-safe slot switching, and a defensive prev→state safety net against transient client glitches.",
      "Custom session layer: HMAC-SHA256 signed cookies, CSRF state, canonical-host redirect to neutralize Netlify branch-deploy cookie-scope bugs, non-httpOnly hint cookie for pre-paint UI.",
      "Workshop Premium pricing was data-driven off a Google Analytics geographic analysis weighing PPP-adjusted conversion against engaged-user counts.",
      "Sponsorship platform: Netlify Blob asset uploads, per-language mutex enforcement, signed-URL approval emails, in-app preview mode for reviewers, automatic theme takeover at the CSS-variable layer.",
      "SEO Edge Function detects crawlers and injects per-recipe / per-item OG meta + Schema.org Product JSON-LD; sitemap auto-generates from the typed item DB at build time.",
      "i18n covers UI labels, item names, recipe ingredients, and search across 13 languages (en/zh/fr/de/it/ja/ru/es/tr/pt/ko/uk/pl) — runs entirely client-side, no per-request translation calls.",
      "Reverse-engineered the game's exported item DB (1,700+ items, 700+ recipes, 13 crafting professions) into a typed runtime catalog with an XP optimizer, profit calculator (market-tax + double-production aware), gear-enhancement planner, and per-profession production calculators.",
      "Performance: pre-paint inline scripts eliminate flash-of-default-theme for premium users and sponsor takeovers; sponsor data is stale-while-revalidate cached in localStorage. Lighthouse 95+ on key pages.",
      "Operations: Stripe webhook idempotency, Discord community-automation bot with multi-language slash commands, AdSense + Amazon Associates monetization, in-app bug-report modal with screenshot upload + auto browser/app-context capture via Resend attachments.",
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "Zustand",
      "Stripe",
      "Discord OAuth2",
      "Resend",
      "Netlify Edge",
    ],
  },

  resume: {
    title: "KyleBryant.dev",
    subtitle: "Creator · 2026–Present",
    url: "https://kylebryant.dev",
    logo: "/COIN_PROF_NO_BACKGROUND.png",
    logoShape: "circle",
    description:
      "This site. Built collaboratively with Claude Code as a pair-programming partner — every section reads from a single data file. Next.js 16 static export, deployed continuously to Netlify.",
    highlights: [
      "Custom 3D coin in the hero: CSS 3D transforms + Motion control a flippable coin with rim, dissolve to portrait, and a velocity-tuned shadow.",
      "Live GitHub activity section: build-time GraphQL fetch of public + private repos with a scroll-linked, draws-as-you-scroll line chart of commits per day.",
      "Flippable project cards: front shows a curated pitch, back shows live commits; clicking any card focuses the chart on that repo's data.",
      "Persistent identity strip in the nav: portrait + name + tagline cross-fade in once the user scrolls past the hero, so the name stays visible across long browsing sessions.",
    ],
    details: [
      "Single source of truth: the nav's monthly commit count reads from the same JSON as the chart total — no third-party API, no drift.",
      "Mobile-friendly coin rim: border-based ring rendering instead of CSS masks, and a lower layer count, so the 3D flip stays smooth on phone GPUs.",
      "Hybrid chart Y-scale: log10 in the all-projects view (so a 50-commit day doesn't flatten everything else), linear when focused on a single repo (so the true shape shows).",
      "Portal-rendered deep-dive modal escapes the card's 3D perspective context, blurs the page behind it, locks body scroll, and supports keyboard / backdrop dismiss.",
      "Image-prep helpers: sharp-based scripts in /scripts trim alpha borders, mask coin images into circles, and process the ETH back-face — all reusable for future assets.",
      "Static export with /scripts/fetch-github-activity.mjs as a prebuild step; Netlify env var GITHUB_TOKEN supplies repo + read:user scopes so private repo names + commits are baked into the build.",
      "Contact form is a styled placeholder ready to wire to an email service; the actual email address is intentionally kept out of the bundle to avoid scraping.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Motion",
      "Netlify",
      "Sharp",
      "Claude Code",
    ],
  },
  "testamentum-bot": {
    title: "Testamentum Discord Bot",
    subtitle: "Creator & Maintainer · 2024–Present",
    url: "https://github.com/Kyrrui/testamentum-bot",
    logo: "/testamentum_bot.png",
    logoShape: "circle",
    description:
      "Serves a Discord church community of over 100 members with the 4,300-verse Marcionite Testamentum. 20+ slash commands, daily AI-generated content, and an interactive multiplayer scripture quiz.",
    highlights: [
      "20+ slash commands across multiple servers: fuzzy search, paginated chapter reader, autocomplete on book/chapter/verse, inline reference expansion, and per-user persistent bookmarks.",
      "AI-powered Verse of the Day via OpenRouter (Kimi K2) with web-search context, history-aware prompting, and tuning that prevents fixation on current events.",
      "Multiplayer daily quiz with persistent Discord views (no 15-minute timeout), three-stage progression (book → chapter → verse), and a live-updating per-server leaderboard.",
      "Hardened scraper with canary verses, count thresholds, and missing-book detection — refuses to overwrite the verse DB if the source site is down or its HTML changes.",
    ],
    details: [
      "PIL-based image generator renders verses as styled PNGs with EB Garamond typography, decorative borders, and section headings — used for shareable verse cards and quiz prompts.",
      "Multi-server architecture with per-guild config (`/setup quiz #channel`), persistent state on Railway volumes surviving redeployments, and scheduled tasks via discord.ext.tasks.",
      "CI/CD via GitHub Actions: daily scraper with validation, AI VOTD generation job, and auto-committing data updates back to the repo.",
      "Production hardening: rate-limit handling, exponential backoff on API failures, graceful degradation when Discord / LLM provider returns 5xx, and restart-loop prevention.",
      "Inline reference expansion: regex parses messages like \"Eph 2:8\" and posts the verse without a slash command — picks up scripture mentions in natural conversation.",
      "Ephemeral per-user quiz responses keep the channel clean while still scoring on a shared, server-wide leaderboard.",
    ],
    stack: [
      "Python",
      "discord.py",
      "Pillow (PIL)",
      "OpenRouter API",
      "BeautifulSoup",
      "GitHub Actions",
      "Railway",
    ],
  },
  // "kin-quilt": {
  //   title: "",
  //   subtitle: "",
  //   url: "",
  //   logo: "",
  //   description: "",
  //   highlights: [],
  //   stack: [],
  // },
};
