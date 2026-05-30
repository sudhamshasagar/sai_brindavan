import React, { useState, useEffect } from 'react';
import { 
  Menu, X, PhoneCall, Clock, CalendarCheck, 
  Globe, ChevronDown, ArrowRight
} from 'lucide-react';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' for English, 'kn' for Kannada
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Detect scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Dictionary for live translation
  const translations = {
    en: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      doctors: 'Our Doctors',
      faq: 'FAQ',
      emergency: '24/7 Emergency Services',
      portal: 'Official Portal',
      checkAvail: 'Check Availability',
      book: 'Book Appointment',
      hotline: 'Emergency Hotline'
    },
    kn: {
      home: 'ಮುಖಪುಟ',
      about: 'ನಮ್ಮ ಬಗ್ಗೆ',
      services: 'ಸೇವೆಗಳು',
      doctors: 'ನಮ್ಮ ವೈದ್ಯರು',
      faq: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',
      emergency: '24/7 ತುರ್ತು ಸೇವೆಗಳು',
      portal: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್',
      checkAvail: 'ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
      book: 'ನೇಮಕಾತಿ ಕಾಯ್ದಿರಿಸಿ',
      hotline: 'ತುರ್ತು ಸಹಾಯವಾಣಿ'
    }
  };

  const t = translations[language];

  const navLinks = [
    { name: t.home, href: '/' }, // Goes back to the top of the home page
    { name: t.about, href: '/#about' },
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
      
      {/* ================= TIER 1: UTILITY TOP BAR ================= */}
      <div className="hidden md:block w-full bg-gradient-to-r from-[#1a365d] to-[#2b4c7e] text-white/90 py-2 px-6 text-xs font-medium tracking-wide border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#f6ac42]" />
              <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
            </div>
            <div className="w-px h-3 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-white font-semibold">{t.emergency}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:+918000123456" className="flex items-center gap-2 hover:text-[#f6ac42] transition-colors group">
              <PhoneCall className="w-3.5 h-3.5 group-hover:animate-bounce" />
              <span className="font-bold tracking-widest">+91 6361069736</span>
            </a>
            <div className="w-px h-3 bg-white/20"></div>
            <a href="/admin" className="hover:text-white transition-colors flex items-center gap-1 group">
              {t.portal}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </div>

      {/* ================= TIER 2: MAIN STICKY NAVBAR ================= */}
      <nav 
        className={`w-full transition-all duration-300 sticky top-0 z-50 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-[#2b4c7e]/5 py-2' 
            : 'bg-white border-b border-stone-100 py-2 lg:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Logo Area */}
          <a href="#" className="flex items-center gap-3 cursor-pointer shrink-0">
            {/* The Large Logo Image */}
            <img 
              src={process.env.PUBLIC_URL + "/logo.jpg"} 
              alt="Sai Brindavan Logo" 
              className="h-14 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            {/* Hospital Name Text (Delete this div if the text is already inside your logo.jpg) */}
            <div className="flex flex-col justify-center">
              <span className="text-lg md:text-xl lg:text-2xl font-black text-[#2b4c7e] tracking-tight leading-none">
                Sai Brindavan
              </span>
              <span className="text-[9px] md:text-[10px] font-bold text-[#1f9b90] uppercase tracking-widest mt-1">
                Medical Center
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="relative text-[13px] font-bold text-slate-600 hover:text-[#1f9b90] transition-colors uppercase tracking-widest group py-2"
              >
                {link.name}
                {/* Animated Underline */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f9b90] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors text-slate-700 font-semibold text-sm"
              >
                <Globe className="w-4 h-4 text-[#1f9b90]" />
                <span className="hidden md:block uppercase tracking-wide text-xs">{language === 'en' ? 'ENG' : 'ಕನ್ನಡ'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden transition-all duration-200 origin-top-right ${isLangDropdownOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                <button 
                  onClick={() => toggleLanguage('en')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${language === 'en' ? 'bg-[#1f9b90]/10 text-[#1f9b90]' : 'text-slate-600 hover:bg-stone-50'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => toggleLanguage('kn')}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${language === 'kn' ? 'bg-[#1f9b90]/10 text-[#1f9b90]' : 'text-slate-600 hover:bg-stone-50'}`}
                >
                  ಕನ್ನಡ (Kannada)
                </button>
              </div>
            </div>

            {/* Desktop CTA Button */}
            <button className="hidden md:flex px-6 py-3 bg-gradient-to-r from-[#f6ac42] to-[#f49b25] hover:from-[#f49b25] hover:to-[#e08912] text-white rounded-xl font-bold items-center gap-2 transition-all shadow-md shadow-[#f6ac42]/20 hover:shadow-lg hover:shadow-[#f6ac42]/40 hover:-translate-y-0.5 text-xs uppercase tracking-wider shrink-0">
               <CalendarCheck className="w-4 h-4" /> {t.checkAvail}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-2.5 text-[#2b4c7e] hover:bg-stone-100 rounded-xl transition-colors border border-stone-200 z-50 bg-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2.5} />
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* ================= FULL SCREEN MOBILE MENU ================= */}
      {/* Positioned fixed inset-0 but with padding-top to sit under the navbar */}
      <div 
        className={`lg:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-40 transition-all duration-500 ease-in-out pt-[80px] md:pt-[100px] ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full px-6 py-4 overflow-y-auto pb-8">
          
          <div className="flex flex-col space-y-2 mb-8">
            {navLinks.map((link, index) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`text-lg font-black text-slate-800 uppercase tracking-widest py-4 border-b border-stone-200 flex items-center justify-between transition-all duration-300 transform ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
                <ArrowRight className="w-5 h-5 text-[#1f9b90] opacity-50" />
              </a>
            ))}
          </div>
          
          <div className={`mt-auto space-y-6 transition-all duration-500 delay-200 transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <a href="tel:+918000123456" className="flex items-center p-4 bg-[#2b4c7e]/5 rounded-2xl gap-4 border border-[#2b4c7e]/10">
              <div className="w-12 h-12 rounded-full bg-[#2b4c7e] text-white flex items-center justify-center shadow-lg shadow-[#2b4c7e]/20 shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#2b4c7e] uppercase tracking-wider">{t.hotline}</div>
                <div className="text-xl font-black text-slate-800">+91 8000 123 456</div>
              </div>
            </a>

            <button className="w-full py-4 bg-gradient-to-r from-[#f6ac42] to-[#f49b25] text-white rounded-xl font-black shadow-lg shadow-[#f6ac42]/25 hover:-translate-y-1 transition-transform flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
              <CalendarCheck className="w-5 h-5" /> {t.book}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;