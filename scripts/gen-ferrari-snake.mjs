/**
 * Ferrari-themed looping contribution-snake SVG (demo).
 * Overwritten by Platane/snk after the GitHub Action runs with real data.
 */
import fs from "node:fs";
import path from "node:path";

const WEEKS = 53;
const DAYS = 7;
const CELL = 11;
const GAP = 3;
const PAD_X = 10;
const PAD_Y = 10;
const STEP = CELL + GAP;
const colors = ["#1a1a1a", "#5C0000", "#A30000", "#E10600", "#FF2800"];
const snakeColor = "#FFF200";

const level = (w, d) => {
  const n = (w * 11 + d * 5) % 19;
  if (w < 10) return n % 13 === 0 ? 1 : 0;
  if (w < 24) return n % 6 === 0 ? 2 : n % 4 === 0 ? 1 : 0;
  if (n % 3 === 0) return 4;
  if (n % 2 === 0) return 3;
  return n % 5 === 0 ? 2 : n % 7 === 0 ? 1 : 0;
};

const pathCells = [];
for (let w = 0; w < WEEKS; w++) {
  if (w % 2 === 0) {
    for (let d = 0; d < DAYS; d++) pathCells.push({ w, d });
  } else {
    for (let d = DAYS - 1; d >= 0; d--) pathCells.push({ w, d });
  }
}

const width = PAD_X * 2 + WEEKS * STEP - GAP;
const height = PAD_Y * 2 + DAYS * STEP - GAP + 26;
const dur = Math.max(18, Math.round(pathCells.length * 0.045));

const rects = [];
for (let w = 0; w < WEEKS; w++) {
  for (let d = 0; d < DAYS; d++) {
    const x = PAD_X + w * STEP;
    const y = PAD_Y + d * STEP;
    rects.push(
      `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" fill="${colors[level(w, d)]}"/>`
    );
  }
}

const xs = pathCells.map(({ w }) => PAD_X + w * STEP).join(";");
const ys = pathCells.map(({ d }) => PAD_Y + d * STEP).join(";");

// Trail segments behind the head
const trail = [1, 2, 3, 4, 5]
  .map((offset, i) => {
    const opacity = 1 - i * 0.15;
    const size = CELL - i;
    const pad = (CELL - size) / 2;
    const delayed = pathCells.slice(0, -offset).concat(pathCells.slice(0, offset));
    // shift path so trail lags: rotate array by offset
    const lagged = pathCells.slice(offset).concat(pathCells.slice(0, offset));
    const tx = lagged.map(({ w }) => PAD_X + w * STEP + pad).join(";");
    const ty = lagged.map(({ d }) => PAD_Y + d * STEP + pad).join(";");
    return `<rect width="${size}" height="${size}" rx="2" fill="${snakeColor}" opacity="${opacity}">
  <animate attributeName="x" values="${tx}" dur="${dur}s" repeatCount="indefinite"/>
  <animate attributeName="y" values="${ty}" dur="${dur}s" repeatCount="indefinite"/>
</rect>`;
  })
  .join("\n");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Ferrari contribution snake">
  <rect width="100%" height="100%" rx="10" fill="#0A0A0A"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="10" fill="none" stroke="#E10600" stroke-width="1"/>
  ${rects.join("\n  ")}
  ${trail}
  <rect width="${CELL}" height="${CELL}" rx="2" fill="${snakeColor}">
    <animate attributeName="x" values="${xs}" dur="${dur}s" repeatCount="indefinite"/>
    <animate attributeName="y" values="${ys}" dur="${dur}s" repeatCount="indefinite"/>
  </rect>
  <text x="${width / 2}" y="${height - 8}" text-anchor="middle" fill="#FFF200" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1.5">YELLOW SNAKE · RED SECTORS · FERRARI GRID</text>
</svg>
`;

const outDir = path.resolve("dist");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "github-snake.svg"), svg);
fs.writeFileSync(path.join(outDir, "github-snake-dark.svg"), svg);
console.log(`OK → dist/github-snake.svg (${width}×${height}, ${dur}s loop)`);
