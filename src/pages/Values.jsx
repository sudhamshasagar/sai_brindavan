import React from 'react';
import { HeartHandshake, Lightbulb, Blocks, Handshake, Users } from 'lucide-react';

const valuesData = [
  {
    id: 1,
    num: '01',
    title: 'Compassion',
    icon: HeartHandshake,
    text: 'We understand that seeking medical care can be stressful. We strive to create a welcoming, supportive environment that puts every patient at ease.',
  },
  {
    id: 2,
    num: '02',
    title: 'Excellence',
    icon: Lightbulb,
    text: 'We are committed to providing exceptional care. We continuously improve our skills, knowledge, and resources to deliver the highest quality outcomes.',
  },
  {
    id: 3,
    num: '03',
    title: 'Integrity',
    icon: Blocks,
    text: "We practice medicine with uncompromising honesty. We are transparent in our decision-making, always putting our patients' best interests first.",
  },
  {
    id: 4,
    num: '04',
    title: 'Respect',
    icon: Handshake,
    text: 'We treat all individuals with absolute dignity, regardless of their background or circumstances. Every person deserves compassion and kindness.',
  },
  {
    id: 5,
    num: '05',
    title: 'Teamwork',
    icon: Users,
    text: 'We believe in working collaboratively across our medical departments to provide seamless, comprehensive, and highly effective care to our patients.',
  }
];

const Values = () => {
  return (
    <section id="values" className="relative w-full bg-[#f8fafc] py-20 lg:py-32 overflow-hidden font-sans selection:bg-[#c19b6c] selection:text-white">
      
      {/* --- Subtle Background Elements --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c19b6c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- Section Header --- */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <h4 className="text-[#c19b6c] font-bold uppercase tracking-widest text-xs mb-4 flex items-center justify-center gap-3">
            <span className="w-8 h-[2px] bg-[#c19b6c]/50"></span>
            Our Philosophy
            <span className="w-8 h-[2px] bg-[#c19b6c]/50"></span>
          </h4>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Core Values
          </h2>
          <p className="text-slate-500 font-medium text-base sm:text-lg">
            The fundamental principles that guide our decisions, shape our culture, and define our commitment to your health.
          </p>
        </div>

        {/* --- Bento Box Grid --- 
            Mobile: 1 column
            Tablet: 2 columns (last item spans 2)
            Desktop: 6 columns (Row 1: 3+3, Row 2: 2+2+2) 
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          
          {valuesData.map((value, index) => {
            const Icon = value.icon;
            
            // Determine span based on the 5-item layout logic
            let spanClasses = "";
            if (index === 0 || index === 1) {
              // First two items span half the width on desktop (3/6 cols)
              spanClasses = "md:col-span-1 lg:col-span-3"; 
            } else if (index === 2 || index === 3) {
              // Next two items span 1/3 width on desktop (2/6 cols)
              spanClasses = "md:col-span-1 lg:col-span-2";
            } else {
              // Last item spans full width on tablet to balance, and 1/3 on desktop
              spanClasses = "md:col-span-2 lg:col-span-2";
            }

            return (
              <div 
                key={value.id} 
                className={`group relative bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#c19b6c]/40 transition-all duration-500 overflow-hidden flex flex-col justify-between ${spanClasses}`}
              >
                {/* Background Watermark Icon */}
                <Icon className="absolute -bottom-8 -right-8 w-40 h-40 text-slate-50 opacity-50 group-hover:scale-110 group-hover:text-[#c19b6c]/5 transition-all duration-700 pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start mb-8">
                    {/* Icon Box */}
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-[#c19b6c] group-hover:border-[#c19b6c] transition-colors duration-500 shadow-sm">
                      <Icon className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    
                    {/* Number Designation */}
                    <span className="text-3xl font-black text-slate-100 group-hover:text-[#c19b6c]/20 transition-colors duration-500 select-none">
                      {value.num}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#c19b6c] transition-colors duration-300">
                    {value.title}
                  </h3>
                </div>

                <p className="text-slate-500 leading-relaxed font-medium relative z-10">
                  {value.text}
                </p>

                {/* Decorative Line on Hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c19b6c] to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-0 transition-all duration-700"></div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default Values;