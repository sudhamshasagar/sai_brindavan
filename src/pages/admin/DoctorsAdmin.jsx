import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import {db} from "../../firebase.js"
import { 
  Users, Upload, Plus, Trash2, Save, ChevronDown, ChevronUp, 
  Check, X, Search, Filter, Stethoscope, Mail, Globe, GraduationCap, Briefcase, Award, FileText, 
  CalendarDays, IndianRupee, Clock, Eye, Edit,
  MessageCircleCheck
} from 'lucide-react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const LANGUAGES_LIST = ['English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Malayalam', 'Marathi', 'Urdu', 'Arabic', 'French'];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

// --- Reusable UI Components ---
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

const PrimaryButton = ({ onClick, children, icon: Icon, className = "", variant = "primary", disabled = false }) => {
  const baseStyle = "px-6 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[#c19b6c] hover:bg-[#a37e50] text-white",
    secondary: "bg-slate-900 hover:bg-slate-800 text-white",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-white border border-red-200 text-red-600 hover:bg-red-50"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );
};

const MultiSelectDropdown = ({ options, selected, setSelected, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (option) => {
    selected.includes(option) ? setSelected(selected.filter(item => item !== option)) : setSelected([...selected, option]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:border-[#c19b6c] focus:ring-1 focus:ring-[#c19b6c] transition-all rounded-lg shadow-sm">
        <span className="truncate">{selected.length === 0 ? <span className="text-slate-400">{placeholder}</span> : selected.join(', ')}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-[fadeSlideDown_0.2s_ease-out]">
          <div className="p-1">
            {options.map((option) => (
              <label key={option} className={`flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-colors ${selected.includes(option) ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                <div className={`w-4 h-4 rounded flex items-center justify-center border mr-3 ${selected.includes(option) ? 'bg-[#c19b6c] border-[#c19b6c]' : 'bg-white border-slate-300'}`}>
                  {selected.includes(option) && <Check className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={selected.includes(option)} onChange={() => toggleSelection(option)} />
                <span className={`text-sm ${selected.includes(option) ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Initial Data Schema ---
const initialDoctorState = {
  name: "",
  designation: "",
  department: "",
  specialization: "",
  subSpecializations: [""],

  qualifications: [
    {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      year: ""
    }
  ],

  fellowships: [
    {
      id: crypto.randomUUID(),
      title: "",
      institution: ""
    }
  ],

  summary: "",
  experienceYears: "",

  professionalExperience: [
    {
  id: crypto.randomUUID(),
  hospital: "",
  designation: "",

  startMonth: "",
  startYear: "",

  endMonth: "",
  endYear: "",

  isPresent: false,

  description: ""
}
  ],

  expertise: [""],
  procedures: [""],
  clinicalInterests: [""],

  researchPublications: [
    {
      id: crypto.randomUUID(),
      title: "",
      journal: "",
      doi: ""
    }
  ],

  awards: [
    {
      id: crypto.randomUUID(),
      title: "",
      organization: "",
      year: ""
    }
  ],

  languages: [],

  availability: [
    {
      id: crypto.randomUUID(),
      day: "",
      startTime: "",
      endTime: ""
    }
  ],

  consultationFee: "",
  careerObjective: "",

  socialLinks: {
    email: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    website: ""
  },

  photoURL: "",
  featured: false,
  status: "active"
};

  // --- Accordion Wrapper ---
  const AccordionSection = ({ title, sectionKey, children,expandedSections,toggleSection, getSectionStatus }) => {
    const isOpen = expandedSections[sectionKey];
    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
        <button type="button" onClick={() => toggleSection(sectionKey)} className="w-full p-4 sm:p-5 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors focus:outline-none">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                {title}
            </h3>
            {getSectionStatus?.(sectionKey) === "complete" ? (
                <span className="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-full">
                ✓ Complete
                </span>
            ) : (
                <span className="px-2 py-1 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-full">
                ⚠ Incomplete
                </span>
            )}
        </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
        {isOpen && <div className="p-4 sm:p-6 border-t border-slate-100">{children}</div>}
      </div>
    );
  };

const DoctorsAdmin = () => {
  // Application State
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialDoctorState);
  
  // Filtering & Viewing State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewDoctor, setViewDoctor] = useState(null);

  // Accordion State
  const [expandedSections, setExpandedSections] = useState({ basic: true });
  const toggleSection = (sec) => setExpandedSections(p => ({ ...p, [sec]: !p[sec] }));
  const getSectionStatus = (sectionKey) => {
  switch (sectionKey) {

    case "basic":
      return form.name &&
             form.department &&
             form.specialization
        ? "complete"
        : "incomplete";

    case "summary":
      return form.summary
        ? "complete"
        : "incomplete";

    case "qualifications":
      return form.qualifications.some(
        q => q.degree || q.institution
      )
        ? "complete"
        : "incomplete";

    case "fellowships":
      return form.fellowships.some(
        f => f.title || f.institution
      )
        ? "complete"
        : "incomplete";

    case "experience":
      return form.professionalExperience.some(
        e => e.hospital || e.designation
      )
        ? "complete"
        : "incomplete";

    case "clinical":
      return (
        form.expertise.some(Boolean) ||
        form.procedures.some(Boolean) ||
        form.clinicalInterests.some(Boolean)
      )
        ? "complete"
        : "incomplete";

    case "research":
      return (
        form.researchPublications.some(
          p => p.title
        ) ||
        form.awards.some(
          a => a.title
        )
      )
        ? "complete"
        : "incomplete";

    case "logistics":
      return (
        form.languages.length > 0 ||
        form.consultationFee
      )
        ? "complete"
        : "incomplete";

    case "media":
      return form.photoURL
        ? "complete"
        : "incomplete";

    default:
      return "incomplete";
  }
};

  // Derived Filter Options
  const uniqueDepartments = [...new Set(doctors.map(d => d.department).filter(Boolean))];
  const uniqueSpecializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  useEffect(() => { fetchDoctors(); }, []);

  // --- Firebase Operations ---
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const qs = await getDocs(collection(db, "doctors"));
      setDoctors(qs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching doctors:", error); }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.department || !form.specialization) return alert("Name, Department, and Specialization are required.");
    
    // Clean empty trailing arrays before save
    const cleanForm = { ...form };
    const arrayKeys = ['subSpecializations', 'expertise', 'procedures', 'clinicalInterests'];
    arrayKeys.forEach(k => cleanForm[k] = cleanForm[k].filter(item => item.trim() !== ""));

    try {
      if (editingId) {
        await updateDoc(doc(db, "doctors", editingId), { ...cleanForm, updatedAt: serverTimestamp() });
        alert("Doctor updated successfully!");
      } else {
        await addDoc(collection(db, "doctors"), { ...cleanForm, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        alert("Doctor added successfully!");
      }
      closeForm();
      fetchDoctors();
    } catch (error) { console.error("Error saving doctor:", error); alert("Error saving record."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoc(doc(db, "doctors", id));
      fetchDoctors();
    } catch (error) { console.error("Error deleting:", error); }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "doctors", id), { status: currentStatus === "active" ? "inactive" : "active" });
      fetchDoctors();
    } catch (error) { console.error("Error updating status:", error); }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      await updateDoc(doc(db, "doctors", id), { featured: !currentFeatured });
      fetchDoctors();
    } catch (error) { console.error("Error updating featured status:", error); }
  };

  // --- Upload Handler ---
  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "hospital_upload"); // Replace with your actual preset
      const res = await fetch("https://api.cloudinary.com/v1_1/dyt28werz/image/upload", { method: "POST", body: formData });
      const data = await res.json();
      setForm(prev => ({ ...prev, [field]: data.secure_url }));
    } catch (error) { console.error("Upload failed:", error); alert("Upload failed."); }
    setIsUploading(false);
  };

  // --- Form Array Handlers ---
  const handleObjArrayChange = (arrayName, id, field, value) => {
  setForm(prev => ({
    ...prev,
    [arrayName]: prev[arrayName].map(item =>
      item.id === id
        ? { ...item, [field]: value }
        : item
    )
  }));
};
  const addObjArrayItem = (arrayName, emptyObj) => setForm(prev => ({ ...prev, [arrayName]: [...prev[arrayName], emptyObj] }));
  const removeObjArrayItem = (arrayName, id) =>
  setForm(prev => ({
    ...prev,
    [arrayName]: prev[arrayName].filter(
      item => item.id !== id
    )
  }));

  const handleStrArrayChange = (arrayName, index, value) => {
    setForm(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };
  const addStrArrayItem = (arrayName) => setForm(prev => ({ ...prev, [arrayName]: [...prev[arrayName], ""] }));
  const removeStrArrayItem = (arrayName, index) => setForm(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));

  // --- UI Helpers ---
  const openEditForm = (doctor) => {
    setForm({ ...initialDoctorState, ...doctor }); // Ensure all arrays exist
    setEditingId(doctor.id);
    setIsFormOpen(true);
    setExpandedSections({ basic: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setForm(initialDoctorState);
    setEditingId(null);
    setIsFormOpen(false);
    setExpandedSections({ basic: true });
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchName = doc.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDept ? doc.department === filterDept : true;
    const matchSpec = filterSpec ? doc.specialization === filterSpec : true;
    const matchStatus = filterStatus ? doc.status === filterStatus : true;
    return matchName && matchDept && matchSpec && matchStatus;
  });



  return (
    <div className="h-screen w-full bg-[#f8fafc] font-sans flex flex-col overflow-hidden selection:bg-[#c19b6c] selection:text-white">
      {/* Navbar Placeholder */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-[#c19b6c]" />
          <h1 className="text-xl font-black text-slate-900 tracking-tight">elv8 <span className="text-slate-400 font-medium">| Medical Control Panel</span></h1>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">
        <div className="max-w-[1400px] mx-auto space-y-8 animate-[fadeSlideUp_0.4s_ease-out_forwards]">

          {/* ================= HEADER & FORM TOGGLE ================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Doctors Management</h2>
                <p className="text-sm text-slate-500 mt-1">Add, update, or remove medical professionals.</p>
              </div>
              {!isFormOpen ? (
                <PrimaryButton onClick={() => setIsFormOpen(true)} icon={Plus}>Add New Doctor</PrimaryButton>
              ) : (
                <PrimaryButton onClick={closeForm} variant="outline" icon={X}>Cancel & Close</PrimaryButton>
              )}
            </div>

            {/* ================= MASSIVE ACCORDION FORM ================= */}
            {isFormOpen && (
              <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50">
                <div className="max-w-5xl mx-auto">
                  
                  <AccordionSection title="1. Basic Information" sectionKey="basic"expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div><InputLabel>Full Name *</InputLabel><MinimalInput type="text" placeholder="Dr. Jane Doe" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
                      <div><InputLabel>Designation</InputLabel><MinimalInput type="text" placeholder="Senior Consultant" value={form.designation} onChange={(e) => setForm({...form, designation: e.target.value})} /></div>
                      <div><InputLabel>Department *</InputLabel><MinimalInput type="text" placeholder="Cardiology" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} /></div>
                      <div><InputLabel>Primary Specialization *</InputLabel><MinimalInput type="text" placeholder="Interventional Cardiology" value={form.specialization} onChange={(e) => setForm({...form, specialization: e.target.value})} /></div>
                      <div><InputLabel>Experience (Years)</InputLabel><MinimalInput type="text" placeholder="15+ Years" value={form.experienceYears} onChange={(e) => setForm({...form, experienceYears: e.target.value})} /></div>
                      
                      {/* Sub-Specializations (String Array) */}
                      <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-slate-100">
                        <InputLabel>Sub-Specializations</InputLabel>
                        <div className="flex flex-wrap gap-3">
                          {form.subSpecializations.map((sub, idx) => (
                            <div key={idx} className="flex items-center gap-2 w-full sm:w-64">
                              <MinimalInput type="text" placeholder="e.g. Echocardiography" value={sub} onChange={(e) => handleStrArrayChange('subSpecializations', idx, e.target.value)} />
                              <button onClick={() => removeStrArrayItem('subSpecializations', idx)} className="text-slate-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          ))}
                          <button onClick={() => addStrArrayItem('subSpecializations')} className="text-xs font-bold text-[#c19b6c] hover:text-[#a37e50]">+ Add Sub-Specialization</button>
                        </div>
                      </div>

                      {/* Status & Featured */}
                      <div className="md:col-span-2 lg:col-span-3 flex flex-wrap gap-6 pt-4 border-t border-slate-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={form.status === 'active'} onChange={(e) => setForm({...form, status: e.target.checked ? 'active' : 'inactive'})} className="w-4 h-4 text-[#c19b6c] rounded border-slate-300" />
                          <span className="text-sm font-bold text-slate-700">Profile Active</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})} className="w-4 h-4 text-[#c19b6c] rounded border-slate-300" />
                          <span className="text-sm font-bold text-slate-700">Mark as Featured</span>
                        </label>
                      </div>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="2. Professional Summary & Objective" sectionKey="summary" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="space-y-6">
                      <div><InputLabel>Career Objective</InputLabel><MinimalInput type="text" placeholder="One line objective..." value={form.careerObjective} onChange={(e) => setForm({...form, careerObjective: e.target.value})} /></div>
                      <div><InputLabel>Detailed Profile Summary</InputLabel><MinimalTextarea rows="4" placeholder="Comprehensive professional background..." value={form.summary} onChange={(e) => setForm({...form, summary: e.target.value})} /></div>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="3. Education & Qualifications" sectionKey="qualifications" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="space-y-4">
                      {form.qualifications.map((qual) => (
                        <div key={qual.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
                          <div className="md:col-span-1"><InputLabel>Degree</InputLabel><MinimalInput placeholder="MBBS, MD" value={qual.degree} onChange={e => handleObjArrayChange('qualifications', qual.id, 'degree', e.target.value)} /></div>
                          <div className="md:col-span-2"><InputLabel>Institution</InputLabel><MinimalInput placeholder="University Name" value={qual.institution} onChange={e => handleObjArrayChange('qualifications', qual.id, 'institution', e.target.value)} /></div>
                          <div className="md:col-span-1"><InputLabel>Year</InputLabel><MinimalInput placeholder="YYYY" value={qual.year} onChange={e => handleObjArrayChange('qualifications', qual.id, 'year', e.target.value)} /></div>
                          <button onClick={() => removeObjArrayItem('qualifications', qual.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                      <button onClick={() => addObjArrayItem('qualifications', { id: crypto.randomUUID(), degree: "", institution: "", year: "" })} className="text-sm font-bold text-[#c19b6c] flex items-center gap-2"><Plus className="w-4 h-4"/> Add Qualification</button>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="4. Fellowships & Memberships" sectionKey="fellowships" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="space-y-4">
                      {form.fellowships.map((fell) => (
                        <div key={fell.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
                          <div><InputLabel>Title / Role</InputLabel><MinimalInput placeholder="Fellow / Member" value={fell.title} onChange={e => handleObjArrayChange('fellowships', fell.id, 'title', e.target.value)} /></div>
                          <div><InputLabel>Organization / Institution</InputLabel><MinimalInput placeholder="American College of Cardiology" value={fell.institution} onChange={e => handleObjArrayChange('fellowships', fell.id, 'institution', e.target.value)} /></div>
                          <button onClick={() => removeObjArrayItem('fellowships', fell.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                      <button onClick={() => addObjArrayItem('fellowships', { id: crypto.randomUUID(),title: "", institution: "" })} className="text-sm font-bold text-[#c19b6c] flex items-center gap-2"><Plus className="w-4 h-4"/> Add Fellowship</button>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="5. Professional Experience" sectionKey="experience" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="space-y-4">
                      {form.professionalExperience.map((exp) => (
                        <div key={exp.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg relative">
                          <div className="lg:col-span-2"><InputLabel>Hospital / Clinic</InputLabel><MinimalInput value={exp.hospital} onChange={e => handleObjArrayChange('professionalExperience',exp.id, 'hospital', e.target.value)} /></div>
                          <div className="lg:col-span-2"><InputLabel>Designation</InputLabel><MinimalInput value={exp.designation} onChange={e => handleObjArrayChange('professionalExperience',exp.id, 'designation', e.target.value)} /></div>
                          <div>
                            <InputLabel>Start Month</InputLabel>
                            <MinimalSelect
                                value={exp.startMonth}
                                onChange={e =>
                                handleObjArrayChange(
                                    "professionalExperience",
                                    exp.id,
                                    "startMonth",
                                    e.target.value
                                )
                                }
                            >
                                <option value="">Month</option>

                                {MONTHS.map(month => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                                ))}
                            </MinimalSelect>
                        </div>
                        <div>
                            <InputLabel>Start Year</InputLabel>

                            <MinimalInput
                                placeholder="2024"
                                value={exp.startYear}
                                onChange={e =>
                                handleObjArrayChange(
                                    "professionalExperience",
                                    exp.id,
                                    "startYear",
                                    e.target.value
                                )
                                }
                            />
                        </div>
                          <div>
                                <InputLabel>End Month</InputLabel>

                                <MinimalSelect
                                    disabled={exp.isPresent}
                                    value={exp.endMonth}
                                    onChange={e =>
                                    handleObjArrayChange(
                                        "professionalExperience",
                                        exp.id,
                                        "endMonth",
                                        e.target.value
                                    )
                                    }
                                >
                                    <option value="">Month</option>

                                    {MONTHS.map(month => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                    ))}
                                </MinimalSelect>
                                </div>
                                <div>
                                <InputLabel>End Year</InputLabel>

                                <MinimalInput
                                    disabled={exp.isPresent}
                                    placeholder="2025"
                                    value={exp.endYear}
                                    onChange={e =>
                                    handleObjArrayChange(
                                        "professionalExperience",
                                        exp.id,
                                        "endYear",
                                        e.target.value
                                    )
                                    }
                                />
                           </div>
                           <div className="lg:col-span-4">
                                <label className="flex items-center gap-3 cursor-pointer">

                                    <input
                                    type="checkbox"
                                    checked={exp.isPresent}
                                    onChange={e =>
                                        handleObjArrayChange(
                                        "professionalExperience",
                                        exp.id,
                                        "isPresent",
                                        e.target.checked
                                        )
                                    }
                                    />

                                    Currently Working Here
                                </label>
                            </div>
                          <div className="lg:col-span-4"><InputLabel>Role Description</InputLabel><MinimalTextarea rows="2" value={exp.description} onChange={e => handleObjArrayChange('professionalExperience',exp.id, 'description', e.target.value)} /></div>
                          <button onClick={() => removeObjArrayItem('professionalExperience',exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        </div>
                      ))}
                      <button onClick={() => addObjArrayItem('professionalExperience', { id: crypto.randomUUID(),hospital: "", designation: "", startDate: "", endDate: "", description: "" })} className="text-sm font-bold text-[#c19b6c] flex items-center gap-2"><Plus className="w-4 h-4"/> Add Experience</button>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="6. Clinical Data (Expertise, Procedures, Interests)" sectionKey="clinical" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Arrays mapping helper inline for brevity */}
                      {[
                        { key: 'expertise', label: 'Areas of Expertise' },
                        { key: 'procedures', label: 'Procedures Performed' },
                        { key: 'clinicalInterests', label: 'Clinical Interests' }
                      ].map(field => (
                        <div key={field.key}>
                          <InputLabel>{field.label}</InputLabel>
                          <div className="space-y-2">
                            {form[field.key].map((val, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <MinimalInput value={val} onChange={e => handleStrArrayChange(field.key, idx, e.target.value)} />
                                <button onClick={() => removeStrArrayItem(field.key, idx)} className="text-slate-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4"/></button>
                              </div>
                            ))}
                            <button onClick={() => addStrArrayItem(field.key)} className="text-xs font-bold text-[#c19b6c]">+ Add Line</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionSection>

                  <AccordionSection title="7. Research & Awards" sectionKey="research" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="space-y-8">
                      <div>
                        <InputLabel>Research Publications</InputLabel>
                        <div className="space-y-3 mt-2">
                          {form.researchPublications.map((pub) => (
                            <div key={pub.id} className="flex flex-col md:flex-row gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                              <MinimalInput placeholder="Publication Title" value={pub.title} onChange={e => handleObjArrayChange('researchPublications', pub.id, 'title', e.target.value)} />
                              <MinimalInput placeholder="Journal Name" value={pub.journal} onChange={e => handleObjArrayChange('researchPublications', pub.id, 'journal', e.target.value)} />
                              <MinimalInput placeholder="DOI / Link" value={pub.doi} onChange={e => handleObjArrayChange('researchPublications', pub.id, 'doi', e.target.value)} />
                              <button onClick={() => removeObjArrayItem('researchPublications', pub.id)} className="p-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          ))}
                          <button onClick={() => addObjArrayItem('researchPublications', {id: crypto.randomUUID(), title: "", journal: "", doi: "" })} className="text-xs font-bold text-[#c19b6c]">+ Add Publication</button>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-100">
                        <InputLabel>Awards & Achievements</InputLabel>
                        <div className="space-y-3 mt-2">
                          {form.awards.map((award) => (
                            <div key={award.id} className="flex flex-col md:flex-row gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                              <MinimalInput placeholder="Award Title" value={award.title} onChange={e => handleObjArrayChange('awards', award.id, 'title', e.target.value)} />
                              <MinimalInput placeholder="Organization" value={award.organization} onChange={e => handleObjArrayChange('awards', award.id, 'organization', e.target.value)} />
                              <MinimalInput placeholder="Year" value={award.year} onChange={e => handleObjArrayChange('awards', award.id, 'year', e.target.value)} />
                              <button onClick={() => removeObjArrayItem('awards', award.id)} className="p-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          ))}
                          <button onClick={() => addObjArrayItem('awards', { id: crypto.randomUUID(),title: "", organization: "", year: "" })} className="text-xs font-bold text-[#c19b6c]">+ Add Award</button>
                        </div>
                      </div>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="8. Logistics & Socials" sectionKey="logistics" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <InputLabel>Consultation Fee</InputLabel>
                          <MinimalInput type="text" placeholder="e.g. ₹500" value={form.consultationFee} onChange={e => setForm({...form, consultationFee: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                          <InputLabel>Languages Known</InputLabel>
                          <MultiSelectDropdown options={LANGUAGES_LIST} selected={form.languages} setSelected={(val) => setForm({...form, languages: val})} placeholder="Select Languages" />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <InputLabel>Weekly Availability</InputLabel>
                        <div className="space-y-3 mt-2">
                          {form.availability.map((av) => (
                            <div key={av.id} className="flex flex-col md:flex-row gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                              <MinimalSelect value={av.day} onChange={e => handleObjArrayChange('availability', av.id, 'day', e.target.value)}>
                                <option value="">Select Day</option>
                                {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                              </MinimalSelect>
                              <MinimalInput placeholder="Start (e.g. 09:00 AM)" value={av.startTime} onChange={e => handleObjArrayChange('availability', av.id, 'startTime', e.target.value)} />
                              <MinimalInput placeholder="End (e.g. 02:00 PM)" value={av.endTime} onChange={e => handleObjArrayChange('availability', av.id, 'endTime', e.target.value)} />
                              <button onClick={() => removeObjArrayItem('availability', av.id)} className="p-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          ))}
                          <button onClick={() => addObjArrayItem('availability', {id: crypto.randomUUID(), day: "", startTime: "", endTime: "" })} className="text-xs font-bold text-[#c19b6c]">+ Add Time Slot</button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <InputLabel>Social Profiles & Links</InputLabel>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          <MinimalInput type="email" placeholder="Email Address" value={form.socialLinks.email} onChange={e => setForm(p => ({...p, socialLinks: {...p.socialLinks, email: e.target.value}}))} />
                          <MinimalInput type="url" placeholder="LinkedIn URL" value={form.socialLinks.linkedin} onChange={e => setForm(p => ({...p, socialLinks: {...p.socialLinks, linkedin: e.target.value}}))} />
                          <MinimalInput type="url" placeholder="Instagram URL" value={form.socialLinks.instagram} onChange={e => setForm(p => ({...p, socialLinks: {...p.socialLinks, instagram: e.target.value}}))} />
                          <MinimalInput type="url" placeholder="YouTube URL" value={form.socialLinks.youtube} onChange={e => setForm(p => ({...p, socialLinks: {...p.socialLinks, youtube: e.target.value}}))} />
                          <div className="md:col-span-2"><MinimalInput type="url" placeholder="Personal Website URL" value={form.socialLinks.website} onChange={e => setForm(p => ({...p, socialLinks: {...p.socialLinks, website: e.target.value}}))} /></div>
                        </div>
                      </div>
                    </div>
                  </AccordionSection>

                  <AccordionSection title="9. Media Uploads" sectionKey="media" expandedSections={expandedSections} toggleSection={toggleSection} getSectionStatus={getSectionStatus}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <InputLabel>High-Res Profile Photo</InputLabel>
                        <div className="flex items-center gap-4 mt-2">
                          {form.photoURL && <img src={form.photoURL} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0" />}
                          <div className="flex-1">
                             <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'photoURL')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-200 rounded-lg bg-white transition-all cursor-pointer" />
                          </div>
                        </div>
                        {isUploading && <span className="text-xs font-bold text-[#c19b6c] animate-pulse block mt-2">Processing upload...</span>}
                      </div>
                      
                      {/* Placeholder for future cert uploads if schema expands to string URLs for them */}
                      <div>
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                           <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                           <p className="text-sm font-bold text-slate-600">Document Vault</p>
                           <p className="text-xs text-slate-400 mt-1">Certificates mapped to array items are managed via the respective sections above.</p>
                        </div>
                      </div>
                    </div>
                  </AccordionSection>

                  {/* Submit Area */}
                  <div className="mt-6 flex justify-end pt-6 border-t border-slate-200 sticky bottom-4 z-20 bg-slate-50/90 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <div className="flex gap-4">
                      <PrimaryButton onClick={closeForm} variant="outline">Cancel</PrimaryButton>
                      <PrimaryButton onClick={handleSubmit} icon={Save}>{editingId ? "Update Record" : "Save New Doctor"}</PrimaryButton>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* ================= DOCTOR DIRECTORY ================= */}
          {!isFormOpen && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col">
              
              {/* Directory Filters */}
              <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md shrink-0">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search by doctor name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c19b6c] focus:ring-1 focus:ring-[#c19b6c] rounded-lg shadow-sm" />
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                  <MinimalSelect value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                    <option value="">All Departments</option>
                    {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </MinimalSelect>
                  <MinimalSelect value={filterSpec} onChange={e => setFilterSpec(e.target.value)}>
                    <option value="">All Specializations</option>
                    {uniqueSpecializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </MinimalSelect>
                  <MinimalSelect value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </MinimalSelect>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                      <th className="p-5">Professional Details</th>
                      <th className="p-5">Department & Spec.</th>
                      <th className="p-5">Experience</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading ? (
                      <tr><td colSpan="5" className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading Directory Data...</td></tr>
                    ) : filteredDoctors.length === 0 ? (
                      <tr><td colSpan="5" className="p-12 text-center text-slate-500 font-medium">No records found matching criteria.</td></tr>
                    ) : (
                      filteredDoctors.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-sm relative">
                                {doc.photoURL ? <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 text-slate-300 m-3" />}
                                {doc.featured && <div className="absolute top-0 right-0 w-3 h-3 bg-[#c19b6c] rounded-bl-lg shadow-sm border-b border-l border-white"></div>}
                              </div>
                              <div>
                                <div className="font-black text-slate-900 text-sm md:text-base">{doc.name}</div>
                                <div className="text-xs font-bold text-[#c19b6c] mt-0.5 uppercase tracking-wide">{doc.designation || 'Consultant'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-slate-700 text-sm">{doc.department || '-'}</div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5 truncate max-w-[200px]">{doc.specialization || '-'}</div>
                          </td>
                          <td className="p-5 text-sm font-bold text-slate-600">{doc.experienceYears || '-'}</td>
                          <td className="p-5">
                            <div className="flex flex-col gap-2 items-start">
                              <button onClick={() => toggleStatus(doc.id, doc.status)} className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors ${doc.status === 'active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
                                {doc.status || 'inactive'}
                              </button>
                              <button onClick={() => toggleFeatured(doc.id, doc.featured)} className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors ${doc.featured ? 'text-[#c19b6c]' : 'text-slate-400 hover:text-slate-600'}`}>
                                {doc.featured ? '★ Featured' : '☆ Feature'}
                              </button>
                            </div>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setViewDoctor(doc)} className="p-2 text-slate-400 hover:text-[#c19b6c] hover:bg-[#c19b6c]/10 rounded-lg transition-colors"><Eye className="w-5 h-5" /></button>
                              <button onClick={() => openEditForm(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-5 h-5" /></button>
                              <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= VIEW PROFILE MODAL ================= */}
      {viewDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setViewDoctor(null)}></div>
          <div className="relative bg-[#f8fafc] w-full h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col max-w-5xl overflow-hidden animate-[fadeSlideUp_0.3s_ease-out_forwards]">
            
            <button onClick={() => setViewDoctor(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-md">
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto hide-scroll">
              {/* Profile Hero */}
              <div className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0 bg-slate-100">
                     <img src={viewDoctor.photoURL || "https://via.placeholder.com/600?text=Profile"} alt={viewDoctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center md:text-left pt-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                      <span className="bg-[#c19b6c]/10 text-[#c19b6c] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{viewDoctor.department}</span>
                      {viewDoctor.featured && <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">★ Featured</span>}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">{viewDoctor.name}</h2>
                    <p className="text-xl font-bold text-slate-500 mb-4">{viewDoctor.designation}</p>
                    {viewDoctor.careerObjective && <p className="text-sm font-medium text-slate-600 italic border-l-2 border-[#c19b6c] pl-4 mb-6">{viewDoctor.careerObjective}</p>}
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      {viewDoctor.socialLinks?.email && <a href={`mailto:${viewDoctor.socialLinks.email}`} className="text-slate-400 hover:text-[#c19b6c] transition-colors"><Mail className="w-5 h-5"/></a>}
                      {viewDoctor.socialLinks?.linkedin && <a href={viewDoctor.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#c19b6c] transition-colors"><MessageCircleCheck className="w-5 h-5"/></a>}
                      {viewDoctor.socialLinks?.website && <a href={viewDoctor.socialLinks.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#c19b6c] transition-colors"><Globe className="w-5 h-5"/></a>}
                    </div>
                  </div>
                </div>
              </div> 

              {/* Profile Details Grid */}
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
                
                {/* Summary & Core Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-[#c19b6c]"/> Profile Overview</h3>
                      <p className="text-slate-600 font-medium leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">{viewDoctor.summary || "No overview provided."}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100"><Award className="w-6 h-6 text-[#c19b6c]"/></div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</p>
                        <p className="font-black text-slate-900">{viewDoctor.experienceYears || "Not specified"}</p>
                      </div>
                    </div>
                    {viewDoctor.consultationFee && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100"><IndianRupee className="w-6 h-6 text-emerald-600"/></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fee</p>
                          <p className="font-black text-slate-900">{viewDoctor.consultationFee}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Qualifications */}
                  {(viewDoctor.qualifications?.length > 0 && viewDoctor.qualifications[0].degree) && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-[#c19b6c]"/> Education</h3>
                      <div className="space-y-6">
                        {viewDoctor.qualifications.map((q, i) => (
                          <div key={i} className="relative pl-6 border-l-2 border-slate-100">
                            <div className="absolute w-3 h-3 bg-white border-2 border-[#c19b6c] rounded-full -left-[7px] top-1"></div>
                            <h4 className="font-bold text-slate-900">{q.degree}</h4>
                            <p className="text-sm font-medium text-slate-500 mt-1">{q.institution}</p>
                            {q.year && <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md">{q.year}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience Timeline */}
                  {(viewDoctor.professionalExperience?.length > 0 && viewDoctor.professionalExperience[0].hospital) && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#c19b6c]"/> Experience</h3>
                      <div className="space-y-6">
                        {viewDoctor.professionalExperience.map((exp, i) => (
                          <div key={i} className="relative pl-6 border-l-2 border-slate-100">
                            <div className="absolute w-3 h-3 bg-[#c19b6c] rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                            <h4 className="font-bold text-slate-900">{exp.designation}</h4>
                            <p className="text-sm font-bold text-[#c19b6c] mt-1">{exp.hospital}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1.5 flex items-center gap-1.5"><CalendarDays className="w-3 h-3"/> {exp.startDate} - {exp.endDate || 'Present'}</p>
                            {exp.description && <p className="text-sm font-medium text-slate-500 mt-2">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lists (Expertise, etc) */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(viewDoctor.expertise?.length > 0 && viewDoctor.expertise[0]) && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Core Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {viewDoctor.expertise.map((e, i) => <span key={i} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">{e}</span>)}
                        </div>
                      </div>
                    )}
                    {(viewDoctor.procedures?.length > 0 && viewDoctor.procedures[0]) && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Procedures</h4>
                        <div className="flex flex-wrap gap-2">
                          {viewDoctor.procedures.map((p, i) => <span key={i} className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">{p}</span>)}
                        </div>
                      </div>
                    )}
                    {(viewDoctor.languages?.length > 0) && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {viewDoctor.languages.map((l, i) => <span key={i} className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg">{l}</span>)}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Required Internal Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

export default DoctorsAdmin;