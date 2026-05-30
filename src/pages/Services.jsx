import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Activity, Search, X, ChevronRight, User, 
  Heart, Brain, Bone, Baby, Eye, Ear, Pill, 
  Stethoscope, Users 
} from 'lucide-react';

// --- Icon Mapping Helper ---
// Dynamically assigns an icon based on the service name fetched from DB
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
  return Stethoscope;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [activeService, setActiveService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both collections simultaneously for performance
        const [servicesSnap, doctorsSnap] = await Promise.all([
          getDocs(collection(db, "services")),
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

  // Helper to match doctors to a service
  const getDoctorsForService = (serviceName) => {
    if (!serviceName) return [];
    const sName = serviceName.toLowerCase();
    return doctors.filter(d => 
      (d.department && d.department.toLowerCase().includes(sName)) ||
      (d.specialty && d.specialty.toLowerCase().includes(sName)) ||
      (sName.includes(d.department?.toLowerCase())) ||
      (sName.includes(d.specialty?.toLowerCase()))
    );
  };

  // Filtered doctors inside the modal based on search query
  const serviceDoctors = activeService ? getDoctorsForService(activeService.name) : [];
  const filteredDoctors = serviceDoctors.filter(doc => 
    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="services" className="w-full bg-[#f8fafc] py-24 px-4 sm:px-6 font-sans relative">
      
      {/* Background Subtle Patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h4 className="text-[#c19b6c] font-bold uppercase tracking-widest text-xs mb-3 flex items-center justify-center gap-3">
            <span className="w-8 h-[2px] bg-[#c19b6c]/40"></span>
            Specialties & Services
            <span className="w-8 h-[2px] bg-[#c19b6c]/40"></span>
          </h4>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-5">
            Excellence in Healthcare
          </h2>
          <p className="text-base text-slate-500 font-medium">
            Explore our specialized departments. Click on any service to learn more and view our dedicated medical experts.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-[#c19b6c] rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => {
              const Icon = getServiceIcon(service.name);
              const doctorCount = getDoctorsForService(service.name).length;

              return (
                <button 
                  key={service.id}
                  onClick={() => { setActiveService(service); setSearchQuery(""); }}
                  className="group bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-left hover:border-[#c19b6c]/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-[#c19b6c] focus:ring-offset-2"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#c19b6c]/10 group-hover:border-[#c19b6c]/20 transition-colors">
                      <Icon className="w-7 h-7 text-slate-700 group-hover:text-[#c19b6c] transition-colors" strokeWidth={1.5} />
                    </div>
                    {/* Doctor Count Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold group-hover:bg-slate-800 group-hover:text-white transition-colors">
                      <Users className="w-3 h-3" />
                      {doctorCount} {doctorCount === 1 ? 'Expert' : 'Experts'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#c19b6c] transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                  
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-6 flex-1">
                    {service.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-800 transition-colors mt-auto">
                    View Details & Doctors <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
            
            {services.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No Services Available</h3>
                <p className="text-slate-500">Please check back later or update via the admin portal.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODAL FOR SERVICE DETAILS --- */}
      {activeService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-[fadeIn_0.2s_ease-out]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveService(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#c19b6c]/10 flex items-center justify-center">
                  {React.createElement(getServiceIcon(activeService.name), { className: "w-6 h-6 text-[#c19b6c]" })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-none">{activeService.name}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">Department Details</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveService(null)}
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-8">
              
              {/* Service Description */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-2">About this Specialty</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{activeService.description}</p>
              </div>

              {/* Doctors Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Available Specialists <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-xs">{serviceDoctors.length}</span>
                  </h3>
                  
                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search doctors..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#c19b6c] focus:ring-1 focus:ring-[#c19b6c] transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Doctors List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doc => (
                      <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-[#c19b6c]/40 transition-colors group">
                        
                        {/* Avatar */}
                        <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
                          {doc.photoURL ? (
                            <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-slate-300" />
                          )}
                          {/* Active Indicator */}
                          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-slate-900 truncate">{doc.name}</h4>
                          <p className="text-xs font-medium text-[#c19b6c] truncate mb-1">{doc.education || doc.specialty}</p>
                          <p className="text-xs text-slate-500 font-medium">Exp: <span className="text-slate-700">{doc.experience}</span></p>
                        </div>

                        {/* Action Link */}
                        {/* Note: Update the href route below to match your app's actual routing structure for doctor profiles */}
                        <a 
                          href={`/doctors/${doc.id}`} 
                          className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors"
                          title="View Full Profile"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                      <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-600">No doctors found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Tailwind Animations Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </section>
  );
};

export default Services;