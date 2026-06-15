"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SectionReveal } from "@/components/site/SectionReveal";

const faqs = [
  ["How long does it take to create a thumbnail?", "Most thumbnails are delivered within 24-48 hours. Rush delivery can be discussed for urgent uploads."],
  ["Do you offer discounts for bulk orders?", "Yes. Bulk thumbnail packages are available for creators who need consistent uploads or channel-wide visual systems."],
  ["Can you work with my style guide?", "Absolutely. We can follow your colors, fonts, references, and channel identity to keep every design consistent."],
  ["What file formats do you deliver?", "Final exports are delivered in high-quality JPG or PNG formats suitable for YouTube, social media, and campaigns."],
];

export function FAQs() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionReveal className="py-24" id="faqs">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="text-sm font-black uppercase text-red-500">FAQs</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Frequently asked questions.</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;

            return (
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/6" key={question}>
                <button className="flex w-full items-center justify-between gap-4 p-5 text-left font-black text-white" type="button" onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                  {question}
                  <Plus className={`shrink-0 text-red-500 transition ${isOpen ? "rotate-45" : ""}`} size={20} />
                </button>
                <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-7 text-white/64">{answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
