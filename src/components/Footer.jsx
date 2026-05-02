import React from 'react';
import { MapPin, Phone, Mail, ArrowRight, HeartPulse, MessageCircleCode, MessageSquareCheck, MessageSquareX, MessageSquareDiffIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact"className="w-full relative mt-32 font-sans">
      
      {/* ================= TOP CURVE SVG ================= */}
      {/* This SVG creates the convex hill effect that seamlessly merges with the footer body */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-[99%] z-0">
        <svg 
          className="w-full h-16 md:h-24 lg:h-32 text-[#e0f1ef] block" 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          fill="currentColor"
        >
          <path d="M0,120 L0,120 Q720,-60 1440,120 Z" />
        </svg>
      </div>

      {/* ================= MAIN FOOTER BODY ================= */}
      <div className="bg-[#e0f1ef] pt-8 md:pt-12 pb-16 px-6 relative z-10">
        
        {/* Overlapping Shield Badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[65%] z-20 flex flex-col items-center justify-center w-32 h-36 md:w-36 md:h-40 bg-white rounded-b-[2.5rem] rounded-t-2xl shadow-2xl border-[6px] border-white">
          <img src="/logo.jpg" className="w-10 h-10 md:w-10 md:h-10 text-[#f6ac42] mb-1.5" />
          <span className="text-stone-900 font-black text-xs md:text-sm tracking-wider uppercase text-center leading-tight">
            Sai<br/>Brindavan
          </span>
        </div>

        <div className="max-w-7xl mx-auto mt-16 md:mt-12">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Column 1: Hospital Info */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-black text-[#2b4c7e] leading-snug pr-4">
                Sai Brindavan Medical & <br /> Healthcare Center
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-stone-600 font-medium">
                  <div className="w-8 h-8 rounded-full bg-[#1f9b90]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#1f9b90]" />
                  </div>
                  <span className="text-sm">123 Healthcare Ave, Sagara,<br/>Karnataka 577401</span>
                </li>
                <li className="flex items-center gap-4 text-stone-600 font-medium">
                  <div className="w-8 h-8 rounded-full bg-[#1f9b90]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#1f9b90]" />
                  </div>
                  <span className="text-sm">+91 8000 123 456</span>
                </li>
                <li className="flex items-center gap-4 text-stone-600 font-medium">
                  <div className="w-8 h-8 rounded-full bg-[#1f9b90]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#1f9b90]" />
                  </div>
                  <span className="text-sm">contact@saibrindavan.com</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2">
              <ul className="space-y-3.5">
                {['About Us', 'Departments', 'Doctors', 'Timetable'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm font-bold text-stone-500 hover:text-[#1f9b90] transition-all duration-300 hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Additional Links */}
            <div className="lg:col-span-2">
              <ul className="space-y-3.5">
                {['Contact Us', 'FAQs'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-sm font-bold text-stone-500 hover:text-[#1f9b90] transition-all duration-300 hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter Subscription */}
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-black text-[#2b4c7e] mb-2">
                Subscribe to our Newsletter
              </h3>
              <p className="text-sm text-stone-600 font-medium mb-6">
                To get the latest news about health from our experts, delivered straight to your inbox.
              </p>
              
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className="w-full bg-white/60 border border-stone-200/60 text-[#2b4c7e] placeholder-stone-400 text-sm px-6 py-4 rounded-full outline-none focus:ring-2 focus:ring-[#1f9b90] focus:bg-white transition-all shadow-sm"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#2b4c7e] hover:bg-[#1a365d] text-white px-5 md:px-6 rounded-full font-bold flex items-center gap-2 transition-colors shadow-md text-sm">
                  Submit <ArrowRight className="w-4 h-4 hidden sm:block" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= BOTTOM COPYRIGHT BAR ================= */}
      <div className="bg-[#2b4c7e] py-6 px-6 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-sm mr-2">Follow Us</span>
            
            <a href="#facebook" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1f9b90] hover:scale-110 transition-all duration-300">
              <MessageCircleCode className="w-4 h-4" />
            </a>
            <a href="#twitter" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1f9b90] hover:scale-110 transition-all duration-300">
              <MessageSquareCheck className="w-4 h-4" />
            </a>
            <a href="#linkedin" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1f9b90] hover:scale-110 transition-all duration-300">
              <MessageSquareX className="w-4 h-4 fill-current" />
            </a>
            <a href="#instagram" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1f9b90] hover:scale-110 transition-all duration-300">
              <MessageSquareDiffIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright Text */}
          <div className="text-sm font-medium text-[#c0daf0]">
            Copyright © 2026 Sai Brindavan. All rights reserved.
          </div>

        </div>
      </div>
      
    </footer>
  );
};

export default Footer;