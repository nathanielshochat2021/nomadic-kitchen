"use client";

import { useEffect } from "react";
import { animate, useMotionValue, useTransform, motion } from "motion/react";

export default function AnimatedPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) =>
    Math.round(v).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    })
  );

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [value, mv]);

  return <motion.span className={className}>{text}</motion.span>;
}
