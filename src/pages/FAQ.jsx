import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {
  Plus, Minus, MessageCircleQuestion, Loader2, PhoneCall,
  Search, Sparkles, ShieldPlus, Stethoscope, CalendarCheck,
  HeartPulse, Mail, ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { key: 'all',         label: 'All',          Icon: Sparkles },
  { key: 'general',     label: 'General',      Icon: MessageCircleQuestion },
  { key: 'appointment', label: 'Appointments', Icon: CalendarCheck },
  { key: 'services',    label: 'Services',     Icon: Stethoscope },
  { key: 'emergency',   label: 'Emergency',    Icon: HeartPulse },
  { key: 'insurance',   label: 'Insurance',    Icon: ShieldPlus },
];

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqsRef = collection(db, 'faqs');
        const q = query(faqsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setFaqs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFAQ = (i) => setOpenIndex(openIndex === i ? null : i);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return faqs.filter((f) => {
      const matchCat =
        activeCat === 'all' ||
        (f.category && String(f.category).toLowerCase() === activeCat);
      if (!matchCat) return false;
      if (!s) return true;
      return (
        (f.question || '').toLowerCase().includes(s) ||
        (f.answer || '').toLowerCase().includes(s)
      );
    });
  }, [faqs, search, activeCat]);

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 md:py-28 px-4 sm:px-6 lg:px-8 font-sans"
    >
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#C19B6C]/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* ===== HEADER ===== */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C19B6C] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Need Answers?
          </span>
          <h2 className="mt-5 font-serif text-4xl md:text-6xl font-black tracking-tight text-slate-900">
            Frequently Asked{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] bg-clip-text text-transparent">
                Questions
              </span>
              <span className="absolute inset-x-0 bottom-1 h-3 -z-0 bg-[#C19B6C]/25 rounded-full" />
            </span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Quick answers about our hospital services, admissions, appointments,
            insurance, and visiting policies.
          </p>
        </motion.div>

        {/* ===== SEARCH + CATEGORIES ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <div className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-lg shadow-slate-900/[0.04] backdrop-blur focus-within:border-[#0EA5E9] focus-within:ring-4 focus-within:ring-sky-100 transition-all">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-[#0EA5E9]">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions e.g. appointment, insurance…"
              className="flex-1 bg-transparent px-1 py-2 text-sm md:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(({ key, label, Icon }) => {
              const active = activeCat === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCat(key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    active
                      ? 'border-transparent bg-slate-900 text-white shadow-md shadow-slate-900/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? 'text-[#C19B6C]' : 'text-[#0EA5E9]'}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ===== ACCORDION ===== */}
        <div className="relative z-10 mt-12 grid gap-8 lg:grid-cols-3">
          {/* Accordion column */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 className="h-10 w-10 animate-spin text-[#0EA5E9] mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                  Loading FAQs...
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-6">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-sky-50 text-[#0EA5E9] mb-4">
                  <MessageCircleQuestion className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  No matching questions
                </h3>
                <p className="text-slate-500 font-medium max-w-sm">
                  Try a different keyword or category — or reach out to our support team directly.
                </p>
              </div>
            ) : (
              filtered.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06, duration: 0.45 }}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? 'border-sky-100 bg-white shadow-xl shadow-sky-900/[0.08]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/60'
                    }`}
                  >
                    {/* Left accent bar */}
                    <span
                      className={`absolute left-0 top-0 h-full w-1 rounded-r-full transition-all duration-300 ${
                        isOpen
                          ? 'bg-gradient-to-b from-[#0EA5E9] to-[#0284C7]'
                          : 'bg-transparent group-hover:bg-slate-200'
                      }`}
                    />

                    <button
                      onClick={() => toggleFAQ(index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 md:px-7 text-left focus:outline-none"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`hidden sm:grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-black transition-colors ${
                            isOpen
                              ? 'bg-[#0EA5E9] text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-[#0EA5E9]'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`font-bold md:text-lg leading-snug transition-colors duration-300 ${
                            isOpen ? 'text-slate-900' : 'text-slate-800 group-hover:text-slate-900'
                          }`}
                        >
                          {faq.question}
                        </span>
                      </div>

                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#0EA5E9] text-white rotate-180 shadow-md shadow-sky-500/30'
                            : 'bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-[#0EA5E9]'
                        }`}
                      >
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 md:px-7 pb-6 sm:pl-[4.75rem]">
                            <div className="mb-4 h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
                            <p className="text-sm md:text-base leading-relaxed text-slate-600 font-medium">
                              {faq.answer}
                            </p>
                            {faq.category && (
                              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#C19B6C]" />
                                {faq.category}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Sticky side card */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/[0.04]">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-sky-100 blur-2xl" aria-hidden="true" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0EA5E9]">
                  <HeartPulse className="h-3 w-3" /> Quick help
                </div>
                <h4 className="mt-4 font-serif text-2xl font-black text-slate-900">
                  Talk to a real person
                </h4>
                <p className="mt-2 text-sm text-slate-500 font-medium">
                  Prefer a conversation? Our patient care team responds within minutes, day or night.
                </p>

                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#0EA5E9] ring-1 ring-slate-200">
                      <PhoneCall className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Call 24×7</div>
                      <a href="tel:+916361069736" className="font-bold text-slate-800 hover:text-[#0EA5E9]">
                        +91 63610 69736
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#C19B6C] ring-1 ring-slate-200">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</div>
                      <a href="mailto:contact@saibrindavan.com" className="font-bold text-slate-800 hover:text-[#0EA5E9] break-all">
                        contact@saibrindavan.com
                      </a>
                    </div>
                  </li>
                </ul>

                <a
                  href="#book"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 transition-transform"
                >
                  Book Appointment <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* ===== BIG CTA ===== */}
        <motion.div
          className="relative mt-14 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 h-72 w-72 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#0EA5E9] blur-[100px] opacity-30" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 h-72 w-72 translate-y-1/3 -translate-x-1/3 rounded-full bg-[#C19B6C] blur-[100px] opacity-25" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            aria-hidden="true"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
              backgroundSize: '22px 22px',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
                <MessageCircleQuestion className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live now
                </span>
                <h4 className="mt-2 font-serif text-xl md:text-3xl font-bold text-white">
                  Still have questions?
                </h4>
                <p className="mt-1 text-sm md:text-base text-slate-300 font-medium max-w-md">
                  Our support team is here to help you 24/7 — no menus, no waiting on hold.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col sm:flex-row md:w-auto items-stretch gap-3">
              <a
                href="tel:+916361069736"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-sky-900/50 hover:-translate-y-0.5 transition-transform whitespace-nowrap"
              >
                <PhoneCall className="h-4 w-4" /> Contact Support
              </a>
              <a
                href="mailto:contact@saibrindavan.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                <Mail className="h-4 w-4" /> Email Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
