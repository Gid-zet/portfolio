"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { designs } from "@/lib/data";
import { SectionLabel } from "./Reveal";

export function Designs() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 40));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const d = open !== null ? designs[open] : null;

  return (
    <section id="designs" ref={ref} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index="04">Graphic design · Visual arts</SectionLabel>
            <h2 className="mt-6 text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              Visual <span className="font-serif font-normal italic text-grad">stories</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted">A collection of visual stories and branding elements crafted to communicate ideas effectively and beautifully.</p>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 pl-5 md:gap-7 md:pl-[max(20px,calc((100vw-1320px)/2))]">
          {designs.map((g, i) => (
            <motion.button
              key={g.src}
              onClick={() => setOpen(i)}
              data-cursor="View"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative h-[52vh] max-h-[560px] shrink-0 overflow-hidden rounded-[24px] bg-bg-2 text-left"
              style={{ aspectRatio: `${Math.max(g.w / g.h, 0.62)}` }}
            >
              <Image src={g.src} alt={g.name} fill sizes="40vw" className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 transition-transform duration-500 ease-expo group-hover:translate-y-0">
                <div className="label !text-white/60">
                  {String(i + 1).padStart(2, "0")} · {g.kind}
                </div>
                <div className="mt-1 text-lg font-medium leading-snug">{g.name}</div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <div className="container-x mt-10 flex items-center gap-4">
          <span className="label">Scroll</span>
          <div className="h-px flex-1 bg-white/10">
            <motion.div className="h-px bg-[image:var(--grad)]" style={{ width: progress }} />
          </div>
          <span className="label">{String(designs.length).padStart(2, "0")} pieces</span>
        </div>
      </div>

      <AnimatePresence>
        {d && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-5 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            data-cursor="Close"
            role="dialog"
            aria-label={d.name}
          >
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} className="text-center">
              <Image src={d.src} alt={d.name} width={d.w} height={d.h} className="mx-auto max-h-[82vh] w-auto rounded-2xl" />
              <p className="mt-4 font-serif text-2xl italic">{d.name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
