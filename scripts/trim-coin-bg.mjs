// Generic background-stripper for coin images that ship as RGB with a
// painted "checkerboard" transparency placeholder. Trims near-white
// borders, pads to a square, applies a circular alpha mask, and writes a
// real RGBA PNG.
//
// Usage:  node scripts/trim-coin-bg.mjs <input> [output] [radius-factor]
//   <input>          required, path relative to project root
//   [output]         optional, path relative to project root
//                    (default: replace "_WITH_BACKGROUND" → "_NO_BACKGROUND" in <input>)
//   [radius-factor]  optional, 0..1, fraction of inscribed circle (default 0.88)
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const [, , inputArg, outputArg, radiusArg] = process.argv;
if (!inputArg) {
  console.error(
    "Usage: node scripts/trim-coin-bg.mjs <input> [output] [radius-factor]"
  );
  process.exit(1);
}

const inputPath = resolve(projectRoot, inputArg);
if (!existsSync(inputPath)) {
  console.error("Missing:", inputPath);
  process.exit(1);
}

const outputPath = outputArg
  ? resolve(projectRoot, outputArg)
  : inputPath.replace(/_WITH_BACKGROUND/, "_NO_BACKGROUND");

const radiusFactor = radiusArg ? parseFloat(radiusArg) : 0.88;
if (Number.isNaN(radiusFactor) || radiusFactor <= 0 || radiusFactor > 1) {
  console.error("radius-factor must be a number in (0, 1]; got:", radiusArg);
  process.exit(1);
}

const sourceBuf = readFileSync(inputPath);

// 1) Trim near-white / checkerboard border. High threshold catches both the
//    pure-white squares and the lighter-gray squares of the placeholder.
const trimmed = await sharp(sourceBuf)
  .trim({ background: "#ffffff", threshold: 60 })
  .toBuffer({ resolveWithObject: true });

const { data: trimmedData, info: trimmedInfo } = trimmed;
const size = Math.max(trimmedInfo.width, trimmedInfo.height);

// 2) Pad to a square so the coin sits in the middle; padding is transparent.
const squareBuf = await sharp(trimmedData)
  .resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .ensureAlpha()
  .png()
  .toBuffer();

// 3) Circular alpha mask. Shrunk by `radiusFactor` so any thin painted
//    background ring just inside the inscribed circle gets clipped.
const radius = (size / 2) * radiusFactor;
const mask = Buffer.from(
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
    `<circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="white"/>` +
    `</svg>`
);

const final = await sharp(squareBuf)
  .composite([{ input: mask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(outputPath, final);
console.log(
  `Wrote ${outputPath} — ${size}x${size}, mask radius factor ${radiusFactor}`
);
