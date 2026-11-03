// Renders motion/reel.html frame-by-frame and scores it with motion/sfx.py.
//
//   npm run reel                      # both cuts
//   npm run reel -- --only=vertical   # just the 9:16 Instagram cut
//   npm run reel -- --only=landscape  # just the 16:9 cut
//
// Outputs (public/motion/):
//   gidzet-reel.mp4 / .webm / -poster.jpg   16:9, silent — used on the website
//   gidzet-reel-16x9.mp4                    16:9 with sound
//   gidzet-reel-9x16.mp4 / -9x16-poster.jpg 9:16 with sound — Instagram Reels / TikTok / Shorts
//
// Needs Playwright's Chromium, ffmpeg and python3 + numpy.
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const FPS = 30;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/motion");
mkdirSync(outDir, { recursive: true });
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const out = (name) => resolve(outDir, name);

const run = (cmd, args) =>
  new Promise((ok, fail) => spawn(cmd, args, { stdio: ["ignore", "ignore", "inherit"] }).on("close", (c) => (c ? fail(new Error(`${cmd} exited ${c}`)) : ok())));

async function renderFrames({ width, height, query, file, poster, posterAt }) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(pathToFileURL(resolve(root, "motion/reel.html")).href + query);
  await page.waitForFunction(() => window.reel?.ready);
  const frames = Math.round((await page.evaluate(() => window.reel.duration)) * FPS);

  const ffmpeg = spawn("ffmpeg", [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "18",
    "-movflags", "+faststart", file,
  ], { stdio: ["pipe", "ignore", "inherit"] });

  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => { window.reel.seek(t); }, i / FPS);
    const buf = await page.screenshot({ type: "png" });
    if (!ffmpeg.stdin.write(buf)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
    if (i % 30 === 0) process.stdout.write(`\r${width}×${height}  frame ${i}/${frames}`);
  }
  ffmpeg.stdin.end();
  await new Promise((r) => ffmpeg.on("close", r));

  await page.evaluate((t) => { window.reel.seek(t); }, posterAt);
  await page.screenshot({ path: poster, type: "jpeg", quality: 88 });
  await browser.close();
  process.stdout.write("\n");
}

// silent video + score → AAC 48 kHz at Instagram's -14 LUFS target
const mux = (video, audio, file) =>
  run("ffmpeg", [
    "-y", "-loglevel", "error", "-i", video, "-i", audio,
    "-map", "0:v", "-map", "1:a", "-c:v", "copy",
    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
    "-shortest", "-movflags", "+faststart", file,
  ]);

const score = join(tmpdir(), "gidzet-reel-sfx.wav");
execFileSync("python3", [resolve(root, "motion/sfx.py"), score], { stdio: "inherit" });

if (only !== "vertical") {
  await renderFrames({ width: 1920, height: 1080, query: "", file: out("gidzet-reel.mp4"), poster: out("gidzet-reel-poster.jpg"), posterAt: 13 });
  await run("ffmpeg", ["-y", "-loglevel", "error", "-i", out("gidzet-reel.mp4"), "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", out("gidzet-reel.webm")]);
  await mux(out("gidzet-reel.mp4"), score, out("gidzet-reel-16x9.mp4"));
}
if (only !== "landscape") {
  const silent = join(tmpdir(), "gidzet-reel-9x16-silent.mp4");
  await renderFrames({ width: 1080, height: 1920, query: "?format=vertical", file: silent, poster: out("gidzet-reel-9x16-poster.jpg"), posterAt: 16.8 });
  await mux(silent, score, out("gidzet-reel-9x16.mp4"));
}
console.log("Done → public/motion/");
