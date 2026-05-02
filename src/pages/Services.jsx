import React from 'react';
import { Baby, Activity, HeartPulse, Ear, Users, Beaker } from 'lucide-react';

const servicesData = [
  {
    id: 1,
    title: 'Paediatrics & Neonatology',
    icon: Baby,
    text: 'Comprehensive care for infants, children, and newborns with expert paediatric and neonatal services.',
    color: '#1f9b90', // Teal
  },
  {
    id: 2,
    title: 'NICU & PICU',
    icon: Activity,
    text: 'Advanced intensive care units dedicated to critically ill newborns and children, ensuring round-the-clock expert care.',
    color: '#2b4c7e', // Deep Blue
  },
  {
    id: 3,
    title: 'Obstetrics & Gynaecology',
    icon: HeartPulse,
    text: 'Personalized obstetric and gynaecological care for every phase of a woman’s life.',
    color: '#f6ac42', // Warm Gold
  },
  {
    id: 4,
    title: 'ENT',
    icon: Ear,
    text: 'Specialized diagnosis and treatment for ear, nose, and throat conditions with expert ENT care.',
    color: '#2b4c7e', // Deep Blue
  },
  {
    id: 5,
    title: 'Family Medicine',
    icon: Users,
    text: 'Holistic primary care for individuals and families across all ages and stages of life.',
    color: '#1f9b90', // Teal
  },
  {
    id: 6,
    title: '24X7 Pharmacy & Laboratory',
    icon: Beaker,
    text: 'Continuous access to essential medicines and diagnostic tests with our 24x7 pharmacy and laboratory.',
    color: '#f6ac42', // Warm Gold
  }
];

const Services = () => {
  return (
    <section id="services" className="w-full bg-[#faf8f1] py-24 px-6 font-sans relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] bg-[url('https://cdn.icon-icons.com/icons2/2367/PNG/512/medical_report_icon_143719.png')] bg-repeat z-0 pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1f9b90]/10 rounded-full blur-3xl z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
          <h4 className="text-[#f6ac42] font-black uppercase tracking-widest text-sm mb-4 flex items-center justify-center gap-2">
            <span className="w-8 h-1 bg-[#f6ac42] rounded-full"></span>
            Our Expertise
            <span className="w-8 h-1 bg-[#f6ac42] rounded-full"></span>
          </h4>
          <h2 className="text-4xl md:text-5xl font-black text-[#2b4c7e] tracking-tight mb-6">
            Services
          </h2>
          <p className="text-lg text-stone-600 font-medium">
            Quality care tailored to your medical needs, delivered by compassionate experts in a state-of-the-art environment.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id}
                className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-2 border border-stone-100/50"
              >
                {/* Icon Container with dynamic color based on the array */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-md"
                  style={{ backgroundColor: `${service.color}15` }} // 15% opacity hex
                >
                  <Icon className="w-8 h-8" style={{ color: service.color }} strokeWidth={2} />
                </div>

                <h3 className="text-2xl font-bold text-[#2b4c7e] mb-4 group-hover:text-[#1f9b90] transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-stone-500 leading-relaxed font-medium">
                  {service.text}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;