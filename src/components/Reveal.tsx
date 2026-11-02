"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Words slide up from behind a mask, one after another. */
export function SplitReveal({ text, className, delay = 0, as = "span" }: { text: string; className?: string; delay?: number; as?: "span" | "h2" | "p" }) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.9, ease, delay: delay + i * 0.06 } } }}
          >
            {w}
            {" "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="label flex items-center gap-3">
      <span className="text-fuchsia">{index}</span>
      <span className="h-px w-10 bg-white/20" />
      {children}
    </div>
  );
}
