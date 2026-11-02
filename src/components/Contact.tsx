"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import { Magnetic } from "./Magnetic";
import { VelocityMarquee } from "./Marquee";

function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: profile.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{time ?? "--:--:--"} GMT</span>;
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden pt-24">
      <div aria-hidden className="aurora absolute bottom-[-30%] left-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet/30 to-fuchsia/25 blur-[140px]" />

      <VelocityMarquee items={["Let's collaborate", "Connect with me"]} baseVelocity={2} className="text-[clamp(4rem,13vw,12rem)] font-semibold leading-none tracking-[-0.05em]" />

      <div className="container-x relative mt-16 grid gap-14 pb-16 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="label mb-4">Have a project in mind?</p>
          <h2 className="max-w-3xl text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.04em]">
            Let&apos;s build something <span className="font-serif font-normal italic text-grad">people love</span> to use.
          </h2>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(profile.email);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="group mt-8 inline-flex items-center gap-3 text-lg text-muted transition-colors hover:text-white md:text-2xl"
          >
            {profile.email}
            <span className="rounded-full border border-line px-3 py-1 font-mono text-xs">{copied ? "Copied ✓" : "Copy"}</span>
          </button>
        </div>
        <Magnetic strength={0.4}>
          <motion.a
            href={`mailto:${profile.email}`}
            whileHover={{ scale: 1.06 }}
            className="relative grid h-44 w-44 place-items-center rounded-full bg-[image:var(--grad)] text-lg font-medium shadow-[0_0_80px_rgba(236,72,153,.35)] md:h-56 md:w-56 md:text-xl"
          >
            <span className="text-center leading-tight">
              E‑mail me
              <span className="mt-1 block text-2xl">↗</span>
            </span>
          </motion.a>
        </Magnetic>
      </div>

      <footer className="container-x relative grid gap-8 border-t border-line py-8 md:grid-cols-3 md:items-center">
        <div className="label">© 2026 Gidzet. All rights reserved.</div>
        <div className="flex gap-6 md:justify-center">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group relative text-sm text-white/70 transition-colors hover:text-white">
              {s.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
            </a>
          ))}
        </div>
        <div className="label flex gap-4 md:justify-end">
          <span>{profile.location}</span>
          <LocalTime />
        </div>
      </footer>
    </section>
  );
}
