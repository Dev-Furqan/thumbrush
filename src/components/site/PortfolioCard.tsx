"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { PortfolioItemView } from "@/components/site/Portfolio";

type PortfolioCardProps = {
  item: PortfolioItemView;
  onOpen: (item: PortfolioItemView) => void;
};

export function PortfolioCard({ item, onOpen }: PortfolioCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.button
      type="button"
      className="group relative block overflow-hidden rounded-lg border border-white/12 bg-white/6 text-left shadow-2xl transition hover:border-red-500/45 hover:shadow-[0_0_45px_rgba(255,23,68,0.16)]"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(item)}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {!loaded ? <div className="absolute inset-0 animate-pulse bg-white/8" /> : null}
        <Image
          src={item.imageUrl}
          alt={`${item.categoryLabel} portfolio image`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 700px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-2 py-1 text-xs font-black uppercase text-slate-950 shadow-[0_0_20px_rgba(255,23,68,0.28)]">
          {item.categoryLabel}
        </span>
      </div>
    </motion.button>
  );
}
