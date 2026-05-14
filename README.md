# resume

Static personal resume site with a Crypto × AI aesthetic.

## Stack

- Next.js 16 (App Router, static export)
- Tailwind CSS v4
- Motion (animations)
- Fonts: Geist, Geist Mono, Space Grotesk

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

Produces a static site in `out/`.

## Deploy

Push to GitHub. Netlify auto-deploys from `main` using the config in `netlify.toml` (build command `npm run build`, publish dir `out`).

## Editing content

All copy lives in [`src/data/resume.ts`](src/data/resume.ts) — profile, featured builds, hackathons, work, and skills. Swap the placeholders, the layout adapts.

## Structure

```
src/
  app/
    layout.tsx         root layout, fonts, metadata
    page.tsx           assembles sections
    globals.css        design tokens, base styles, utilities
  components/
    Nav.tsx            sticky top nav with scroll-spy
    sections/          one file per page section
    ui/                Background, Reveal, Pill, SectionHeader
  data/
    resume.ts          all editable content
```
