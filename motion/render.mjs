// Renders motion/reel.html frame-by-frame to public/motion/gidzet-reel.mp4 (+ webm and a poster).
// Usage: npm run reel        (needs Playwright's Chromium and ffmpeg on PATH)
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const FPS = 30;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/motion");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(resolve(root, "motion/reel.html")).href);
await page.waitForFunction(() => window.reel?.ready);

const duration = await page.evaluate(() => window.reel.duration);
const frames = Math.round(duration * FPS);

const ffmpeg = spawn("ffmpeg", [
  "-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "20",
  "-movflags", "+faststart", resolve(outDir, "gidzet-reel.mp4"),
], { stdio: ["pipe", "ignore", "inherit"] });

for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.reel.seek(t), i / FPS);
  const buf = await page.screenshot({ type: "png" });
  if (!ffmpeg.stdin.write(buf)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
  if (i % 30 === 0) process.stdout.write(`\rframe ${i}/${frames}`);
}
ffmpeg.stdin.end();
await new Promise((r) => ffmpeg.on("close", r));

// poster frame from the logo lock-up
await page.evaluate(() => window.reel.seek(13));
await page.screenshot({ path: resolve(outDir, "gidzet-reel-poster.jpg"), type: "jpeg", quality: 85 });
await browser.close();

// a lighter VP9 copy for browsers that prefer it
await new Promise((r) =>
  spawn("ffmpeg", ["-y", "-i", resolve(outDir, "gidzet-reel.mp4"), "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", resolve(outDir, "gidzet-reel.webm")], { stdio: "ignore" }).on("close", r),
);
console.log(`\nDone → public/motion/gidzet-reel.{mp4,webm}`);
