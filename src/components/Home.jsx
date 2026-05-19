import React from 'react';
import Navbar from './Navbar';
import { 
  Calendar, PhoneCall, AlertTriangle, 
  HeartPulse, Activity, ArrowRight, ShieldPlus,
  Stethoscope, Droplets, Apple
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans relative flex flex-col selection:bg-[#1f9b90] selection:text-white overflow-hidden">
      
      <Navbar />

      {/* ================= AUTO-SCROLLING HEALTH ADVICE BANNER ================= */}
      {/* This creates the "Media / News Ticker" effect across the screen */}
      <div className="w-full bg-gradient-to-r from-[#2b4c7e] via-[#1a365d] to-[#2b4c7e] text-white py-3 flex overflow-hidden relative shadow-md z-20 border-b-4 border-[#1f9b90]">
        
        {/* Absolute "Live Updates" Badge so it stays fixed on the left */}
        <div className="absolute left-0 top-0 h-full bg-red-600 px-4 md:px-6 flex items-center gap-2 z-10 font-bold uppercase tracking-widest text-xs md:text-sm shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          Health Tips
        </div>

        {/* The Scrolling Content */}
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] pl-[120px] md:pl-[150px] items-center text-sm font-medium tracking-wide">
          <div className="flex items-center gap-2 mx-8">
            <Droplets className="w-4 h-4 text-[#1f9b90]" /> Hydration is key: Drink at least 8 glasses of water daily.
          </div>
          <div className="flex items-center gap-2 mx-8">
            <Activity className="w-4 h-4 text-[#f6ac42]" /> Exercise: 30 minutes of daily walking improves cardiovascular health.
          </div>
          <div className="flex items-center gap-2 mx-8">
            <Apple className="w-4 h-4 text-green-400" /> Diet: Include fresh greens and fruits in your daily meals.
          </div>
          <div className="flex items-center gap-2 mx-8">
            <HeartPulse className="w-4 h-4 text-red-400" /> Stress Relief: Practice deep breathing for 5 minutes every morning.
          </div>
          <div className="flex items-center gap-2 mx-8">
            <Stethoscope className="w-4 h-4 text-[#1f9b90]" /> Prevention: Schedule your annual full-body health checkup today.
          </div>
        </div>
        
        {/* Duplicate for seamless infinite loop */}
        
      </div>

      {/* ================= MAIN HERO SECTION ================= */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col lg:flex-row items-center relative z-10 pt-10 pb-20 lg:py-12 gap-12 lg:gap-8">
        
        {/* LEFT COLUMN: EDITORIAL HEADLINES */}
        <div className="w-full lg:w-[55%] space-y-8 text-center lg:text-left relative z-20">
          
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-black text-[#0f172a] leading-[1.05] tracking-tighter uppercase">
            Your Health, <br />
            <span className="text-[#2b4c7e]">Our Priority.</span>
          </h1>
          
          <div className="w-24 h-2 bg-[#f6ac42] mx-auto lg:mx-0 rounded-full"></div>

          <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
            Comprehensive medical care, state-of-the-art facilities, and a dedicated rapid-response emergency unit. Your life is safe in our hands.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-[#2b4c7e] hover:bg-[#1a365d] text-white rounded-none font-black flex items-center justify-center gap-3 transition-all shadow-xl hover:-translate-y-1 uppercase tracking-widest text-sm">
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>
            
            <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-[#2b4c7e] text-[#2b4c7e] rounded-none font-black flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-sm">
              View Departments <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: EMERGENCY / AMBULANCE DIGITAL SIGNAGE */}
        {/* We build this out of CSS and Icons so it perfectly represents Emergency/Ambulance without any bad images loading */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
          
          <div className="w-full max-w-[500px] bg-[#0f172a] rounded-3xl p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative overflow-hidden group">
            
            {/* Background design elements to look like a digital billboard */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Top Red Flasher */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4" /> 24/7 Standby
              </div>
              <ShieldPlus className="w-8 h-8 text-slate-600" />
            </div>

            {/* Huge Emergency Typography */}
            <div className="relative z-10 mb-8">
              <h2 className="text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                Emergency
              </h2>
              <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 uppercase tracking-tight">
                Response Unit
              </h3>
            </div>

            {/* Ambulance Graphic Box */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl relative z-10 mb-8 backdrop-blur-md">
              <div className="flex items-center gap-6">
                {/* Ambulance/Medical Icon */}
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  {/* CSS built Medical Cross to guarantee it looks right */}
                  <div className="relative w-10 h-10">
                    <div className="absolute top-1/2 left-0 w-full h-3 -translate-y-1/2 bg-red-600 rounded-sm"></div>
                    <div className="absolute top-0 left-1/2 w-3 h-full -translate-x-1/2 bg-red-600 rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-xl uppercase">Ambulance</div>
                  <div className="text-red-400 font-bold text-sm uppercase tracking-widest mt-1">Dispatch Ready</div>
                  <div className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">Advanced Cardiac Life Support (ACLS) equipped vehicles.</div>
                </div>
              </div>
            </div>

            {/* Hotline Call Button */}
            <a href="tel:+918000123456" className="relative z-10 w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.6)] transition-all transform hover:-translate-y-1">
              <PhoneCall className="w-6 h-6 animate-bounce" />
              Dial 8000 123 456
            </a>
            
          </div>
        </div>

      </main>

      {/* Global Animations for the Media Ticker */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
};

export default Home;