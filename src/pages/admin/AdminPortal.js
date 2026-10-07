import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import DoctorsAdmin from "./DoctorsAdmin";
import FaqAdmin from "./FaqAdmin";
import ServiceAdmin from "./ServiceAdmin";
import BlogAdmin from "./BlogAdmin";
import DoctorAvailabilityAdmin from "./DoctorAvailabilityAdmin";
import {
  LayoutDashboard,
  Stethoscope,
  MessageSquare,
  Loader2,
  LogOut,
  BriefcaseMedical,
  CalendarDays,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
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
      "Manage consultant profiles, qualifications, clinical expertise, and active status.",
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
      "Publish clinical departments, describe facilities, and assign specialists.",
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
      "Configure weekly consultation hours, shifts, and block leaves or OT surgeries.",
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
      "Publish patient health guides, wellness tips, and hospital medical news.",
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
      "Manage answers for common hospital inquiries, cashless insurance, and visiting rules.",
  },
];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Admin logout error:", error);
      alert("Unable to sign out. Please try again.");
      setLoggingOut(false);
    }
  };

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
    <div className="max-w-6xl mx-auto space-y-5 pb-6">
      
      {/* Compact Welcome & Sync Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1f9b90]">
            <ShieldCheck className="h-3 w-3" />
            <span>Administration Console</span>
          </div>

          <h2 className="mt-1.5 text-lg sm:text-xl font-extrabold text-[#1a365d] tracking-tight truncate">
            Hospital Operations Workspace
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Select a module below to update clinical records, doctor hours, or patient guides.
          </p>
        </div>

        {/* Live sync badge */}
        <div className="shrink-0 flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#f6ac42] shrink-0" />
          <div className="text-[11px] leading-tight text-slate-600">
            <span className="font-bold text-[#1a365d]">Live Sync: </span>
            <span>Updates publish instantly to public site</span>
          </div>
        </div>
      </div>

      {/* Module Grid (Compact Cards) */}
      <div>
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Management Modules ({ADMIN_MODULES.length})
          </span>
          <span className="text-[11px] text-slate-400">Click card to manage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {ADMIN_MODULES.map((mod) => {
            const Icon = mod.icon;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveTab(mod.id)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1f9b90]/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1f9b90]"
              >
                <div>
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${mod.bgColor} ${mod.textColor} transition-colors group-hover:bg-[#1a365d] group-hover:text-white`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="mt-3 text-sm sm:text-base font-bold text-[#1a365d] transition-colors group-hover:text-[#1f9b90]">
                    {mod.label}
                  </h4>

                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                {/* Bottom Action Pill */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-bold text-[#1a365d] group-hover:text-[#1f9b90] transition-colors">
                  <span className="flex items-center gap-1">
                    <span>Manage</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
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
    // True 100% viewport container without outer page scrollbars
    <div className="h-screen h-dvh w-full bg-[#f8fafc] font-sans flex flex-col overflow-hidden text-slate-800 antialiased">
      
      {/* =====================================================
          1. COMPACT FIXED TOP NAVBAR (56px)
      ===================================================== */}
      <header className="shrink-0 border-b border-slate-200/90 bg-white z-50 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center justify-between gap-3">

            {/* BRAND OR BACK BUTTON */}
            <div className="flex items-center gap-2.5 min-w-0">
              {activeTab !== "dashboard" ? (
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-bold text-[#1a365d] hover:bg-white hover:border-[#1f9b90] hover:text-[#1f9b90] transition-colors shadow-2xs"
                  title="Back to Overview Dashboard"
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Overview</span>
                </button>
              ) : null}

              {/* Hospital Logo & Brand Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 p-1 shadow-2xs">
                  <img
                    src="/logo.jpg"
                    alt="Sai Brindavan"
                    className="h-full w-full rounded-md object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="min-w-0 hidden sm:block">
                  <p className="truncate text-xs sm:text-sm font-black tracking-tight text-[#1a365d] leading-none">
                    Sai Brindavan
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#1f9b90] mt-0.5">
                    Admin Portal
                  </p>
                </div>
              </div>
            </div>

            {/* CENTER: DESKTOP TAB NAVIGATION PILLS */}
            <nav
              aria-label="Admin Navigation Tabs"
              className="hidden lg:flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/70"
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
                      "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none",
                      isActive
                        ? "text-[#1a365d]"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50",
                    ].join(" ")}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                        isActive ? "text-[#1f9b90]" : "text-slate-400"
                      }`}
                    />
                    <span>{tab.label}</span>

                    {/* Animated Sliding Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="compactAdminTab"
                        className="absolute inset-0 bg-white rounded-lg border border-slate-200/60 shadow-2xs -z-10"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* LOGOUT BUTTON */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-600 shadow-2xs transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                ) : (
                  <LogOut className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {loggingOut ? "Signing out..." : "Logout"}
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          2. MOBILE HORIZONTAL NAVIGATION RAIL (< lg screens)
      ===================================================== */}
      <div className="lg:hidden shrink-0 bg-white border-b border-slate-200/80 px-2 py-1.5 overflow-x-auto scrollbar-none z-40">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-[#1a365d] text-white font-bold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100",
                ].join(" ")}
              >
                <Icon className={`h-3 w-3 ${isActive ? "text-[#f6ac42]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          3. MAIN SCROLLABLE CONTENT VIEWPORT
      ===================================================== */}
      <main className="flex-1 w-full overflow-y-auto relative bg-[#f8fafc] custom-portal-scroll">
        <div className="max-w-[1600px] mx-auto p-3 sm:p-5 lg:p-6 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
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

      {/* Micro scrollbar styling */}
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
            .custom-portal-scroll::-webkit-scrollbar {
              width: 5px;
            }
            .custom-portal-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-portal-scroll::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 9999px;
            }
            .custom-portal-scroll::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `,
        }}
      />
    </div>
  );
};

export default AdminPortal;