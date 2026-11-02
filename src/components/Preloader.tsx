"use client";

import { AnimatePresence, animate, motion } from "motion/react";
import { useEffect, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => setTimeout(() => setDone(true), 200),
    });
    return () => controls.stop();
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-bg p-6 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1, ease }}
        >
          <div className="label flex justify-between">
            <span>Gidzet ©2026</span>
            <span>Portfolio</span>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="font-serif text-[clamp(3rem,10vw,9rem)] italic leading-none"
            >
              <span className="text-grad">Gideon</span> Adonteng
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <div className="h-px flex-1 bg-white/10">
              <div className="h-px bg-[var(--grad)]" style={{ width: `${count}%`, backgroundImage: "var(--grad)" }} />
            </div>
            <span className="ml-6 font-sans text-[clamp(3rem,8vw,7rem)] font-light tabular-nums leading-none">{count}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
