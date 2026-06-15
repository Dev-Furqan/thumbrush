import { BadgeCheck, Rocket, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionReveal } from "@/components/site/SectionReveal";

const cards = [
  ["Creative Design", "Sharp, high-impact compositions made to catch attention instantly.", Sparkles],
  ["Fast Delivery", "A focused workflow that keeps campaigns moving without messy handoffs.", Rocket],
  ["Brand-Focused Visuals", "Design systems, colors, and layouts that make your brand feel consistent.", BadgeCheck],
  ["Social Media Growth Support", "Graphics shaped around clicks, saves, shares, and platform behavior.", TrendingUp],
];

export function About() {
  return (
    <SectionReveal className="py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase text-red-500">About Thumbrush</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Visual design for digital brands that need attention.</h2>
          <p className="mt-5 text-base leading-8 text-white/68">
            Thumbrush specializes in scroll-stopping visual design for creators, digital brands, and businesses. Every piece is built to feel premium, readable, and ready for the platforms where attention moves fast.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map(([title, text, Icon]) => (
            <Card className="transition duration-300 hover:-translate-y-1 hover:border-red-500/35" key={title as string}>
              <Icon className="mb-4 text-red-500" size={26} />
              <h3 className="text-lg font-bold text-white">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-white/62">{text as string}</p>
            </Card>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
