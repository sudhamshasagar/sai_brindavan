import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import DoctorsAdmin from "./DoctorsAdmin";
import FaqAdmin from "./FaqAdmin";
import ServiceAdmin from "./ServiceAdmin";
import BlogAdmin from "./BlogAdmin";
import DoctorAvailabilityAdmin from "./DoctorAvailabilityAdmin";
import {
  LayoutDashboard,
  Stethoscope,
  MessageSquare,
  ChevronRight,
  BriefcaseMedical,
  CalendarDays,
  FileText,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// =====================================================
// MODULE CONFIGURATION
// =====================================================
const ADMIN_MODULES = [
  {
    id: "doctors",
    label: "Doctors Directory",
    shortLabel: "Doctors",
    icon: Stethoscope,
    badge: "Clinical Panel",
    color: "#1a365d",
    bgColor: "bg-[#1a365d]/10",
    textColor: "text-[#1a365d]",
    description:
      "Manage consultant profiles, academic qualifications, clinical expertise, and active public directory status.",
  },
  {
    id: "services",
    label: "Hospital Services",
    shortLabel: "Services",
    icon: BriefcaseMedical,
    badge: "Departments",
    color: "#1f9b90",
    bgColor: "bg-[#1f9b90]/10",
    textColor: "text-[#1f9b90]",
    description:
      "Publish clinical departments, describe diagnostic facilities, and assign qualified specialists to care units.",
  },
  {
    id: "availability",
    label: "OPD Schedules",
    shortLabel: "Schedules",
    icon: CalendarDays,
    badge: "Timetable",
    color: "#1f9b90",
    bgColor: "bg-[#1f9b90]/10",
    textColor: "text-[#1f9b90]",
    description:
      "Configure weekly consultation timings, visiting hours, doctor shifts, and mark blocked leaves or OT surgeries.",
  },
  {
    id: "blogs",
    label: "Health Articles",
    shortLabel: "Blogs",
    icon: FileText,
    badge: "Education",
    color: "#f6ac42",
    bgColor: "bg-[#f6ac42]/10",
    textColor: "text-[#c28224]",
    description:
      "Publish patient health guides, seasonal wellness tips, hospital achievements, and preventive medical news.",
  },
  {
    id: "faq",
    label: "FAQ Knowledge Base",
    shortLabel: "FAQs",
    icon: MessageSquare,
    badge: "Patient Care",
    color: "#1a365d",
    bgColor: "bg-[#1a365d]/10",
    textColor: "text-[#1a365d]",
    description:
      "Manage answers for common hospital inquiries, cashless insurance (TPA) processing, and visitor policies.",
  },
];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    ...ADMIN_MODULES.map((m) => ({
      id: m.id,
      label: m.shortLabel,
      icon: m.icon,
    })),
  ];

  // ---------------------------------------------------
  // DASHBOARD VIEW
  // ---------------------------------------------------
  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      <div className="shrink-0 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-xs max-w-xs">
          <p className="font-bold text-[#1a365d] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#f6ac42]" />
            Live Synchronization
          </p>
          <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">
            Changes made in this console immediately reflect on public web pages and patient booking directories.
          </p>
        </div>

      {/* Module Navigation Grid (Non-repetitive, dynamically rendered) */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Administrative Modules ({ADMIN_MODULES.length})
          </h3>
          <span className="text-xs text-slate-400">Select a section to manage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {ADMIN_MODULES.map((mod) => {
            const Icon = mod.icon;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveTab(mod.id)}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 text-left shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#1f9b90]/60 hover:shadow-lg hover:shadow-slate-200/60 focus:outline-none focus:ring-2 focus:ring-[#1f9b90]"
              >
                <div>
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${mod.bgColor} ${mod.textColor} transition-colors group-hover:bg-[#1a365d] group-hover:text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="mt-5 text-lg font-bold text-[#1a365d] transition-colors group-hover:text-[#1f9b90]">
                    {mod.label}
                  </h4>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                {/* Bottom Action Pill */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs font-bold text-[#1a365d] group-hover:text-[#1f9b90] transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span>Open Module</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1f9b90] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    // True 100% viewport container (using modern 'h-dvh' fallback to 'h-screen')
    <div className="h-screen h-dvh w-full bg-[#f8fafc] font-sans flex flex-col overflow-hidden text-slate-800 antialiased">
      
      {/* 1. TOP MAIN BRAND NAVBAR */}
      <div className="shrink-0 z-50">
        <Navbar />
      </div>

      {/* 2. ADMIN SEGMENTED NAVIGATION BAR */}
      <header className="shrink-0 bg-white border-b border-slate-200/90 z-40 relative shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Module Indicator / Title */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Workspace
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-[#1a365d] capitalize">
              {tabs.find((t) => t.id === activeTab)?.label || "Overview"}
            </span>
          </div>

          {/* Segmented Control Pill Bar */}
          <nav
            aria-label="Admin Sections"
            className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none w-full md:w-auto"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "relative flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap z-10 focus:outline-none",
                    isActive
                      ? "text-[#1a365d]"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50",
                  ].join(" ")}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? "text-[#1f9b90]" : "text-slate-400"
                    }`}
                  />
                  <span>{tab.label}</span>

                  {/* Sliding Animated Active Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminTab"
                      className="absolute inset-0 bg-white rounded-xl border border-slate-200/60 shadow-xs -z-10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Quick Exit to Dashboard */}
          <div className="hidden lg:flex items-center gap-2">
            {activeTab !== "dashboard" && (
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className="text-xs font-semibold text-[#1f9b90] hover:underline flex items-center gap-1"
              >
                <span>Back to Overview</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. FLUID FULL-HEIGHT SCROLLABLE WORKSPACE */}
      <main className="flex-1 w-full overflow-y-auto relative bg-[#f8fafc] custom-admin-scroll">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full h-full"
            >
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "doctors" && <DoctorsAdmin />}
              {activeTab === "services" && <ServiceAdmin />}
              {activeTab === "availability" && <DoctorAvailabilityAdmin />}
              {activeTab === "blogs" && <BlogAdmin />}
              {activeTab === "faq" && <FaqAdmin />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Subtle modern scrollbar styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-none {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .custom-admin-scroll::-webkit-scrollbar {
              width: 6px;
            }
            .custom-admin-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-admin-scroll::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 9999px;
            }
            .custom-admin-scroll::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `,
        }}
      />
    </div>
  );
};

export default AdminPortal;