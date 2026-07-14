import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  Calendar, PhoneCall, ArrowRight, ShieldPlus, Activity, Megaphone,
  Stethoscope, HeartPulse, Baby, Award, Clock, MapPin
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const Home = () => {
  const [homeData, setHomeData] = useState({ photoURL: '/about.png', aboutUs: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const homeDoc = await getDoc(doc(db, 'settings', 'home'));
        if (homeDoc.exists()) setHomeData(homeDoc.data());

        const annQuery = query(collection(db, 'announcements'), where('active', '==', true));
        const annSnapshot = await getDocs(annQuery);
        setAnnouncements(annSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching home content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeContent();
  }, []);

  const trustStats = [
    { icon: Award, value: '25+', label: 'Years of Care' },
    { icon: HeartPulse, value: '50k+', label: 'Lives Touched' },
    { icon: Stethoscope, value: '40+', label: 'Specialists' },
    { icon: Baby, value: '10k+', label: 'Deliveries' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-teal-50/30 text-slate-800 overflow-x-hidden">
      <Navbar />

      {/* ================= LIVE ANNOUNCEMENTS TICKER ================= */}
      <div className="relative flex items-stretch bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white shadow-md overflow-hidden">
        {/* Live Badge */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 shrink-0 z-10 shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Live</span>
        </div>

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] py-2.5">
            {(announcements.length > 0
              ? [...announcements, ...announcements]
              : Array(2).fill({
                  id: 'default',
                  title: 'Welcome',
                  content: 'Sai Brindavan Hospital — excellence in women & child healthcare.',
                })
            ).map((ann, i) => (
              <div key={`${ann.id}-${i}`} className="flex items-center gap-3 px-8 text-sm font-medium">
                <Megaphone className="w-4 h-4 text-amber-200 shrink-0" />
                <span>
                  <span className="font-bold text-amber-200">{ann.title}:</span> {ann.content}
                </span>
                <span className="text-white/40">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="relative isolate">
        {/* Decorative blobs */}
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-5 lg:pb-28">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* LEFT COLUMN */}
            <div className="lg:col-span-6 space-y-5">
              <motion.h1
                variants={fadeUp}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-slate-900"
              >
                Where <span className="italic text-teal-700">Compassion</span>
                <br />
                Meets{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-rose-600">Healing.</span>
                  <span className="absolute inset-x-0 bottom-1 h-3 bg-rose-200/70 -z-0 rounded-sm" />
                </span>
              </motion.h1>

              {/* {loading ? (
                <motion.div variants={fadeUp} className="space-y-3">
                  <div className="h-4 w-full bg-slate-200/70 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-slate-200/70 rounded animate-pulse" />
                  <div className="h-4 w-9/12 bg-slate-200/70 rounded animate-pulse" />
                </motion.div>
              ) : (
                <motion.p variants={fadeUp} className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  {homeData.aboutUs ||
                    'At Sai Brindavan Hospital, we blend state-of-the-art medical technology with unwavering empathy — a premier destination for women, children, and family healthcare where clinical excellence and compassionate healing go hand in hand.'}
                </motion.p>
              )} */}

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-teal-600/25 transition-all hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5">
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-300 bg-white/70 backdrop-blur hover:border-teal-600 hover:text-teal-700 px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-800 transition-all">
                  <Stethoscope className="w-4 h-4" />
                  View Specialties
                </button>
              </motion.div>

              {/* Emergency Card */}
              <motion.div variants={fadeUp} className="relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-r from-rose-50 via-white to-rose-50/50 p-5 sm:p-6 shadow-sm">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-rose-200/40 blur-2xl" />
                <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:gap-5">
                  <div className="shrink-0 grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/30">
                    <ShieldPlus className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-rose-600">Emergency · 24 / 7</p>
                    <h3 className="mt-0.5 text-lg sm:text-xl font-bold text-slate-900 truncate">Need Immediate Help?</h3>
                    <a
                      href="tel:6361069736"
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm font-semibold transition"
                    >
                      <PhoneCall className="w-4 h-4" />
                      6361069736
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <motion.div variants={fadeUp} className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] w-full max-w-xl mx-auto">
                {/* Decorative offset frames */}
                <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-teal-300/60 hidden sm:block" />
                <div className="absolute inset-0 -translate-x-3 -translate-y-3 rounded-[2rem] bg-gradient-to-br from-rose-200/40 to-teal-200/40 hidden sm:block" />

                {/* Image */}
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 bg-slate-100">
                  {loading ? (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse" />
                  ) : (
                    <>
                      <img
                       src={process.env.PUBLIC_URL + "/about.png"}
                        alt="Sai Brindavan Hospital"
                        className="w-full h-full object-fit"
                        onError={(e) => {
                          console.error('Image failed to load:', e.currentTarget.src);
                          e.currentTarget.src = '/about.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/0 to-transparent" />
                    </>
                  )}

                  {/* Floating Trust Stamp */}
                  <div className="absolute top-5 left-5 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-xl border border-white flex items-center gap-3">
                    <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white">
                      <Activity className="w-5 h-5" />
                    </div>
                    {/* <div className="leading-tight">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rated</p>
                      <p className="text-sm font-bold text-slate-900">★ 4.9 · Trusted Care</p>
                    </div> */}
                  </div>

                  {/* Floating Info Chip */}
                  {/* <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-[260px] rounded-2xl bg-white/95 backdrop-blur p-4 shadow-xl border border-white">
                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                      <Clock className="w-3.5 h-3.5" />
                      OPEN NOW
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900 leading-snug">
                      Multi-specialty care with a personal touch.
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">Visit our campus today</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Trust Stats Row */}
          {/* <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {trustStats.map(({ icon: Icon, value, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur p-5 sm:p-6 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 transition-all"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-teal-50 opacity-0 group-hover:opacity-100 transition" />
                <Icon className="w-6 h-6 text-teal-700 mb-3" />
                <div className="relative">
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">{label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div> */}
        </div>
      </section>

      {/* Marquee keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      ` }} />
    </div>
  );
};

export default Home;
