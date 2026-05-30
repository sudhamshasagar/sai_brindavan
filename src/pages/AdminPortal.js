import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from '../components/Navbar';
import { 
  Users, Activity, Settings, Upload, Plus, 
  Trash2, Download, Save, Home, 
  ChevronDown, HelpCircle, Calendar, PhoneCall, Megaphone, Check
} from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const LANGUAGES_LIST = ['English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Malayalam', 'Marathi', 'Urdu'];
const EXPERIENCE_OPTIONS = ['Fresher', '1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6-10 Years', '10-15 Years', '15+ Years'];
const SHIFTS = ['Morning', 'Afternoon', 'Night', '24 Hours'];

// --- Custom Multi-Select Dropdown Component ---
const MultiSelectDropdown = ({ options, selected, setSelected, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(item => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-[#c19b6c] focus:ring-1 focus:ring-[#c19b6c] transition-all rounded-lg shadow-sm"
      >
        <span className="truncate">
          {selected.length === 0 ? <span className="text-slate-400">{placeholder}</span> : selected.join(', ')}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-[fadeSlideDown_0.2s_ease-out_forwards]">
          <div className="p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <label 
                  key={option} 
                  className={`flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border mr-3 ${isSelected ? 'bg-[#c19b6c] border-[#c19b6c]' : 'bg-white border-slate-300'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleSelection(option)} />
                  <span className={`text-sm ${isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const InputLabel = ({ children }) => (
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">{children}</label>
  );

  const MinimalInput = (props) => (
    <input {...props} className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c19b6c] focus:ring-1 focus:ring-[#c19b6c] transition-all rounded-lg shadow-sm" />
  );
  
  const MinimalSelect = (props) => (
    <select {...props} className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#c19b6c] focus:ring-1 focus:ring-[#c19b6c] transition-all rounded-lg shadow-sm appearance-none cursor-pointer">
      {props.children}
    </select>
  );

  const MinimalTextarea = (props) => (
    <textarea {...props} className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c19b6c] focus:ring-1 focus:ring-[#c19b6c] transition-all rounded-lg shadow-sm resize-none" />
  );

  const PrimaryButton = ({ onClick, children, icon: Icon, className = "" }) => (
    <button onClick={onClick} className={`px-6 py-3 bg-slate-900 hover:bg-[#c19b6c] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-lg ${className}`}>
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );

  
const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [isUploading, setIsUploading] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  
  // --- Data States ---
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [onCall, setOnCall] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  
  // --- Settings States ---
  const [homeSettings, setHomeSettings] = useState({ photoURL: "", aboutUs: "" });
  const [contactSettings, setContactSettings] = useState({ mobileNumber: '', emergencyNumber: '', email: '', address: '' });

  // --- Forms ---
  const [doctorForm, setDoctorForm] = useState({
    name: "", specialty: "", experience: "", education: "",
    collegeName: "", photoURL: "", certificateURL: "",
    instagram: "", linkedin: "", gmail: "", description: "",
    department: "", consultationFee: "", featured: false, status: "active",
  });
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const [serviceForm, setServiceForm] = useState({ name: "", description: "", status: "active" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [specialistForm, setSpecialistForm] = useState({ doctorId: "", doctorName: "", dayOfWeek: "", timeSlot: "" });
  const [onCallForm, setOnCallForm] = useState({ doctorId: "", doctorName: "", date: "", shift: "" });
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "", active: true });

  useEffect(() => {
    fetchDoctors(); fetchServices(); fetchFaqs(); fetchSpecialists(); fetchOnCall(); fetchAnnouncements();
    fetchContactSettings(); fetchHomeSettings();
  }, []);

  // --- Firebase Fetchers ---
  const fetchDoctors = async () => {
    try {
      const qs = await getDocs(collection(db, "doctors"));
      setDoctors(qs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching doctors:", error); }
  };

  const fetchServices = async () => {
    try {
      const qs = await getDocs(collection(db, "services"));
      setServices(qs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching services:", error); }
  };

  const fetchFaqs = async () => {
    try {
      const qs = await getDocs(collection(db, "faqs"));
      setFaqs(qs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching faqs:", error); }
  };

  const fetchSpecialists = async () => {
    try {
      const qs = await getDocs(collection(db, "specialists"));
      setSpecialists(qs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching specialists:", error); }
  };

  const fetchOnCall = async () => {
    try {
      const qs = await getDocs(collection(db, "onCall"));
      setOnCall(qs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching on call:", error); }
  };

  const fetchAnnouncements = async () => {
    try {
      const qs = await getDocs(collection(db, "announcements"));
      setAnnouncements(qs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching announcements:", error); }
  };

  const fetchContactSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, "settings", "contact"));
      if (docSnap.exists()) setContactSettings(docSnap.data());
    } catch (error) { console.error("Error fetching contact settings:", error); }
  };

  const fetchHomeSettings = async () => {
    try {
      const docSnap = await getDoc(doc(db, "settings", "home"));
      if (docSnap.exists()) setHomeSettings(docSnap.data());
    } catch (error) { console.error("Error fetching home settings:", error); }
  };

  // --- Mutators ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "hospital_upload");

      const response = await fetch("https://api.cloudinary.com/v1_1/dyt28werz/image/upload", { method: "POST", body: formData });
      const data = await response.json();
      setDoctorForm({ ...doctorForm, photoURL: data.secure_url });
      setIsUploading(false);
    } catch (error) { console.error("Upload failed:", error); setIsUploading(false); }
  };

  const addDoctor = async () => {
    if (!doctorForm.name || !doctorForm.specialty || !doctorForm.experience) return alert("Please fill required fields.");
    try {
      await addDoc(collection(db, "doctors"), {
        ...doctorForm, languages: selectedLanguages, availability: selectedDays, createdAt: new Date(),
      });
      alert("Doctor Added Successfully");
      setDoctorForm({
        name: "", specialty: "", experience: "", education: "",
        collegeName: "", photoURL: "", certificateURL: "",
        instagram: "", linkedin: "", gmail: "", description: "",
        department: "", consultationFee: "", featured: false, status: "active",
      });
      setSelectedLanguages([]); setSelectedDays([]); setIsAddDoctorOpen(false); fetchDoctors();
    } catch (error) { console.error(error); }
  };

  const addGenericDoc = async (collectionName, formState, setFormState, defaultState, fetchFn) => {
    try {
      await addDoc(collection(db, collectionName), { ...formState, createdAt: new Date() });
      setFormState(defaultState); fetchFn();
    } catch (error) { console.error(error); }
  };

  const deleteGenericDoc = async (collectionName, id, fetchFn) => {
    try {
      await deleteDoc(doc(db, collectionName, id)); fetchFn();
    } catch (error) { console.error(error); }
  };

  const saveSettings = async (docName, payload, stateSetter, successMsg) => {
    try {
      await setDoc(doc(db, "settings", docName), payload);
      if (stateSetter) stateSetter(payload); alert(successMsg);
    } catch (error) { console.error(error); }
  };

  const downloadCSVTemplate = () => {
    const headers = "Name,Specialty,Experience,Education,College,Department,Fee,Languages,Availability,Instagram,LinkedIn,Email,Photo URL,Certificate URL,Description,Featured\n";
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url); a.setAttribute('download', 'doctors_template.csv');
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleCSVUpload = (e) => {
    setIsUploading(true);
    setTimeout(() => { setIsUploading(false); alert("CSV Uploaded Successfully!"); }, 1500);
  };

  // --- Shared UI Components ---
  const SectionHeader = ({ title, subtitle, action }) => (
    <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );

  

  const navItems = [
    { id: 'doctors', label: 'Doctors', icon: Users },
    { id: 'services', label: 'Services', icon: Activity },
    { id: 'specialists', label: 'Specialists', icon: Calendar },
    { id: 'oncall', label: 'On Call', icon: PhoneCall },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'home', label: 'Home Config', icon: Home },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex flex-col overflow-hidden selection:bg-[#c19b6c] selection:text-white">
      <div className="shrink-0"><Navbar /></div>

      {/* Horizontal Nav (Mobile Responsive Scroll) */}
      <div className="bg-white border-b border-slate-200 shrink-0 z-20 shadow-sm relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <nav className="flex overflow-x-auto gap-2 py-3 hide-scroll snap-x">
            {navItems.map((tab) => (
              <button 
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`snap-start flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all whitespace-nowrap rounded-full ${
                  activeTab === tab.id ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">
        <div className="max-w-[1400px] mx-auto space-y-8">

          {/* --- DOCTORS --- */}
          {activeTab === 'doctors' && (
            <div className="space-y-8 animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => setIsAddDoctorOpen(!isAddDoctorOpen)}
                  className="w-full p-6 flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <div className="p-2 bg-[#c19b6c]/10 rounded-lg"><Plus className="w-5 h-5 text-[#c19b6c]" /></div>
                      Add New Doctor Profile
                    </h2>
                  </div>
                  <div className={`p-2 rounded-full transition-transform duration-300 ${isAddDoctorOpen ? 'bg-slate-100 rotate-180' : 'hover:bg-slate-100'}`}>
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  </div>
                </button>

                {isAddDoctorOpen && (
                  <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div><InputLabel>Doctor Name *</InputLabel><MinimalInput type="text" placeholder="Dr. Jane Doe" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} /></div>
                      <div><InputLabel>Specialty *</InputLabel><MinimalInput type="text" placeholder="e.g. Cardiology" value={doctorForm.specialty} onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })} /></div>
                      <div>
                        <InputLabel>Experience *</InputLabel>
                        <MinimalSelect value={doctorForm.experience} onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}>
                          <option value="" disabled>Select Experience</option>
                          {EXPERIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </MinimalSelect>
                      </div>
                      
                      <div><InputLabel>Languages Known</InputLabel><MultiSelectDropdown options={LANGUAGES_LIST} selected={selectedLanguages} setSelected={setSelectedLanguages} placeholder="Select Languages" /></div>
                      <div><InputLabel>Availability</InputLabel><MultiSelectDropdown options={DAYS_OF_WEEK} selected={selectedDays} setSelected={setSelectedDays} placeholder="Select Days" /></div>
                      
                      <div><InputLabel>Education</InputLabel><MinimalInput type="text" placeholder="e.g. MBBS, MD" value={doctorForm.education} onChange={(e) => setDoctorForm({ ...doctorForm, education: e.target.value })} /></div>
                      <div><InputLabel>Department</InputLabel><MinimalInput type="text" placeholder="e.g. General Medicine" value={doctorForm.department} onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })} /></div>
                      <div><InputLabel>Consultation Fee (₹)</InputLabel><MinimalInput type="text" placeholder="e.g. 500" value={doctorForm.consultationFee} onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })} /></div>
                      
                      <div className="md:col-span-2 lg:col-span-3">
                        <InputLabel>Profile Image Upload</InputLabel>
                        <div className="flex items-center gap-4">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-200 rounded-lg bg-white shadow-sm" />
                          {isUploading && <span className="text-sm font-medium text-[#c19b6c] animate-pulse">Uploading...</span>}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 lg:col-span-3"><InputLabel>Biography</InputLabel><MinimalTextarea rows="3" placeholder="Brief professional background..." value={doctorForm.description} onChange={(e) => setDoctorForm({ ...doctorForm, description: e.target.value })} /></div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${doctorForm.featured ? 'bg-[#c19b6c] border-[#c19b6c]' : 'bg-white border-slate-300 group-hover:border-[#c19b6c]'}`}>
                          {doctorForm.featured && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={doctorForm.featured} onChange={(e) => setDoctorForm({ ...doctorForm, featured: e.target.checked })} />
                        <span className="text-sm font-bold text-slate-700 select-none">Mark as Featured Professional</span>
                      </label>

                      <PrimaryButton onClick={addDoctor} icon={Save} className="w-full sm:w-auto">Save Doctor Profile</PrimaryButton>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                <SectionHeader 
                  title="Medical Directory" 
                  subtitle="Manage existing staff or bulk upload records."
                  action={
                    <div className="flex flex-wrap gap-3">
                      <button onClick={downloadCSVTemplate} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold flex items-center gap-2 rounded-lg hover:bg-slate-50 shadow-sm transition-all"><Download className="w-4 h-4" /> Template</button>
                      <div className="relative">
                        <input type="file" accept=".csv" onChange={handleCSVUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                        <button className="px-4 py-2.5 bg-[#c19b6c] text-white text-sm font-bold flex items-center gap-2 rounded-lg hover:bg-[#b08d60] shadow-sm transition-all relative pointer-events-none">
                          {isUploading ? <span className="animate-pulse">Processing...</span> : <><Upload className="w-4 h-4" /> Import CSV</>}
                        </button>
                      </div>
                    </div>
                  }
                />
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-5">Physician Profile</th>
                        <th className="p-5">Specialty</th>
                        <th className="p-5">Languages</th>
                        <th className="p-5">Availability</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {doctors.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5">
                            <div className="font-bold text-slate-900">{doc.name}</div>
                            <div className="text-sm font-medium text-slate-500 mt-0.5">{doc.department || 'General'}</div>
                          </td>
                          <td className="p-5"><span className="inline-flex px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{doc.specialty}</span></td>
                          <td className="p-5">
                            <div className="flex gap-1.5 flex-wrap">
                              {doc.languages?.length ? doc.languages.map(l => <span key={l} className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">{l}</span>) : '-'}
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex gap-1.5 flex-wrap">
                              {doc.availability?.length ? doc.availability.map(d => <span key={d} className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{d.slice(0,3)}</span>) : '-'}
                            </div>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => deleteDoc(doc(db, "doctors", doc.id)).then(fetchDoctors)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                      {doctors.length === 0 && (
                        <tr><td colSpan="5" className="p-12 text-center text-slate-500 font-medium">No doctors added yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              <div className="block lg:hidden bg-slate-50/50 p-4 space-y-4">
                  {doctors.map(doc => (
                    <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 relative">
                      
                      {/* Card Header: Name, Dept & Delete Action */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="font-bold text-slate-900 text-lg">{doc.name}</div>
                          <div className="text-sm font-medium text-slate-500 mt-0.5">{doc.department || 'General'}</div>
                        </div>
                        <button onClick={() => deleteDoc(doc(db, "doctors", doc.id)).then(fetchDoctors)} className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Specialty Tag */}
                      <div>
                        <span className="inline-flex px-3 py-1 bg-[#c19b6c]/10 text-[#a37e50] rounded-full text-xs font-bold">
                          {doc.specialty}
                        </span>
                      </div>

                      {/* Details Section */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Languages</div>
                          <div className="flex gap-2 flex-wrap">
                            {doc.languages?.length ? doc.languages.map(l => (
                              <span key={l} className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md">{l}</span>
                            )) : <span className="text-sm text-slate-400">-</span>}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Availability</div>
                          <div className="flex gap-2 flex-wrap">
                            {doc.availability?.length ? doc.availability.map(d => (
                              <span key={d} className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{d.slice(0,3)}</span>
                            )) : <span className="text-sm text-slate-400">-</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {doctors.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200">
                      No doctors added yet.
                    </div>
                  )}
                </div>
              </div>
              </div>
          )}

          {/* --- SERVICES --- */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              
              {/* --- ADD SERVICE FORM (Left Column) --- */}
              <div className="xl:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Add Service</h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <InputLabel>Service Name *</InputLabel>
                    <MinimalInput 
                      type="text" 
                      placeholder="e.g. Cardiology, 24/7 Pharmacy" 
                      value={serviceForm.name} 
                      onChange={e => setServiceForm({...serviceForm, name: e.target.value})} 
                    />
                  </div>
                  
                  <div>
                    <InputLabel>Detailed Description *</InputLabel>
                    <MinimalTextarea 
                      rows="5" 
                      placeholder="Describe the treatments, facilities, and care provided under this service..." 
                      value={serviceForm.description} 
                      onChange={e => setServiceForm({...serviceForm, description: e.target.value})} 
                    />
                  </div>

                  <div>
                    <InputLabel>Linked Doctors (Optional)</InputLabel>
                    <MultiSelectDropdown 
                      options={doctors.map(d => d.name)} 
                      selected={serviceForm.linkedDoctors || []} 
                      setSelected={(val) => setServiceForm({...serviceForm, linkedDoctors: val})} 
                      placeholder="Assign Doctors" 
                    />
                  </div>

                  <div>
                    <InputLabel>Cover Image (Optional)</InputLabel>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} // Assumes your existing upload handler sets serviceForm.imageURL
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-200 rounded-lg bg-white shadow-sm transition-all" 
                      />
                    </div>
                    {isUploading && <span className="text-xs font-bold text-[#c19b6c] animate-pulse mt-2 block">Uploading Image...</span>}
                  </div>

                  <PrimaryButton 
                    onClick={() => {
                      if(!serviceForm.name || !serviceForm.description) return alert("Name and Description are required");
                      addGenericDoc("services", serviceForm, setServiceForm, {name: "", description: "", linkedDoctors: [], imageURL: "", status: "active"}, fetchServices);
                    }} 
                    icon={Plus} 
                    className="w-full mt-6"
                  >
                    Publish Service
                  </PrimaryButton>
                </div>
              </div>

              {/* --- SERVICES DIRECTORY (Right Column) --- */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
                <SectionHeader 
                  title="Hospital Services" 
                  subtitle="Manage available specialties, detailed descriptions, and linked medical professionals." 
                />
                
                {/* DESKTOP VIEW (Table) */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-5 w-16">Image</th>
                        <th className="p-5 w-1/3">Service Details</th>
                        <th className="p-5 w-1/3">Assigned Doctors</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {services.map(srv => (
                        <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5 align-top">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {srv.imageURL ? (
                                <img src={srv.imageURL} alt={srv.name} className="w-full h-full object-cover" />
                              ) : (
                                <Activity className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                          </td>
                          <td className="p-5 align-top">
                            <div className="font-bold text-slate-900 text-base mb-1">{srv.name}</div>
                            <div className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-3">{srv.description}</div>
                          </td>
                          <td className="p-5 align-top">
                            <div className="flex flex-wrap gap-1.5">
                              {srv.linkedDoctors?.length ? srv.linkedDoctors.map(docName => (
                                <span key={docName} className="inline-flex px-2.5 py-1 bg-[#c19b6c]/10 text-[#a37e50] border border-[#c19b6c]/20 rounded-md text-xs font-bold whitespace-nowrap">
                                  {docName}
                                </span>
                              )) : <span className="text-xs font-medium text-slate-400 italic">No doctors assigned</span>}
                            </div>
                          </td>
                          <td className="p-5 text-right align-top">
                            <button onClick={() => deleteGenericDoc("services", srv.id, fetchServices)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shadow-sm border border-transparent group-hover:border-red-100">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {services.length === 0 && (
                        <tr><td colSpan="4" className="p-16 text-center text-slate-500 font-medium">No services added yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE & TABLET VIEW (Cards) */}
                <div className="block lg:hidden bg-slate-50/50 p-4 space-y-4 flex-1">
                  {services.map(srv => (
                    <div key={srv.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4 relative">
                      
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {srv.imageURL ? (
                            <img src={srv.imageURL} alt={srv.name} className="w-full h-full object-cover" />
                          ) : (
                            <Activity className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        
                        {/* Header & Delete */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 text-lg leading-tight">{srv.name}</h4>
                            <button onClick={() => deleteGenericDoc("services", srv.id, fetchServices)} className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{srv.description}</p>
                      </div>

                      {/* Linked Doctors */}
                      <div className="pt-4 border-t border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Professionals</div>
                        <div className="flex flex-wrap gap-2">
                          {srv.linkedDoctors?.length ? srv.linkedDoctors.map(docName => (
                            <span key={docName} className="inline-flex px-2.5 py-1 bg-[#c19b6c]/10 text-[#a37e50] border border-[#c19b6c]/20 rounded-md text-xs font-bold">
                              {docName}
                            </span>
                          )) : <span className="text-xs font-medium text-slate-400 italic">None assigned</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {services.length === 0 && (
                    <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-xl border border-slate-200">
                      No services added yet.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* --- WEEKLY SPECIALISTS --- */}
          {activeTab === 'specialists' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-50 rounded-xl"><Calendar className="w-5 h-5 text-indigo-600" /></div>
                  <h3 className="text-lg font-bold text-slate-800">Assign Specialist</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <InputLabel>Doctor</InputLabel>
                    <MinimalSelect 
                      value={specialistForm.doctorId} 
                      onChange={e => {
                        const selectedDoc = doctors.find(d => d.id === e.target.value);
                        setSpecialistForm({...specialistForm, doctorId: e.target.value, doctorName: selectedDoc?.name || ''});
                      }}
                    >
                      <option value="" disabled>Select Physician</option>
                      {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                    </MinimalSelect>
                  </div>
                  <div>
                    <InputLabel>Day of Week</InputLabel>
                    <MinimalSelect value={specialistForm.dayOfWeek} onChange={e => setSpecialistForm({...specialistForm, dayOfWeek: e.target.value})}>
                      <option value="" disabled>Select Day</option>
                      {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                    </MinimalSelect>
                  </div>
                  <div><InputLabel>Time Slot</InputLabel><MinimalInput type="text" placeholder="e.g. 10:00 AM - 02:00 PM" value={specialistForm.timeSlot} onChange={e => setSpecialistForm({...specialistForm, timeSlot: e.target.value})} /></div>
                  <PrimaryButton onClick={() => {
                    if(!specialistForm.doctorId || !specialistForm.dayOfWeek) return alert("Doctor and Day required");
                    addGenericDoc("specialists", specialistForm, setSpecialistForm, { doctorId: "", doctorName: "", dayOfWeek: "", timeSlot: "" }, fetchSpecialists);
                  }} icon={Plus} className="w-full mt-4">Assign Specialist</PrimaryButton>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <SectionHeader title="Weekly Roster" />
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-5">Specialist</th>
                        <th className="p-5">Day</th>
                        <th className="p-5">Time</th>
                        <th className="p-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {specialists.map(sp => (
                        <tr key={sp.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5 font-bold text-slate-900">{sp.doctorName}</td>
                          <td className="p-5 text-sm font-medium text-slate-600"><span className="bg-slate-100 px-3 py-1 rounded-full">{sp.dayOfWeek}</span></td>
                          <td className="p-5 text-sm font-medium text-slate-600">{sp.timeSlot || 'N/A'}</td>
                          <td className="p-5 text-right">
                            <button onClick={() => deleteGenericDoc("specialists", sp.id, fetchSpecialists)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                      {specialists.length === 0 && (<tr><td colSpan="4" className="p-12 text-center text-slate-500 font-medium">No specialists assigned yet.</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- DOCTORS ON CALL --- */}
          {activeTab === 'oncall' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-rose-50 rounded-xl"><PhoneCall className="w-5 h-5 text-rose-600" /></div>
                  <h3 className="text-lg font-bold text-slate-800">Assign On-Call</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <InputLabel>Doctor</InputLabel>
                    <MinimalSelect 
                      value={onCallForm.doctorId} 
                      onChange={e => {
                        const selectedDoc = doctors.find(d => d.id === e.target.value);
                        setOnCallForm({...onCallForm, doctorId: e.target.value, doctorName: selectedDoc?.name || ''});
                      }}
                    >
                      <option value="" disabled>Select Physician</option>
                      {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </MinimalSelect>
                  </div>
                  <div><InputLabel>Date</InputLabel><MinimalInput type="date" value={onCallForm.date} onChange={e => setOnCallForm({...onCallForm, date: e.target.value})} /></div>
                  <div>
                    <InputLabel>Shift</InputLabel>
                    <MinimalSelect value={onCallForm.shift} onChange={e => setOnCallForm({...onCallForm, shift: e.target.value})}>
                      <option value="" disabled>Select Shift</option>
                      {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </MinimalSelect>
                  </div>
                  <PrimaryButton onClick={() => {
                    if(!onCallForm.doctorId || !onCallForm.date) return alert("Doctor and Date required");
                    addGenericDoc("onCall", onCallForm, setOnCallForm, { doctorId: "", doctorName: "", date: "", shift: "" }, fetchOnCall);
                  }} icon={Plus} className="w-full mt-4">Add to Schedule</PrimaryButton>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <SectionHeader title="On-Call Schedule" />
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-5">Physician</th>
                        <th className="p-5">Date</th>
                        <th className="p-5">Shift</th>
                        <th className="p-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {onCall.map(oc => (
                        <tr key={oc.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5 font-bold text-slate-900">{oc.doctorName}</td>
                          <td className="p-5 text-sm font-medium text-slate-600">{oc.date}</td>
                          <td className="p-5 text-sm font-medium text-slate-600"><span className="bg-slate-100 px-3 py-1 rounded-full">{oc.shift}</span></td>
                          <td className="p-5 text-right">
                            <button onClick={() => deleteGenericDoc("onCall", oc.id, fetchOnCall)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                      {onCall.length === 0 && (<tr><td colSpan="4" className="p-12 text-center text-slate-500 font-medium">No on-call duties assigned.</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- ANNOUNCEMENTS --- */}
          {activeTab === 'announcements' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-amber-50 rounded-xl"><Megaphone className="w-5 h-5 text-amber-600" /></div>
                  <h3 className="text-lg font-bold text-slate-800">New Announcement</h3>
                </div>
                <div className="space-y-5">
                  <div><InputLabel>Announcement Title</InputLabel><MinimalInput type="text" placeholder="e.g. Free Health Camp" value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} /></div>
                  <div><InputLabel>Message Content</InputLabel><MinimalTextarea rows="4" placeholder="Details of the announcement..." value={announcementForm.content} onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})} /></div>
                  
                  <label className="flex items-center gap-3 cursor-pointer group pt-2">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${announcementForm.active ? 'bg-[#c19b6c] border-[#c19b6c]' : 'bg-white border-slate-300 group-hover:border-[#c19b6c]'}`}>
                      {announcementForm.active && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={announcementForm.active} onChange={(e) => setAnnouncementForm({ ...announcementForm, active: e.target.checked })} />
                    <span className="text-sm font-bold text-slate-700 select-none">Set as Active</span>
                  </label>

                  <PrimaryButton onClick={() => {
                    if(!announcementForm.title) return alert("Title required");
                    addGenericDoc("announcements", { ...announcementForm, datePosted: new Date().toISOString() }, setAnnouncementForm, {title: "", content: "", active: true}, fetchAnnouncements);
                  }} icon={Plus} className="w-full mt-4">Publish Announcement</PrimaryButton>
                </div>
              </div>
              
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <SectionHeader title="Active & Past Announcements" />
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <tbody className="divide-y divide-slate-100">
                      {announcements.map(ann => (
                        <tr key={ann.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                              {ann.active ? <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Active</span> 
                                          : <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Inactive</span>}
                              <span className="text-xs font-bold text-slate-400">{new Date(ann.datePosted).toLocaleDateString()}</span>
                            </div>
                            <div className="font-bold text-slate-900 text-base">{ann.title}</div>
                            <div className="text-sm font-medium text-slate-500 mt-1.5 leading-relaxed">{ann.content}</div>
                          </td>
                          <td className="p-6 text-right align-top">
                            <button onClick={() => deleteGenericDoc("announcements", ann.id, fetchAnnouncements)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                      {announcements.length === 0 && (<tr><td colSpan="2" className="p-12 text-center text-slate-500 font-medium">No announcements published.</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- FAQS --- */}
          {activeTab === 'faqs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-purple-50 rounded-xl"><HelpCircle className="w-5 h-5 text-purple-600" /></div>
                  <h3 className="text-lg font-bold text-slate-800">Create FAQ</h3>
                </div>
                <div className="space-y-5">
                  <div><InputLabel>Question</InputLabel><MinimalInput type="text" placeholder="e.g. What are visiting hours?" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} /></div>
                  <div><InputLabel>Answer</InputLabel><MinimalTextarea rows="4" placeholder="Provide the answer..." value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} /></div>
                  <PrimaryButton onClick={() => {
                    if(!faqForm.question || !faqForm.answer) return alert("Question and Answer required");
                    addGenericDoc("faqs", faqForm, setFaqForm, {question: "", answer: ""}, fetchFaqs);
                  }} icon={Plus} className="w-full mt-4">Add FAQ</PrimaryButton>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <SectionHeader title="Frequently Asked Questions" />
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <tbody className="divide-y divide-slate-100">
                      {faqs.map(faq => (
                        <tr key={faq.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-6">
                            <div className="font-bold text-slate-900 text-base mb-1">Q: {faq.question}</div>
                            <div className="text-sm font-medium text-slate-500 leading-relaxed">A: {faq.answer}</div>
                          </td>
                          <td className="p-6 text-right align-top">
                            <button onClick={() => deleteGenericDoc("faqs", faq.id, fetchFaqs)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                      {faqs.length === 0 && (<tr><td colSpan="2" className="p-12 text-center text-slate-500 font-medium">No FAQs created yet.</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- HOME PAGE CONFIG --- */}
          {activeTab === 'home' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              <SectionHeader title="Home Page Configuration" subtitle="Manage your primary banner and about section." />
              <div className="p-6 sm:p-8 max-w-4xl space-y-6">
                <div>
                  <InputLabel>Banner Image (Drive Link)</InputLabel>
                  <MinimalInput type="text" placeholder="Paste public Google Drive image link..." value={homeSettings.photoURL} onChange={(e) => setHomeSettings({...homeSettings, photoURL: e.target.value})} />
                </div>
                <div>
                  <InputLabel>About Us Synopsis</InputLabel>
                  <MinimalTextarea rows="6" placeholder="Introduction text for the landing page..." value={homeSettings.aboutUs} onChange={(e) => setHomeSettings({...homeSettings, aboutUs: e.target.value})} />
                </div>
                <div className="flex justify-end pt-4">
                  <PrimaryButton onClick={() => saveSettings("home", homeSettings, setHomeSettings, "Home Settings Saved")} icon={Save}>Update Home Page</PrimaryButton>
                </div>
              </div>
            </div>
          )}

          {/* --- SETTINGS --- */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-[fadeSlideUp_0.4s_ease-out_forwards]">
              <SectionHeader title="Contact & Location Settings" subtitle="Manage global footer and contact details." />
              <div className="p-6 sm:p-8 max-w-4xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><InputLabel>Primary Mobile</InputLabel><MinimalInput type="text" placeholder="+91 XXXXX XXXXX" value={contactSettings.mobileNumber} onChange={e => setContactSettings({...contactSettings, mobileNumber: e.target.value})} /></div>
                  <div><InputLabel>Emergency Response</InputLabel><MinimalInput type="text" placeholder="108 or Landline" value={contactSettings.emergencyNumber} onChange={e => setContactSettings({...contactSettings, emergencyNumber: e.target.value})} /></div>
                  <div><InputLabel>Official Email</InputLabel><MinimalInput type="email" placeholder="contact@hospital.com" value={contactSettings.email} onChange={e => setContactSettings({...contactSettings, email: e.target.value})} /></div>
                  <div className="md:col-span-2"><InputLabel>Location / Address</InputLabel><MinimalTextarea rows="3" placeholder="Full hospital address..." value={contactSettings.address} onChange={e => setContactSettings({...contactSettings, address: e.target.value})} /></div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <PrimaryButton onClick={() => saveSettings("contact", contactSettings, null, "Settings Saved")} icon={Save}>Update Contact Details</PrimaryButton>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default AdminPortal;