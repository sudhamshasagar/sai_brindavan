import React from 'react';
import Navbar from './Navbar';
import { Play, Calendar, HeartPulse, CheckCircle2, Award } from 'lucide-react';

const Home = () => {
  return (
    // Changed to min-h-screen on mobile, h-screen on lg to handle mobile scrolling better
    <div className="min-h-screen lg:h-screen bg-gradient-to-br from-[#faf8f1] to-[#e0f1ef] font-sans overflow-hidden relative flex flex-col">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02] bg-[url('https://cdn.icon-icons.com/icons2/2367/PNG/512/medical_report_icon_143719.png')] bg-repeat pointer-events-none"></div>
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col lg:flex-row items-center relative z-10 pt-10 lg:pt-0">
        
        {/* ================= LEFT COLUMN: TEXT CONTENT ================= */}
        <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left relative z-20 pb-16 lg:pb-0">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1f9b90]/10 border border-[#1f9b90]/20 rounded-full text-[#1f9b90] font-bold text-xs uppercase tracking-widest mx-auto lg:mx-0">
            <HeartPulse className="w-4 h-4" />
            Trusted Healthcare
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-black text-[#2b4c7e] leading-[1.1] tracking-tight">
            Your <span className="text-[#1f9b90]">Partner</span> <br className="hidden sm:block" />
            In Health <span className="text-[#1f9b90]">And</span> <br className="hidden sm:block" />
            Wellness
          </h1>
          
          {/* Description */}
          <p className="text-base md:text-lg text-stone-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            We are committed to providing you with exceptional, comprehensive medical and healthcare services in our cutting-edge, patient-centered facility, with a special focus on maternal and child health.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#2b4c7e] hover:bg-[#1a365d] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>
            
            {/* <button className="w-full sm:w-auto px-6 py-4 group flex items-center justify-center gap-4 transition-all">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-[#f6ac42] group-hover:text-white transition-colors border border-stone-100 text-[#2b4c7e]">
                <Play className="w-5 h-5 ml-1 fill-current" />
              </div>
              <span className="font-bold text-[#2b4c7e] group-hover:text-[#f6ac42] transition-colors">
                See how we work
              </span>
            </button> */}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: HERO IMAGE & CARDS ================= */}
        <div className="w-full lg:w-1/2 relative h-full flex items-end justify-center lg:justify-end min-h-[50vh] lg:min-h-0 mt-10 lg:mt-0">
          
          <div className="relative w-full max-w-[550px] h-full flex items-end justify-center">
            
            {/* Soft decorative glow behind the doctors */}
            <div className="absolute bottom-0 w-[90%] aspect-square bg-gradient-to-t from-[#1f9b90]/20 to-transparent rounded-full blur-3xl translate-y-1/4 z-0"></div>

            {/* Main Doctor Image */}
            <img
              src="hero_img.png"
              alt="Medical Professionals"
              className="object-contain object-bottom w-full max-h-[75vh] lg:max-h-[85vh] drop-shadow-2xl relative z-10"
            />

            {/* Floating Card 1: Main Stat (Bottom Leftish) */}
            <div className="absolute z-30 bottom-4 sm:bottom-12 left-0 sm:-left-8 lg:-left-12 bg-white rounded-3xl p-5 shadow-[0_20px_40px_rgb(43,76,126,0.1)] border border-stone-100 w-[90%] sm:w-[320px] mx-auto sm:mx-0 right-0 sm:right-auto transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1f9b90]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-[#1f9b90]" />
                  </div>
                  <h3 className="text-base font-black text-[#2b4c7e]">Patient Recovery</h3>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-stone-100/80">
                <div>
                  <div className="font-black text-[#2b4c7e] text-xl">150,000+</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Healing Journeys</div>
                </div>
                <div className="w-px h-10 bg-stone-200"></div>
                <div className="text-right">
                  <div className="font-black text-[#1f9b90] text-xl">98.5%</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Top Award (Top Rightish) */}
            <div className="absolute z-30 top-[10%] lg:top-[20%] right-0 lg:-right-4 bg-white rounded-2xl p-4 shadow-xl border border-stone-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-[#f6ac42]/10 rounded-full flex items-center justify-center shrink-0">
                 <Award className="w-6 h-6 text-[#f6ac42]" />
              </div>
              <div>
                <div className="text-lg font-black text-[#2b4c7e] leading-tight">No. 1</div>
                <div className="text-xs font-bold text-stone-500">Top Best Hospital</div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;