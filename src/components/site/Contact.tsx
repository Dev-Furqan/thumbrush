import { Mail, MessageCircle, Send, Twitter } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SectionReveal } from "@/components/site/SectionReveal";

export function Contact() {
  return (
    <SectionReveal className="py-24" id="contact">
      <div className="section-shell overflow-hidden rounded-lg border border-red-500/30 bg-red-950/20 p-6 shadow-[0_0_65px_rgba(255,23,68,0.16)] sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase text-red-400">Contact</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Ready to make your next upload impossible to ignore?</h2>
            <p className="mt-4 text-lg text-white/70">Send the project details and the message will be directed to Thumbrush email.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <LinkButton href="mailto:contact.thumbrush1@gmail.com">
                <Mail size={18} /> Email Thumbrush
              </LinkButton>
              <LinkButton href="https://wa.me/923710221411" variant="secondary" target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> WhatsApp Now
              </LinkButton>
              <LinkButton href="https://x.com/gfxwithak56" variant="secondary" target="_blank" rel="noreferrer">
                <Twitter size={18} /> Visit X Profile
              </LinkButton>
            </div>
            <div className="mt-6 grid gap-2 text-sm text-white/60">
              <p>Email: contact.thumbrush1@gmail.com</p>
              <p>Phone / WhatsApp: 03710221411</p>
            </div>
          </div>

          <form action="https://formsubmit.co/contact.thumbrush1@gmail.com" method="POST" className="grid gap-4 rounded-lg border border-white/10 bg-black/28 p-5">
            <input type="hidden" name="_subject" value="New Thumbrush website inquiry" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-white/70">Name</span>
                <Input name="name" placeholder="Your name" required />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-white/70">Email</span>
                <Input name="email" type="email" placeholder="you@example.com" required />
              </label>
            </div>
            <label>
              <span className="mb-2 block text-sm font-semibold text-white/70">Project Type</span>
              <Input name="project_type" placeholder="Thumbnail, poster, logo, branding..." />
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-white/70">Message</span>
              <Textarea name="message" placeholder="Tell us about your video, idea, deadline, and references..." required />
            </label>
            <Button type="submit" className="w-full sm:w-auto">
              <Send size={18} /> Send Message
            </Button>
            <p className="text-xs leading-5 text-white/45">Form submissions are sent to contact.thumbrush1@gmail.com. FormSubmit may ask you to confirm the email once on first use.</p>
          </form>
        </div>
      </div>
    </SectionReveal>
  );
}
