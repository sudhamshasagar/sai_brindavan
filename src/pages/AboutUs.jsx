import React from 'react';
import { 
  ArrowRight, 
  Activity, 
  Stethoscope, 
  HeartPulse, 
  ShieldCheck 
} from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="about" className="w-full bg-white py-20 md:py-32 font-sans selection:bg-[#c19b6c] selection:text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================== */}
        {/* TOP: Split Editorial Header                */}
        {/* ========================================== */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-16 mb-16 lg:mb-20">
          
          <div className="max-w-3xl flex-1">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-px bg-[#c19b6c]"></span>
              <span className="text-[#c19b6c] font-bold uppercase tracking-[0.2em] text-[11px]">
                About Sai Brindavan
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.1] tracking-tight font-light">
              Advancing Health. <br />
              <span className="font-black">Enriching Lives.</span>
            </h2>
          </div>

          <div className="max-w-lg lg:pb-3 flex-1">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium mb-8">
              For over 15 years, Sai Brindavan Hospital has stood as a beacon of trust, combining world-class medical expertise, state-of-the-art technology, and a deep commitment to compassionate patient care.
            </p>
            <a href="#specialties" className="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-widest text-[11px] pb-2 border-b-2 border-slate-900 hover:text-[#c19b6c] hover:border-[#c19b6c] transition-colors group">
              Discover Our Legacy 
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>

        {/* ========================================== */}
        {/* MIDDLE: Hero Facility Image & Metrics      */}
        {/* ========================================== */}
        <div className="relative mb-20 lg:mb-32 mt-8">
          
          {/* Main Establishing Shot */}
          <div className="w-full aspect-[4/3] md:aspect-[16/7] lg:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=80" 
              alt="Sai Brindavan Hospital Facility" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Floating Trust Metrics Bar */}
          <div className="w-[92%] max-w-[1000px] mx-auto bg-slate-900 rounded-2xl shadow-2xl -mt-16 md:-mt-20 relative z-10 p-6 md:p-10 border border-slate-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0 lg:divide-x divide-slate-700/50">
              
              <div className="text-center px-2 md:px-6">
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#c19b6c] mb-2">15<span className="text-2xl font-light text-slate-500">+</span></div>
                <div className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-slate-400 font-bold">Years of Trust</div>
              </div>

              <div className="text-center px-2 md:px-6">
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">50<span className="text-2xl font-light text-slate-500">+</span></div>
                <div className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-slate-400 font-bold">Expert Doctors</div>
              </div>

              <div className="text-center px-2 md:px-6">
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">25<span className="text-2xl font-light text-slate-500">k+</span></div>
                <div className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-slate-400 font-bold">Patients Healed</div>
              </div>

              <div className="text-center px-2 md:px-6">
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">24<span className="text-2xl font-light text-slate-500">/7</span></div>
                <div className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-slate-400 font-bold">Emergency Care</div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* BOTTOM: Core Hospital Pillars Grid         */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pt-8 border-t border-slate-100">
          
          <div className="group">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:border-[#c19b6c] group-hover:bg-[#c19b6c]/5 transition-colors">
              <Stethoscope className="w-6 h-6 text-[#c19b6c]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Clinical Excellence</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Our multidisciplinary team of specialists utilizes evidence-based medicine to provide accurate diagnoses and superior treatment plans.
            </p>
          </div>

          <div className="group">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:border-[#c19b6c] group-hover:bg-[#c19b6c]/5 transition-colors">
              <Activity className="w-6 h-6 text-[#c19b6c]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Advanced Technology</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Equipped with state-of-the-art diagnostic and surgical technology to ensure precision, safety, and faster recovery times.
            </p>
          </div>

          <div className="group">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:border-[#c19b6c] group-hover:bg-[#c19b6c]/5 transition-colors">
              <HeartPulse className="w-6 h-6 text-[#c19b6c]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Patient-Centric Care</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              We believe in treating patients, not just diseases. Our approach is deeply rooted in empathy, transparency, and holistic well-being.
            </p>
          </div>

          <div className="group">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:border-[#c19b6c] group-hover:bg-[#c19b6c]/5 transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#c19b6c]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-3">Highest Safety Standards</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Strict adherence to international hygiene and safety protocols, ensuring a secure healing environment for every patient.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutUs;