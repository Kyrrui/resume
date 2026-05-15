// Trims transparent (alpha=0) borders from a PNG so the visible content
// fills the file. Useful for project logos with stock-asset padding.
// Writes back to the same path.
//
// Usage:  node scripts/trim-alpha-borders.mjs <path-relative-to-project-root>
//   e.g.: node scripts/trim-alpha-borders.mjs public/quinfall-crafting-no-background.png

import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const [, , inputArg] = process.argv;
if (!inputArg) {
  console.error("Usage: node scripts/trim-alpha-borders.mjs <input>");
  process.exit(1);
}

const inputPath = resolve(projectRoot, inputArg);
if (!existsSync(inputPath)) {
  console.error("Missing:", inputPath);
  process.exit(1);
}

const sourceBuf = readFileSync(inputPath);

// trim() with no args matches the top-left corner pixel by default. For
// PNGs with alpha=0 corners that's exactly what we want. Threshold left
// at the default so anti-aliased semi-transparent edges of the content
// don't get clipped.
const trimmed = await sharp(sourceBuf)
  .trim()
  .png({ compressionLevel: 9 })
  .toBuffer({ resolveWithObject: true });

writeFileSync(inputPath, trimmed.data);

console.log(
  `Trimmed ${inputArg} → ${trimmed.info.width}x${trimmed.info.height}`
);
