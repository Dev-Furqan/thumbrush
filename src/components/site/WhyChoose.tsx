import { CheckCircle2 } from "lucide-react";
import { SectionReveal } from "@/components/site/SectionReveal";

const points = [
  "Scroll-stopping visuals",
  "Modern design style",
  "Social media optimized graphics",
  "Creator and business focused",
  "Professional brand identity",
  "High-quality export-ready files",
];

export function WhyChoose() {
  return (
    <SectionReveal className="border-y border-white/8 bg-white/[0.025] py-24" id="why-choose">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase text-red-500">Why Choose Thumbrush</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Premium visuals built for the pace of YouTube and social feeds.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/6 p-4" key={point}>
              <CheckCircle2 className="shrink-0 text-red-500" size={20} />
              <span className="font-semibold text-white/86">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
