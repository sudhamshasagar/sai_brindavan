import React, { useState, useEffect } from 'react';
import { Menu, X, HeartPulse, PhoneCall, Clock, CalendarCheck } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to add shadow to the sticky main bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40); // 40px is roughly the height of the top bar
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Our Doctors', href: '#doctors' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="w-full relative z-50 font-sans">
      
      {/* ================= TIER 1: UTILITY TOP BAR ================= */}
      {/* This bar stays at the top and naturally scrolls away */}
      <div className="hidden md:block w-full bg-[#2b4c7e] text-white/90 py-2.5 px-6 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#f6ac42]" />
              <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
            </div>
            <div className="w-px h-3 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>24/7 Emergency Services Available</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:+918000123456" className="flex items-center gap-2 hover:text-[#f6ac42] transition-colors">
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="font-bold tracking-widest">+91 8000 123 456</span>
            </a>
            <div className="w-px h-3 bg-white/20"></div>
            <a href="#patient-portal" className="hover:text-white transition-colors">Official Portal</a>
          </div>

        </div>
      </div>

      {/* ================= TIER 2: MAIN STICKY NAVBAR ================= */}
      {/* This bar uses sticky positioning to lock to the top of the viewport when reached */}
      <nav 
        className={`w-full bg-white transition-all duration-300 sticky top-0 z-50 ${
          isScrolled ? 'shadow-md py-3' : 'border-b border-stone-200/60 py-4 lg:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo Area */}
          <a href="#" className="flex items-center gap-2.5 cursor-pointer group shrink-0">
            <div className="w-10 h-10 bg-[#1f9b90]/10 rounded-xl flex items-center justify-center group-hover:bg-[#1f9b90] transition-colors duration-300">
              <img src="/logo.jpg" className="w-6 h-6 text-[#1f9b90] group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-[#2b4c7e] tracking-tight leading-none uppercase">
                Sai Brindavan
              </span>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                Medical Center
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-sm font-bold text-stone-600 hover:text-[#1f9b90] transition-colors uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Desktop CTA Button (Gold to stand out against the white bar) */}
            <button className="hidden md:flex px-6 py-3 bg-[#f6ac42] hover:bg-[#e09830] text-white rounded-xl font-bold items-center gap-2 transition-colors shadow-sm text-sm uppercase tracking-wider">
               <CalendarCheck className="w-4 h-4" />Check Availability
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden p-2 text-[#2b4c7e] hover:bg-stone-50 rounded-lg transition-colors border border-stone-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={2.5} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={2.5} />
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* ================= MOBILE MENU SLIDE-DOWN ================= */}
      <div 
        className={`lg:hidden fixed top-[72px] left-0 w-full bg-white border-b border-stone-200 shadow-2xl transition-all duration-300 origin-top overflow-y-auto z-40
          ${isMobileMenuOpen ? 'opacity-100 max-h-screen py-6' : 'opacity-0 max-h-0 py-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col px-6 space-y-2 text-stone-700 font-bold uppercase tracking-wide text-sm">
          
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              onClick={toggleMenu} 
              className="py-4 border-b border-stone-100 hover:text-[#1f9b90] transition-colors flex items-center justify-between"
            >
              {link.name}
            </a>
          ))}
          
          {/* Mobile Utility Info (Since Top Bar is hidden on mobile) */}
          <div className="py-6 space-y-4">
            <a href="tel:+918000123456" className="flex items-center gap-3 text-[#2b4c7e]">
              <div className="w-10 h-10 rounded-full bg-[#2b4c7e]/10 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-stone-400">Emergency Hotline</div>
                <div className="text-base font-black">+91 8000 123 456</div>
              </div>
            </a>
          </div>

          {/* Mobile CTA */}
          <button className="w-full py-4 bg-[#f6ac42] text-white rounded-xl font-bold shadow-md hover:bg-[#e09830] transition-colors flex items-center justify-center gap-2">
            <CalendarCheck className="w-5 h-5" /> Book Appointment
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;