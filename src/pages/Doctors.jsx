import React, { useState, useEffect, useRef } from 'react';
import { 
  Twitter, Linkedin, Mail, Phone, GraduationCap, 
  Award, Stethoscope, Clock, ChevronRight, Contact2Icon, IdCardLanyardIcon 
} from 'lucide-react';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// The component now accepts 'doctorsList' as a prop so your HR portal can inject the parsed CSV data dynamically.
const Doctors = () => {
  const [activeId, setActiveId] = useState(null);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);

useEffect(() => {
  fetchDoctors();
}, []);

const fetchDoctors = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "doctors"));

    const doctorsData = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        specialty: data.specialty,
        image: data.photoURL,
        bio: data.description,
        experience: data.experience,
        qualifications: data.education,

        education: [
          data.education,
          data.collegeName
        ].filter(Boolean),

        socials: {
          twitter: data.instagram,
          linkedin: data.linkedin,
          mail: data.gmail ? `mailto:${data.gmail}` : null,
        }
      };
    });

    setDoctorsList(doctorsData);

  } catch (error) {
    console.error("Error fetching doctors:", error);
  }
};

  // Set the first doctor as default once the dynamic data loads
  useEffect(() => {
    if (doctorsList?.length > 0 && !activeId) {
      setActiveId(doctorsList[0].id);
    }
  }, [doctorsList, activeId]);

  // Smooth Auto-Scrolling Engine using requestAnimationFrame
  useEffect(() => {
    if (!scrollRef.current || isHovered) return;

    const scrollContainer = scrollRef.current;
    let animationFrameId;

    const scrollStep = () => {
      if (scrollContainer) {
        // If we reach the end of the scroll container, snap back to the beginning
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
          scrollContainer.scrollLeft = 0; 
        } else {
          // Advance by 1 pixel every frame for a smooth continuous scroll
          scrollContainer.scrollLeft += 1;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    // Cleanup animation frame on unmount or hover state change
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  // Handle empty or loading states smoothly
  if (!doctorsList || doctorsList.length === 0) {
    return (
      <div className="w-full py-24 px-6 bg-[#faf8f1] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#1f9b90] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#2b4c7e] font-bold uppercase tracking-widest text-sm">Loading Specialists...</p>
        </div>
      </div>
    );
  }

  const activeDoctor = doctorsList.find(d => d.id === activeId) || doctorsList[0];

  return (
    <section id="doctors" className="w-full bg-[#faf8f1] py-24 px-6 font-sans relative overflow-hidden">
      
      {/* Required CSS for hiding the scrollbar on the carousel and animating the spotlight */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

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

        {/* ================= INTERACTIVE AUTO-SCROLLING CAROUSEL ================= */}
        <div className="mb-12 relative">
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scroll pb-4 pt-2 px-2 cursor-grab active:cursor-grabbing"
          >
            {doctorsList.map((doctor) => (
              <button 
                key={doctor.id}
                onClick={() => setActiveId(doctor.id)}
                className={`snap-start shrink-0 w-[280px] p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 text-left relative overflow-hidden
                  ${activeId === doctor.id 
                    ? 'bg-white shadow-[0_10px_30px_rgb(31,155,144,0.15)] border-2 border-[#1f9b90] scale-[1.02]' 
                    : 'bg-white/60 border border-stone-200 hover:bg-white hover:border-[#2b4c7e]/30 opacity-70 hover:opacity-100'}
                `}
              >
                {activeId === doctor.id && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#1f9b90]/10 rounded-bl-full -z-10"></div>
                )}
                
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }} // Fallback for bad CSV links
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
          
          {/* Mobile Swipe/Interaction Indicator */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-2 text-stone-400 text-xs font-bold uppercase tracking-widest">
            Tap or hold to pause scroll <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* ================= DYNAMIC SPOTLIGHT CARD ================= */}
        <div key={activeId} className="w-full bg-white rounded-3xl shadow-[0_20px_60px_rgb(43,76,126,0.08)] border border-stone-100 overflow-hidden flex flex-col lg:flex-row animate-fade-slide">
          
          {/* Left Side: Clean Portrait Image Only */}
          <div className="w-full lg:w-[35%] relative bg-stone-100 shrink-0">
            <div className="aspect-[4/5] lg:aspect-auto lg:h-full w-full relative">
              <img 
                src={activeDoctor.image} 
                alt={activeDoctor.name}
                onError={(e) => { e.target.src = "https://via.placeholder.com/600?text=Doctor+Profile"; }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2b4c7e] via-[#2b4c7e]/10 to-transparent opacity-90 lg:opacity-40"></div>
              
              {/* Simplified Image Overlay (Socials removed from here) */}
              <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10 lg:hidden">
                <span className="inline-flex items-center gap-1.5 bg-[#f6ac42] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 shadow-sm">
                  <Stethoscope className="w-3.5 h-3.5" /> {activeDoctor.specialty}
                </span>
                <h2 className="text-3xl font-black leading-tight mb-1">{activeDoctor.name}</h2>
              </div>
            </div>
          </div>

          {/* Right Side: Detailed Info & Actions */}
          <div className="w-full lg:w-[65%] p-6 lg:p-12 flex flex-col justify-between">
            
            <div className="space-y-8 lg:space-y-10">
              
              {/* Desktop Header Title (Hidden on mobile where the overlay takes over) */}
              <div className="hidden lg:block border-b border-stone-100 pb-6">
                <span className="inline-flex items-center gap-1.5 bg-[#f6ac42] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
                  <Stethoscope className="w-3.5 h-3.5" /> {activeDoctor.specialty}
                </span>
                <h2 className="text-4xl font-black text-[#2b4c7e] leading-tight mb-1">{activeDoctor.name}</h2>
                <p className="text-[#1f9b90] font-bold tracking-wide text-sm">{activeDoctor.qualifications}</p>
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-sm font-black text-[#2b4c7e] uppercase tracking-widest mb-4 flex items-center gap-2">
                  Professional Overview
                </h4>
                <p className="text-stone-600 leading-relaxed lg:text-lg font-medium">
                  {activeDoctor.bio}
                </p>
              </div>

              {/* Education */}
              {activeDoctor.education && activeDoctor.education.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-[#2b4c7e] uppercase tracking-widest mb-4 flex items-center gap-2">
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
              )}

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-stone-100 p-4 lg:p-5 rounded-2xl flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#f6ac42]/10 rounded-full flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 lg:w-6 lg:h-6 text-[#f6ac42]" />
                  </div>
                  <div>
                    <p className="text-[9px] lg:text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">Experience</p>
                    <p className="font-black text-[#2b4c7e] text-base lg:text-lg">{activeDoctor.experience}</p>
                  </div>
                </div>

                <div className="bg-white border-2 border-stone-100 p-4 lg:p-5 rounded-2xl flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#1f9b90]/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-[#1f9b90]" />
                  </div>
                  <div>
                    <p className="text-[9px] lg:text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5">Availability</p>
                    <p className="font-black text-[#2b4c7e] text-base lg:text-lg">Mon - Sat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Area & Social Links (Moved to Content Side) */}
            <div className="pt-8 mt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-6 justify-between">
              
              {/* Relocated Social Links */}
              {activeDoctor.socials && (
                <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-start">
                  {activeDoctor.socials.twitter && (
                    <a href={activeDoctor.socials.twitter} className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] text-stone-400 transition-all shadow-sm">
                      <Contact2Icon className="w-5 h-5 fill-current" />
                    </a>
                  )}
                  {activeDoctor.socials.linkedin && (
                    <a href={activeDoctor.socials.linkedin} className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] text-stone-400 transition-all shadow-sm">
                      <IdCardLanyardIcon className="w-5 h-5 fill-current" />
                    </a>
                  )}
                  {activeDoctor.socials.mail && (
                    <a href={activeDoctor.socials.mail} className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center hover:bg-[#f6ac42] hover:text-white hover:border-[#f6ac42] text-stone-400 transition-all shadow-sm">
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}

              {/* Call to Action Button */}
              <button className="w-full sm:w-auto flex-1 py-4 px-8 bg-[#2b4c7e] hover:bg-[#1a365d] text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 shadow-lg text-sm lg:text-base uppercase tracking-widest">
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