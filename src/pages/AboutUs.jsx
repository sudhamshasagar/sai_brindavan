import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Heart, 
  Activity, 
  ShieldCheck, 
  Users, 
  Star,
  Stethoscope,
  Baby,
  Microscope,
  HandHeart,
  Wallet,
  Sofa
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

const AboutUs = () => {
  return (
    <section id="about" className="w-full bg-slate-50/50 py-20 md:py-32 font-sans overflow-hidden text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================== */}
        {/* HEADER SECTION                             */}
        {/* ========================================== */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="flex justify-center items-center gap-3 mb-6">
            <span className="w-8 h-px bg-[#C19B6C]"></span>
            <span className="text-[#C19B6C] font-bold uppercase tracking-widest text-xs md:text-sm">
              Trusted Healthcare Since 2008
            </span>
            <span className="w-8 h-px bg-[#C19B6C]"></span>
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 leading-tight mb-4">
            Compassionate Care for <br className="hidden md:block" />
            <span className="font-bold text-[#1f9b90]">Every Generation</span>
          </motion.h2>
          
          <motion.h3 variants={fadeUp} className="text-xl md:text-2xl text-slate-700 font-medium mb-6">
            Where Advanced Medicine Meets Human Touch
          </motion.h3>
        </motion.div>

        {/* ========================================== */}
        {/* MAIN SPLIT LAYOUT                          */}
        {/* ========================================== */}
        {/* ========================================== */}
        {/* MAIN SPLIT LAYOUT                          */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left Side: Hero Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-300/50 group w-full aspect-[4/3] lg:aspect-square xl:aspect-[4/5] bg-slate-100 ring-1 ring-slate-200"
          >
            <img 
              src={process.env.PUBLIC_URL + "/about.png"} 
              alt="Sai Brindavan Hospital Exterior" 
              className="w-full h-full object-fit object-center transition-transform duration-1000 group-hover:scale-105"
            />
          </motion.div>

          {/* Right Side: Storytelling Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center text-center lg:text-left"
          >
            <motion.p 
              variants={fadeUp} 
              className="text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              At Sai Brindavan Hospital, we blend state-of-the-art medical technology with unwavering empathy. As a premier destination for women, children, and family healthcare, we are dedicated to providing a nurturing environment where clinical excellence and compassionate healing go hand in hand.
            </motion.p>
          </motion.div>
          
        </div>

        {/* ========================================== */}
        {/* STATISTICS SECTION                         */}
        {/* ========================================== */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            { num: "24/7", label: "Emergency Care", icon: Activity },
            { num: "100%", label: "Patient Focus", icon: Heart }
          ].map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeUp}
              className="bg-[#2b4c7e] border border-slate-100 rounded-[1.5rem] p-6 text-center shadow-lg shadow-slate-200/40 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-14 h-14 mx-auto bg-white rounded-2xl flex items-center justify-center mb-5 text-[#1f9b90] ring-1 ring-sky-100">
                <stat.icon className="w-7 h-7" />
              </div>
              <h4 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">{stat.num}</h4>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ========================================== */}
        {/* CORE VALUES SECTION                        */}
        {/* ========================================== */}
        <div className="mb-24">
          <div className="text-center mb-12 lg:mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Core Pillars</h3>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">The foundational principles that guide every interaction, diagnosis, and treatment plan within our walls.</p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { title: "Clinical Excellence", desc: "Evidence-based medicine by top-tier specialists.", icon: Stethoscope },
              { title: "Advanced Technology", desc: "Cutting-edge diagnostic and surgical tools.", icon: Activity },
              { title: "Compassionate Care", desc: "Empathy and kindness in every interaction.", icon: HandHeart },
              { title: "Patient Safety", desc: "Strict protocols ensuring a secure environment.", icon: ShieldCheck },
              { title: "Family-Centered", desc: "Involving loved ones in the healing process.", icon: Users },
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                variants={fadeUp}
                className="bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-sky-900/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#C19B6C]/10 group-hover:text-[#C19B6C] group-hover:border-[#C19B6C]/20 text-[#0EA5E9] transition-all duration-300">
                  <value.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">{value.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ========================================== */}
        {/* WHY FAMILIES CHOOSE US GRID                */}
        {/* ========================================== */}
        <motion.div 
          className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 lg:p-20 text-white relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Background Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C19B6C] rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 text-center mb-14">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Why Families Choose Us</h3>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Providing a seamless, comfortable, and highly effective healthcare experience from the moment you walk through our doors.</p>
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { label: "Expert Doctors", icon: Stethoscope },
              { label: "Advanced NICU & PICU", icon: Baby },
              { label: "Modern Diagnostics", icon: Microscope },
              { label: "Personalized Treatment", icon: HandHeart },
              { label: "Affordable Care", icon: Wallet },
              { label: "Comfortable Environment", icon: Sofa },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center justify-start group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center mb-5 group-hover:bg-[#0EA5E9] group-hover:border-[#0EA5E9] group-hover:shadow-lg group-hover:shadow-[#0EA5E9]/50 group-hover:-translate-y-2 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-white/90 group-hover:text-white" />
                </div>
                <h5 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors tracking-wide">{feature.label}</h5>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutUs;