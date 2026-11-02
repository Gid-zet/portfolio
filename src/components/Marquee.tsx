"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { useRef } from "react";

/** Endless row whose speed and direction react to scroll velocity. */
export function VelocityMarquee({ items, baseVelocity = -2, className = "", separator = "✦" }: { items: string[]; baseVelocity?: number; className?: string; separator?: string }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex shrink-0 items-center gap-[0.35em] pr-[0.35em]">
          {t}
          <span className="text-[0.45em] text-fuchsia">{separator}</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className={`flex w-max ${className}`} style={{ x }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
