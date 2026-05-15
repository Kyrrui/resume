// One-shot helper: takes public/ETH_TOKEN.png (RGB, no alpha, with painted
// "checkerboard" transparency placeholder in the corners) and produces a
// circularly-masked PNG with a real alpha channel so the coin sits cleanly
// inside the flippable token. Overwrites the original.
import sharp from "sharp";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const input = resolve(projectRoot, "public/ETH_TOKEN.png");
const backup = resolve(projectRoot, "public/ETH_TOKEN.original.png");

if (!existsSync(input)) {
  console.error("Missing", input);
  process.exit(1);
}

// Keep a one-time backup of the original (only if we haven't already made one).
if (!existsSync(backup)) {
  copyFileSync(input, backup);
}

// Always trim and remask starting from the pristine source.
const sourceBuf = readFileSync(backup);

// Step 1: trim near-white / checkerboard border. The corners are an
// alternating white (#fff) / light-gray (~#ccc) pattern, so we use a high
// threshold so both colors qualify as background.
const trimmed = await sharp(sourceBuf)
  .trim({ background: "#ffffff", threshold: 60 })
  .toBuffer({ resolveWithObject: true });

const { data: trimmedData, info: trimmedInfo } = trimmed;
const size = Math.max(trimmedInfo.width, trimmedInfo.height);

// Step 2: pad to a square so the coin sits in the middle. Padded area is
// transparent.
const squareBuf = await sharp(trimmedData)
  .resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .ensureAlpha()
  .png()
  .toBuffer();

// Step 3: apply a circular alpha mask. The actual silver disc in the source
// is a few % smaller than the inscribed circle of the square — so we shrink
// the mask radius slightly to clip the thin painted-background ring that
// otherwise sits between the disc edge and the inscribed circle.
const radius = (size / 2) * 0.88;
const mask = Buffer.from(
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
    `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="white"/>` +
    `</svg>`
);

const final = await sharp(squareBuf)
  .composite([{ input: mask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(input, final);
console.log(
  `Wrote ${input} — ${size}x${size}, original backed up to ETH_TOKEN.original.png`
);
