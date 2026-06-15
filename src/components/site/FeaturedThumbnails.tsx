"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PortfolioItemView } from "@/components/site/Portfolio";
import { SectionReveal } from "@/components/site/SectionReveal";

type FeaturedThumbnailsProps = {
  items: PortfolioItemView[];
};

export function FeaturedThumbnails({ items }: FeaturedThumbnailsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const activeItem = items[index];

  const visibleItems = useMemo(() => {
    if (!items.length) return [];
    return [items[index], items[(index + 1) % items.length], items[(index + 2) % items.length]].filter(Boolean);
  }, [index, items]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % items.length);
      setLoaded(false);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  function goTo(nextIndex: number) {
    if (!items.length) return;
    setLoaded(false);
    setIndex((nextIndex + items.length) % items.length);
  }

  return (
    <SectionReveal className="border-y border-white/8 bg-white/[0.025] py-24" id="featured-thumbnails">
      <div className="section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-red-500">Featured Thumbnails</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Featured Thumbnails</h2>
            <p className="mt-4 text-white/66">Check out some of our best thumbnail designs that helped creators stand out.</p>
          </div>
          {items.length > 1 ? (
            <div className="flex gap-2">
              <button className="grid size-11 place-items-center rounded-lg border border-white/12 bg-white/8 text-white transition hover:border-red-500/60 hover:text-red-300" type="button" onClick={() => goTo(index - 1)} aria-label="Previous featured thumbnail">
                <ChevronLeft size={20} />
              </button>
              <button className="grid size-11 place-items-center rounded-lg border border-white/12 bg-white/8 text-white transition hover:border-red-500/60 hover:text-red-300" type="button" onClick={() => goTo(index + 1)} aria-label="Next featured thumbnail">
                <ChevronRight size={20} />
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {activeItem ? (
            <>
              <div className="relative overflow-hidden rounded-lg border border-red-500/25 bg-slate-950 p-2 shadow-[0_0_60px_rgba(255,23,68,0.16)]">
                {!loaded ? <div className="absolute inset-2 animate-pulse rounded-lg bg-white/8" /> : null}
                <AnimatePresence mode="wait">
                  <motion.div
                    className="relative aspect-video overflow-hidden rounded-lg bg-slate-900"
                    key={activeItem.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    <Image src={activeItem.imageUrl} alt="Featured thumbnail design" fill className="object-cover" priority sizes="(min-width: 1024px) 1120px, 100vw" onLoad={() => setLoaded(true)} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {items.length > 1 ? (
                <div className="mt-5 flex items-center justify-center gap-2">
                  {items.map((item, dotIndex) => (
                    <button
                      className={`h-2.5 rounded-full transition-all ${dotIndex === index ? "w-9 bg-red-500" : "w-2.5 bg-white/24 hover:bg-white/50"}`}
                      type="button"
                      key={item.id}
                      onClick={() => goTo(dotIndex)}
                      aria-label={`Show featured thumbnail ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              ) : null}

              {visibleItems.length > 1 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {visibleItems.map((item, previewIndex) => (
                    <button className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-white/5 opacity-75 transition hover:opacity-100" type="button" key={`${item.id}-${previewIndex}`} onClick={() => goTo((index + previewIndex) % items.length)}>
                      <Image src={item.imageUrl} alt="Featured thumbnail carousel preview" fill className="object-cover" sizes="33vw" />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-red-500/25 bg-red-500/[0.04] p-10 text-center">
              <h3 className="text-xl font-black text-white">No featured thumbnails yet</h3>
              <p className="mt-2 text-white/60">Mark a published thumbnail as featured in admin to populate this carousel.</p>
            </div>
          )}
        </div>
      </div>
    </SectionReveal>
  );
}
