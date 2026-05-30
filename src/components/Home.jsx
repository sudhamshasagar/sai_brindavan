import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { 
  Calendar, PhoneCall, AlertCircle, 
  ArrowRight, ShieldPlus, Activity, Megaphone
} from 'lucide-react';

const Home = () => {
  const [homeData, setHomeData] = useState({ photoURL: '', aboutUs: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback image if admin hasn't set one
  const DEFAULT_HERO_IMAGE = "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg";

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        // Fetch Home Settings
        const homeDoc = await getDoc(doc(db, "settings", "home"));
        if (homeDoc.exists()) {
          setHomeData(homeDoc.data());
        }

        // Fetch Active Announcements
        const annQuery = query(collection(db, "announcements"), where("active", "==", true));
        const annSnapshot = await getDocs(annQuery);
        const annList = annSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(annList);

      } catch (error) {
        console.error("Error fetching home content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans relative flex flex-col selection:bg-[#c19b6c] selection:text-white overflow-hidden">
      
      <Navbar />

      {/* ================= LIVE ANNOUNCEMENTS TICKER ================= */}
      <div className="w-full bg-slate-900 text-white py-2.5 flex overflow-hidden relative shadow-md z-30 border-b border-[#c19b6c]/30">
        
        {/* Fixed "Live Updates" Badge */}
        <div className="absolute left-0 top-0 h-full bg-[#c19b6c] px-4 md:px-6 flex items-center gap-2 z-10 font-bold uppercase tracking-widest text-xs shadow-[10px_0_20px_rgba(15,23,42,0.8)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Updates
        </div>

        {/* Scrolling Content */}
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] pl-[120px] md:pl-[140px] items-center text-xs sm:text-sm font-medium tracking-wide text-slate-300">
          {announcements.length > 0 ? (
            <>
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-center gap-2 mx-8">
                  <Megaphone className="w-4 h-4 text-[#c19b6c]" /> 
                  <span className="text-white font-bold">{ann.title}:</span> {ann.content}
                </div>
              ))}
              {/* Duplicate mapping for seamless infinite loop if items exist */}
              {announcements.map((ann) => (
                <div key={`dup-${ann.id}`} className="flex items-center gap-2 mx-8">
                  <Megaphone className="w-4 h-4 text-[#c19b6c]" /> 
                  <span className="text-white font-bold">{ann.title}:</span> {ann.content}
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center gap-2 mx-8">
              <Activity className="w-4 h-4 text-[#c19b6c]" /> 
              Welcome to Sai Brindavan Hospital. Providing excellence in healthcare.
            </div>
          )}
        </div>
      </div>

      {/* ================= MAIN HERO SECTION ================= */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row items-center relative z-10 py-12 lg:py-20 gap-12 lg:gap-8">
        
        {/* Subtle Background Element */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#c19b6c]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        {/* --- LEFT COLUMN: TYPOGRAPHY & CTA --- */}
        <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left relative z-20">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Accepting New Patients</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-black text-slate-900 leading-[1.05] tracking-tighter">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c19b6c] to-[#9a7b56]">Compassion</span><br />
            Meets Healing.
          </h1>
          
          {loading ? (
            <div className="space-y-3 max-w-xl mx-auto lg:mx-0 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {homeData.aboutUs || "Comprehensive medical care, state-of-the-art facilities, and a dedicated rapid-response emergency unit. Your life is safe in our hands."}
            </p>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-[#c19b6c] text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-slate-900/20 uppercase tracking-widest text-xs">
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
            <button className="group w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-[#c19b6c] text-slate-700 hover:text-[#c19b6c] rounded-xl font-bold flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs shadow-sm">
              View Specialties <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN: DYNAMIC HERO IMAGE & EMERGENCY CARD --- */}
        <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
          
          {/* Main Image Container */}
          <div className="relative rounded-3xl overflow-hidden aspect-square sm:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] shadow-[0_20px_50px_rgba(15,23,42,0.1)] border border-white">
            {loading ? (
              <div className="w-full h-full bg-slate-200 animate-pulse"></div>
            ) : (
              <>
                <img 
                  src={homeData.photoURL || DEFAULT_HERO_IMAGE} 
                  alt="Hospital Facility" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent mix-blend-multiply"></div>
              </>
            )}
          </div>

          {/* Floating Emergency Response Card */}
          <div className="absolute -bottom-8 lg:-bottom-12 sm:-left-8 lg:-left-16 w-[90%] sm:w-[380px] bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white mx-auto left-0 right-0 sm:mx-0 group">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 shrink-0">
                  <ShieldPlus className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight text-lg leading-none mb-1">Emergency Unit</h3>
                  <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span> 24/7 Standby
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 font-medium mb-5 leading-relaxed">
              ACLS equipped ambulances and critical care rapid-response teams ready for dispatch.
            </p>

            <a href="tel:+918000123456" className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md shadow-red-600/20">
              <PhoneCall className="w-4 h-4" /> Dial 8000 123 456
            </a>
          </div>

        </div>
      </main>

      {/* CSS Injection for Marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default Home;