"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** Dot + trailing ring. Elements with data-cursor="Label" grow the ring and show the label. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      if (!enabled) setEnabled(true);
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHover(!!t?.closest("a, button, [role=button]"));
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y, enabled]);

  if (!enabled) return null;

  const size = label ? 96 : hover ? 56 : 34;
  return (
    <>
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[100] grid place-items-center rounded-full ${label ? "" : "liquid liquid-lens !shadow-none"}`}
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? "rgba(236,72,153,0.95)" : "rgba(255,255,255,0)",
          borderColor: label ? "rgba(236,72,153,0)" : "rgba(255,255,255,0.5)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="h-full w-full rounded-full border" style={{ borderColor: "inherit" }} />
        {label && (
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="absolute text-[11px] font-semibold uppercase tracking-widest text-white">
            {label}
          </motion.span>
        )}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: label ? 0 : 1 }}
      />
    </>
  );
}
