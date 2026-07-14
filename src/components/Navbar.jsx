import React, { useState, useEffect } from 'react';
import {
  Menu, X, PhoneCall, Clock, CalendarCheck,
  Globe, ChevronDown, ArrowRight, Stethoscope, MapPin, Sparkles
} from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const translations = {
    en: {
      home: 'Home', services: 'Services', doctors: 'Our Doctors', faq: 'FAQ',
      emergency: '24/7 Emergency Care',
      portal: 'Admin Portal',
      checkAvail: 'Check Availability',
      book: 'Book Appointment',
      hotline: 'Emergency Hotline',
      location: 'Sagara, Karnataka',
      hours: 'Mon – Sat · 8:00 AM – 8:00 PM',
      tagline: 'We care about everyone',
    },
    kn: {
      home: 'ಮುಖಪುಟ', services: 'ಸೇವೆಗಳು', doctors: 'ನಮ್ಮ ವೈದ್ಯರು', faq: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',
      emergency: '24/7 ತುರ್ತು ಸೇವೆಗಳು',
      portal: 'ರೋಗಿ ಪೋರ್ಟಲ್',
      checkAvail: 'ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
      book: 'ನೇಮಕಾತಿ ಕಾಯ್ದಿರಿಸಿ',
      hotline: 'ತುರ್ತು ಸಹಾಯವಾಣಿ',
      location: 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ',
      hours: 'ಸೋಮ – ಶನಿ · 8:00 – 20:00',
      tagline: 'NABH ಮಾನ್ಯತೆ · 1998 ರಿಂದ',
    },
  };
  const t = translations[language];

  const navLinks = [
    { name: t.home, href: '/' },
    { name: t.services, href: '/#services' },
    { name: t.doctors, href: '/#doctors' },
    { name: t.faq, href: '/#faq' },
  ];

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  return (
    <header className="w-full relative z-50 font-sans">
      {/* ============ TIER 1 · UTILITY BAR ============ */}
      <div className="hidden md:block w-full bg-gradient-to-r from-[#0f2544] via-[#1a365d] to-[#2b4c7e] text-white/85 text-[11px] font-medium tracking-wide border-b border-white/10 relative z-50 overflow-hidden">
        {/* soft glow accent */}
        <div className="pointer-events-none absolute -top-8 left-1/3 h-24 w-72 rounded-full bg-[#1f9b90]/25 blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center relative">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#f6ac42]" />
              <span>{t.hours}</span>
            </div>
            <span className="w-px h-3 bg-white/15" />
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#f6ac42]" />
              <span>{t.location}</span>
            </div>
            <span className="w-px h-3 bg-white/15" />
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-400/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-white font-semibold uppercase tracking-wider text-[10px]">
                {t.emergency}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden lg:flex items-center gap-1.5 text-white/70">
              <Sparkles className="w-3 h-3 text-[#f6ac42]" />
              {t.tagline}
            </span>
            <span className="hidden lg:block w-px h-3 bg-white/15" />
            <a href="tel:+916361069736" className="flex items-center gap-2 hover:text-[#f6ac42] transition-colors group">
              <PhoneCall className="w-3.5 h-3.5 group-hover:animate-bounce" />
              <span className="font-bold tracking-widest">+91 63610 69736</span>
            </a>
            <span className="w-px h-3 bg-white/15" />
            <a href="/admin" className="hover:text-white transition-colors flex items-center gap-1 group text-white/70">
              {t.portal}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* ============ TIER 2 · MAIN NAV ============ */}
      <nav
        className={`w-full transition-all duration-300 sticky top-0 z-50 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(43,76,126,0.18)] py-1.5 border-b border-white/60'
            : 'bg-white py-2 lg:py-3 border-b border-stone-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 cursor-pointer shrink-0 group">
            <div className="relative">
              
              <div className="relative h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-2xl flex items-center justify-center ">
                <img src={process.env.PUBLIC_URL + "/logo.jpg"}/>
              </div>
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-base md:text-lg lg:text-2xl font-black text-[#1a365d] tracking-tight">
                Sai Brindavan
              </span>
              <span className="text-[9px] md:text-[10px] font-bold text-[#1f9b90] uppercase tracking-[0.22em] mt-1 flex items-center gap-1.5">
                <span className="h-px w-4 bg-[#1f9b90]/60" />
                Medical Center
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 bg-stone-50/70 border border-stone-200/70 rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-[12px] font-bold text-slate-600 hover:text-white uppercase tracking-widest px-4 py-2 rounded-full transition-colors group"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1f9b90] to-[#178278] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Language pill */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 pl-2.5 pr-2 py-2 rounded-full border border-stone-200 hover:border-[#1f9b90]/40 hover:bg-[#1f9b90]/5 transition-all text-slate-700 font-semibold text-xs"
              >
                <Globe className="w-4 h-4 text-[#1f9b90]" />
                <span className="hidden sm:block uppercase tracking-wider">
                  {language === 'en' ? 'ENG' : 'ಕನ್ನಡ'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-stone-100 overflow-hidden transition-all duration-200 origin-top-right ${isLangDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                {[
                  { code: 'en', label: 'English', sub: 'EN' },
                  { code: 'kn', label: 'ಕನ್ನಡ', sub: 'KN' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => toggleLanguage(l.code)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                      language === l.code
                        ? 'bg-gradient-to-r from-[#1f9b90]/10 to-transparent text-[#1f9b90]'
                        : 'text-slate-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] font-black tracking-widest opacity-60">{l.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href="#availability"
              className="hidden md:inline-flex relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-[#1f9b90] to-[#178278] text-white rounded-full font-bold items-center gap-2 text-[11px] uppercase tracking-widest shadow-lg shadow-[#1f9b90]/25 hover:shadow-xl hover:shadow-[#1f9b90]/40 hover:-translate-y-0.5 transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#f6ac42] to-[#f49b25] opacity-0 hover:opacity-100 transition-opacity" />
              <CalendarCheck className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{t.checkAvail}</span>
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-2.5 text-[#1a365d] hover:bg-stone-100 rounded-xl transition-colors border border-stone-200 z-50 bg-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Menu className="w-5 h-5" strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ============ MOBILE DRAWER ============ */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-in-out pt-[72px] ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f5f9fb]/95 backdrop-blur-xl" />
        {/* decorative blobs */}
        <div className="absolute top-24 -right-16 h-56 w-56 rounded-full bg-[#1f9b90]/15 blur-3xl" />
        <div className="absolute bottom-24 -left-16 h-64 w-64 rounded-full bg-[#f6ac42]/15 blur-3xl" />

        <div className="relative flex flex-col h-full px-6 py-6 overflow-y-auto pb-10">
          {/* emergency chip */}
          <div
            className={`flex items-center gap-3 p-3 rounded-2xl bg-red-500/10 border border-red-400/30 mb-6 transition-all duration-500 ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-red-700 font-bold text-xs uppercase tracking-widest">{t.emergency}</span>
          </div>

          {/* links */}
          <div className="flex flex-col space-y-1 mb-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group relative text-lg font-black text-slate-800 uppercase tracking-widest py-4 px-4 rounded-2xl border border-transparent hover:border-stone-200 hover:bg-white flex items-center justify-between transition-all duration-300 transform ${
                  isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span className="h-6 w-1 rounded-full bg-gradient-to-b from-[#1f9b90] to-[#f6ac42] opacity-60 group-hover:opacity-100 transition-opacity" />
                  {link.name}
                </span>
                <ArrowRight className="w-5 h-5 text-[#1f9b90] group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>

          {/* footer actions */}
          <div className={`mt-auto space-y-4 transition-all duration-500 delay-200 transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <a href="tel:+916361069736" className="flex items-center p-4 bg-white rounded-2xl gap-4 border border-stone-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#2b4c7e] text-white flex items-center justify-center shadow-lg shadow-[#2b4c7e]/25 shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-[#1f9b90] uppercase tracking-widest">{t.hotline}</div>
                <div className="text-lg font-black text-slate-800 truncate">+91 63610 69736</div>
              </div>
            </a>

            <button className="w-full py-4 bg-gradient-to-r from-[#1f9b90] to-[#178278] text-white rounded-2xl font-black shadow-lg shadow-[#1f9b90]/25 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
              <CalendarCheck className="w-5 h-5" /> {t.book}
            </button>

            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-[#f6ac42]" />
              {t.tagline}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
