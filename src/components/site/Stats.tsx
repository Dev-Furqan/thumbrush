import { SectionReveal } from "@/components/site/SectionReveal";
import { ScrollCounter } from "@/components/site/ScrollCounter";

const stats = [
  { value: 1000, suffix: "+", label: "Thumbnails Created" },
  { value: 120, suffix: "+", label: "Happy Clients" },
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

export function Stats() {
  return (
    <SectionReveal className="relative z-10 pb-20 pt-16">
      <div className="section-shell">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div className="rounded-lg border border-red-500/25 bg-slate-950/72 p-5 shadow-[0_0_35px_rgba(255,23,68,0.12)] backdrop-blur-xl" key={stat.label}>
              <p className="font-mono text-4xl font-black text-white sm:text-5xl">
                <ScrollCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-xs font-black uppercase tracking-wide text-red-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
