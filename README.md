# Gidzet: Portfolio of Gideon Adonteng

Personal portfolio of a Full Stack Developer, UI & Motion Designer and Psychology graduate.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (Framer Motion) · Lenis smooth scroll

## Highlights

- Preloader with counter and curtain reveal
- Custom magnetic cursor with contextual labels ("Visit", "View")
- Aurora gradient hero with cursor spotlight, masked headline reveal and parallax-on-scroll
- Scroll-velocity marquees
- Sticky stacking project cards with browser-frame mockups
- Scroll-linked word highlighting, clip-path image reveal and animated counters
- Bento skills grid with an animated motion-graphics easing curve
- Pinned horizontal-scroll design gallery with lightbox
- Expanding services list, magnetic contact button and a live Accra clock
- **Liquid glass**: SVG-displacement refraction with chromatic aberration, pointer-tracked specular highlights and rim lighting (nav, buttons, skills cards, gallery captions, a draggable hero lens, the contact orb and the cursor). Chromium shows full refraction; Safari and Firefox fall back to frosted glass.
- Respects `prefers-reduced-motion`

## Motion graphic: brand reel

`motion/reel.html` is an 18s GSAP motion graphic (kinetic type, easing curve, squash & stretch shapes, glass-orb logo reveal, contact end card).
It renders in two formats: 16:9 (1920×1080) and 9:16 (1080×1920, add `?format=vertical`) with text kept inside the Instagram Reels safe zone.

`motion/sfx.py` scores it with original, synthesised sound design (ambient pad, whooshes, risers, letter thuds, typing,
bubble pops, sub-bass logo impact, shimmer and a UI chime), mixed through a stereo reverb and delivered at -14 LUFS.

```bash
npm run reel                      # both cuts
npm run reel -- --only=vertical   # just the 9:16 cut
```

| File (`public/motion/`) | Use |
| --- | --- |
| `gidzet-reel-9x16.mp4` | Instagram Reels / TikTok / YouTube Shorts (with sound) |
| `gidzet-reel-16x9.mp4` | Landscape with sound (used on the site) |
| `gidzet-reel.mp4`, `.webm` | Landscape, silent |

Needs ffmpeg, python3 + numpy and Playwright's Chromium.

## Develop

```bash
npm install
npm run dev
```

## Edit content

All copy, projects, skills, services and design pieces live in [`src/lib/data.ts`](src/lib/data.ts).
Images are in `public/` (`work/` for project screenshots, `designs/` for graphic design pieces).
