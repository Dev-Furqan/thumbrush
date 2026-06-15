"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionReveal({ children, className = "", ...props }: SectionRevealProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
