import React from 'react';
import { ShieldCheck, HeartHandshake, Clock4, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  return (
    <section id="about" className="w-full bg-[#e0f1ef]/30 py-24 px-6 font-sans relative overflow-hidden">
      
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#1f9b90]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2b4c7e]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column: Image/Visual Area */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.1)]">
               {/* Replace this with an actual photo of your hospital building or team */}
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80" 
                alt="Sai Brindavan Hospital Facility" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b4c7e]/80 to-transparent mix-blend-multiply"></div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-4">
              <div className="text-4xl font-black text-[#1f9b90]">15+</div>
              <div className="text-sm font-bold text-stone-600 uppercase tracking-widest leading-tight">
                Years of <br /> <span className="text-[#2b4c7e]">Excellence</span>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h4 className="text-[#f6ac42] font-black uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
                <span className="w-8 h-1 bg-[#f6ac42] rounded-full"></span>
                About Us
              </h4>
              <h2 className="text-4xl md:text-5xl font-black text-[#2b4c7e] tracking-tight leading-[1.15]">
                A Premier Healthcare <br className="hidden md:block" /> Institution
              </h2>
            </div>
            
            <p className="text-lg text-stone-600 leading-relaxed font-medium">
              Sai Brindavan Hospital is dedicated to excellence in medical care and patient well-being. We offer advanced treatments with a compassionate approach, ensuring affordability and accessibility for all. With cutting-edge technology and a patient-first philosophy, we strive to make a meaningful impact on every life we touch.
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1f9b90]/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#1f9b90]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2b4c7e] mb-1">Advanced Healthcare</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">Expert team with experienced doctors supported by modern facilities.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1f9b90]/10 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6 text-[#1f9b90]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2b4c7e] mb-1">Compassionate Care</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">Personalized treatment ensuring high-quality care at reasonable costs.</p>
                </div>
              </div>

              {/* Feature 3 (Spans full width on mobile, 1 col on md) */}
              <div className="flex gap-4 md:col-span-2">
                <div className="w-12 h-12 rounded-xl bg-[#f6ac42]/10 flex items-center justify-center shrink-0">
                  <Clock4 className="w-6 h-6 text-[#f6ac42]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2b4c7e] mb-1">Round-the-Clock Emergency</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">Immediate medical response for critical conditions, ensuring 24/7 availability.</p>
                </div>
              </div>

            </div>

            {/* Optional CTA */}
            <div className="pt-6">
              <button className="px-8 py-4 bg-[#2b4c7e] hover:bg-[#1a365d] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                Discover More About Us <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;