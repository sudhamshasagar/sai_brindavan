import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldPlus,
  Heart,
  ChevronRight,
  PhoneCall,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

// --- Accessible SVG Social Icons ---
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4V21H3V9.75ZM9.5 9.75h3.8v1.55h.05a4.17 4.17 0 0 1 3.75-2.05C21 9.25 22 11.7 22 15v6h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4V9.75Z" />
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23 12s0-3.6-.46-5.32a2.78 2.78 0 0 0-1.96-1.97C18.86 4.25 12 4.25 12 4.25s-6.86 0-8.58.46A2.78 2.78 0 0 0 1.46 6.68 29.2 29.2 0 0 0 1 12a29.2 29.2 0 0 0 .46 5.32 2.78 2.78 0 0 0 1.96 1.97c1.72.46 8.58.46 8.58.46s6.86 0 8.58-.46a2.78 2.78 0 0 0 1.96-1.97C23 15.6 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: 'Clinical Services', href: '#services' },
    { label: 'Doctors Directory', href: '#doctors' },
    { label: 'OPD Schedule & Hours', href: '/#availability' },
    { label: 'Frequently Asked Questions', href: '#faq' },
  ];

  const socialLinks = [
    { Icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com' },
    { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
    { Icon: LinkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
    { Icon: YoutubeIcon, label: 'YouTube', href: 'https://youtube.com' },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-gradient-to-b from-[#10243e] via-[#0d1c31] to-[#081220] text-white font-sans">
      {/* Subtle ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-64 w-96 rounded-full bg-[#1f9b90]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-[#f6ac42]/10 blur-3xl" />
      </div>

      {/* Top Architectural Curve */}
      <svg
        className="block w-full h-8 sm:h-12 md:h-16 text-[#f8fafc]"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z" fill="currentColor" />
      </svg>

      {/* ===================================================
          MAIN FOOTER GRID
      =================================================== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* 1. BRAND & CLINICAL ADDRESS (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f9b90] text-white shadow-md shadow-[#1f9b90]/25">
                <ShieldPlus className="h-6 w-6" />
              </div>
              <div>
                <div className="font-extrabold text-xl leading-tight tracking-tight text-white">
                  Sai Brindavan
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f6ac42]">
                  Healthcare Center
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-sm">
              Providing compassionate, multispeciality medical care and 24/7 critical trauma services to Sagara and the Malnad region.
            </p>

            {/* Direct Contact Details */}
            <ul className="space-y-3 pt-1 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#1f9b90] shrink-0 mt-0.5" />
                <span>BH Road, Near Sagara City, Karnataka 577401</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#1f9b90] shrink-0" />
                <a
                  href="tel:+916361069736"
                  className="hover:text-[#f6ac42] transition-colors font-medium text-white"
                >
                  +91 63610 69736
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#1f9b90] shrink-0" />
                <a
                  href="mailto:contact@saibrindavan.com"
                  className="hover:text-[#f6ac42] transition-colors break-all"
                >
                  contact@saibrindavan.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[#1f9b90] shrink-0" />
                <span className="text-emerald-400 font-semibold text-xs">
                  24/7 Emergency, Casualty & Pharmacy Open
                </span>
              </li>
            </ul>
          </div>

          {/* 2. NAVIGATION: QUICK LINKS (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Navigation
            </h4>
            <span className="mt-1.5 block h-0.5 w-8 rounded-full bg-[#1f9b90]" />

            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="group flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-[#1f9b90] transition-transform group-hover:translate-x-1" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. EMERGENCY & HELPDESK CARD (lg:col-span-4) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-xs">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-teal-500/10 border border-teal-400/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Patient Helpdesk</span>
              </div>

              <h4 className="mt-3 text-base font-bold text-white">
                Need Fast Hospital Assistance?
              </h4>

              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                Direct phone triage for immediate doctor consultation tokens, ambulance requests, and casualty admissions.
              </p>

              <div className="mt-5 space-y-2.5">
                <a
                  href="tel:+916361069736"
                  className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#1f9b90] to-[#178077] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#1f9b90]/20 hover:opacity-95 transition-opacity"
                >
                  <span className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4" />
                    <span>Call Hotline</span>
                  </span>
                  <span className="font-mono text-sm tracking-normal">+91 63610 69736</span>
                </a>

                <a
                  href="/availability"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-[#f6ac42]" />
                  <span>Check Doctor Timings</span>
                </a>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>OPD: Mon – Sat (8 AM – 8 PM)</span>
                <span className="text-[#f6ac42] font-semibold">Casualty 24/7</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ===================================================
          BOTTOM LEGAL & ATTRIBUTION BAR
      =================================================== */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
            
            {/* Copyright */}
            <p className="text-xs text-slate-400">
              © {currentYear} <strong className="text-white font-semibold">Sai Brindavan Healthcare Center</strong>. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-2.5">
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:border-[#1f9b90] hover:bg-[#1f9b90] hover:text-white transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>

            {/* Developer Credit */}
            <div className="text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                Designed & Developed with <Heart className="h-3 w-3 text-[#f6ac42] fill-[#f6ac42]" /> by
                <a
                  href="#"
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f6ac42] to-[#1f9b90] hover:underline"
                >
                  Digiyuktha
                </a>
              </span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;