const services = ["Thumbnails", "Posters", "Social Posts", "Logos", "Branding"];
const links = ["Home", "Process", "Portfolio", "Services", "Testimonials", "FAQs", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="section-shell grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-2xl font-black uppercase text-white">Thum<span className="text-red-500">brush</span></p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/58">Scroll-stopping graphics for creators, brands, and businesses that want to look premium online.</p>
        </div>
        <div>
          <h3 className="font-bold text-white">Quick Links</h3>
          <div className="mt-3 grid gap-2 text-sm text-white/58">
            {links.map((link) => (
              <a className="hover:text-red-300" href={`#${link.toLowerCase() === "home" ? "top" : link.toLowerCase()}`} key={link}>{link}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Services</h3>
          <div className="mt-3 grid gap-2 text-sm text-white/58">
            {services.map((service) => <span key={service}>{service}</span>)}
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>(c) 2026 Thumbrush. All rights reserved.</p>
        <a href="https://x.com/gfxwithak56" target="_blank" rel="noreferrer">X / Twitter</a>
      </div>
    </footer>
  );
}
