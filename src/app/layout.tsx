import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Inter_Tight } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { GlassFilters } from "@/components/LiquidGlass";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://gidzet.vercel.app"),
  title: "Gidzet · Gideon Adonteng: Full Stack Developer & Designer",
  description:
    "Gideon Adonteng is a Full Stack Developer, UI & motion designer and Psychology graduate building human-centric digital experiences.",
  openGraph: {
    title: "Gidzet · Gideon Adonteng",
    description: "Engineering human-centric digital solutions.",
    images: ["/profile.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} ${instrument.variable} ${geistMono.variable}`}>
      <body>
        <GlassFilters />
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden />
        {children}
      </body>
    </html>
  );
}
