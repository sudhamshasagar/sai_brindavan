import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Phone, ArrowLeft, X,
  CheckCircle2, Star, Clock, GraduationCap, 
  Briefcase, FileText, BookOpen, Award, Languages, ExternalLink, Calendar,ChevronRight
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 

const HospitalDoctors = () => {
  // --- State Management ---
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  
  // Profile View State
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctorsList(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Scroll Lock ---
  useEffect(() => {
    if (selectedDoctor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedDoctor]);

  // --- Handlers ---
  const handleViewProfile = (doctor) => setSelectedDoctor(doctor);
  const handleCloseProfile = () => setSelectedDoctor(null);
  
  const handleBookAppointment = (doctorName) => {
    alert(`Initiating secure booking for ${doctorName}`);
  };

  // --- Filtering ---
  const uniqueDepartments = [...new Set(doctorsList.map(d => d.department).filter(Boolean))];
  const filteredDoctors = doctorsList.filter(doc => {
    const matchName = doc.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDept ? doc.department === filterDept : true;
    const matchStatus = doc.status === 'active'; 
    return matchName && matchDept && matchStatus;
  });

  // --- Helpers ---
  const hasValidData = (arr, key) => arr && arr.length > 0 && arr[0][key] && arr[0][key].trim() !== "";
  const hasValidStrings = (arr) => arr && arr.length > 0 && arr[0].trim() !== "";

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-24 selection:bg-[#c19b6c] selection:text-white relative">
      
      {/* ========================================== */}
      {/* 1. HERO & SEARCH SECTION                     */}
      {/* ========================================== */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c19b6c]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <span className="inline-block text-[#2b4c7e] font-bold uppercase tracking-widest text-[10px] mb-4 border border-[#c19b6c]/20 px-3 py-1 rounded-full bg-[#c19b6c]/5">
            Our Medical Experts
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Find Your <span className="text-[#1f9b90]">Specialist</span>
          </h1>
          <p className="text-slate-500 font-medium mb-10 max-w-2xl mx-auto text-base">
            Book appointments with world-class doctors dedicated to providing exceptional, personalized healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#c19b6c] focus-within:ring-1 focus-within:ring-[#c19b6c] transition-all">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doctor by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 outline-none text-slate-800 font-medium text-sm"
              />
            </div>
            <div className="relative w-full sm:w-64 bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#c19b6c] focus-within:ring-1 focus-within:ring-[#c19b6c] transition-all">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select 
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 outline-none text-slate-800 font-medium text-sm appearance-none bg-transparent cursor-pointer"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. SPACIOUS, PREMIUM DIRECTORY GRID          */}
      {/* ========================================== */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#c19b6c] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Directory...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Specialists Found</h3>
            <p className="text-slate-500 font-medium">Please try a different name or department.</p>
          </div>
        ) : (
          /* Changed to a spacious 3-column grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:border-[#c19b6c]/30 transition-all duration-300 flex flex-col relative group">
                
                {/* Header Block with Background Accent */}
                <div className="h-20 bg-[#1f9b90] border-b border-slate-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-[#c19b6c]/5 opacity-50"></div>
                  
                  {/* Featured Badge */}
                  {doctor.featured && (
                    <div className="absolute top-4 right-4 bg-[#c19b6c] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </div>
                  )}

                  {/* Large Overlapping Avatar */}
                  <div className="absolute -bottom-12 left-6 w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white z-10">
                    <img 
                      src={doctor.photoURL || "https://via.placeholder.com/300?text=Profile"} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Profile"; }}
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-16 px-6 pb-6 flex-1 flex flex-col">
                  
                  {/* Identity */}
                  <div className="mb-5">
                    <span className="text-[#1f9b90] text-[10px] font-black uppercase tracking-widest text-centre px-2.5 py-1 rounded-md block w-fit mb-2 truncate">
                      {doctor.department}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight truncate">{doctor.name}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1 truncate">{doctor.designation}</p>
                  </div>

                  {/* Credentials */}
                  <div className="space-y-3 mb-6">
                    {hasValidData(doctor.qualifications, 'degree') && (
                      <div className="flex items-start gap-2.5 text-slate-700">
                        <GraduationCap className="w-4 h-4 text-[#c19b6c] shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-snug line-clamp-2">
                          {doctor.qualifications.map(q => q.degree).join(', ')}
                        </p>
                      </div>
                    )}
                    {doctor.experienceYears && (
                      <div className="flex items-start gap-2.5 text-slate-700">
                        <Briefcase className="w-4 h-4 text-[#c19b6c] shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-snug">
                          {doctor.experienceYears} Experience
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Core Expertise Section */}
                  {hasValidStrings(doctor.expertise) && (
                    <div className="mt-auto pt-5 border-t border-slate-100 mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Top Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.expertise.slice(0, 3).map((exp, i) => (
                          <span key={i} className="bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button 
                      onClick={() => handleViewProfile(doctor)}
                      className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:border-[#c19b6c] hover:text-[#c19b6c] rounded-xl text-xs font-bold uppercase tracking-widest transition-colors text-center"
                    >
                      Profile
                    </button>
                    <button 
                      onClick={() => handleBookAppointment(doctor.name)}
                      className="w-full py-3.5 bg-slate-900 hover:bg-[#c19b6c] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-md hover:shadow-lg text-center"
                    >
                      Book Visit
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* 3. PROFILE OVERLAY (FULL SCREEN MODAL)       */}
      {/* ========================================== */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 lg:p-8">
          
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleCloseProfile}></div>

          <div className="relative w-full max-w-[1000px] h-full sm:h-[95vh] bg-white sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-[fadeSlideUp_0.3s_ease-out_forwards]">
            
            {/* Sticky Header with embedded Booking Button */}
            <div className="bg-white border-b border-slate-100 px-4 sm:px-8 py-4 flex justify-between items-center z-30 shrink-0">
              <button 
                onClick={handleCloseProfile} 
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Directory</span>
              </button>
              
              <button 
                onClick={() => handleBookAppointment(selectedDoctor.name)}
                className="px-5 sm:px-8 py-2.5 bg-[#c19b6c] hover:bg-[#a37e50] text-white rounded-lg text-xs font-black uppercase tracking-widest transition-colors shadow-[0_4px_14px_rgba(193,155,108,0.3)] flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" /> Book <span className="hidden sm:inline">Appointment</span>
              </button>
            </div>

            {/* Scrollable Profile Body */}
            <div className="flex-1 overflow-y-auto hide-scroll bg-[#f8fafc]">
              
              {/* Profile Hero */}
              <div className="bg-white border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 py-10 lg:py-14 flex flex-col md:flex-row items-center md:items-start gap-8">
                  
                  <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shrink-0 shadow-sm">
                    <img 
                      src={selectedDoctor.photoURL || "https://via.placeholder.com/400"} 
                      alt={selectedDoctor.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }}
                    />
                  </div>

                  <div className="text-center md:text-left flex-1 pt-2">
                    <span className="inline-block bg-[#c19b6c]/10 text-[#c19b6c] border border-[#c19b6c]/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                      {selectedDoctor.department}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">{selectedDoctor.name}</h1>
                    <p className="text-lg font-bold text-slate-500 mb-6">{selectedDoctor.designation}</p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600 text-sm font-medium">
                      {hasValidData(selectedDoctor.qualifications, 'degree') && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-[#c19b6c]" /> 
                          <span>{selectedDoctor.qualifications.map(q => q.degree).join(', ')}</span>
                        </div>
                      )}
                      {selectedDoctor.experienceYears && (
                        <div className="flex items-center gap-1.5 md:border-l md:border-slate-300 md:pl-4">
                          <Briefcase className="w-4 h-4 text-[#c19b6c]" /> 
                          <span>{selectedDoctor.experienceYears} Exp.</span>
                        </div>
                      )}
                      {selectedDoctor.languages?.length > 0 && (
                        <div className="flex items-center gap-1.5 md:border-l md:border-slate-300 md:pl-4">
                          <Languages className="w-4 h-4 text-[#c19b6c]" /> 
                          <span>{selectedDoctor.languages.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details Container */}
              <div className="max-w-4xl mx-auto px-6 py-10 space-y-12 pb-20">
                
                {/* Section: Overview & Objective */}
                <section>
                  <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#c19b6c]" /> Professional Summary
                  </h2>
                  {selectedDoctor.careerObjective && (
                    <p className="text-base font-medium text-slate-800 italic border-l-4 border-[#c19b6c] pl-4 mb-6 leading-relaxed">
                      "{selectedDoctor.careerObjective}"
                    </p>
                  )}
                  <p className="text-slate-600 font-medium leading-loose whitespace-pre-line text-sm sm:text-base">
                    {selectedDoctor.summary || "No summary provided."}
                  </p>
                </section>

                {/* Section: Clinical Focus & Expertise */}
                {(hasValidStrings(selectedDoctor.expertise) || hasValidStrings(selectedDoctor.procedures) || hasValidStrings(selectedDoctor.clinicalInterests)) && (
                  <section>
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#c19b6c]" /> Clinical Focus
                    </h2>
                    <div className="space-y-6">
                      {hasValidStrings(selectedDoctor.expertise) && (
                        <div>
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Core Expertise</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDoctor.expertise.map((item, i) => item && <span key={i} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded text-sm font-medium shadow-sm">{item}</span>)}
                          </div>
                        </div>
                      )}
                      {hasValidStrings(selectedDoctor.procedures) && (
                        <div>
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Procedures Performed</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDoctor.procedures.map((item, i) => item && <span key={i} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded text-sm font-medium shadow-sm">{item}</span>)}
                          </div>
                        </div>
                      )}
                      {hasValidStrings(selectedDoctor.clinicalInterests) && (
                        <div>
                          <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Clinical Interests</h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedDoctor.clinicalInterests.map((item, i) => item && (
                              <li key={i} className="flex items-start gap-2 text-slate-700 text-sm font-medium">
                                <span className="w-1.5 h-1.5 bg-[#c19b6c] rounded-full shrink-0 mt-1.5"></span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Section: Credentials */}
                {(hasValidData(selectedDoctor.qualifications, 'degree') || hasValidData(selectedDoctor.fellowships, 'title')) && (
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {hasValidData(selectedDoctor.qualifications, 'degree') && (
                      <div>
                        <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-[#c19b6c]" /> Education
                        </h2>
                        <div className="space-y-5">
                          {selectedDoctor.qualifications.map((q, i) => q.degree && (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="w-1.5 h-1.5 bg-[#c19b6c] rounded-full mt-2 shrink-0"></div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{q.degree}</h4>
                                <p className="text-sm font-medium text-slate-500">{q.institution}</p>
                                {q.year && <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{q.year}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {hasValidData(selectedDoctor.fellowships, 'title') && (
                      <div>
                        <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#c19b6c]" /> Fellowships
                        </h2>
                        <div className="space-y-4">
                          {selectedDoctor.fellowships.map((f, i) => f.title && (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                              <h4 className="font-bold text-slate-800 text-sm leading-snug">{f.title}</h4>
                              <p className="text-sm font-medium text-slate-500 mt-1">{f.institution}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* Section: Experience Timeline */}
                {hasValidData(selectedDoctor.professionalExperience, 'hospital') && (
                  <section>
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#c19b6c]" /> Experience Timeline
                    </h2>
                    <div className="relative border-l-2 border-slate-200 ml-2 space-y-8 pb-2">
                      {selectedDoctor.professionalExperience.map((exp, i) => exp.hospital && (
                        <div key={i} className="relative pl-6">
                          <div className="absolute w-3 h-3 bg-white border-2 border-[#c19b6c] rounded-full -left-[7px] top-1"></div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                            {exp.startDate || 'Unknown'} - {exp.endDate || 'Present'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base">{exp.designation}</h4>
                          <p className="text-[#c19b6c] font-bold text-sm mb-2">{exp.hospital}</p>
                          {exp.description && <p className="text-sm text-slate-600 font-medium leading-relaxed">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Section: Publications & Awards */}
                {(hasValidData(selectedDoctor.researchPublications, 'title') || hasValidData(selectedDoctor.awards, 'title')) && (
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    
                    {hasValidData(selectedDoctor.researchPublications, 'title') && (
                      <div>
                        <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#c19b6c]" /> Publications
                        </h2>
                        <div className="space-y-4">
                          {selectedDoctor.researchPublications.map((pub, i) => pub.title && (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                              <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{pub.title}</h4>
                              <p className="text-xs text-slate-500 italic mb-2">{pub.journal}</p>
                              {pub.doi && (
                                <a 
                                  href={pub.doi} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white bg-slate-900 hover:bg-[#c19b6c] transition-colors px-3 py-1.5 rounded"
                                >
                                  Read Paper <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasValidData(selectedDoctor.awards, 'title') && (
                      <div>
                        <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-3 mb-6 flex items-center gap-2">
                          <Award className="w-5 h-5 text-[#c19b6c]" /> Awards
                        </h2>
                        <div className="space-y-4">
                          {selectedDoctor.awards.map((award, i) => award.title && (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start gap-3">
                              <Star className="w-5 h-5 text-[#c19b6c] fill-current shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm leading-snug">{award.title}</h4>
                                <p className="text-xs font-medium text-slate-500 mt-1">{award.organization}</p>
                                {award.year && <p className="text-[10px] font-bold text-[#c19b6c] mt-1.5 uppercase">{award.year}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}
                
                {/* Bottom Schedule & Fee Section */}
                <section className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl mt-8">
                   <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                      <div className="flex-1 w-full">
                         <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                           <Clock className="w-5 h-5 text-[#c19b6c]" /> Consultation Details
                         </h2>
                         {selectedDoctor.consultationFee && (
                           <div className="mb-6">
                             <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Consultation Fee</p>
                             <p className="text-2xl font-black text-[#c19b6c]">{selectedDoctor.consultationFee}</p>
                           </div>
                         )}
                         {hasValidData(selectedDoctor.availability, 'day') ? (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                             {selectedDoctor.availability.map((slot, i) => slot.day && (
                               <div key={i} className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-lg text-sm">
                                 <span className="font-bold">{slot.day}</span>
                                 <span className="text-slate-300 font-medium">{slot.startTime || '-'} - {slot.endTime || '-'}</span>
                               </div>
                             ))}
                           </div>
                         ) : (
                           <p className="text-slate-400 text-sm italic">Please contact the clinic for the schedule.</p>
                         )}
                      </div>
                   </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal Custom Styles for missing scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default HospitalDoctors;