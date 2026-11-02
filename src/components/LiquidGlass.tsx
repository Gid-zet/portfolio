"use client";

import { useRef } from "react";

/**
 * Displacement map for edge refraction: red encodes x, green encodes y, and a
 * neutral grey centre leaves the middle undistorted so only the rim bends light.
 */
const lensMap = (edge: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="r" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient>
        <radialGradient id="m" r="0.72"><stop offset="${edge}" stop-color="#808080"/><stop offset="1" stop-color="#808080" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="400" height="400" fill="#000"/>
      <rect width="400" height="400" fill="url(#r)" style="mix-blend-mode:screen"/>
      <rect width="400" height="400" fill="url(#g)" style="mix-blend-mode:screen"/>
      <rect width="400" height="400" fill="url(#m)"/>
    </svg>`,
  )}`;

/** Refraction with a touch of chromatic aberration: each colour channel bends by a slightly different amount. */
function RefractionFilter({ id, edge, scale }: { id: string; edge: number; scale: number }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feImage href={lensMap(edge)} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" result="dr" />
      <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale={scale * 1.06} xChannelSelector="R" yChannelSelector="G" result="dg" />
      <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale={scale * 1.12} xChannelSelector="R" yChannelSelector="G" result="db" />
      <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
      <feBlend in="red" in2="green" mode="screen" result="rg" />
      <feBlend in="rg" in2="blue" mode="screen" />
    </filter>
  );
}

/** SVG filter definitions referenced by the `.liquid*` classes. Render once. */
export function GlassFilters() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
      <defs>
        {/* panels & pills: gentle bend at the rim */}
        <RefractionFilter id="lg-panel" edge={0.62} scale={-38} />
        {/* lenses & orbs: strong, bubble-like bend */}
        <RefractionFilter id="lg-lens" edge={0.52} scale={-80} />
      </defs>
    </svg>
  );
}

type Props<T extends React.ElementType> = {
  as?: T;
  variant?: "panel" | "lens";
} & React.ComponentPropsWithoutRef<T>;

/** Glass surface whose specular highlight follows the pointer. */
export function LiquidGlass<T extends React.ElementType = "div">({ as, variant = "panel", className = "", onPointerMove, ...rest }: Props<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`liquid ${variant === "lens" ? "liquid-lens" : ""} ${className}`}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
        onPointerMove?.(e);
      }}
      {...rest}
    />
  );
}
