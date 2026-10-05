import React, { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Plus,
  Minus,
  MessageCircleQuestion,
  Loader2,
  PhoneCall,
  Search,
  Sparkles,
  ShieldPlus,
  Stethoscope,
  CalendarCheck,
  HeartPulse,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  X,
  RotateCcw,
} from "lucide-react";

// =====================================================
// IN-MEMORY CACHE (Zero duplicate Firestore reads)
// =====================================================
let faqCache = null;
let faqFetchPromise = null;

const CATEGORIES = [
  { key: "all", label: "All Topics", Icon: Sparkles },
  { key: "general", label: "General Care", Icon: MessageCircleQuestion },
  { key: "appointment", label: "Appointments", Icon: CalendarCheck },
  { key: "services", label: "Treatments", Icon: Stethoscope },
  { key: "emergency", label: "Emergency & ICU", Icon: HeartPulse },
  { key: "insurance", label: "Insurance & TPA", Icon: ShieldPlus },
];

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const shouldReduceMotion = useReducedMotion();

  // ---------------------------------------------------
  // 1. FETCH FAQS (Cached)
  // ---------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      try {
        if (faqCache) {
          if (isMounted) {
            setFaqs(faqCache);
            setLoading(false);
          }
          return;
        }

        if (!faqFetchPromise) {
          const faqsRef = collection(db, "faqs");
          const q = query(faqsRef, orderBy("createdAt", "desc"));

          faqFetchPromise = getDocs(q)
            .then((snapshot) => {
              const data = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
              }));
              faqCache = data;
              return data;
            })
            .catch((err) => {
              faqFetchPromise = null;
              throw err;
            });
        }

        const data = await faqFetchPromise;
        if (isMounted) setFaqs(data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        if (isMounted) setFaqs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: faqs.length };
    faqs.forEach((faq) => {
      const cat = normalizeText(faq.category).trim().toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    const searchTerm = normalizeText(search).trim().toLowerCase();

    return faqs.filter((faq) => {
      const category = normalizeText(faq.category).trim().toLowerCase();
      const question = normalizeText(faq.question);
      const answer = normalizeText(faq.answer);

      const matchesCategory =
        activeCat === "all" || category === activeCat;

      if (!matchesCategory) return false;
      if (!searchTerm) return true;

      return (
        question.toLowerCase().includes(searchTerm) ||
        answer.toLowerCase().includes(searchTerm)
      );
    });
  }, [faqs, search, activeCat]);

  // Keep open item synchronized
  useEffect(() => {
    if (!openId) return;
    const stillVisible = filteredFaqs.some((faq) => faq.id === openId);
    if (!stillVisible) setOpenId(null);
  }, [filteredFaqs, openId]);

  const toggleFAQ = (id) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative w-full bg-[#f8fafc] py-14 sm:py-20 lg:py-24 font-sans overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================
            HEADER
        =================================================== */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-[#1f9b90]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a365d] sm:text-4xl lg:text-5xl"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-2 text-sm text-slate-600 sm:text-base leading-relaxed">
            Quick clarity on consultations, emergency casualty, insurance pre-authorizations, and patient admissions.
          </p>

          {/* Search Box */}
          <div className="mt-6 relative max-w-lg mx-auto">
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-xs focus-within:border-[#1f9b90] focus-within:ring-2 focus-within:ring-[#1f9b90]/15 transition-all">
              <Search className="h-4 w-4 text-slate-400 ml-2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type your question or keyword..."
                className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            UNIQUE CATEGORY HUB (2x3 Grid on Mobile, 6 Grid on Desktop)
            NO HORIZONTAL SCROLL - CLEAN VISUAL TILES
        =================================================== */}
        <div className="mt-8 mx-auto max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {CATEGORIES.map(({ key, label, Icon }) => {
              const active = activeCat === key;
              const count = categoryCounts[key] || 0;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCat(key)}
                  className={[
                    "relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer focus:outline-none",
                    active
                      ? "border-[#1a365d] bg-[#1a365d] text-white shadow-md shadow-slate-900/10"
                      : "border-slate-200/90 bg-white text-slate-700 hover:border-[#1f9b90]/50 hover:bg-slate-50/80 shadow-2xs",
                  ].join(" ")}
                >
                  {/* Category Icon */}
                  <div
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-xl mb-1.5 transition-colors",
                      active
                        ? "bg-white/10 text-[#f6ac42]"
                        : "bg-teal-50 text-[#1f9b90]",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Label */}
                  <span className="text-xs font-bold leading-tight">
                    {label}
                  </span>

                  {/* Question Count Badge */}
                  <span
                    className={[
                      "mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      active
                        ? "bg-white/15 text-slate-200"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {count} {count === 1 ? "FAQ" : "FAQs"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Bar (When search or category is active) */}
        {(search || activeCat !== "all") && (
          <div className="mt-6 mx-auto max-w-4xl flex items-center justify-between rounded-xl bg-teal-50/70 border border-teal-200/60 px-4 py-2 text-xs text-[#1a365d]">
            <span>
              Showing: <strong>{filteredFaqs.length}</strong> questions in{" "}
              <strong>{CATEGORIES.find((c) => c.key === activeCat)?.label}</strong>
              {search && ` matching "${search}"`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCat("all");
              }}
              className="flex items-center gap-1 font-bold text-[#1f9b90] hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        )}

        {/* ===================================================
            ACCORDION STREAM + STICKY ASSISTANCE SIDEBAR
        =================================================== */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
          
          {/* ACCORDION (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
                <Loader2 className="h-8 w-8 animate-spin text-[#1f9b90] mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Retrieving FAQs...
                </p>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 text-center px-6">
                <HelpCircle className="h-10 w-10 text-slate-300 mb-2" />
                <h3 className="text-base font-bold text-slate-800">
                  No questions match your query
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Try another search phrase or call our hospital help desk for immediate assistance.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCat("all");
                  }}
                  className="mt-4 rounded-xl bg-[#1a365d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#122846]"
                >
                  View All Questions
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                const answerId = `faq-ans-${faq.id}`;
                const buttonId = `faq-btn-${faq.id}`;

                return (
                  <div
                    key={faq.id}
                    className={[
                      "rounded-2xl border bg-white transition-all duration-200 overflow-hidden",
                      isOpen
                        ? "border-[#1f9b90] ring-1 ring-[#1f9b90]/15 shadow-sm"
                        : "border-slate-200/90 hover:border-slate-300 hover:shadow-2xs",
                    ].join(" ")}
                  >
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => toggleFAQ(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      className="flex w-full items-start justify-between gap-4 p-4 sm:p-5 text-left focus:outline-none"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Number Index */}
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold mt-0.5 ${
                            isOpen
                              ? "bg-[#1a365d] text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`text-sm sm:text-base font-bold leading-snug break-words ${
                            isOpen ? "text-[#1a365d]" : "text-slate-800"
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>

                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all mt-0.5 ${
                          isOpen
                            ? "border-[#1f9b90] bg-[#1f9b90] text-white"
                            : "border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                      >
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={answerId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 sm:pl-14 pt-0">
                            <div className="border-t border-slate-100 pt-3">
                              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-line">
                                {faq.answer}
                              </p>

                              {faq.category && (
                                <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                  <span>Category:</span>
                                  <span className="text-[#1a365d]">{faq.category}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* STICKY ASSISTANCE SIDEBAR (lg:col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-teal-50 border border-teal-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1f9b90]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Patient Support Desk</span>
              </div>

              <h3 className="mt-3 text-lg font-bold text-[#1a365d]">
                Have a specific question?
              </h3>

              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Our front desk team is ready 24 hours a day to answer inquiries regarding doctor consultation tokens, admissions, and emergency services.
              </p>

              <div className="mt-5 space-y-2.5">
                <a
                  href="tel:+916361069736"
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 hover:bg-teal-50/60 hover:border-teal-200 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1a365d] text-white">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Emergency & Reception (24/7)
                    </p>
                    <p className="font-extrabold text-sm text-slate-900">
                      +91 63610 69736
                    </p>
                  </div>
                </a>

                {/* <a
                  href="mailto:contact@saibrindavan.com"
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 hover:bg-teal-50/60 hover:border-teal-200 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#1f9b90]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Email Inquiries
                    </p>
                    <p className="font-bold text-xs text-slate-800 truncate">
                      contact@saibrindavan.com
                    </p>
                  </div>
                </a> */}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-[#1f9b90]" />
                  <span>OPD Hours:</span>
                </span>
                <span>Mon – Sat · 8 AM – 8 PM</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FAQ;