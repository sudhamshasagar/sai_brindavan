import React, { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight, Clock, ShieldPlus, Heart, Send } from 'lucide-react';

// --- Inline SVG Social Icons ---
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z"/>
  </svg>
);
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4V21H3V9.75ZM9.5 9.75h3.8v1.55h.05a4.17 4.17 0 0 1 3.75-2.05C21 9.25 22 11.7 22 15v6h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4V9.75Z"/>
  </svg>
);
const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23 12s0-3.6-.46-5.32a2.78 2.78 0 0 0-1.96-1.97C18.86 4.25 12 4.25 12 4.25s-6.86 0-8.58.46A2.78 2.78 0 0 0 1.46 6.68 29.2 29.2 0 0 0 1 12a29.2 29.2 0 0 0 .46 5.32 2.78 2.78 0 0 0 1.96 1.97c1.72.46 8.58.46 8.58.46s6.86 0 8.58-.46a2.78 2.78 0 0 0 1.96-1.97C23 15.6 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  const explore = ['Home', 'About Us', 'Services', 'Find a Doctor', 'Timetable'];
  const patients = ['Book Appointment', 'Emergency Care', 'Insurance', 'Contact Us', 'FAQ'];
  const socials = [
    { Icon: FacebookIcon, label: 'Facebook', href: '#' },
    { Icon: InstagramIcon, label: 'Instagram', href: '#' },
    { Icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
    { Icon: YoutubeIcon, label: 'YouTube', href: '#' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setEmail('');
  };

  return (
    <footer className="relative isolate overflow-hidden bg-gradient-to-b from-[#0b3b3a] via-[#0a2e2e] to-[#061f1f] text-white">
      {/* Decorative background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-56 w-96 rounded-full bg-[#1f9b90]/20 blur-3xl" />
        <div className="absolute top-20 right-0 h-[18rem] w-[28rem] rounded-full bg-[#f6ac42]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#1f9b90]/10 blur-3xl" />
      </div>

      {/* Top curve */}
      <svg
        className="block w-full h-6 md:h-16 text-white"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z" fill="currentColor" />
      </svg>

      {/* ============ CTA STRIP ============ */}
      {/* ============ MAIN GRID ============ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 md:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#f6ac42] to-[#f49b25] text-[#0b3b3a] shadow-lg shadow-[#f6ac42]/25">
                <ShieldPlus className="h-6 w-6" />
              </div>
              <div>
                <div className="font-serif text-xl font-bold leading-tight">Sai Brindavan</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#f6ac42]">Healthcare Center</div>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-white/70">
              A trusted multi-speciality hospital delivering compassionate, world-class healthcare to
              Sagara and the wider Malnad region.
            </p>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <MapPin className="h-4 w-4 text-[#1f9b90]" />
                </span>
                <span className="text-white/80">
                  123 Healthcare Ave, Sagara,<br />Karnataka 577401
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Phone className="h-4 w-4 text-[#1f9b90]" />
                </span>
                <a href="tel:+916361069736" className="text-white/80 hover:text-[#f6ac42] transition-colors">
                  +91 63610 69736
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Mail className="h-4 w-4 text-[#1f9b90]" />
                </span>
                <a href="mailto:contact@saibrindavan.com" className="text-white/80 hover:text-[#f6ac42] transition-colors break-all">
                  contact@saibrindavan.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Clock className="h-4 w-4 text-[#1f9b90]" />
                </span>
                <span className="text-white/80">Open 24 × 7 • Emergency Always Available</span>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-lg font-bold">Explore</h4>
            <span className="mt-2 block h-0.5 w-10 rounded-full bg-[#f6ac42]" />
            <ul className="mt-5 space-y-3">
              {explore.map((link) => (
                <li key={link}>
                  <a href="#" className="group inline-flex items-center gap-2 text-sm text-white/75 hover:text-white transition-colors">
                    <ArrowRight className="h-3.5 w-3.5 text-[#1f9b90] transition-transform group-hover:translate-x-1" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Patients */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-lg font-bold">Patients</h4>
            <span className="mt-2 block h-0.5 w-10 rounded-full bg-[#f6ac42]" />
            <ul className="mt-5 space-y-3">
              {patients.map((link) => (
                <li key={link}>
                  <a href="#" className="group inline-flex items-center gap-2 text-sm text-white/75 hover:text-white transition-colors">
                    <ArrowRight className="h-3.5 w-3.5 text-[#1f9b90] transition-transform group-hover:translate-x-1" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="font-serif text-lg font-bold">Health Updates</h4>
            <span className="mt-2 block h-0.5 w-10 rounded-full bg-[#f6ac42]" />
            <p className="mt-5 text-sm text-white/70">
              Subscribe for medical news, wellness tips, and updates from our specialists — straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur focus-within:border-[#1f9b90] focus-within:bg-white/10 transition-colors">
                <div className="pl-3 text-white/40">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1f9b90] to-[#178a80] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </div>
              <p className="mt-3 text-xs text-white/50">
                By subscribing you agree to our privacy policy. No spam, unsubscribe anytime.
              </p>
            </form>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: '25+', v: 'Years Care' },
                { k: '50k+', v: 'Patients' },
                { k: '30+', v: 'Specialists' },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <div className="font-serif text-lg font-bold text-[#f6ac42]">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="border-t border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-xs sm:text-sm text-white/60 text-center md:text-left">
              © {year} <span className="font-semibold text-white/85">Sai Brindavan Hospital</span>. All rights reserved.
            </p>

            <div className="flex items-center justify-center gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-[#1f9b90] hover:bg-[#1f9b90]/20 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5">
              Designed & Developed with <Heart className="h-3 w-3 text-[#f6ac42] fill-[#f6ac42]" /> by
              <a href="#" className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#f6ac42] to-[#1f9b90] hover:underline">
                Digiyuktha
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
