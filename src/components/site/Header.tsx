import { LinkButton } from "@/components/ui/Button";

const links = [
  ["Home", "#top"],
  ["Process", "#process"],
  ["Portfolio", "#portfolio"],
  ["Services", "#services"],
  ["Testimonials", "#testimonials"],
  ["FAQs", "#faqs"],
  ["Contact", "#contact"],
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="section-shell flex h-16 items-center justify-between">
        <a className="text-xl font-black uppercase tracking-tight text-white" href="#top" aria-label="Thumbrush home">
          Thum<span className="text-red-500">brush</span>
        </a>
        <div className="hidden items-center gap-5 text-sm font-bold text-white/70 lg:flex">
          {links.map(([label, href]) => (
            <a className="transition hover:text-red-300" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <LinkButton className="min-h-10 px-3 shadow-[0_0_25px_rgba(255,23,68,0.2)]" href="#contact">
          Get Started
        </LinkButton>
      </nav>
    </header>
  );
}
