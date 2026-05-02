import React from 'react';
import { Phone, Stethoscope, MapPin, ArrowRight } from 'lucide-react';

const ContactBar = () => {
  return (
    // The negative margin (-mt-16 lg:-mt-20) creates the overlapping effect
    <div className=" z-10 md:mt-16 lg:-mt-0 mx-auto  px-6 w-full font-sans">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] py-6 px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
        
        {/* Hotline */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start">
          <div className="w-12 h-12 rounded-full bg-[#1f9b90] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Hotline</p>
            <p className="text-base md:text-lg font-black text-[#2b4c7e]">+91 8000 123 456</p>
          </div>
        </div>

        {/* Divider (Hidden on Mobile) */}
        <div className="hidden lg:block w-px h-12 bg-stone-200"></div>

        {/* Ambulance */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start">
          <div className="w-12 h-12 rounded-full bg-[#1f9b90] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Ambulance</p>
            <p className="text-base md:text-lg font-black text-[#2b4c7e]">+91 98765 10800</p>
          </div>
        </div>

        {/* Divider (Hidden on Mobile) */}
        <div className="hidden lg:block w-px h-12 bg-stone-200"></div>

        {/* Location */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start">
          <div className="w-12 h-12 rounded-full bg-[#1f9b90] flex items-center justify-center text-white shrink-0 shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Location</p>
            <p className="text-base md:text-lg font-black text-[#2b4c7e]">Sagara, Karnataka</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-full lg:w-auto pt-2 lg:pt-0">
          <button className="w-full lg:w-auto px-8 py-3.5 bg-[#2b4c7e] hover:bg-[#1a365d] text-white text-sm rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
            Book Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactBar;