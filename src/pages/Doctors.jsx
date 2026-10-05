import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  GraduationCap,
  Briefcase,
  X,
  User,
  Sparkles,
  Phone,
  Languages,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  FileText,
  Award,
  ShieldCheck,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

// =====================================================
// IN-MEMORY CACHE (Zero duplicate Firestore reads)
// =====================================================
let doctorsCache = null;
let doctorsFetchPromise = null;

const HospitalDoctors = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const [activeDoctor, setActiveDoctor] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorIdFromUrl = searchParams.get("doctor");

  // ---------------------------------------------------
  // 1. FETCH DOCTORS (Cached in memory)
  // ---------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const loadDoctors = async () => {
      try {
        if (doctorsCache) {
          if (!cancelled) {
            setDoctorsList(doctorsCache);
            setLoading(false);
          }
          return;
        }

        if (!doctorsFetchPromise) {
          const q = query(
            collection(db, "doctors"),
            where("status", "==", "active")
          );

          doctorsFetchPromise = getDocs(q)
            .then((snap) => {
              const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
              doctorsCache = data;
              return data;
            })
            .catch((err) => {
              doctorsFetchPromise = null;
              throw err;
            });
        }

        const data = await doctorsFetchPromise;
        if (!cancelled) {
          setDoctorsList(data);
        }
      } catch (err) {
        console.error("Error loading doctors:", err);
        if (!cancelled) setDoctorsList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDoctors();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync URL doctor param with active doctor state
  useEffect(() => {
    if (loading) return;
    if (doctorIdFromUrl) {
      const match = doctorsList.find((d) => d.id === doctorIdFromUrl);
      setActiveDoctor(match || null);
    } else {
      setActiveDoctor(null);
    }
  }, [doctorIdFromUrl, doctorsList, loading]);

  // Lock body scroll only when modal is open
  useEffect(() => {
    document.body.style.overflow = activeDoctor ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDoctor]);

  const handleOpenDoctor = (doctor) => {
    setActiveDoctor(doctor);
    setSearchParams({ doctor: doctor.id });
  };

  const handleCloseDoctor = useCallback(() => {
    setActiveDoctor(null);
    setSearchParams({});
  }, [setSearchParams]);

  // Unique Departments
  const departments = useMemo(() => {
    const list = [
      ...new Set(
        doctorsList
          .map((d) => d.department || d.specialty)
          .filter(Boolean)
      ),
    ].sort();
    return ["all", ...list];
  }, [doctorsList]);

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return doctorsList.filter((doc) => {
      const matchName = doc.name?.toLowerCase().includes(q);
      const docDept = doc.department || doc.specialty || "";
      const matchDept = selectedDept === "all" || docDept === selectedDept;
      return matchName && matchDept;
    });
  }, [doctorsList, searchQuery, selectedDept]);

  return (
    <section id="doctors" className="w-full bg-[#f8fafc] py-14 sm:py-20 lg:py-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================
            HEADER & SEARCH BAR
        =================================================== */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1a365d] sm:text-4xl">
            Our Specialist Panel
          </h2>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Consult experienced doctors and surgeons across our clinical specialties.
          </p>

          {/* Search Input */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1f9b90] focus:outline-none focus:ring-1 focus:ring-[#1f9b90]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Department Filter Pills */}
          <div className="mt-5 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={[
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all capitalize",
                    isSelected
                      ? "bg-[#1a365d] text-white shadow-xs font-semibold"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900",
                  ].join(" ")}
                >
                  {dept === "all" ? "All Departments" : dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            DOCTORS CARD GRID
        =================================================== */}
        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse"
              />
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <User className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-2 text-base font-bold text-slate-800">
              No doctors found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search query or department filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("all");
              }}
              className="mt-3 text-xs font-semibold text-[#1f9b90] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doc) => {
              const dept = doc.department || doc.specialty || "General Specialist";
              const qualifications = Array.isArray(doc.qualifications)
                ? doc.qualifications.map((q) => q.degree).filter(Boolean).join(", ")
                : "";

              return (
                <div
                  key={doc.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Avatar + Department Accreditation Stamp */}
                    <div className="flex items-start gap-4">
                      {/* Doctor Photo */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-xs">
                        {doc.photoURL ? (
                          <img
                            src={doc.photoURL}
                            alt={doc.name}
                            className="h-full w-full object-cover object-top"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <User className="h-10 w-10 text-slate-300 m-auto mt-5" />
                        )}
                      </div>

                      {/* Header Stamp Badge & Title */}
                      <div className="min-w-0 flex-1">
                        {/* Clinical Department Badge */}
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200/80 bg-teal-50/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1f9b90]">
                          <ShieldCheck className="h-3 w-3 shrink-0" />
                          <span className="leading-none">{dept}</span>
                        </div>

                        {/* Complete Full Name (No truncation) */}
                        <h3 className="mt-2 text-lg font-extrabold text-[#1a365d] leading-snug break-words">
                          {doc.name}
                        </h3>

                        {/* Designation / Role */}
                        <p className="mt-0.5 text-xs font-semibold text-slate-500 break-words">
                          {doc.designation || "Senior Consultant"}
                        </p>
                      </div>
                    </div>

                    {/* Qualifications & Clinical Details */}
                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-3.5 text-xs text-slate-600">
                      {qualifications && (
                        <div className="flex items-start gap-2.5">
                          <GraduationCap className="h-4 w-4 shrink-0 text-[#1f9b90] mt-0.5" />
                          <span className="font-medium text-slate-700 leading-relaxed break-words">
                            {qualifications}
                          </span>
                        </div>
                      )}

                      {doc.experienceYears && (
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="h-4 w-4 shrink-0 text-[#1f9b90]" />
                          <span className="font-medium text-slate-700">
                            {doc.experienceYears} Years Clinical Experience
                          </span>
                        </div>
                      )}

                      {Array.isArray(doc.languages) && doc.languages.length > 0 && (
                        <div className="flex items-center gap-2.5">
                          <Languages className="h-4 w-4 shrink-0 text-[#1f9b90]" />
                          <span className="text-slate-600">
                            Speaks: {doc.languages.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => handleOpenDoctor(doc)}
                      className="rounded-xl border border-slate-200 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                    >
                      Profile
                    </button>

                    <Link
                      to="/availability"
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1a365d] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#122846] transition shadow-2xs"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Timings</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ===================================================
          DOCTOR PROFILE MODAL (Full Credentials)
      =================================================== */}
      {activeDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={handleCloseDoctor}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-6 bg-slate-50/70">
              <div className="flex items-center gap-4 min-w-0 pr-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {activeDoctor.photoURL ? (
                    <img
                      src={activeDoctor.photoURL}
                      alt={activeDoctor.name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <User className="h-8 w-8 text-slate-300 m-auto mt-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="inline-block rounded-md bg-teal-50 border border-teal-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1f9b90]">
                    {activeDoctor.department || activeDoctor.specialty}
                  </span>
                  <h3 className="mt-1 text-xl font-extrabold text-[#1a365d] break-words">
                    {activeDoctor.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {activeDoctor.designation || "Consultant"}
                    {activeDoctor.experienceYears && ` · ${activeDoctor.experienceYears} Years Exp.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDoctor}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm">
              
              {/* Professional Summary */}
              {activeDoctor.summary && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[11px]">
                    About Doctor
                  </h4>
                  <p className="mt-1.5 leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {activeDoctor.summary}
                  </p>
                </div>
              )}

              {/* Specializations / Expertise */}
              {Array.isArray(activeDoctor.expertise) && activeDoctor.expertise.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[11px] mb-2">
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDoctor.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-teal-50 border border-teal-100 px-2.5 py-1 text-xs font-medium text-[#1a365d]"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Qualifications */}
              {Array.isArray(activeDoctor.qualifications) && activeDoctor.qualifications.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[11px] mb-2">
                    Qualifications & Medical Degrees
                  </h4>
                  <div className="space-y-1.5">
                    {activeDoctor.qualifications.map((q, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 p-3 bg-white">
                        <span className="font-bold text-slate-800">{q.degree}</span>
                        {q.institution && <span className="text-slate-500"> — {q.institution}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Timings */}
              {Array.isArray(activeDoctor.availability) && activeDoctor.availability.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[11px] mb-2">
                    OPD Consultation Timings
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {activeDoctor.availability.map((slot, idx) => (
                      <div key={idx} className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-800">{slot.day}</span>
                        <span className="text-slate-500 font-medium">
                          {slot.startTime || "8:00 AM"} - {slot.endTime || "2:00 PM"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 bg-slate-50/80 p-4 sm:p-5 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Reception: +91 63610 69736
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseDoctor}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <Link
                  to="/availability"
                  className="rounded-xl bg-[#1a365d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#122846]"
                >
                  Check Availability
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default HospitalDoctors;