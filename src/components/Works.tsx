"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { projects } from "@/lib/data";
import { SectionLabel, SplitReveal } from "./Reveal";

type Project = (typeof projects)[number];

function Card({ p, i, progress, total }: { p: Project; i: number; progress: MotionValue<number>; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  // cards behind shrink and dim as the next one slides over them
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - i) * 0.05]);
  const dim = useTransform(progress, [i / total, 1], [0, (total - i - 1) * 0.25]);

  return (
    <div ref={ref} className="sticky top-0 flex h-screen items-center justify-center">
      <motion.article
        style={{ scale, top: `calc(8vh + ${i * 28}px)` }}
        className="ring-grad relative w-full origin-top overflow-hidden rounded-[28px] bg-bg-2 md:rounded-[36px]"
      >
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between gap-10 p-7 md:p-12">
            <div>
              <div className="mb-8 flex items-center justify-between">
                <span className="font-serif text-6xl italic text-white/15 md:text-7xl">0{i + 1}</span>
                <span className="label">{p.year}</span>
              </div>
              <h3 className="text-4xl font-semibold tracking-[-0.03em] md:text-6xl">{p.name}</h3>
              <p className="mt-2 font-serif text-xl italic md:text-2xl" style={{ color: p.accent }}>
                {p.tagline}
              </p>
              <p className="mt-6 max-w-md leading-relaxed text-muted">{p.description}</p>
            </div>
            <div>
              <dl className="mb-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="label mb-1">Client</dt>
                  <dd>{p.client}</dd>
                </div>
                <div>
                  <dt className="label mb-1">Services</dt>
                  <dd>{p.services.join(", ")}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3">
                <a href={p.live} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
                  Live site <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                </a>
                <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition-colors hover:border-white/40">
                  Source code
                </a>
              </div>
            </div>
          </div>

          <a href={p.live} target="_blank" rel="noreferrer" data-cursor="Visit" className="group relative m-3 block overflow-hidden rounded-[20px] md:m-4 md:rounded-[26px]" style={{ background: `radial-gradient(120% 120% at 80% 0%, ${p.accent}55, transparent 60%), #111019` }}>
            <div className="flex h-full min-h-[240px] flex-col p-4 pt-10 md:min-h-[520px] md:p-10 md:pt-16">
              {/* browser frame */}
              <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/60">
                <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-white/5 px-3">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-3 truncate font-mono text-[10px] text-white/40">{p.live.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                </div>
                <motion.div style={{ scale: imgScale }} className="relative aspect-[16/7] w-full origin-top md:absolute md:inset-0 md:top-7 md:aspect-auto">
                  <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="(max-width: 768px) 100vw, 700px" className="object-cover object-top transition-transform duration-[1.2s] ease-expo group-hover:scale-105" />
                </motion.div>
              </div>
            </div>
          </a>
        </div>
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  );
}

export function Works() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="work" className="relative pt-32 md:pt-44">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="01">Selected work</SectionLabel>
            <SplitReveal as="h2" text="Recent works" className="mt-6 block text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]" />
          </div>
          <p className="max-w-sm text-muted">A few products I&apos;ve designed and engineered end to end, from first sketch to production.</p>
        </div>
        <div ref={ref} className="relative mt-10 md:mt-16">
          {projects.map((p, i) => (
            <Card key={p.name} p={p} i={i} progress={scrollYProgress} total={projects.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
