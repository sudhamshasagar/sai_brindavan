import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  doc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Activity,
  Eye,
  EyeOff,
  Stethoscope,
  BriefcaseMedical
} from 'lucide-react';

const ServiceAdmin = () => {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    doctorIds: [],
    isActive: true, // Is the service currently operating at the hospital?
    isVisible: true // Should it be displayed on the public website?
  });

  const servicesCollectionRef = collection(db, 'services');
  const doctorsCollectionRef = collection(db, 'doctors');

  // Fetch Services and Doctors on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Doctors (for the multi-select dropdown)
      const docSnapshot = await getDocs(doctorsCollectionRef);
      const doctorsData = docSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorsData);

      // 2. Fetch Services
      const q = query(servicesCollectionRef, orderBy('createdAt', 'desc'));
      const srvSnapshot = await getDocs(q);
      const servicesData = srvSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesData);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle standard text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  // Handle Doctor Multi-Select Checkboxes
  const handleDoctorToggle = (doctorId) => {
    setNewService(prev => {
      const isSelected = prev.doctorIds.includes(doctorId);
      if (isSelected) {
        return { ...prev, doctorIds: prev.doctorIds.filter(id => id !== doctorId) };
      } else {
        return { ...prev, doctorIds: [...prev.doctorIds, doctorId] };
      }
    });
  };

  // Handle Boolean Toggles
  const handleToggle = (field) => {
    setNewService(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Submit New Service
  const handleAddService = async (e) => {
    e.preventDefault();
    setError('');

    if (!newService.name.trim() || !newService.description.trim()) {
      setError('Service Name and Description are required.');
      return;
    }

    try {
      setSubmitting(true);
      const serviceData = {
        name: newService.name.trim(),
        description: newService.description.trim(),
        doctorIds: newService.doctorIds,
        isActive: newService.isActive,
        isVisible: newService.isVisible,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(servicesCollectionRef, serviceData);

      // Update local state immediately
      setServices(prev => [{ id: docRef.id, ...serviceData }, ...prev]);

      // Reset form
      setNewService({
        name: '',
        description: '',
        doctorIds: [],
        isActive: true,
        isVisible: true
      });
      
    } catch (err) {
      console.error("Error adding service:", err);
      setError("Failed to add service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(srv => srv.id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service. Please try again.");
    }
  };

  // Quick Toggle Visibility from the list
  const toggleServiceVisibility = async (id, currentStatus) => {
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, { isVisible: !currentStatus });
      
      setServices(prev => prev.map(srv => 
        srv.id === id ? { ...srv, isVisible: !currentStatus } : srv
      ));
    } catch (err) {
      console.error("Error updating visibility:", err);
      alert("Failed to update visibility.");
    }
  };

  // Helper to render assigned doctor names
  const renderAssignedDoctors = (doctorIds) => {
    if (!doctorIds || doctorIds.length === 0) return <span className="text-slate-400 italic">No doctors assigned</span>;
    
    const assignedNames = doctorIds.map(id => {
      const doc = doctors.find(d => d.id === id);
      return doc ? doc.name : 'Unknown Doctor';
    });

    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {assignedNames.map((name, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-[#0EA5E9] text-xs font-bold rounded-md border border-sky-100">
            <Stethoscope className="w-3 h-3" /> {name}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
          <BriefcaseMedical className="w-8 h-8 text-[#0EA5E9]" />
          Service Management
        </h1>
        <p className="text-slate-500 font-medium">Create medical services, assign doctors, and manage website visibility.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: Add Service Form              */}
        {/* ========================================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-8">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#0EA5E9]" />
            Add New Service
          </h2>
          
          <form onSubmit={handleAddService} className="space-y-5">
            
            {/* Service Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={newService.name}
                onChange={handleInputChange}
                placeholder="e.g., Pediatric Care, NICU, Cardiology"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0EA5E9] outline-none transition-all placeholder:text-slate-400 font-medium"
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                placeholder="Briefly describe the service provided..."
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0EA5E9] outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
                disabled={submitting}
              ></textarea>
            </div>

            {/* Assign Doctors (Multi-Select) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Assign Doctors
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto custom-scrollbar">
                {doctors.length === 0 ? (
                  <p className="text-sm text-slate-500 italic p-2">No doctors found. Please add doctors first.</p>
                ) : (
                  <div className="space-y-2">
                    {doctors.map(doctor => (
                      <label key={doctor.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                        <input 
                          type="checkbox"
                          checked={newService.doctorIds.includes(doctor.id)}
                          onChange={() => handleDoctorToggle(doctor.id)}
                          className="w-4 h-4 rounded text-[#0EA5E9] focus:ring-[#0EA5E9] border-slate-300 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{doctor.name}</span>
                          {doctor.specialty && <span className="text-xs font-medium text-slate-500">{doctor.specialty}</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Active Toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    checked={newService.isActive}
                    onChange={() => handleToggle('isActive')}
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                    style={{ transform: newService.isActive ? 'translateX(100%)' : 'translateX(0)', borderColor: newService.isActive ? '#10B981' : '#CBD5E1' }}
                  />
                  <div className={`toggle-label block overflow-hidden h-5 rounded-full ${newService.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Active Service</span>
                  <span className="text-[10px] text-slate-500 font-medium">Is it operational?</span>
                </div>
              </label>

              {/* Visible Toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    checked={newService.isVisible}
                    onChange={() => handleToggle('isVisible')}
                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                    style={{ transform: newService.isVisible ? 'translateX(100%)' : 'translateX(0)', borderColor: newService.isVisible ? '#0EA5E9' : '#CBD5E1' }}
                  />
                  <div className={`toggle-label block overflow-hidden h-5 rounded-full ${newService.isVisible ? 'bg-[#0EA5E9]' : 'bg-slate-300'}`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">Visible on Web</span>
                  <span className="text-[10px] text-slate-500 font-medium">Show to patients?</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0EA5E9] hover:bg-sky-500 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Saving Service...</>
              ) : (
                <><Plus className="w-5 h-5" /> Publish Service</>
              )}
            </button>
          </form>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: Existing Services List       */}
        {/* ========================================== */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C19B6C]" />
            Managed Services ({services.length})
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
              <Loader2 className="w-8 h-8 animate-spin text-[#0EA5E9] mb-4" />
              <p className="font-medium">Loading Services & Doctors...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center text-slate-500">
              <BriefcaseMedical className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-semibold text-slate-700">No Services Found</p>
              <p className="text-sm mt-1">Add your first hospital service using the form.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  className={`bg-white rounded-2xl border ${service.isVisible ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-80'} p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 justify-between items-start group`}
                >
                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{service.name}</h3>
                      
                      {/* Status Badges */}
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        {!service.isActive && (
                          <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-md border border-red-100">
                            Inactive
                          </span>
                        )}
                        {!service.isVisible && (
                          <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Hidden
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 font-medium text-sm mb-4 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Assigned Doctors</span>
                      {renderAssignedDoctors(service.doctorIds)}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <button
                      onClick={() => toggleServiceVisibility(service.id, service.isVisible)}
                      className={`flex-1 sm:flex-none flex items-center justify-center p-2.5 rounded-xl transition-colors border ${service.isVisible ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-transparent' : 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20 hover:bg-[#0EA5E9]/20'}`}
                      title={service.isVisible ? "Hide from website" : "Show on website"}
                    >
                      {service.isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="flex-1 sm:flex-none flex items-center justify-center p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                      title="Delete Service"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Custom Scrollbar CSS for Doctor List */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

export default ServiceAdmin;