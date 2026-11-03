"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LiquidGlass } from "./LiquidGlass";
import { SectionLabel, SplitReveal } from "./Reveal";

export function Showreel() {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [64, 28]);

  // only play while on screen
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && playing) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [playing]);

  return (
    <section id="reel" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="04">Motion graphics</SectionLabel>
            <SplitReveal as="h2" text="Brand reel" className="mt-6 block text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]" />
          </div>
          <p className="max-w-sm text-muted">
            A 14-second identity piece: kinetic type, easing curves and a liquid-glass logo reveal, built in code and rendered frame by frame.
          </p>
        </div>

        <motion.div ref={ref} style={{ scale, borderRadius: radius }} className="relative mt-14 aspect-video overflow-hidden bg-bg-2 shadow-[0_40px_120px_-30px_rgba(168,85,247,.45)]" data-cursor={playing ? "Pause" : "Play"}>
          <video
            ref={video}
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            poster="/motion/gidzet-reel-poster.jpg"
            muted={muted}
            loop
            playsInline
            preload="metadata"
            aria-label="GIDZET brand reel motion graphic"
            onClick={() => setPlaying((p) => !p)}
          >
            <source src="/motion/gidzet-reel-16x9.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 md:inset-x-6 md:bottom-6">
            <LiquidGlass className="rounded-full px-4 py-2 text-sm">
              <span className="relative z-[2] flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${playing ? "pulse-dot bg-red-500" : "bg-white/50"}`} />
                GIDZET · Brand reel · 0:14
              </span>
            </LiquidGlass>
            <div className="flex gap-2">
              <LiquidGlass
                as="button"
                onClick={() => {
                  setMuted((m) => !m);
                  video.current?.play().catch(() => {});
                }}
                aria-label={muted ? "Turn sound on" : "Mute"}
                className="pointer-events-auto flex h-12 items-center gap-2 rounded-full px-4 text-sm"
              >
                <span className="relative z-[2] flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
                    {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
                  </svg>
                  {muted ? "Sound on" : "Sound off"}
                </span>
              </LiquidGlass>
              <LiquidGlass as="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause reel" : "Play reel"} className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full">
                <span className="relative z-[2] text-sm">{playing ? "❚❚" : "▶"}</span>
              </LiquidGlass>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["After Effects-style keyframing", "Kinetic typography", "Squash & stretch", "Custom easing", "GSAP", "Original sound design"].map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
