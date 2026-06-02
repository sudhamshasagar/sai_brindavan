import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Plus, Minus, MessageCircleQuestion, Loader2, PhoneCall } from 'lucide-react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0); // Default first item open

  // Fetch FAQs from Firebase
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const faqsRef = collection(db, 'faqs');
        // Fetch ordered by creation time
        const q = query(faqsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const faqData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setFaqs(faqData);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* ========================================== */}
        {/* HEADER SECTION                             */}
        {/* ========================================== */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#C19B6C]"></span>
            <span className="text-[#C19B6C] font-bold uppercase tracking-widest text-xs md:text-sm">
              Need Answers?
            </span>
            <span className="w-8 h-px bg-[#C19B6C]"></span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Find quick answers to common questions about our hospital services, admissions, and visiting policies.
          </p>
        </motion.div>

        {/* ========================================== */}
        {/* ACCORDION CONTAINER                        */}
        {/* ========================================== */}
        <div className="space-y-4 relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Loader2 className="w-10 h-10 animate-spin text-[#0EA5E9] mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-6">
              <MessageCircleQuestion className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No FAQs Available Yet</h3>
              <p className="text-slate-500 font-medium">Please check back later for updated information.</p>
            </div>
          ) : (
            faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div 
                  key={faq.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'bg-white border-sky-100 shadow-xl shadow-sky-900/5' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50'
                  }`}
                >
                  {/* Accordion Header / Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-6 py-5 md:px-8 flex items-center justify-between focus:outline-none group"
                  >
                    <span className={`font-bold pr-4 md:text-lg transition-colors duration-300 ${
                      isOpen ? 'text-[#0EA5E9]' : 'text-slate-800 group-hover:text-[#0EA5E9]'
                    }`}>
                      {faq.question}
                    </span>
                    
                    {/* Plus/Minus Icon */}
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen 
                        ? 'bg-[#0EA5E9] text-white rotate-180' 
                        : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-[#0EA5E9] rotate-0'
                    }`}>
                      {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Accordion Content (Framer Motion AnimatePresence) */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6">
                          <div className="h-px w-full bg-slate-100 mb-5"></div>
                          <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* ========================================== */}
        {/* STILL HAVE QUESTIONS CTA                   */}
        {/* ========================================== */}
        <motion.div 
          className="mt-12 bg-slate-900 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C19B6C] rounded-full blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
               <MessageCircleQuestion className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xl md:text-2xl mb-1">Still have questions?</h4>
              <p className="text-sm md:text-base text-slate-400 font-medium">Our support team is here to help you 24/7.</p>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <a 
              href="tel:+916361069736" 
              className="w-full md:w-auto px-8 py-4 bg-[#0EA5E9] hover:bg-sky-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-sky-900/50 hover:-translate-y-1 uppercase tracking-widest text-xs whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" /> Contact Support
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FAQ;