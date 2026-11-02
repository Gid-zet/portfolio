"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { roles } from "@/lib/data";
import { LiquidGlass } from "./LiquidGlass";
import { Magnetic } from "./Magnetic";

const ease = [0.16, 1, 0.3, 1] as const;
const intro = 2.1; // starts after the preloader lifts

function Line({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span className={`block ${className}`} initial={{ y: "105%", rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1.2, ease, delay: intro + delay }}>
        {children}
      </motion.span>
    </span>
  );
}

/** A draggable bead of liquid glass that refracts the headline beneath it. */
function GlassLens({ bounds }: { bounds: React.RefObject<HTMLElement | null> }) {
  return (
    <motion.div
      drag
      dragConstraints={bounds}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
      whileDrag={{ scale: 1.08 }}
      whileHover={{ scale: 1.04 }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: intro + 0.8, type: "spring", stiffness: 120, damping: 14 }}
      data-cursor="Drag"
      className="absolute left-[50%] top-[23%] z-20 h-[clamp(120px,17vw,230px)] w-[clamp(120px,17vw,230px)] cursor-grab touch-none active:cursor-grabbing max-md:left-auto max-md:right-[4%] max-md:top-[16%]"
    >
      <motion.div
        className="liquid liquid-lens h-full w-full rounded-full"
        animate={{ y: [0, -14, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="label pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap !text-[10px] !text-white/50">drag me ✦</span>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const mx = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, rgba(168,85,247,0.18), transparent 60%)`;

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {/* backdrop */}
      <div aria-hidden className="absolute inset-0">
        <div className="aurora absolute -left-[10%] top-[10%] h-[55vmax] w-[55vmax] rounded-full bg-violet/30 blur-[120px]" />
        <div className="aurora absolute -right-[15%] top-[30%] h-[45vmax] w-[45vmax] rounded-full bg-fuchsia/25 blur-[120px]" style={{ animationDelay: "-6s" }} />
        <div className="aurora absolute bottom-[-20%] left-[30%] h-[40vmax] w-[40vmax] rounded-full bg-indigo-500/20 blur-[120px]" style={{ animationDelay: "-12s" }} />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 75%)",
          }}
        />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <GlassLens bounds={ref} />

      <motion.div style={{ y, opacity, scale }} className="container-x relative flex flex-1 flex-col justify-center pb-10 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: intro, duration: 1, ease }}
          className="liquid mb-8 inline-flex w-fit items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-sm text-white/80"
        >
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] tracking-wider text-white">NEW</span>
          Now offering motion graphics ✦
        </motion.div>

        <h1 className="text-[clamp(3rem,10.5vw,10.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
          <Line delay={0}>Engineering</Line>
          <Line delay={0.1} className="font-serif font-normal italic tracking-[-0.02em]">
            <span className="text-grad pr-[0.06em]">Human‑Centric</span>
          </Line>
          <Line delay={0.2}>
            Digital Solutions<span className="text-fuchsia">.</span>
          </Line>
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: intro + 0.5, duration: 1, ease }}
            className="max-w-xl text-lg leading-relaxed text-muted md:text-xl"
          >
            I&apos;m <span className="text-white">Gideon Adonteng</span>, a Full Stack Developer and Psychology graduate merging deep technical expertise with an
            understanding of human behavior to build websites that matter.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: intro + 0.65, duration: 1, ease }}
            className="flex flex-wrap gap-3"
          >
            <Magnetic>
              <a href="#work" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-7 py-4 font-medium text-black">
                <span className="absolute inset-0 translate-y-full rounded-full bg-[image:var(--grad)] transition-transform duration-500 ease-expo group-hover:translate-y-0" />
                <span className="relative transition-colors duration-500 group-hover:text-white">View my work</span>
                <span className="relative grid h-6 w-6 place-items-center rounded-full bg-black text-white transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <LiquidGlass as="a" href="#contact" className="inline-flex items-center rounded-full px-7 py-4 font-medium">
                <span className="relative z-[2]">Get in touch</span>
              </LiquidGlass>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: intro + 0.9, duration: 1 }}
        className="container-x relative flex items-center justify-between border-t border-line py-5"
      >
        <span className="label hidden sm:block">Based in Accra, Ghana</span>
        <span className="label">{roles.join("  ·  ")}</span>
        <span className="label hidden items-center gap-2 lg:flex">
          Scroll
          <span className="relative block h-6 w-px overflow-hidden bg-white/15">
            <motion.span className="absolute inset-x-0 top-0 h-2 bg-white" animate={{ y: [-8, 24] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} />
          </span>
        </span>
      </motion.div>
    </section>
  );
}
