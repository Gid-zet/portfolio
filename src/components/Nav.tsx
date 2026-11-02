"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { profile } from "@/lib/data";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#designs", label: "Designs" },
  { href: "#services", label: "Services" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400 && !open);
    setScrolled(v > 40);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 pt-4"
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className={`container-x flex items-center justify-between rounded-full px-3 py-2.5 transition-all duration-500 ${scrolled ? "glass" : "border border-transparent"}`}>
          <a href="#top" className="flex items-center gap-2 pl-2 text-lg font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white font-serif text-xl italic text-black">G</span>
            <span>
              GID<span className="text-grad">ZET</span>
            </span>
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative block overflow-hidden rounded-full px-4 py-2 text-sm text-white/70 transition-colors hover:text-white">
                  <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{l.label}</span>
                  <span className="absolute inset-x-4 top-full block transition-transform duration-500 ease-expo group-hover:-translate-y-[calc(100%+0.5rem)]">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="#contact" className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-[1.03] sm:flex">
              <span className="pulse-dot h-2 w-2 rounded-full bg-green-400" />
              Available for work
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white/5 md:hidden"
            >
              <span className={`absolute h-px w-4 bg-white transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-4 bg-white transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-bg px-6 pb-10 pt-24 md:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {[...links, { href: "#contact", label: "Contact" }].map((l, i) => (
              <div key={l.href} className="overflow-hidden border-b border-line">
                <motion.a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4 font-serif text-5xl"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.label}
                  <span className="label">0{i + 1}</span>
                </motion.a>
              </div>
            ))}
            <div className="mt-8 flex gap-5">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="label hover:text-white">
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
