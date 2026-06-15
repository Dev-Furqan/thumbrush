import { ArrowRight, Badge, Brush, Images, Megaphone, PlaySquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { SectionReveal } from "@/components/site/SectionReveal";

const services = [
  ["YouTube Thumbnail Design", "Readable, dramatic thumbnails crafted for better click-through.", PlaySquare],
  ["Poster Design", "Event, promo, and campaign posters with bold visual hierarchy.", Images],
  ["Social Media Post Design", "Platform-ready posts for launches, offers, announcements, and carousels.", Megaphone],
  ["Logo Design", "Clean marks and identity starters that make brands easier to remember.", Badge],
  ["Branding / Featured Graphics", "Featured graphics, brand kits, and design systems for premium presence.", Brush],
];

export function Services() {
  return (
    <SectionReveal className="border-y border-white/8 bg-white/[0.025] py-24" id="services">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-red-500">Services</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Thumbnail-first creative support for creators and businesses.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, text, Icon]) => (
            <Card className="group flex min-h-60 flex-col justify-between transition duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_0_40px_rgba(255,23,68,0.12)]" key={title as string}>
              <div>
                <Icon className="text-red-500 transition group-hover:scale-110" size={30} />
                <h3 className="mt-5 text-xl font-bold text-white">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{text as string}</p>
              </div>
              <a className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-red-300" href="#contact">
                Start a project <ArrowRight size={16} />
              </a>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <LinkButton href="#contact" variant="secondary">
            Book Thumbrush
          </LinkButton>
        </div>
      </div>
    </SectionReveal>
  );
}
