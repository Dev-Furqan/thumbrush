"use client";

import { motion } from "framer-motion";
import { ArrowRight, Images } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Hero3D } from "@/components/site/Hero3D";

export function Hero() {
  return (
    <section id="top" className="mesh-bg relative overflow-hidden pt-16">
      <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      <div className="section-shell relative z-10 grid min-h-[calc(100svh-4rem)] items-center gap-8 py-8 md:py-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(380px,0.94fr)] lg:items-start lg:gap-10 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="max-w-[780px]"
        >
          <p className="mb-4 inline-flex rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs font-black uppercase text-red-100 shadow-[0_0_30px_rgba(255,23,68,0.12)]">
            YouTube thumbnail design agency
          </p>
          <h1 className="max-w-[780px] text-[2.55rem] font-black leading-[0.98] text-white sm:text-5xl md:text-6xl lg:text-[4.7rem] xl:text-[5.05rem]">
            Make Every Scroll Stop With <span className="bg-gradient-to-r from-red-300 via-red-500 to-rose-200 bg-clip-text text-transparent">Stunning Thumbnails</span>
          </h1>
          <p className="mt-5 max-w-[680px] text-base leading-7 text-white/74 sm:text-lg">
            We create scroll-stopping thumbnails, posters, social media posts, logos, and brand visuals that help creators and businesses stand out online.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#contact">
              Get Started <ArrowRight size={18} />
            </LinkButton>
            <LinkButton href="#portfolio" variant="secondary">
              <Images size={18} /> View Portfolio
            </LinkButton>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.12 }}
          className="min-w-0"
          aria-hidden="true"
        >
          <Hero3D />
        </motion.div>
      </div>
    </section>
  );
}
