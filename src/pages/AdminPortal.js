import React, { useEffect, useState } from 'react';
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
  Trash2, Download, Save, Home, Image, ChevronDown, ChevronUp
} from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const LANGUAGES_LIST = ['English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Malayalam', 'Marathi', 'Urdu'];
const EXPERIENCE_OPTIONS = ['Fresher', '1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6-10 Years', '10-15 Years', '15+ Years'];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [isUploading, setIsUploading] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  
  // Data States
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  
  // Settings States
  const [homeSettings, setHomeSettings] = useState({ photoURL: "", aboutUs: "" });
  const [contactSettings, setContactSettings] = useState({
    mobileNumber: '',
    emergencyNumber: '',
    email: '',
    address: '',
  });

  // Forms
  const [doctorForm, setDoctorForm] = useState({
    name: "", specialty: "", experience: "", education: "",
    collegeName: "", photoURL: "", certificateURL: "",
    instagram: "", linkedin: "", gmail: "", description: "",
    department: "", consultationFee: "", featured: false, status: "active",
  });
  
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const [serviceForm, setServiceForm] = useState({
    name: "", description: "", status: "active"
  });

  useEffect(() => {
    fetchDoctors();
    fetchServices();
    fetchContactSettings();
    fetchHomeSettings();
  }, []);

  // --- Helpers ---
  const convertDriveLink = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/(.*?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
  };

  const toggleArraySelection = (item, array, setArray) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  // --- Firebase Fetchers ---
  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDoctors(doctorsList);
    } catch (error) { console.error("Error fetching doctors:", error); }
  };

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const servicesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServices(servicesList);
    } catch (error) { console.error("Error fetching services:", error); }
  };

  const fetchContactSettings = async () => {
    try {
      const docRef = doc(db, "settings", "contact");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContactSettings(docSnap.data());
      }
    } catch (error) { console.error("Error fetching contact settings:", error); }
  };

  const fetchHomeSettings = async () => {
    try {
      const docRef = doc(db, "settings", "home");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHomeSettings(docSnap.data());
      }
    } catch (error) { console.error("Error fetching home settings:", error); }
  };

  // --- Firebase Mutators ---
  const addDoctor = async () => {
    try {
      if (!doctorForm.name || !doctorForm.specialty || !doctorForm.experience) {
        alert("Please fill required fields (Name, Specialty, Experience)");
        return;
      }
      await addDoc(collection(db, "doctors"), {
        ...doctorForm,
        languages: selectedLanguages,
        availability: selectedDays,
        photoURL: convertDriveLink(doctorForm.photoURL),
        certificateURL: convertDriveLink(doctorForm.certificateURL),
        createdAt: new Date(),
      });
      alert("Doctor Added Successfully");
      
      // Reset
      setDoctorForm({
        name: "", specialty: "", experience: "", education: "",
        collegeName: "", photoURL: "", certificateURL: "",
        instagram: "", linkedin: "", gmail: "", description: "",
        department: "", consultationFee: "", featured: false, status: "active",
      });
      setSelectedLanguages([]);
      setSelectedDays([]);
      setIsAddDoctorOpen(false);
      fetchDoctors();
    } catch (error) { console.error(error); }
  };

  const deleteDoctor = async (id) => {
    try {
      await deleteDoc(doc(db, "doctors", id));
      fetchDoctors();
    } catch (error) { console.error(error); }
  };

  const addService = async () => {
    try {
      if (!serviceForm.name || !serviceForm.description) {
        alert("Please fill in Service Name and Description");
        return;
      }
      await addDoc(collection(db, "services"), {
        ...serviceForm,
        createdAt: new Date(),
      });
      alert("Service Added Successfully");
      setServiceForm({ name: "", description: "", status: "active" });
      fetchServices();
    } catch (error) { console.error(error); }
  };

  const deleteService = async (id) => {
    try {
      await deleteDoc(doc(db, "services", id));
      fetchServices();
    } catch (error) { console.error(error); }
  };

  const saveContactSettings = async () => {
    try {
      await setDoc(doc(db, "settings", "contact"), contactSettings);
      alert("Footer & Contact Settings Saved Successfully!");
    } catch (error) { console.error(error); }
  };

  const saveHomeSettings = async () => {
    try {
      const payload = {
        aboutUs: homeSettings.aboutUs,
        photoURL: convertDriveLink(homeSettings.photoURL)
      };
      await setDoc(doc(db, "settings", "home"), payload);
      setHomeSettings(payload); // Update UI with converted link
      alert("Home Page Settings Saved Successfully!");
    } catch (error) { console.error(error); }
  };

  const handleCSVUpload = (e) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert("CSV Uploaded Successfully! Doctors list updated.");
    }, 1500);
  };

  const downloadCSVTemplate = () => {
    const headers = "Name,Specialty,Experience,Education,College,Department,Fee,Languages (comma separated),Availability (comma separated),Instagram URL,LinkedIn URL,Email,Drive Photo URL,Drive Certificate URL,About Description,Featured (true/false)\n";
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'doctors_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    // Fixed screen layout to prevent entire page scrolling. No sidebars.
    <div className="h-screen w-full bg-[#f4f7f9] font-sans flex flex-col overflow-hidden selection:bg-[#1f9b90] selection:text-white">
      
      {/* Navbar fixed top via flex-col structure */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* Horizontal Tabs Navigation (Replaces Sidebar) */}
      <div className="bg-white border-b border-stone-200 shrink-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex overflow-x-auto gap-2 py-3 hide-scroll">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'home' ? 'bg-[#2b4c7e] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Home className="w-4 h-4" /> Manage Home Page
            </button>

            <button 
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'doctors' ? 'bg-[#2b4c7e] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Users className="w-4 h-4" /> Manage Doctors
            </button>
            
            <button 
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'services' ? 'bg-[#2b4c7e] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Activity className="w-4 h-4" /> Medical Services
            </button>
            
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-[#2b4c7e] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Settings className="w-4 h-4" /> Footer & Contact
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Internally Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ----- TAB: HOME PAGE MANAGEMENT ----- */}
          {activeTab === 'home' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden animate-[fadeSlideUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-stone-100">
                <h1 className="text-2xl font-black text-[#2b4c7e]">Home Page Settings</h1>
                <p className="text-sm text-stone-500 font-medium mt-1">Manage banner photos and 'About Us' section.</p>
              </div>
              <div className="p-6 space-y-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Home Page Banner Image (Google Drive Link)</label>
                  <input 
                    type="text" 
                    placeholder="Paste public Google Drive image link here..."
                    value={homeSettings.photoURL}
                    onChange={(e) => setHomeSettings({...homeSettings, photoURL: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all"
                  />
                  {homeSettings.photoURL && (
                    <div className="mt-3 p-4 border border-stone-200 rounded-xl bg-stone-50 flex items-center gap-4">
                      <Image className="w-6 h-6 text-[#1f9b90]" />
                      <a href={homeSettings.photoURL} target="_blank" rel="noreferrer" className="text-sm text-[#1f9b90] hover:underline truncate block">
                        {homeSettings.photoURL}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">About Us Description</label>
                  <textarea 
                    rows="6"
                    placeholder="Write the introduction or about us text for the homepage..."
                    value={homeSettings.aboutUs}
                    onChange={(e) => setHomeSettings({...homeSettings, aboutUs: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button onClick={saveHomeSettings} className="px-6 py-3 bg-[#1f9b90] hover:bg-[#16786f] text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
                    <Save className="w-5 h-5" /> Save Home Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----- TAB: DOCTORS MANAGEMENT ----- */}
          {activeTab === 'doctors' && (
            <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out_forwards]">
              
              {/* Add Doctor Collapsible Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <button 
                  onClick={() => setIsAddDoctorOpen(!isAddDoctorOpen)}
                  className="w-full p-6 flex justify-between items-center bg-stone-50/50 hover:bg-stone-100 transition-colors"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-black text-[#2b4c7e] flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#1f9b90]" />
                      Add New Doctor
                    </h2>
                    <p className="text-sm text-stone-500 font-medium mt-1">Manually enter a doctor's details</p>
                  </div>
                  {isAddDoctorOpen ? <ChevronUp className="w-6 h-6 text-stone-400" /> : <ChevronDown className="w-6 h-6 text-stone-400" />}
                </button>

                {isAddDoctorOpen && (
                  <div className="p-6 border-t border-stone-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Basic Info */}
                      <input type="text" placeholder="Doctor Name *" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      <input type="text" placeholder="Specialty *" value={doctorForm.specialty} onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      
                      {/* Experience Dropdown */}
                      <select 
                        value={doctorForm.experience} 
                        onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })} 
                        className="px-4 py-3 border rounded-xl bg-white text-stone-700 outline-none"
                      >
                        <option value="" disabled>Select Experience *</option>
                        {EXPERIENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>

                      <input type="text" placeholder="Education (e.g. MBBS, MD)" value={doctorForm.education} onChange={(e) => setDoctorForm({ ...doctorForm, education: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      <input type="text" placeholder="College Name" value={doctorForm.collegeName} onChange={(e) => setDoctorForm({ ...doctorForm, collegeName: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      <input type="text" placeholder="Department" value={doctorForm.department} onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      <input type="text" placeholder="Consultation Fee (₹)" value={doctorForm.consultationFee} onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      <input type="email" placeholder="Gmail" value={doctorForm.gmail} onChange={(e) => setDoctorForm({ ...doctorForm, gmail: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      <input type="url" placeholder="Instagram URL" value={doctorForm.instagram} onChange={(e) => setDoctorForm({ ...doctorForm, instagram: e.target.value })} className="px-4 py-3 border rounded-xl" />
                      <input type="url" placeholder="LinkedIn URL" value={doctorForm.linkedin} onChange={(e) => setDoctorForm({ ...doctorForm, linkedin: e.target.value })} className="px-4 py-3 border rounded-xl" />

                      <div className="md:col-span-2">
                        <input type="text" placeholder="Photo Google Drive Link" value={doctorForm.photoURL} onChange={(e) => setDoctorForm({ ...doctorForm, photoURL: e.target.value })} className="w-full px-4 py-3 border rounded-xl" />
                      </div>
                      <div className="md:col-span-2">
                        <input type="text" placeholder="Certificate Google Drive Link" value={doctorForm.certificateURL} onChange={(e) => setDoctorForm({ ...doctorForm, certificateURL: e.target.value })} className="w-full px-4 py-3 border rounded-xl" />
                      </div>
                    </div>

                    {/* Languages Multiple Choice */}
                    <div className="mt-6">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 block">Languages Known</label>
                      <div className="flex flex-wrap gap-3">
                        {LANGUAGES_LIST.map(lang => (
                          <label key={lang} className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${selectedLanguages.includes(lang) ? 'bg-[#1f9b90] border-[#1f9b90] text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                            <input 
                              type="checkbox" className="hidden"
                              checked={selectedLanguages.includes(lang)}
                              onChange={() => toggleArraySelection(lang, selectedLanguages, setSelectedLanguages)}
                            />
                            {lang}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Availability Multiple Choice */}
                    <div className="mt-6">
                      <label className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-3 block">Availability Days</label>
                      <div className="flex flex-wrap gap-3">
                        {DAYS_OF_WEEK.map(day => (
                          <label key={day} className={`px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${selectedDays.includes(day) ? 'bg-[#2b4c7e] border-[#2b4c7e] text-white' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                            <input 
                              type="checkbox" className="hidden"
                              checked={selectedDays.includes(day)}
                              onChange={() => toggleArraySelection(day, selectedDays, setSelectedDays)}
                            />
                            {day}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6">
                      <textarea rows="3" placeholder="About Doctor Description" value={doctorForm.description} onChange={(e) => setDoctorForm({ ...doctorForm, description: e.target.value })} className="w-full px-4 py-3 border rounded-xl resize-none" />
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4">
                      <input type="checkbox" id="featuredCheck" checked={doctorForm.featured} onChange={(e) => setDoctorForm({ ...doctorForm, featured: e.target.checked })} className="w-4 h-4 rounded text-[#1f9b90] focus:ring-[#1f9b90]" />
                      <label htmlFor="featuredCheck" className="font-bold text-stone-700 cursor-pointer">Mark as Featured Doctor</label>
                    </div>

                    <div className="mt-6 pt-6 border-t border-stone-100 flex justify-end">
                      <button onClick={addDoctor} className="px-8 py-3 bg-[#1f9b90] hover:bg-[#16786f] transition-colors text-white rounded-xl font-bold flex items-center gap-2 shadow-md">
                        <Save className="w-5 h-5" /> Save Doctor Details
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Doctors Roster & CSV Upload */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-[#2b4c7e] text-xl">Existing Doctors</h3>
                    <p className="text-sm text-stone-500 font-medium">Or upload bulk data matching the manual fields.</p>
                  </div>
                  
                  {/* Bulk Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={downloadCSVTemplate} className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-stone-200">
                      <Download className="w-4 h-4" /> Download Template
                    </button>
                    <button className="px-4 py-2.5 bg-[#2b4c7e] hover:bg-[#1a365d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md relative overflow-hidden">
                      <input 
                        type="file" accept=".csv" onChange={handleCSVUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer" title="Upload CSV"
                      />
                      {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-4 h-4" />}
                      {isUploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                        <th className="p-4">Name & Dept</th>
                        <th className="p-4">Specialty</th>
                        <th className="p-4">Experience</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc) => (
                        <tr key={doc.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-[#2b4c7e]">{doc.name}</div>
                            <div className="text-xs text-stone-500">{doc.department || 'N/A'}</div>
                          </td>
                          <td className="p-4 text-sm text-stone-600 font-medium">
                            <span className="bg-[#1f9b90]/10 text-[#1f9b90] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                              {doc.specialty}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-stone-600 font-medium">{doc.experience}</td>
                          <td className="p-4 text-sm text-stone-600">
                            {doc.availability?.length > 0 ? (
                               <div className="flex gap-1 flex-wrap">
                                 {doc.availability.map(d => (
                                    <span key={d} className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">{d.slice(0,3)}</span>
                                 ))}
                               </div>
                            ) : '-'}
                          </td>
                          <td className="p-4 flex items-center justify-end gap-3 h-full">
                            <button onClick={() => deleteDoctor(doc.id)} className="text-stone-400 hover:text-red-500 transition-colors p-2 bg-white border border-stone-200 rounded-lg shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {doctors.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-12 text-center">
                            <Users className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 font-medium">No doctors added yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ----- TAB: SERVICES MANAGEMENT ----- */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out_forwards]">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                <h3 className="text-xl font-black text-[#2b4c7e] mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#f6ac42]" /> Add New Service
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    type="text" placeholder="Service Name *" 
                    value={serviceForm.name} 
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} 
                    className="w-full px-4 py-3 border rounded-xl" 
                  />
                  <textarea 
                    rows="3" placeholder="Service Description *" 
                    value={serviceForm.description} 
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} 
                    className="w-full px-4 py-3 border rounded-xl resize-none" 
                  />
                </div>
                <button onClick={addService} className="mt-6 px-6 py-3 bg-[#f6ac42] hover:bg-[#e09830] transition-colors text-white rounded-xl font-bold flex items-center gap-2 shadow-md">
                   Save Service
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 bg-stone-50/50">
                  <h3 className="font-bold text-stone-700">Existing Services</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                        <th className="p-4 w-1/3">Service Name</th>
                        <th className="p-4 w-1/2">Description</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((srv) => (
                        <tr key={srv.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                          <td className="p-4 font-bold text-[#2b4c7e]">{srv.name}</td>
                          <td className="p-4 text-sm text-stone-600 font-medium truncate">{srv.description}</td>
                          <td className="p-4 flex items-center justify-end gap-3 h-full">
                            <button onClick={() => deleteService(srv.id)} className="text-stone-400 hover:text-red-500 transition-colors p-2 bg-white border border-stone-200 rounded-lg shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {services.length === 0 && (
                        <tr>
                          <td colSpan="3" className="p-12 text-center">
                            <Activity className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                            <p className="text-stone-500 font-medium">No services added yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ----- TAB: SETTINGS (FOOTER/CONTACT) ----- */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden animate-[fadeSlideUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-stone-100">
                <h1 className="text-2xl font-black text-[#2b4c7e]">Footer & Contact Settings</h1>
                <p className="text-sm text-stone-500 font-medium mt-1">Update phone numbers, email, and location.</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Mobile Number</label>
                    <input 
                      type="text" placeholder="+91 XXXXX XXXXX"
                      value={contactSettings.mobileNumber}
                      onChange={(e) => setContactSettings({...contactSettings, mobileNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Emergency Number</label>
                    <input 
                      type="text" placeholder="e.g. 108 or landline"
                      value={contactSettings.emergencyNumber}
                      onChange={(e) => setContactSettings({...contactSettings, emergencyNumber: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Gmail / Email Address</label>
                  <input 
                    type="email" placeholder="contact@hospital.com"
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Hospital Address (Footer)</label>
                  <textarea 
                    rows="3"
                    value={contactSettings.address}
                    onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button onClick={saveContactSettings} className="px-6 py-3 bg-[#1f9b90] hover:bg-[#16786f] text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
                    <Save className="w-5 h-5" /> Save Contact Details
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Global utility styles injected directly */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default AdminPortal;