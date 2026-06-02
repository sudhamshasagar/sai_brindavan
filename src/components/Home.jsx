import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { 
  Calendar, PhoneCall, ArrowRight, ShieldPlus, Activity, Megaphone
} from 'lucide-react';

// --- Animation Variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Home = () => {
  const [homeData, setHomeData] = useState({ photoURL: '', aboutUs: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-slate-50/50 font-sans relative flex flex-col selection:bg-[#0EA5E9] selection:text-white overflow-hidden">
      
      <Navbar />

      {/* ================= LIVE ANNOUNCEMENTS TICKER ================= */}
      <div className="w-full bg-slate-900 text-white py-3 flex overflow-hidden relative shadow-md z-30 border-b border-slate-800">
        
        {/* Fixed "Live Updates" Badge */}
        <div className="absolute left-0 top-0 h-full bg-[#1f9b90] px-5 md:px-8 flex items-center gap-2 z-10 font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-[15px_0_20px_rgba(15,23,42,0.9)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          Live Updates
        </div>

        {/* Scrolling Content */}
        <div className="flex whitespace-nowrap animate-[marquee_35s_linear_infinite] pl-[140px] md:pl-[180px] items-center text-xs sm:text-sm font-medium tracking-wide text-slate-300">
          {announcements.length > 0 ? (
            <>
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-center gap-2.5 mx-8">
                  <Megaphone className="w-4 h-4 text-[#C19B6C]" /> 
                  <span className="text-white font-bold">{ann.title}:</span> {ann.content}
                </div>
              ))}
              {/* Duplicate mapping for seamless infinite loop */}
              {announcements.map((ann) => (
                <div key={`dup-${ann.id}`} className="flex items-center gap-2.5 mx-8">
                  <Megaphone className="w-4 h-4 text-[#C19B6C]" /> 
                  <span className="text-white font-bold">{ann.title}:</span> {ann.content}
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center gap-2.5 mx-8">
              <Activity className="w-4 h-4 text-[#C19B6C]" /> 
              Welcome to Sai Brindavan Hospital. Providing excellence in women and child healthcare.
            </div>
          )}
        </div>
      </div>

      {/* ================= MAIN HERO SECTION ================= */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center relative z-10 py-12 lg:py-20">
        
        {/* Subtle Decorative Background Elements */}
       

        <div className="w-full grid lg:grid-cols-12 gap-16 lg:gap-10 items-center">
          
          {/* --- LEFT COLUMN: TYPOGRAPHY, CTA & EMERGENCY INFO --- */}
          <motion.div 
            className="lg:col-span-6 space-y-8 text-center lg:text-left relative z-20"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            
               {/* <motion.div 
              className="absolute top-6 right-6 md:top-8 md:right-8 w-24 h-24 md:w-28 md:h-28 bg-white/90 backdrop-blur-md rounded-full 
              shadow-2xl flex flex-col items-center justify-center border-[3px] border-white/60 text-center ring-1 ring-black/5 md:hidden sm:hidden"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                <ShieldPlus className="w-6 h-6 md:w-8 md:h-8 text-red-600 mb-1" />
                <span className="text-[10px] md:text-xs font-black uppercase text-slate-900 tracking-widest leading-none mt-1">24/7</span>
                <span className="text-[8px] md:text-[9px] font-bold uppercase text-red-600 tracking-widest leading-none mt-0.5">Available</span>
              </motion.div> */}
            

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5rem] font-bold text-slate-900 leading-[1.1] tracking-tight">
              Where <span className="text-[#1f9b90] font-black">Compassion</span><br />
              Meets Healing.
            </motion.h1>
            
            {loading ? (
              <motion.div variants={fadeUp} className="space-y-3 max-w-xl mx-auto lg:mx-0 animate-pulse">
                <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
                <div className="h-3 bg-slate-200 rounded-full w-4/6"></div>
              </motion.div>
            ) : (
              <motion.p variants={fadeUp} className="text-lg text-slate-500 text-justify max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {
                  "At Sai Brindavan Hospital, we blend state-of-the-art medical technology with unwavering empathy. As a premier destination for women, children,  and family healthcare, we are dedicated to providing a nurturing environment where clinical excellence and compassionate healing go hand in hand."
                }
              </motion.p>
            )}

            {/* Primary Action Buttons */}
            <motion.div variants={fadeUp} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#2b4c7e] hover:bg-sky-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#0EA5E9]/30 hover:shadow-[#0EA5E9]/50 hover:-translate-y-1 uppercase tracking-widest text-xs">
                <Calendar className="w-4 h-4" /> Book Appointment
              </button>
              <button className="group w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs shadow-sm hover:shadow hover:-translate-y-1">
                View Specialties <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Moved & Redesigned Emergency Section */}
            <motion.div variants={fadeUp} className="pt-6 mt-6 border-t border-slate-200/60 max-w-xl mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shrink-0">
                  <PhoneCall className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="font-extrabold text-slate-900 text-lg mb-0.5">Need Immediate Help?</h3>
                  <p className="text-xs text-slate-500 font-medium mb-2">ACLS equipped rapid-response teams on standby.</p>
                  <a href="tel:+916361069736" className="inline-flex items-center gap-2 text-xl font-black text-red-600 hover:text-red-700 transition-colors">
                    6361069736
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)] ml-2"></span>
                  </a>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* --- RIGHT COLUMN: DYNAMIC HERO IMAGE & STAMP --- */}
          <motion.div 
            className="lg:col-span-6 w-full relative mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            
            {/* Main Image Container */}
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-square sm:aspect-[4/3] xl:aspect-square shadow-2xl shadow-slate-300/50 border-[6px] border-white ring-1 ring-slate-100">
              {loading ? (
                <div className="w-full h-full  animate-pulse"></div>
              ) : (
                <>
                  <img 
                    src={homeData.photoURL || process.env.PUBLIC_URL + "/about.png"}  
                    alt="Sai Brindavan Hospital Facility" 
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Subtle Premium Gradient Overlay to maintain text legibility if you ever add text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
                </>
              )}
            </div>
          </motion.div>
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