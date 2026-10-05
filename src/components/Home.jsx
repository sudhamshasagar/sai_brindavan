import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  limit,
} from "firebase/firestore";
import {
  Calendar,
  PhoneCall,
  Megaphone,
  CheckCircle,
  Clock,
  Sparkles,
  Shield,
} from "lucide-react";

const Home = () => {
  const [photoURL, setPhotoURL] = useState("/about.png");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHeroData = async () => {
      try {
        const homeRef = doc(db, "settings", "home");
        const announcementsQuery = query(
          collection(db, "announcements"),
          where("active", "==", true),
          limit(5)
        );

        const [homeSnap, announcementsSnap] = await Promise.all([
          getDoc(homeRef),
          getDocs(announcementsQuery),
        ]);

        if (isMounted) {
          if (homeSnap.exists() && homeSnap.data().photoURL) {
            setPhotoURL(homeSnap.data().photoURL);
          }

          if (!announcementsSnap.empty) {
            setAnnouncements(
              announcementsSnap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              }))
            );
          }
        }
      } catch (err) {
        console.error("Error loading home:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  const tickerList = useMemo(() => {
    const base =
      announcements.length > 0
        ? announcements
        : [
            {
              id: "1",
              title: "Outpatient Services",
              content: "Consultations open Mon–Sat 8:00 AM to 8:00 PM",
            },
            {
              id: "2",
              title: "Emergency 24/7",
              content: "Trauma, maternal, and pediatric critical care ready",
            },
          ];

    // Duplicate list to guarantee seamless looping without blank space
    return [...base, ...base, ...base];
  }, [announcements]);

  return (
    <section id="home" className="relative w-full bg-[#f8fafc] overflow-hidden">
      {/* =====================================================
          1. HIGH-CONTRAST MARQUEE (Top of Page)
      ===================================================== */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerScroll 28s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative z-20 w-full border-b border-amber-400/20 bg-[#10233d] py-2 text-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Eyecatching Amber Badge with Pulse */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#f6ac42] px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-950 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-950" />
            </span>
            <Megaphone className="h-3 w-3" />
            <span>Notice</span>
          </div>

          {/* Continuous Ticker */}
          <div className="relative flex-1 overflow-hidden">
            <div className="ticker-track items-center gap-8 py-0.5 text-xs text-slate-200">
              {tickerList.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center gap-2">
                  <span className="font-bold text-[#f6ac42]">{item.title}:</span>
                  <span className="font-medium text-slate-100">{item.content}</span>
                  <span className="text-white/30">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          2. DESKTOP RIGHT-SIDE BACKGROUND IMAGE (Screen >= lg)
      ===================================================== */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 select-none pointer-events-none">
        {loading ? (
          <div className="w-full h-full bg-slate-200 animate-pulse" />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={photoURL}
              alt="Sai Brindavan Medical Center"
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
              decoding="sync"
              onError={(e) => {
                if (!e.currentTarget.src.endsWith("/about.png")) {
                  e.currentTarget.src = "/about.png";
                }
              }}
            />
            {/* Seamless blend gradient towards left side */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f8fafc] to-transparent" />
          </div>
        )}
      </div>

      {/* =====================================================
          3. MAIN HERO CONTENT AREA
      ===================================================== */}
      <div className="relative mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* LEFT: Text, Highlights & Actions */}
          <div className="flex flex-col justify-center lg:col-span-6 z-10">
            {/* Pill Tag */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-3.5 py-1 text-xs font-semibold text-[#1f9b90]">
              <Shield className="h-3.5 w-3.5" />
              <span>Dedicated Patient Care & Diagnostics</span>
            </div>

            {/* Headline */}
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1a365d] sm:text-4xl lg:text-5xl leading-tight">
              Advanced Medical Care, <br />
              <span className="text-[#1f9b90]">Trusted Specialists.</span>
            </h1>

            {/* Trust Highlights */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:text-sm">
                <CheckCircle className="h-4 w-4 text-[#1f9b90] shrink-0" />
                <span>Experienced Doctors</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:text-sm">
                <CheckCircle className="h-4 w-4 text-[#1f9b90] shrink-0" />
                <span>Pharmacy & Labs</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:text-sm">
                <CheckCircle className="h-4 w-4 text-[#1f9b90] shrink-0" />
                <span>Modern Diagnostics</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:text-sm">
                <CheckCircle className="h-4 w-4 text-[#1f9b90] shrink-0" />
                <span>Emergency Ready</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-500 shadow-none transition-none"
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Book Appointment</span>
                <span className="rounded-full bg-slate-300/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Coming Soon
                </span>
              </button>

              <a
                href="tel:+916361069736"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99]"
              >
                <PhoneCall className="h-4 w-4 text-red-500" />
                <span>Call Emergency</span>
              </a>
            </div>

            {/* OPD Timing */}
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5 text-[#f6ac42]" />
              <span>OPD Timings: Mon – Sat (8:00 AM – 8:00 PM)</span>
            </div>
          </div>

          {/* ===================================================
              4. RESPONSIVE IMAGE FOR SMALL & MEDIUM SCREENS (< lg)
              Framed proportionally without squishing or cutting
          =================================================== */}
          <div className="block lg:hidden w-full mt-2 sm:mt-4">
            <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm sm:p-2">
              {loading ? (
                <div className="aspect-[16/10] sm:aspect-[2/1] w-full bg-slate-200 animate-pulse rounded-xl" />
              ) : (
                <img
                  src={photoURL}
                  alt="Sai Brindavan Medical Center"
                  className="w-full aspect-[16/10] sm:aspect-[2/1] object-cover object-center rounded-xl"
                  onError={(e) => {
                    if (!e.currentTarget.src.endsWith("/about.png")) {
                      e.currentTarget.src = "/about.png";
                    }
                  }}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Home;