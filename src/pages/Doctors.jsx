import React, { useState } from 'react';
import { Twitter, Linkedin, Mail, Phone, GraduationCap, Award, Stethoscope, Clock, ChevronRight, Contact2Icon, IdCardLanyardIcon } from 'lucide-react';

const doctorsData = [
  {
    id: 1,
    name: 'Dr. Naveen Sagar H M',
    specialty: 'Pediatrician',
    qualifications: 'MBBS, MD',
    experience: '12+ Years',
    bio: 'Dr. Naveen Sagar is a highly skilled pediatrician dedicated to providing comprehensive care for infants, children, and adolescents. His gentle approach and expertise make him a trusted choice for parents navigating their child’s developmental milestones.',
    education: [
      'MD in Pediatrics - XYZ Medical College',
      'MBBS - Rajiv Gandhi University of Health Sciences'
    ],
    image: 'doctor1.jpeg', 
    socials: { twitter: '#', linkedin: '#', mail: 'mailto:naveen@saibrindavan.com' }
  },
  {
    id: 2,
    name: 'Dr. Dhanalaxmi Billava',
    specialty: 'ENT Specialist',
    qualifications: 'MBBS, DLO',
    experience: '10+ Years',
    bio: 'Specializing in Otorhinolaryngology, Dr. Dhanalaxmi offers expert diagnosis and treatment for complex ear, nose, and throat conditions. She is known for her patient-centric care and precision in minor surgical procedures.',
    education: [
      'DLO (Diploma in Otorhinolaryngology)',
      'MBBS - State Medical University'
    ],
    image: 'doctor2.jpeg',
    socials: { twitter: '#', linkedin: '#', mail: 'mailto:dhanalaxmi@saibrindavan.com' }
  },
  {
    id: 3,
    name: 'Dr. S Md Samiulla',
    specialty: 'Family Medicine',
    qualifications: 'MBBS, D Fam med.',
    experience: '15+ Years',
    bio: 'As a Family Medicine practitioner, Dr. Samiulla focuses on holistic, continuous care for individuals of all ages. He emphasizes preventive medicine, lifestyle management, and overall family wellness.',
    education: [
      'Diploma in Family Medicine',
      'MBBS - National Medical College'
    ],
    image: 'doctor3.jpeg',
    socials: { twitter: '#', linkedin: '#', mail: 'mailto:samiulla@saibrindavan.com' }
  },
  {
    id: 4,
    name: 'Dr. Shaik Asifa Yasmin',
    specialty: 'Pediatrician',
    qualifications: 'MBBS, DCH',
    experience: '8+ Years',
    bio: 'Dr. Asifa Yasmin is passionate about neonatal and pediatric care. With specialized training in child health, she provides expert guidance on nutrition, immunization, and early childhood illnesses.',
    education: [
      'DCH (Diploma in Child Health)',
      'MBBS - Medical College of Sciences'
    ],
    image: 'doctor4.jpeg',
    socials: { twitter: '#', linkedin: '#', mail: 'mailto:asifa@saibrindavan.com' }
  },
  {
    id: 5,
    name: 'Dr. Chandan Kumar',
    specialty: 'Pediatrician',
    qualifications: 'MBBS, MD',
    experience: '11+ Years',
    bio: 'Dr. Chandan is a dedicated pediatrician with extensive experience in managing pediatric emergencies and chronic childhood conditions. He believes in creating a comforting environment for his young patients.',
    education: [
      'MD in Pediatrics - City Medical Institute',
      'MBBS - University of Health Sciences'
    ],
    image: 'doctor5.jpg',
    socials: { twitter: '#', linkedin: '#', mail: 'mailto:chandan@saibrindavan.com' }
  }
];

