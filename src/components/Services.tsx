"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { services } from "@/lib/data";
import { SectionLabel, SplitReveal } from "./Reveal";

export function Services() {
  const [active, setActive] = useState<number>(0);

  return (
    <section id="services" className="relative py-32 md:py-44">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="05">What I do</SectionLabel>
            <SplitReveal as="h2" text="Expertise & specializations" className="mt-6 block max-w-4xl text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]" />
          </div>
          <p className="max-w-sm text-muted">Combining design thinking with technical mastery to deliver world-class digital products.</p>
        </div>

        <ul className="mt-16 border-t border-line">
          {services.map((s, i) => {
            const on = active === i;
            return (
              <li key={s.title} className="relative border-b border-line" onMouseEnter={() => setActive(i)}>
                <motion.div
                  aria-hidden
                  className="absolute inset-0 origin-bottom bg-gradient-to-r from-violet/15 via-fuchsia/10 to-transparent"
                  initial={false}
                  animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
                <button onClick={() => setActive(i)} aria-expanded={on} className="relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-5 py-7 text-left md:gap-10 md:px-4 md:py-9">
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  <span className={`text-[clamp(1.7rem,4vw,3.4rem)] font-semibold tracking-[-0.03em] transition-colors duration-500 ${on ? "text-white" : "text-white/45"}`}>
                    {s.title === "Motion Graphics" ? (
                      <>
                        Motion <span className="font-serif font-normal italic">Graphics</span>
                        <span className="ml-3 align-middle font-mono text-[11px] tracking-wider text-fuchsia">NEW</span>
                      </>
                    ) : (
                      s.title
                    )}
                  </span>
                  <motion.span
                    animate={{ rotate: on ? 45 : 0, backgroundColor: on ? "#ffffff" : "rgba(255,255,255,0)" }}
                    className={`grid h-12 w-12 place-items-center rounded-full border border-line text-xl ${on ? "text-black" : ""}`}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="relative overflow-hidden"
                    >
                      <div className="grid gap-6 pb-9 pl-9 md:grid-cols-[1fr_auto] md:items-end md:pl-[6.5rem] md:pr-4">
                        <p className="max-w-xl text-lg leading-relaxed text-muted">{s.body}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <span key={t} className="chip">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
