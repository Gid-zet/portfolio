"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { motionWork, type MotionPiece } from "@/lib/data";
import { SectionLabel, SplitReveal } from "./Reveal";

const FILTERS = ["All", "Brand films", "Social", "Explainers"] as const;
type Filter = (typeof FILTERS)[number];
const matches = (m: MotionPiece, f: Filter) =>
  f === "All" ||
  (f === "Social" && (m.ratio !== "16/9" || /social|promo/i.test(m.kind))) ||
  (f === "Brand films" && /brand|concept|product/i.test(m.kind)) ||
  (f === "Explainers" && /explainer/i.test(m.kind));

/** One clip: poster at rest, plays muted on hover (desktop) or when scrolled into view (touch). */
function Clip({ m, i, onOpen }: { m: MotionPiece; i: number; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting && e.intersectionRatio > 0.6), { threshold: [0, 0.6, 1] });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active) {
      if (v.preload !== "auto") v.preload = "auto";
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpen}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      data-cursor="Watch"
      aria-label={`Watch ${m.title}`}
      className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-[24px] bg-bg-2 text-left md:mb-6"
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: m.ratio }}>
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.04]"
          poster={m.poster}
          src={m.src}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <span className="liquid absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium text-black/80">
          <span className="relative z-[2]">
            {m.kind} · {m.duration}
          </span>
        </span>
        <span
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white text-black transition-all duration-500 ease-expo ${active ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
          aria-hidden
        >
          ▶
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <div className="label !text-white/60">{m.client}</div>
        <div className="mt-1 text-lg font-semibold leading-tight tracking-[-0.02em] [text-shadow:0_1px_10px_rgba(0,0,0,.6)] md:text-xl">{m.title}</div>
      </div>
    </motion.button>
  );
}

export function MotionWork() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<MotionPiece | null>(null);
  const shown = motionWork.filter((m) => matches(m, filter));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="motion" className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="05">Motion work</SectionLabel>
            <SplitReveal as="h2" text="Films, promos & stories" className="mt-6 block text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]" />
          </div>
          <p className="max-w-sm text-muted">Brand films, explainers and social ads for real clients, built in code and rendered frame by frame. Previews play as you browse; open one to watch with sound.</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter motion work">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`chip ${filter === f ? "!border-fuchsia/60 !bg-fuchsia/10 !text-white" : ""}`}>
              {f}
              <span className="ml-1.5 text-white/40">{motionWork.filter((m) => matches(m, f)).length}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 columns-1 gap-5 sm:columns-2 md:gap-6 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {shown.map((m, i) => (
              <Clip key={m.src} m={m} i={i} onOpen={() => setOpen(m)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4 backdrop-blur-md md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            data-cursor="Close"
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-5xl flex-col items-center"
            >
              <video
                key={open.src}
                src={open.src}
                poster={open.poster}
                controls
                autoPlay
                playsInline
                className="max-h-[76vh] w-auto max-w-full rounded-2xl bg-black shadow-[0_40px_120px_-30px_rgba(168,85,247,.45)]"
                style={{ aspectRatio: open.ratio }}
              />
              <div className="mt-5 max-w-2xl text-center">
                <div className="label">
                  {open.client} · {open.kind} · {open.duration}
                  {open.sound ? " · sound on" : ""}
                </div>
                <p className="mt-2 font-serif text-2xl italic md:text-3xl">{open.title}</p>
                <p className="mt-2 text-muted">{open.blurb}</p>
              </div>
              <button onClick={() => setOpen(null)} className="liquid mt-5 rounded-full px-5 py-2.5 text-sm font-medium" aria-label="Close video">
                <span className="relative z-[2]">Close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
