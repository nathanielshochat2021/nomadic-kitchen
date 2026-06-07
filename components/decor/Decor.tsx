import type { CSSProperties } from "react";

const CONTOUR =
  "M200,44 C286,52 330,120 348,196 C360,250 300,352 206,356 C150,360 64,322 52,236 C40,150 96,52 200,44 Z";

/** Decorative nested topographic contour lines. */
export function TopoBackground({
  className,
  color = "currentColor",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  const rings = [1, 0.84, 0.68, 0.52, 0.37, 0.23];
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      style={style}
      fill="none"
      stroke={color}
      strokeWidth={1}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {rings.map((s) => (
        <path
          key={s}
          d={CONTOUR}
          transform={`translate(${200 - 200 * s}, ${200 - 200 * s}) scale(${s})`}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** A small surveyor's crosshair mark. */
export function Crosshair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="7" strokeWidth="1" />
      <path d="M12 1v6M12 17v6M1 12h6M17 12h6" strokeWidth="1" />
    </svg>
  );
}

/** Coordinate / technical stamp line. */
export function Stamp({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`stamp ${className}`}>{children}</span>;
}

export const SITE_COORD = "44.21°N / 72.58°W";
