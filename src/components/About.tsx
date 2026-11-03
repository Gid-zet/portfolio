"use client";

import Image from "next/image";
import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
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

export function About() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  // the candid shot drifts faster than the portrait for depth
  const candidY = useTransform(scrollYProgress, [0, 1], [90, -90]);

  return (
    <section id="about" className="relative py-32 md:py-44">
      <div className="container-x">
        <SectionLabel index="02">About me</SectionLabel>
        <div className="mt-10 max-w-5xl">
          <ScrollText text="Code is written for machines to execute, but interfaces are designed for humans to experience." />
        </div>

        <div className="mt-24 grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <div className="relative">
              <motion.div
                ref={imgRef}
                initial={{ clipPath: "inset(100% 0 0 0 round 28px)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0 round 28px)" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
                className="relative aspect-[3/4] overflow-hidden rounded-[28px]"
                data-cursor="Hello"
              >
                <motion.div style={{ y: imgY }} className="absolute inset-[-12%_0]">
                  <Image src="/profile.jpg" alt="Gideon Adonteng" fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover grayscale transition duration-700 hover:grayscale-0" />
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div>
                    <div className="font-serif text-3xl italic">Gideon Adonteng</div>
                    <div className="label !text-white/60">Developer · Designer</div>
                  </div>
                  <svg viewBox="0 0 100 100" className="spin-slow h-20 w-20" aria-hidden>
                    <defs>
                      <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                    </defs>
                    <text fontSize="10.5" fill="white" letterSpacing="2.4" fontFamily="var(--font-geist-mono)">
                      <textPath href="#circ">PSYCHOLOGY · CODE · DESIGN · MOTION ·</textPath>
                    </text>
                    <circle cx="50" cy="50" r="4" fill="#ec4899" />
                  </svg>
                </div>
              </motion.div>

              {/* candid shot: a tilted glass-framed print layered over the portrait */}
              <motion.figure
                style={{ y: candidY }}
                initial={{ opacity: 0, rotate: 18, scale: 0.85 }}
                whileInView={{ opacity: 1, rotate: 6, scale: 1 }}
                whileHover={{ rotate: 0, scale: 1.04 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.5 }}
                className="absolute -right-[4%] -top-[5%] z-10 w-[42%] lg:-right-[6%] lg:w-[44%]"
                data-cursor="Hi!"
              >
                <LiquidGlass className="rounded-[22px] p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] md:p-2.5">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[16px]">
                    <Image src="/profile-candid.jpg" alt="Gideon Adonteng smiling, a candid selfie" fill sizes="(max-width: 1024px) 42vw, 260px" className="object-cover object-[center_40%]" />
                  </div>
                  <figcaption className="relative z-[2] flex items-center justify-between px-1.5 pb-0.5 pt-2.5">
                    <span className="font-serif text-lg italic leading-none [text-shadow:0_1px_10px_rgba(0,0,0,.7)] md:text-xl">off-screen</span>
                    <span className="text-fuchsia">✦</span>
                  </figcaption>
                </LiquidGlass>
              </motion.figure>
            </div>
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
