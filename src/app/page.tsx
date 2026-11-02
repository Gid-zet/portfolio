import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Designs } from "@/components/Designs";
import { Hero } from "@/components/Hero";
import { VelocityMarquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { Services } from "@/components/Services";
import { Showreel } from "@/components/Showreel";
import { Skills } from "@/components/Skills";
import { Works } from "@/components/Works";
import { principles, roles } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <div className="space-y-2 py-10 md:py-16">
          <VelocityMarquee items={roles} className="font-serif text-[clamp(3rem,9vw,8.5rem)] italic leading-[1.05]" />
          <VelocityMarquee items={principles} baseVelocity={2} separator="●" className="outline-text text-[clamp(3rem,9vw,8.5rem)] font-semibold uppercase leading-[1.05] tracking-[-0.04em]" />
        </div>
        <Works />
        <About />
        <Skills />
        <Showreel />
        <Designs />
        <Services />
        <Contact />
      </main>
    </>
  );
}
