import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  documentId,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Ear,
  Pill,
  Users,
  Stethoscope,
  Activity,
  Search,
  Calendar,
  User,
  ArrowRight,
  X,
  Clock,
  Sparkles,
  PhoneCall,
} from "lucide-react";

// Icon selector
const getServiceIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("cardio") || n.includes("heart")) return Heart;
  if (n.includes("neuro") || n.includes("brain")) return Brain;
  if (n.includes("ortho") || n.includes("bone")) return Bone;
  if (n.includes("paed") || n.includes("ped") || n.includes("child")) return Baby;
  if (n.includes("eye") || n.includes("opthal")) return Eye;
  if (n.includes("ent") || n.includes("ear")) return Ear;
  if (n.includes("pharm") || n.includes("med")) return Pill;
  if (n.includes("gynae") || n.includes("obs") || n.includes("women")) return Users;
  return Stethoscope;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Sidebar state
  const [selectedService, setSelectedService] = useState(null);
  const [serviceDoctors, setServiceDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // In-memory Firestore doctor cache to prevent re-fetching
  const doctorCacheRef = useRef(new Map());

  // 1. Fetch Services once
  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const q = query(
          collection(db, "services"),
          where("isVisible", "==", true),
          orderBy("createdAt", "desc"),
          limit(30)
        );
        const snapshot = await getDocs(q);
        if (isMounted) {
          setServices(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Doctors when sidebar opens
  const handleOpenSidebar = async (service) => {
    setSelectedService(service);

    const doctorIds = service.doctorIds || [];
    if (doctorIds.length === 0) {
      setServiceDoctors([]);
      return;
    }

    // Check what is already in cache
    const cached = [];
    const missing = [];

    for (const id of doctorIds) {
      if (doctorCacheRef.current.has(id)) {
        cached.push(doctorCacheRef.current.get(id));
      } else {
        missing.push(id);
      }
    }

    if (missing.length === 0) {
      setServiceDoctors(cached);
      return;
    }

    setLoadingDoctors(true);

    try {
      // Chunk by 30 for Firestore "in" queries
      const chunks = [];
      for (let i = 0; i < missing.length; i += 30) {
        chunks.push(missing.slice(i, i + 30));
      }

      const snapshots = await Promise.all(
        chunks.map((chunk) =>
          getDocs(query(collection(db, "doctors"), where(documentId(), "in", chunk)))
        )
      );

      const newlyFetched = [];
      snapshots.forEach((snap) => {
        snap.docs.forEach((docSnap) => {
          const docData = { id: docSnap.id, ...docSnap.data() };
          doctorCacheRef.current.set(docSnap.id, docData);
          newlyFetched.push(docData);
        });
      });

      setServiceDoctors([...cached, ...newlyFetched]);
    } catch (err) {
      console.error("Error loading doctors for sidebar:", err);
      setServiceDoctors(cached);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleCloseSidebar = useCallback(() => {
    setSelectedService(null);
    setServiceDoctors([]);
  }, []);

  // Keyboard close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleCloseSidebar();
    };
    if (selectedService) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // lock scroll when drawer is open
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedService, handleCloseSidebar]);

  // Filter services by search term
  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [services, search]);

  const SelectedIcon = selectedService ? getServiceIcon(selectedService.name) : Stethoscope;

  return (
    <section id="services" className="relative w-full bg-[#f8fafc] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================
            1. SECTION HEADER & SEARCH
        =================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1a365d] sm:text-4xl">
              Our Medical Services
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-lg">
              Explore hospital clinical specialties. Select any department to view assigned medical specialists, treatments, and timings.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search specialty..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1f9b90] focus:outline-none focus:ring-1 focus:ring-[#1f9b90]"
            />
          </div>
        </div>

        {/* ===================================================
            2. SERVICES GRID (Never disturbed, clean 3 cols)
        =================================================== */}
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-52 rounded-2xl border border-slate-200 bg-white p-6 animate-pulse"
              />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const Icon = getServiceIcon(service.name);
              const doctorCount = service.doctorIds?.length || 0;
              const isSelected = selectedService?.id === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => handleOpenSidebar(service)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenSidebar(service);
                    }
                  }}
                  className={[
                    "group relative flex flex-col justify-between rounded-2xl border bg-white p-6 text-left shadow-xs transition-all duration-200 cursor-pointer focus:outline-none",
                    isSelected
                      ? "border-[#1f9b90] ring-2 ring-[#1f9b90]/20 shadow-md"
                      : "border-slate-200 hover:-translate-y-1 hover:border-[#1f9b90]/60 hover:shadow-md",
                  ].join(" ")}
                >
                  <div>
                    {/* Top Row: Icon + Doctor Count */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-[#1f9b90] transition-colors group-hover:bg-[#1f9b90] group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-[#1a365d] group-hover:text-white">
                        <Users className="h-3 w-3" />
                        <span>{doctorCount} {doctorCount === 1 ? "Doctor" : "Doctors"}</span>
                      </span>
                    </div>

                    {/* Service Name */}
                    <h3 className="mt-5 text-lg font-bold text-[#1a365d] transition-colors group-hover:text-[#1f9b90]">
                      {service.name}
                    </h3>

                    {/* Brief description */}
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {service.description || "Expert medical consultations, state-of-the-art diagnostics and patient care."}
                    </p>
                  </div>

                  {/* Know More action */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-[#1f9b90]">
                    <span>Know More</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Activity className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-2 text-base font-bold text-slate-800">
              No services match "{search}"
            </h3>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-3 text-xs font-semibold text-[#1f9b90] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

      </div>

      {/* ===================================================
          3. SIDEBAR / SLIDE-OVER SHEET (Right Side Card)
      =================================================== */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={handleCloseSidebar}
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            {/* The Slide-over Card Panel */}
            <div className="relative w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
              
              {/* Top Bar Header */}
              <div className="border-b border-slate-100 bg-[#1a365d] px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
                      <SelectedIcon className="h-6 w-6 text-[#f6ac42]" />
                    </div>
                    <div>
                      <h3 id="slide-over-title" className="text-lg font-bold leading-tight">
                        {selectedService.name}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wider text-teal-300">
                        Department Profile
                      </p>
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={handleCloseSidebar}
                    className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/20 transition focus:outline-none"
                    aria-label="Close sidebar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* About the Service */}
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Activity className="h-3.5 w-3.5 text-[#1f9b90]" />
                    <span>Clinical Scope & Treatments</span>
                  </h4>
                  <p className="mt-2 rounded-xl bg-slate-50 p-4 text-xs sm:text-sm leading-relaxed text-slate-600 border border-slate-100">
                    {selectedService.description ||
                      "Our team provides specialized diagnostic assessments and comprehensive inpatient and outpatient consultations with patient-first precision."}
                  </p>
                </div>

                {/* Assigned Doctors */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <Stethoscope className="h-3.5 w-3.5 text-[#1f9b90]" />
                      <span>Specialist Panel ({serviceDoctors.length})</span>
                    </h4>
                  </div>

                  {loadingDoctors ? (
                    <div className="rounded-xl border border-slate-100 bg-white py-8 text-center">
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-[#1f9b90]" />
                      <p className="mt-2 text-xs text-slate-400">Loading specialist profiles...</p>
                    </div>
                  ) : serviceDoctors.length > 0 ? (
                    <div className="space-y-3">
                      {serviceDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-[#1f9b90]/50 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                              {doc.photoURL ? (
                                <img
                                  src={doc.photoURL}
                                  alt={doc.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs sm:text-sm text-[#1a365d] truncate">
                                {doc.name || "Doctor"}
                              </p>
                              <p className="text-[11px] font-medium text-[#1f9b90] truncate">
                                {doc.specialty || "Specialist"}
                              </p>
                              {doc.experience && (
                                <p className="text-[10px] text-slate-400">
                                  Exp: {doc.experience}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 italic">
                      No doctors currently assigned to this department.
                    </div>
                  )}
                </div>

                {/* Emergency Contact Quick Strip */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1a365d]">Need Immediate Assistance?</p>
                      <p className="text-[11px] text-slate-600">24/7 Sagara Hospital Reception</p>
                    </div>
                    <a
                      href="tel:+916361069736"
                      className="flex items-center gap-1.5 rounded-lg bg-[#1a365d] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#132a48] transition"
                    >
                      <PhoneCall className="h-3 w-3 text-[#f6ac42]" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Bottom Footer Actions */}
              <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Mon – Sat · 8:00 AM – 8:00 PM
                </span>
                <button
                  type="button"
                  onClick={handleCloseSidebar}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                >
                  Close Panel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Services;