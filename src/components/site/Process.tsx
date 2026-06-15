import { CheckCircle2, Lightbulb, MessageSquare } from "lucide-react";
import { SectionReveal } from "@/components/site/SectionReveal";

const steps = [
  ["Contact Us", "Get in touch via email, WhatsApp, or X. We discuss your video topic, audience, references, and creative direction.", MessageSquare],
  ["Generating an Idea/Concept", "We research the topic, angle, title, and competitors, then build a clickable visual concept around attention and clarity.", Lightbulb],
  ["Final Version", "We polish the thumbnail with strong composition, bold type, color, and final export files ready for upload.", CheckCircle2],
];

export function Process() {
  return (
    <SectionReveal className="py-24" id="process">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-red-500">Process</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">The process of creating a clickable thumbnail.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(([title, text, Icon], index) => (
            <div className="relative overflow-hidden rounded-lg border border-white/12 bg-white/6 p-5 shadow-[0_0_35px_rgba(255,23,68,0.08)]" key={title as string}>
              <span className="font-mono text-sm text-red-500">0{index + 1}</span>
              <Icon className="mt-5 text-red-500" size={28} />
              <h3 className="mt-5 text-lg font-black text-white">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{text as string}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
