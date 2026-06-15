import { Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionReveal } from "@/components/site/SectionReveal";

const testimonials = [
  ["The thumbnails instantly looked more premium and easier to click.", "Creator Client"],
  ["Thumbrush understood the brand direction and delivered clean campaign visuals fast.", "Startup Founder"],
  ["The logo and post designs gave our page a much more professional look.", "Business Owner"],
];

export function Testimonials() {
  return (
    <SectionReveal className="border-y border-white/8 bg-white/[0.025] py-24" id="testimonials">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-red-500">Testimonials</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Hear it from the clients.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, name]) => (
            <Card key={name}>
              <Quote className="text-red-500" size={28} />
              <p className="mt-5 text-base leading-7 text-white/78">&ldquo;{quote}&rdquo;</p>
              <p className="mt-5 text-sm font-bold text-red-300">{name}</p>
            </Card>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