const Doctors = () => {
  // Set the first doctor as the default active profile
  const [activeId, setActiveId] = useState(doctorsData[0].id);
  const activeDoctor = doctorsData.find(d => d.id === activeId);

  return (
    <section id="doctors" className="w-full bg-[#faf8f1] py-24 px-6 font-sans relative overflow-hidden">
      
      {/* Required CSS for hiding the scrollbar on the carousel and animating the spotlight */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2b4c7e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h4 className="text-[#f6ac42] font-black uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
            <span className="w-6 h-1 bg-[#f6ac42] rounded-full"></span>
            Medical Staff
            <span className="w-6 h-1 bg-[#f6ac42] rounded-full"></span>
          </h4>
          <h2 className="text-4xl md:text-5xl font-black text-[#2b4c7e] tracking-tight mb-4">
            Our Specialists
          </h2>
          <p className="text-lg text-stone-500 font-medium">
            Select a doctor below to view their complete profile, expertise, and availability.
          </p>
        </div>

        {/* ================= INTERACTIVE CAROUSEL TRACK ================= */}
        <div className="mb-12 relative">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scroll pb-4 pt-2 px-2">
            {doctorsData.map((doctor) => (
              <button 
                key={doctor.id}
                onClick={() => setActiveId(doctor.id)}
                className={`snap-start shrink-0 w-[280px] p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 text-left relative overflow-hidden
                  ${activeId === doctor.id 
                    ? 'bg-white shadow-[0_10px_30px_rgb(31,155,144,0.15)] border-2 border-[#1f9b90] scale-105' 
                    : 'bg-white/60 border border-stone-200 hover:bg-white hover:border-[#2b4c7e]/30 opacity-70 hover:opacity-100'}
                `}
              >
                {activeId === doctor.id && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#1f9b90]/10 rounded-bl-full -z-10"></div>
                )}
                
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className={`w-16 h-16 rounded-full object-cover transition-all duration-300 ${activeId === doctor.id ? 'ring-2 ring-offset-2 ring-[#1f9b90]' : 'grayscale'}`}
                />
                <div>
                  <h3 className={`font-black line-clamp-1 ${activeId === doctor.id ? 'text-[#2b4c7e]' : 'text-stone-600'}`}>
                    {doctor.name}
                  </h3>
                  <p className={`text-xs font-bold uppercase tracking-wider ${activeId === doctor.id ? 'text-[#1f9b90]' : 'text-stone-400'}`}>
                    {doctor.specialty}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          {/* Mobile Swipe Indicator */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-2 text-stone-400 text-xs font-bold uppercase tracking-widest">
            Swipe to see more <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* ================= DYNAMIC SPOTLIGHT CARD ================= */}
        {/* The key={activeId} forces React to re-mount this div, triggering the CSS fade animation every time a new doctor is clicked */}
        <div key={activeId} className="w-full bg-white rounded-3xl shadow-[0_20px_60px_rgb(43,76,126,0.08)] border border-stone-100 overflow-hidden flex flex-col lg:flex-row animate-fade-slide">
          
          {/* Left Side: Large Portrait & Socials */}
          <div className="w-full lg:w-[35%] relative bg-stone-100 shrink-0">
            <div className="aspect-[4/5] lg:aspect-auto lg:h-full w-full relative">
              <img 
                src={activeDoctor.image} 
                alt={activeDoctor.name} 
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b4c7e] via-[#2b4c7e]/20 to-transparent opacity-90 lg:opacity-60"></div>
              
              {/* Overlay Content on Image */}
              <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                <span className="inline-flex items-center gap-1.5 bg-[#f6ac42] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
                  <Stethoscope className="w-3.5 h-3.5" /> {activeDoctor.specialty}
                </span>
                <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-1">{activeDoctor.name}</h2>
                <p className="text-white/80 font-semibold tracking-wide text-sm">{activeDoctor.qualifications}</p>
                
                {/* Social Links on Image */}
                <div className="flex gap-3 mt-6">
                  {activeDoctor.socials.twitter && (
                    <a href={activeDoctor.socials.twitter} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-[#1DA1F2] transition-colors border border-white/30">
                      <Contact2Icon className="w-4 h-4 fill-current text-white" />
                    </a>
                  )}
                  {activeDoctor.socials.linkedin && (
                    <a href={activeDoctor.socials.linkedin} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-[#0A66C2] transition-colors border border-white/30">
                      <IdCardLanyardIcon className="w-4 h-4 fill-current text-white" />
                    </a>
                  )}
                  {activeDoctor.socials.mail && (
                    <a href={activeDoctor.socials.mail} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-[#f6ac42] transition-colors border border-white/30">
                      <Mail className="w-4 h-4 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Detailed Info */}
          <div className="w-full lg:w-[65%] p-6 lg:p-12 flex flex-col justify-between">
            
            <div className="space-y-10">
              {/* Bio */}
              <div>
                <h4 className="text-sm font-black text-[#2b4c7e] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-stone-100 pb-2">
                   Professional Overview
                </h4>
                <p className="text-stone-600 leading-relaxed lg:text-lg font-medium">
                  {activeDoctor.bio}
                </p>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-sm font-black text-[#2b4c7e] uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-stone-100 pb-2">
                  Education & Credentials
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDoctor.education.map((degree, index) => (
                    <li key={index} className="flex items-start gap-3 bg-[#faf8f1] p-4 rounded-xl border border-stone-100">
                      <GraduationCap className="w-6 h-6 text-[#1f9b90] shrink-0" />
                      <span className="text-stone-600 text-sm font-bold leading-tight">{degree}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-stone-100 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f6ac42]/10 rounded-full flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-[#f6ac42]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">Experience</p>
                    <p className="font-black text-[#2b4c7e] text-lg">{activeDoctor.experience}</p>
                  </div>
                </div>

                <div className="bg-white border-2 border-stone-100 p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1f9b90]/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#1f9b90]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">Availability</p>
                    <p className="font-black text-[#2b4c7e] text-lg">Mon - Sat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="pt-10 mt-10 border-t border-stone-100 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-4 bg-[#2b4c7e] hover:bg-[#1a365d] text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-lg text-lg">
                <Phone className="w-5 h-5" /> Schedule Appointment
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Doctors;