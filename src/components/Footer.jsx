import React from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

// --- Real Inline SVGs for Social Media ---
const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Footer = () => {
  return (
    <footer id="contact" className="w-full relative mt-32 font-sans selection:bg-[#1f9b90] selection:text-white">
      
      {/* ================= TOP CURVE SVG ================= */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-[99%] z-0">
        <svg 
          className="w-full h-12 md:h-20 lg:h-28 text-[#e0f1ef] block drop-shadow-[0_-10px_15px_rgba(0,0,0,0.02)]" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          fill="currentColor"
        >
          <path d="M0,120 L0,120 Q720,-60 1440,120 Z" />
        </svg>
      </div>

      {/* ================= MAIN FOOTER BODY ================= */}
      <div className="bg-[#e0f1ef] pt-12 md:pt-16 pb-16 px-4 sm:px-6 relative z-10">
        
        {/* Overlapping Shield Badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[65%] z-20 flex flex-col items-center justify-center w-28 h-32 md:w-36 md:h-40 bg-white rounded-b-[2.5rem] rounded-t-3xl shadow-[0_20px_40px_rgba(31,155,144,0.15)] border-[6px] border-white group hover:-translate-y-[70%] transition-transform duration-500">
          <img src={process.env.PUBLIC_URL + "/logo.jpg"}  alt="Sai Brindavan Logo" className="w-10 h-14 md:w-12 md:h-12 object-contain mb-2 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-[#2b4c7e] font-black text-[10px] md:text-xs tracking-widest uppercase text-center leading-tight">
            Sai<br/>Brindavan
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto mt-12 md:mt-8">
          
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
            
            {/* Column 1: Hospital Info */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-2xl font-black text-[#2b4c7e] leading-tight pr-4">
                Sai Brindavan Medical & <br /> Healthcare Center
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-[#2b4c7e]/80 font-medium group">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#1f9b90] transition-colors duration-300">
                    <MapPin className="w-5 h-5 text-[#1f9b90] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-sm leading-relaxed pt-1">123 Healthcare Ave, Sagara,<br/>Karnataka 577401</span>
                </li>
                <li className="flex items-center gap-4 text-[#2b4c7e]/80 font-medium group">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#1f9b90] transition-colors duration-300">
                    <Phone className="w-5 h-5 text-[#1f9b90] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <a href="tel:+918000123456" className="text-sm hover:text-[#1f9b90] transition-colors">+91 63610 69736</a>
                </li>
                <li className="flex items-center gap-4 text-[#2b4c7e]/80 font-medium group">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#1f9b90] transition-colors duration-300">
                    <Mail className="w-5 h-5 text-[#1f9b90] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <a href="mailto:contact@saibrindavan.com" className="text-sm hover:text-[#1f9b90] transition-colors">contact@saibrindavan.com</a>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2 lg:ml-8">
              <h4 className="text-lg font-bold text-[#2b4c7e] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f6ac42]"></span> Explore
              </h4>
              <ul className="space-y-4">
                {['Home', 'Services', 'Find a Doctor', 'Timetable'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, '')}`} className="text-sm font-bold text-[#2b4c7e]/70 hover:text-[#1f9b90] transition-all duration-300 flex items-center gap-2 group">
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#1f9b90]" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Patient Info */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-bold text-[#2b4c7e] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1f9b90]"></span> Patients
              </h4>
              <ul className="space-y-4">
                {['Book Appointment', 'Emergency Care', 'Contact Us', 'FAQ'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, '')}`} className="text-sm font-bold text-[#2b4c7e]/70 hover:text-[#1f9b90] transition-all duration-300 flex items-center gap-2 group">
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#1f9b90]" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="lg:col-span-4 bg-white/40 p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-xl font-black text-[#2b4c7e] mb-3">
                Health Updates & Newsletter
              </h3>
              <p className="text-sm text-[#2b4c7e]/70 font-medium mb-6 leading-relaxed">
                Subscribe to get the latest medical news, health tips, and hospital updates delivered straight to your inbox.
              </p>
              
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-white border border-stone-200 text-[#2b4c7e] placeholder-stone-400 text-sm px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1f9b90] focus:border-transparent transition-all shadow-sm"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-[#2b4c7e] hover:bg-[#1f9b90] text-white px-5 rounded-xl font-bold flex items-center justify-center transition-colors shadow-md group-focus-within:bg-[#1f9b90]">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= BOTTOM DARK BAR ================= */}
      <div className="bg-[#2b4c7e] pt-8 pb-10 px-4 sm:px-6 relative z-10">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-6">
          
          {/* Top Row: Social & Copyright */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
            
            {/* Copyright Text */}
            <div className="text-sm font-medium text-[#c0daf0] order-2 md:order-1 text-center md:text-left">
              Copyright © {new Date().getFullYear()} <span className="text-white font-bold">Sai Brindavan Hospital</span>.<br className="md:hidden"/> All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 order-1 md:order-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-[#3b5998] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-[#0077b5] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center text-white hover:bg-[#FF0000] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <YoutubeIcon className="w-5 h-5" />
              </a>
            </div>

          </div>

          {/* Bottom Row: Digiyuktha Credit - Centered Perfectly */}
          <div className="flex items-center justify-center w-full">
            <p className="text-sm text-[#c0daf0]/80 font-medium flex items-center gap-1.5">
              Designed & Developed by 
              <a 
                href="https://digiyuktha.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#f6ac42] font-black tracking-wide hover:text-white transition-colors"
              >
                Digiyuktha
              </a>
            </p>
          </div>

        </div>
      </div>
      
    </footer>
  );
};

export default Footer;