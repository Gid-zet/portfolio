"use client";

import { motion } from "motion/react";
import { skills } from "@/lib/data";
import { LiquidGlass } from "./LiquidGlass";
import { FadeUp, SectionLabel, SplitReveal } from "./Reveal";

/** Looping keyframe/easing curve: a small nod to the motion graphics toolkit. */
function MotionArt() {
  return (
    <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      <svg viewBox="0 0 400 140" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" x2="400" y1={20 + i * 33} y2={20 + i * 33} stroke="rgba(255,255,255,.06)" />
        ))}
        <motion.path
          d="M10 120 C 140 120, 160 20, 390 20"
          fill="none"
          stroke="url(#mg)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 1.2 }}
        />
        <line x1="10" y1="120" x2="140" y2="120" stroke="rgba(255,255,255,.3)" strokeDasharray="3 4" />
        <line x1="390" y1="20" x2="160" y2="20" stroke="rgba(255,255,255,.3)" strokeDasharray="3 4" />
        <circle cx="140" cy="120" r="5" fill="#a855f7" />
        <circle cx="160" cy="20" r="5" fill="#ec4899" />
        <defs>
          <linearGradient id="mg" x1="0" x2="1">
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <motion.span
        className="absolute bottom-3 left-[10px] h-4 w-4 rotate-45 rounded-[3px] bg-white shadow-[0_0_20px_rgba(236,72,153,.8)]"
        animate={{ x: [0, 370], y: [0, -100] }}
        transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 1.2 }}
      />
      <span className="label absolute right-3 top-2 !text-[10px]">ease-in-out · 1.6s</span>
    </div>
  );
}

export function Skills() {
  return (
    <section className="relative py-24 md:py-32">
      {/* colour for the glass to refract */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora absolute left-[8%] top-[38%] h-[26rem] w-[26rem] rounded-full bg-violet/45 blur-[90px]" />
        <div className="aurora absolute right-[6%] top-[30%] h-[22rem] w-[22rem] rounded-full bg-fuchsia/40 blur-[90px]" style={{ animationDelay: "-5s" }} />
        <div className="aurora absolute bottom-[4%] left-[40%] h-[20rem] w-[30rem] rounded-full bg-indigo-500/35 blur-[90px]" style={{ animationDelay: "-10s" }} />
        <div className="aurora absolute bottom-[20%] right-[30%] h-40 w-40 rounded-full bg-amber-400/30 blur-[60px]" style={{ animationDelay: "-3s" }} />
      </div>
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="03">Technical arsenal</SectionLabel>
            <SplitReveal as="h2" text="Tools of the trade" className="mt-6 block text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]" />
          </div>
          <p className="max-w-sm text-muted">A full-stack toolkit, a designer&apos;s eye, and now motion, all guided by an understanding of how people think.</p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-flow-dense md:grid-cols-6">
          {skills.map((s, i) => {
            const span = s.featured ? "md:col-span-4 md:row-span-2" : i > 2 ? "md:col-span-3" : "md:col-span-2";
            return (
              <FadeUp key={s.title} delay={i * 0.06} className={span}>
                <LiquidGlass className="group h-full overflow-hidden rounded-[28px] p-7">
                  {s.featured && <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-violet/25 via-transparent to-fuchsia/20" />}
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <h3 className={`${s.featured ? "text-4xl md:text-5xl" : "text-2xl"} font-semibold tracking-[-0.03em]`}>
                      {s.featured ? (
                        <>
                          Motion <span className="font-serif font-normal italic text-grad">Graphics</span>
                        </>
                      ) : (
                        s.title
                      )}
                    </h3>
                    {s.featured && <span className="rounded-full bg-white px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-black">New</span>}
                  </div>
                  {s.featured && (
                    <>
                      <p className="mb-6 max-w-lg text-muted">
                        Animated logos, social reels, explainer videos and buttery web interactions: motion that guides attention and makes brands feel alive.
                      </p>
                      <div className="mb-6">
                        <MotionArt />
                      </div>
                    </>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <span key={it} className={`chip ${s.psych ? "!border-violet/40 !bg-violet/10 !text-violet-200" : ""}`}>
                        {it}
                      </span>
                    ))}
                  </div>
                </LiquidGlass>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
