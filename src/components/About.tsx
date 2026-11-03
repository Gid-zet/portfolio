"use client";

import Image from "next/image";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LiquidGlass } from "./LiquidGlass";
import { FadeUp, SectionLabel } from "./Reveal";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-serif text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.08] tracking-[-0.01em]">
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

const photos = [
  { src: "/profile.jpg", alt: "Gideon Adonteng seated in a gallery lobby", title: "Gideon Adonteng", sub: "Developer · Designer", pos: "center 50%" },
  { src: "/profile-candid.jpg", alt: "Gideon Adonteng smiling, a candid selfie", title: "Off-screen", sub: "The human behind the code", pos: "center 36%" },
];

const swapEase = [0.65, 0, 0.35, 1] as const;
const pose = {
  front: { x: "0%", y: "0%", rotate: 0, scale: 1, filter: "brightness(1)" },
  back: { x: "7%", y: "-5%", rotate: 5, scale: 0.92, filter: "brightness(0.5)" },
};

/** Two stacked prints that shuffle places: the front one slides out and tucks behind. */
function PhotoStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [front, setFront] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [hovered, setHovered] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const swap = () => {
    setFront((f) => (f + 1) % photos.length);
    setSwaps((n) => n + 1);
  };

  // auto-shuffle while visible; pause on hover and for reduced-motion users
  useEffect(() => {
    if (!inView || hovered || reduce) return;
    const id = setInterval(swap, 4500);
    return () => clearInterval(id);
  }, [inView, hovered, reduce]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[3/4]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {photos.map((ph, i) => {
        const isFront = i === front;
        // after the first swap, play the shuffle path; before that, just sit in pose
        const motionPath = swaps === 0
          ? (isFront ? pose.front : pose.back)
          : isFront
            ? { x: ["7%", "62%", "0%"], y: ["-5%", "-2%", "0%"], rotate: [5, 14, 0], scale: [0.92, 0.97, 1], filter: ["brightness(0.5)", "brightness(0.9)", "brightness(1)"], zIndex: [1, 1, 2, 2] }
            : { x: ["0%", "-12%", "7%"], y: ["0%", "2%", "-5%"], rotate: [0, -6, 5], scale: [1, 0.9, 0.92], filter: ["brightness(1)", "brightness(0.7)", "brightness(0.5)"], zIndex: [2, 2, 1, 1] };
        return (
          <motion.figure
            key={ph.src}
            initial={false}
            animate={motionPath}
            transition={{ duration: 0.95, ease: swapEase, zIndex: { duration: 0.95, times: [0, 0.5, 0.501, 1] } }}
            style={{ zIndex: isFront ? 2 : 1 }}
            onClick={swap}
            data-cursor={isFront ? "Switch" : undefined}
            className="absolute inset-0 cursor-pointer overflow-hidden rounded-[28px] shadow-[0_30px_80px_-25px_rgba(0,0,0,.85)]"
            aria-hidden={!isFront}
          >
            <motion.div style={{ y: imgY }} className="absolute inset-[-10%_0]">
              <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover grayscale" style={{ objectPosition: ph.pos }} />
            </motion.div>
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-6">
              <div>
                <div className="font-serif text-3xl italic">{ph.title}</div>
                <div className="label !text-white/60">{ph.sub}</div>
              </div>
              {i === 0 && (
                <svg viewBox="0 0 100 100" className="spin-slow h-20 w-20" aria-hidden>
                  <defs>
                    <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text fontSize="10.5" fill="white" letterSpacing="2.4" fontFamily="var(--font-geist-mono)">
                    <textPath href="#circ">PSYCHOLOGY · CODE · DESIGN · MOTION ·</textPath>
                  </text>
                  <circle cx="50" cy="50" r="4" fill="#ec4899" />
                </svg>
              )}
            </figcaption>
          </motion.figure>
        );
      })}

      <LiquidGlass
        as="button"
        onClick={swap}
        aria-label={`Show ${photos[(front + 1) % photos.length].title} photo`}
        className="absolute left-4 top-4 z-10 flex items-center gap-2.5 rounded-full !bg-black/35 py-2 pl-2 pr-4 text-sm [text-shadow:0_1px_8px_rgba(0,0,0,.6)]"
      >
        <span className="relative z-[2] flex items-center gap-2.5">
          <span className="flex gap-1">
            {photos.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === front ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </span>
          Switch ⇄
        </span>
      </LiquidGlass>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-32 md:py-44">
      <div className="container-x">
        <SectionLabel index="02">About me</SectionLabel>
        <div className="mt-10 max-w-5xl">
          <ScrollText text="Code is written for machines to execute, but interfaces are designed for humans to experience." />
        </div>

        <div className="mt-24 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <PhotoStack />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                { n: 5, s: "+", l: "Years experience" },
                { n: 20, s: "+", l: "Tools mastered" },
              ].map((s) => (
                <div key={s.l} className="ring-grad rounded-3xl bg-bg-2 p-6">
                  <div className="text-5xl font-semibold tracking-tight">
                    <Counter to={s.n} suffix={s.s} />
                  </div>
                  <div className="label mt-2">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pt-10">
            <FadeUp>
              <h3 className="text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-[1] tracking-[-0.035em]">
                From human behavior <br />
                <span className="font-serif font-normal italic text-grad">to functional code.</span>
              </h3>
            </FadeUp>
            <FadeUp delay={0.1} className="mt-10 space-y-6 text-lg leading-relaxed text-muted">
              <p>
                My journey into technology began from an unconventional place: <span className="text-white">Psychology</span>. Graduating from the University of
                Ghana, I spent years studying how people think, feel, and interact with the world around them.
              </p>
              <p>
                This transition from <span className="text-grad font-medium">Psychology to Programming</span> wasn&apos;t a pivot, but a fusion. I realized that
                the best software isn&apos;t just about clean logic; it&apos;s about understanding the user&apos;s mental model. My background in psychology
                allows me to anticipate user needs, reduce cognitive load, and create intuitive designs that feel natural.
              </p>
              <p>
                With over <span className="text-white">3 years of experience</span> in the JavaScript ecosystem (React, Node.js, Next.js), I&apos;ve built
                everything from AI-driven email clients to real-time audio processing applications. Whether I&apos;m automating workflows at Winnck Enterprise or
                engineering eCommerce platforms for Tillyn Clothings, I approach every line of code with a human-centric lens. Now I bring that same
                sensibility to <span className="text-white">motion graphics</span>, making products not just usable, but alive.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
