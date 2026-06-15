"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { categories } from "@/lib/categories";
import { PortfolioCard } from "@/components/site/PortfolioCard";
import { PortfolioModal } from "@/components/site/PortfolioModal";

export type PortfolioItemView = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
  displayOrder: number;
};

type PortfolioProps = {
  items: PortfolioItemView[];
};

export function Portfolio({ items }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selected, setSelected] = useState<PortfolioItemView | null>(null);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => activeCategory === "ALL" || item.categoryId === activeCategory)
      .sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
  }, [activeCategory, items]);

  const activeLabel = activeCategory === "ALL" ? "portfolio" : categories.find((category) => category.id === activeCategory)?.label.toLowerCase();

  return (
    <section className="py-24" id="portfolio">
      <div className="section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-red-500">Portfolio</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">A gallery built for clicks, views, and visual trust.</h2>
            <p className="mt-4 text-white/64">Browse published Thumbrush designs by category. New admin uploads appear here automatically.</p>
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {[{ id: "ALL", label: "All" }, ...categories].map((category) => (
            <motion.button
              type="button"
              key={category.id}
              className={`relative min-h-10 shrink-0 rounded-lg px-4 text-sm font-black transition ${
                activeCategory === category.id ? "text-slate-950" : "border border-white/12 bg-white/7 text-white/74 hover:text-white"
              }`}
              onClick={() => setActiveCategory(category.id)}
              whileTap={{ scale: 0.97 }}
            >
              {activeCategory === category.id ? <motion.span className="absolute inset-0 rounded-lg bg-red-500" layoutId="category-pill" /> : null}
              <span className="relative">{category.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-10">
          {filteredItems.length ? (
            <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" layout>
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <PortfolioCard item={item} key={item.id} onOpen={setSelected} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/16 bg-white/[0.04] p-10 text-center">
              <h3 className="text-xl font-black text-white">No images in this category yet</h3>
              <p className="mt-2 text-white/60">Upload and publish {activeLabel} images in admin to fill this section.</p>
            </div>
          )}
        </div>
      </div>
      <PortfolioModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
