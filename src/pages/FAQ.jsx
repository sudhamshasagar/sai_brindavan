import React, { useState } from 'react';
import { Plus, Minus, MessageCircleQuestion } from 'lucide-react';

// Common hospital FAQs - easily editable
const faqData = [
  {
    id: 1,
    question: "What are the visiting hours for the hospital?",
    answer: "General visiting hours are from 4:00 PM to 7:00 PM daily. However, visiting hours for the ICU and NICU are strictly restricted to immediate family members for short durations to ensure patient safety and infection control."
  },
  {
    id: 2,
    question: "Do I need an appointment for a general consultation?",
    answer: "While walk-ins are welcome for general consultations, we highly recommend booking an appointment in advance to minimize your wait time. Emergency cases are prioritized and attended to immediately 24/7."
  },
  {
    id: 3,
    question: "Which health insurance providers do you accept?",
    answer: "Sai Brindavan Hospital is empaneled with all major health insurance providers and TPAs. Please bring your insurance card and a valid ID to the billing desk prior to admission for a smooth cashless process."
  },
  {
    id: 4,
    question: "What should I bring for my admission?",
    answer: "Please bring your doctor's admission note, past medical records, a list of current medications, valid photo ID, insurance details, and comfortable personal clothing. Avoid bringing valuables or large amounts of cash."
  },
  {
    id: 5,
    question: "Is there a pharmacy available inside the hospital?",
    answer: "Yes, our hospital features a fully stocked, 24/7 in-house pharmacy. It provides all necessary prescription medications, surgical supplies, and over-the-counter health products for both inpatients and outpatients."
  }
];

const FAQ = () => {
  // State to track which accordion item is currently open
  const [openIndex, setOpenIndex] = useState(0); // Default to the first one being open

  const toggleFAQ = (index) => {
    // If clicking the one that is already open, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-[#faf8f1] py-24 px-6 font-sans border-t border-stone-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Clean Header */}
        <div className="text-center mb-16">
          <h4 className="text-[#f6ac42] font-black uppercase tracking-widest text-sm mb-3 flex items-center justify-center gap-2">
             <span className="w-6 h-1 bg-[#f6ac42] rounded-full"></span>
             Need Answers?
             <span className="w-6 h-1 bg-[#f6ac42] rounded-full"></span>
          </h4>
          <h2 className="text-4xl md:text-5xl font-black text-[#2b4c7e] tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
            Find quick answers to common questions about our hospital services, admissions, and visiting policies.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={faq.id} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-white border-[#1f9b90]/30 shadow-[0_10px_30px_rgb(31,155,144,0.08)]' 
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Accordion Header / Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 md:px-8 flex items-center justify-between focus:outline-none group"
                >
                  <span className={`font-bold pr-4 md:text-lg transition-colors duration-300 ${
                    isOpen ? 'text-[#1f9b90]' : 'text-[#2b4c7e] group-hover:text-[#1f9b90]'
                  }`}>
                    {faq.question}
                  </span>
                  
                  {/* Plus/Minus Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isOpen ? 'bg-[#1f9b90] text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-[#1f9b90]/10 group-hover:text-[#1f9b90]'
                  }`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                {/* Accordion Content (Smooth expansion using CSS Grid) */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 md:px-8 pb-6 text-stone-600 leading-relaxed font-medium text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 text-center bg-white border border-stone-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-[#1f9b90]/10 rounded-full flex items-center justify-center shrink-0">
               <MessageCircleQuestion className="w-6 h-6 text-[#1f9b90]" />
            </div>
            <div>
              <h4 className="font-black text-[#2b4c7e] text-lg">Still have questions?</h4>
              <p className="text-sm text-stone-500 font-medium">Can't find the answer you're looking for?</p>
            </div>
          </div>
          <button className="px-8 py-3.5 bg-white border-2 border-[#2b4c7e] hover:bg-[#2b4c7e] hover:text-white text-[#2b4c7e] rounded-xl font-bold transition-colors whitespace-nowrap">
            Contact Support
          </button>
        </div>

      </div>
    </section>
  );
};

export default FAQ;