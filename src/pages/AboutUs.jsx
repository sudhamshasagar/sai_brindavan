import React from 'react';
import { ShieldCheck, HeartHandshake, Clock4, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="about" className="w-full bg-[#f8fafc] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden selection:bg-[#c19b6c] selection:text-white">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-0 lg:items-center">
          
          {/* --- LEFT: Overlapping Content Card --- */}
          <div className="lg:col-span-5 lg:col-start-1 xl:col-span-4 xl:col-start-2 z-20 order-2 lg:order-1">
            <div className="bg-white p-8 sm:p-10 lg:p-12 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative">
              
              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -z-10"></div>

              <h4 className="text-[#c19b6c] font-bold uppercase tracking-widest text-xs mb-5 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#c19b6c]"></span>
                Our Legacy
              </h4>
              
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
                Excellence in <br />
                <span className="text-slate-400 font-light">Healthcare.</span>
              </h2>
              
              <p className="text-slate-600 leading-relaxed font-medium mb-8">
                Sai Brindavan Hospital is dedicated to excellence in medical care and patient well-being. We offer advanced treatments with a compassionate approach, ensuring affordability and accessibility for all. With cutting-edge technology and a patient-first philosophy, we strive to make a meaningful impact on every life we touch.
              </p>

              {/* Dynamic CTA */}
              <button className="group flex items-center gap-4 text-sm font-bold text-slate-900 hover:text-[#c19b6c] transition-colors uppercase tracking-widest">
                Discover Our Story
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-[#c19b6c]/30 group-hover:bg-[#c19b6c]/10 transition-all">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>

            {/* Floating Experience Metric */}
            <div className="mt-8 lg:mt-10 ml-4 sm:ml-8 flex items-center gap-5">
              <div className="text-5xl sm:text-6xl font-black text-[#c19b6c] tracking-tighter">15<span className="text-3xl">+</span></div>
              <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Years of <br /> <span className="text-slate-900">Excellence</span>
              </div>
            </div>
          </div>

          {/* --- RIGHT: Main Image & Features Bar --- */}
          <div className="lg:col-span-8 lg:col-start-5 xl:col-span-7 z-10 relative order-1 lg:order-2">
            
            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[16/11] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80" 
                alt="Sai Brindavan Hospital Facility" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            </div>

            {/* Dark Mode Features Bar (Overlapping the bottom of the image on Desktop) */}
            <div className="lg:absolute lg:-bottom-12 lg:left-12 lg:-right-8 mt-6 lg:mt-0 bg-slate-900 rounded-2xl shadow-xl p-6 sm:p-8 z-30">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                
                {/* Feature 1 */}
                <div className="pt-4 sm:pt-0 sm:px-4 first:pt-0 first:sm:pl-0 last:sm:pr-0 group">
                  <ShieldCheck className="w-7 h-7 text-[#c19b6c] mb-4 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="text-white font-bold text-sm tracking-wide mb-2">Advanced Care</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">Expert team supported by modern, state-of-the-art facilities.</p>
                </div>

                {/* Feature 2 */}
                <div className="pt-6 sm:pt-0 sm:px-6 group">
                  <HeartHandshake className="w-7 h-7 text-[#c19b6c] mb-4 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="text-white font-bold text-sm tracking-wide mb-2">Compassion</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">Personalized treatment ensuring high-quality care.</p>
                </div>

                {/* Feature 3 */}
                <div className="pt-6 sm:pt-0 sm:px-6 group">
                  <Clock4 className="w-7 h-7 text-[#c19b6c] mb-4 group-hover:-translate-y-1 transition-transform" />
                  <h4 className="text-white font-bold text-sm tracking-wide mb-2">24/7 Emergency</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">Immediate medical response for critical conditions.</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;