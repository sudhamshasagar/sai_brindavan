import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import DoctorsAdmin from "./DoctorsAdmin";
import FaqAdmin from "./FaqAdmin";
import ServiceAdmin from "./ServiceAdmin"; 
import DoctorAvailabilityAdmin from "./DoctorAvailabilityAdmin"; // Imported the new Availability Admin
import { 
  LayoutDashboard, 
  Stethoscope, 
  MessageSquare, 
  ChevronRight,
  BriefcaseMedical,
  CalendarDays // Added icon for Availability
} from "lucide-react";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "doctors", label: "Doctors Directory", icon: Stethoscope },
    { id: "services", label: "Hospital Services", icon: BriefcaseMedical },
    { id: "availability", label: "Availability & Timetable", icon: CalendarDays }, // Added Availability Tab
    { id: "faq", label: "FAQ Editor", icon: MessageSquare },
  ];

  // The Dashboard/Overview view
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto space-y-6 pb-5">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, Admin</h2>
        <p className="text-slate-500 font-medium mt-1">Select a module below to manage your hospital's public data.</p>
      </div>

      {/* Grid updated to cleanly handle 4 cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* DOCTORS CARD */}
        <button 
          onClick={() => setActiveTab("doctors")}
          className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#2b4c7e]/10 hover:-translate-y-1 transition-all group text-left flex flex-col"
        >
          <div className="w-14 h-14 bg-[#2b4c7e]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2b4c7e] transition-colors">
            <Stethoscope className="w-7 h-7 text-[#2b4c7e] group-hover:text-white" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Doctors</h3>
          <p className="text-slate-500 font-medium mb-8 flex-1 text-sm lg:text-base">Add new specialists, update qualifications, or remove departing staff members.</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 group-hover:bg-[#2b4c7e]/10 rounded-xl text-[#2b4c7e] font-bold text-xs uppercase tracking-widest transition-colors w-max">
            Manage Doctors <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* SERVICES CARD */}
        <button 
          onClick={() => setActiveTab("services")}
          className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#0EA5E9]/10 hover:-translate-y-1 transition-all group text-left flex flex-col"
        >
          <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0EA5E9] transition-colors">
            <BriefcaseMedical className="w-7 h-7 text-[#0EA5E9] group-hover:text-white" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Services</h3>
          <p className="text-slate-500 font-medium mb-8 flex-1 text-sm lg:text-base">Create medical services, assign your existing doctors to them, and toggle visibility.</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 group-hover:bg-sky-50 rounded-xl text-[#0EA5E9] font-bold text-xs uppercase tracking-widest transition-colors w-max">
            Manage Services <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* AVAILABILITY CARD (NEW) */}
        <button 
          onClick={() => setActiveTab("availability")}
          className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all group text-left flex flex-col"
        >
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
            <CalendarDays className="w-7 h-7 text-emerald-500 group-hover:text-white" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">Schedules</h3>
          <p className="text-slate-500 font-medium mb-8 flex-1 text-sm lg:text-base">Manage weekly availability, set working hours, and block times for surgeries (OT) or leaves.</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 group-hover:bg-emerald-50 rounded-xl text-emerald-600 font-bold text-xs uppercase tracking-widest transition-colors w-max">
            Manage Timetable <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* FAQs CARD */}
        <button 
          onClick={() => setActiveTab("faq")}
          className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#C19B6C]/10 hover:-translate-y-1 transition-all group text-left flex flex-col"
        >
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#C19B6C] transition-colors">
            <MessageSquare className="w-7 h-7 text-[#C19B6C] group-hover:text-white" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">FAQs</h3>
          <p className="text-slate-500 font-medium mb-8 flex-1 text-sm lg:text-base">Update patient information, visiting hours, insurance queries, and common hospital inquiries.</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 group-hover:bg-amber-50 rounded-xl text-[#C19B6C] font-bold text-xs uppercase tracking-widest transition-colors w-max">
            Manage FAQs <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        
      </div>
    </div>
  );

  return (
    // 'h-screen' and 'overflow-hidden' lock the outer page from scrolling
    <div className="h-screen w-full bg-slate-50 font-sans flex flex-col overflow-hidden text-slate-800">
      
      {/* 1. FIXED TOP NAVBAR */}
      <div className="shrink-0 z-50">
        <Navbar />
      </div>

      {/* 2. FIXED APP TOOLBAR / SUB-HEADER */}
      <header className="shrink-0 bg-white border-b border-slate-200 z-40 relative shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Centered Segmented Control Navigation */}
          <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto hide-scrollbar w-full sm:w-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap z-10
                    ${isActive ? "text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}
                  `}
                >
                  <tab.icon className={`w-4 h-4 ${isActive ? "text-[#2b4c7e]" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {/* Sliding Background for Active Tab */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-white rounded-xl border border-slate-200/50 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block w-24"></div> {/* Spacer for perfect centering */}
        </div>
      </header>

      {/* 3. SCROLLABLE INNER CONTENT AREA */}
      {/* 'flex-1' takes remaining height, 'overflow-y-auto' enables scrolling ONLY here */}
      <main className="flex-1 w-full overflow-y-auto custom-scrollbar relative bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full"
            >
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "doctors" && <DoctorsAdmin />}
              {activeTab === "services" && <ServiceAdmin />}
              {activeTab === "availability" && <DoctorAvailabilityAdmin />} {/* Added Availability Render */}
              {activeTab === "faq" && <FaqAdmin />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Hide standard scrollbars and stylize the custom inner scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Custom subtle scrollbar for the main content area */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}} />
    </div>
  );
};

export default AdminPortal;