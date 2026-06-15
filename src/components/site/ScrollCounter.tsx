"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type ScrollCounterProps = {
  target: number;
  suffix?: string;
  duration?: number;
};

export function ScrollCounter({ target, suffix = "", duration = 1.8 }: ScrollCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    const controls = animate(value, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [duration, isInView, target, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
