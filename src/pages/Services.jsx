import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Activity, Search, X, ChevronRight, User, 
  Heart, Brain, Bone, Baby, Eye, Ear, Pill, 
  Stethoscope, Users, BriefcaseMedical
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

// --- Icon Mapping Helper ---
const getServiceIcon = (name) => {
  if (!name) return Activity;
  const n = name.toLowerCase();
  if (n.includes('cardio') || n.includes('heart')) return Heart;
  if (n.includes('neuro') || n.includes('brain')) return Brain;
  if (n.includes('ortho') || n.includes('bone')) return Bone;
  if (n.includes('paed') || n.includes('ped') || n.includes('child')) return Baby;
  if (n.includes('eye') || n.includes('opthal')) return Eye;
  if (n.includes('ent') || n.includes('ear')) return Ear;
  if (n.includes('pharm') || n.includes('med')) return Pill;
  if (n.includes('gynae') || n.includes('obs')) return Users;
  return BriefcaseMedical;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // Modal States
  const [activeService, setActiveService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both collections simultaneously
        // Only fetch services that are meant to be visible on the website
        const servicesQuery = query(
          collection(db, "services"), 
          where("isVisible", "==", true),
          orderBy("createdAt", "desc")
        );
        
        const [servicesSnap, doctorsSnap] = await Promise.all([
          getDocs(servicesQuery),
          getDocs(collection(db, "doctors"))
        ]);

        setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setDoctors(doctorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (activeService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeService]);

  // Helper to match explicitly assigned doctors to a service
  const getAssignedDoctors = (doctorIdsArray) => {
    if (!doctorIdsArray || doctorIdsArray.length === 0) return [];
    return doctors.filter(doc => doctorIdsArray.includes(doc.id));
  };

  // Filtered doctors inside the modal based on search query
  const serviceDoctors = activeService ? getAssignedDoctors(activeService.doctorIds) : [];
  const filteredDoctors = serviceDoctors.filter(doc => 
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="services" className="w-full bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C19B6C] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#0EA5E9]"></span>
            <span className="text-[#0EA5E9] font-bold uppercase tracking-widest text-xs md:text-sm">
              Specialties & Services
            </span>
            <span className="w-8 h-px bg-[#0EA5E9]"></span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            Excellence in Healthcare
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Explore our specialized departments. Click on any service to learn more and view our dedicated medical experts.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0EA5E9] rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.name);
              const doctorCount = (service.doctorIds || []).length;

              return (
                <motion.button 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => { setActiveService(service); setSearchQuery(""); }}
                  className="group bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 text-left hover:border-transparent hover:shadow-2xl hover:shadow-sky-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-4"
                >
                  <div className="flex justify-between items-start mb-6 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:bg-[#0EA5E9] group-hover:border-[#0EA5E9] transition-colors duration-300">
                      <Icon className="w-8 h-8 text-[#0EA5E9] group-hover:text-white transition-colors" />
                    </div>
                    {/* Doctor Count Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Users className="w-3.5 h-3.5" />
                      {doctorCount} {doctorCount === 1 ? 'Expert' : 'Experts'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-[#0EA5E9] transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-8 flex-1">
                    {service.description}
                  </p>

                  {/* Active Indicator & Action Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between w-full mt-auto">
                    <div className="flex items-center gap-2">
                      {service.isActive ? (
                         <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active
                         </span>
                      ) : (
                         <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                           <span className="w-2 h-2 rounded-full bg-slate-300"></span> Inactive
                         </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                      View Details <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
            
            {services.length === 0 && (
              <div className="col-span-full text-center py-24 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                <BriefcaseMedical className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Services Available</h3>
                <p className="text-slate-500">Please check back later or update via the admin portal.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODAL FOR SERVICE DETAILS --- */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setActiveService(null)}
            ></motion.div>
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              
              {/* Modal Header */}
              <div className="px-6 py-6 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10">
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 items-center justify-center shrink-0">
                    {React.createElement(getServiceIcon(activeService.name), { className: "w-7 h-7 text-[#0EA5E9]" })}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mb-1.5">{activeService.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department Profile</span>
                      {activeService.isActive && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Operating
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveService(null)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors focus:outline-none border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto bg-slate-50 p-6 sm:p-8 space-y-8 custom-scrollbar">
                
                {/* Service Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#0EA5E9]" /> About this Specialty
                  </h3>
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-slate-600 leading-relaxed font-medium">
                    {activeService.description}
                  </div>
                </div>

                {/* Doctors Section */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-widest flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[#0EA5E9]" /> Assigned Specialists
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">Meet the medical experts leading this department.</p>
                    </div>
                    
                    {/* Search Input for Modal */}
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search doctors by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Doctors List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map(doc => (
                        <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-[#0EA5E9]/40 hover:shadow-md transition-all group">
                          
                          {/* Avatar */}
                          <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
                            {doc.photoURL ? (
                              <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-slate-900 truncate">{doc.name}</h4>
                            <p className="text-xs font-bold text-[#0EA5E9] truncate mb-1 uppercase tracking-wider">{doc.specialty || "Specialist"}</p>
                            {doc.experience && <p className="text-xs text-slate-500 font-medium">Exp: <span className="text-slate-700">{doc.experience}</span></p>}
                          </div>

                          {/* Action Link (Assuming you have a doctor detail route) */}
                          <button
                            onClick={() => navigate(`/doctors?doctor=${doc.id}`)}
                            className="w-10 h-10 shrink-0 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors border border-slate-200 group-hover:border-transparent"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                        {searchQuery ? (
                          <>
                            <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-600">No doctors found matching "{searchQuery}"</p>
                          </>
                        ) : (
                          <>
                            <User className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-600">No doctors have been assigned to this service yet.</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </section>
  );
};

export default Services;