import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase.js";
import {
  Users,
  Upload,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Search,
  Filter,
  Stethoscope,
  Mail,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  CalendarDays,
  IndianRupee,
  Clock,
  Eye,
  Edit,
  MessageCircleCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const LANGUAGES_LIST = [
  "English",
  "Kannada",
  "Hindi",
  "Telugu",
  "Tamil",
  "Malayalam",
  "Marathi",
  "Urdu",
  "Arabic",
  "French",
];

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
  "December",
];

// =====================================================
// FORM CONTROL COMPONENTS
// =====================================================

const InputLabel = ({ children }) => (
  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
    {children}
  </label>
);

const MinimalInput = (props) => (
  <input
    {...props}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1f9b90] focus:bg-white focus:ring-1 focus:ring-[#1f9b90] transition-all rounded-xl shadow-2xs"
  />
);

const MinimalSelect = (props) => (
  <select
    {...props}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#1f9b90] focus:bg-white focus:ring-1 focus:ring-[#1f9b90] transition-all rounded-xl shadow-2xs appearance-none cursor-pointer"
  >
    {props.children}
  </select>
);

const MinimalTextarea = (props) => (
  <textarea
    {...props}
    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1f9b90] focus:bg-white focus:ring-1 focus:ring-[#1f9b90] transition-all rounded-xl shadow-2xs resize-none"
  />
);

const PrimaryButton = ({
  onClick,
  children,
  icon: Icon,
  className = "",
  variant = "primary",
  disabled = false,
  type = "button",
}) => {
  const baseStyle =
    "px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#1a365d] to-[#1f9b90] hover:opacity-95 text-white active:scale-95",
    secondary: "bg-[#1a365d] hover:bg-[#122846] text-white",
    outline: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-white border border-red-200 text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const MultiSelectDropdown = ({ options, selected, setSelected, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (option) => {
    selected.includes(option)
      ? setSelected(selected.filter((item) => item !== option))
      : setSelected([...selected, option]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100/60 focus:border-[#1f9b90] focus:bg-white focus:outline-none transition-all rounded-xl shadow-2xs"
      >
        <span className="truncate">
          {selected.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            selected.join(", ")
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 animate-in fade-in zoom-in-95 duration-150">
          {options.map((option) => (
            <label
              key={option}
              className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold ${
                selected.includes(option)
                  ? "bg-teal-50 text-[#1f9b90]"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border mr-2.5 shrink-0 ${
                  selected.includes(option)
                    ? "bg-[#1f9b90] border-[#1f9b90]"
                    : "bg-white border-slate-300"
                }`}
              >
                {selected.includes(option) && (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={selected.includes(option)}
                onChange={() => toggleSelection(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// DATA SCHEMAS
// =====================================================

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
      year: "",
    },
  ],
  fellowships: [
    {
      id: crypto.randomUUID(),
      title: "",
      institution: "",
    },
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
      description: "",
    },
  ],
  expertise: [""],
  procedures: [""],
  clinicalInterests: [""],
  researchPublications: [
    {
      id: crypto.randomUUID(),
      title: "",
      journal: "",
      doi: "",
    },
  ],
  awards: [
    {
      id: crypto.randomUUID(),
      title: "",
      organization: "",
      year: "",
    },
  ],
  languages: [],
  availability: [
    {
      id: crypto.randomUUID(),
      day: "",
      startTime: "",
      endTime: "",
    },
  ],
  consultationFee: "",
  careerObjective: "",
  socialLinks: {
    email: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    website: "",
  },
  photoURL: "",
  featured: false,
  status: "active",
};

// =====================================================
// ACCORDION SECTION WRAPPER
// =====================================================

const AccordionSection = ({
  title,
  sectionKey,
  children,
  expandedSections,
  toggleSection,
  getSectionStatus,
}) => {
  const isOpen = expandedSections[sectionKey];
  const isComplete = getSectionStatus?.(sectionKey) === "complete";

  return (
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden mb-3 bg-white shadow-2xs">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full p-4 sm:p-5 flex justify-between items-center bg-white hover:bg-slate-50/80 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-xs sm:text-sm font-bold text-[#1a365d] uppercase tracking-wider">
            {title}
          </h3>

          {isComplete ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
              Optional / Incomplete
            </span>
          )}
        </div>

        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-slate-100 text-slate-500">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/40">
          {children}
        </div>
      )}
    </div>
  );
};

// =====================================================
// MAIN DOCTORS ADMIN COMPONENT
// =====================================================

const DoctorsAdmin = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialDoctorState);

  // Notifications
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewDoctor, setViewDoctor] = useState(null);

  // Accordion State
  const [expandedSections, setExpandedSections] = useState({ basic: true });

  const toggleSection = (sec) =>
    setExpandedSections((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));

  const getSectionStatus = (sectionKey) => {
    switch (sectionKey) {
      case "basic":
        return form.name && form.department && form.specialization
          ? "complete"
          : "incomplete";
      case "summary":
        return form.summary ? "complete" : "incomplete";
      case "qualifications":
        return form.qualifications.some((q) => q.degree || q.institution)
          ? "complete"
          : "incomplete";
      case "fellowships":
        return form.fellowships.some((f) => f.title || f.institution)
          ? "complete"
          : "incomplete";
      case "experience":
        return form.professionalExperience.some((e) => e.hospital || e.designation)
          ? "complete"
          : "incomplete";
      case "clinical":
        return form.expertise.some(Boolean) ||
          form.procedures.some(Boolean) ||
          form.clinicalInterests.some(Boolean)
          ? "complete"
          : "incomplete";
      case "research":
        return form.researchPublications.some((p) => p.title) ||
          form.awards.some((a) => a.title)
          ? "complete"
          : "incomplete";
      case "logistics":
        return form.languages.length > 0 || form.consultationFee
          ? "complete"
          : "incomplete";
      case "media":
        return form.photoURL ? "complete" : "incomplete";
      default:
        return "incomplete";
    }
  };

  // ---------------------------------------------------
  // FETCH DOCTORS
  // ---------------------------------------------------
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "doctors"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const doctorsData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setFeedback({ type: "error", message: "Failed to load doctor records." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Derived Filters
  const uniqueDepartments = useMemo(() => {
    return [...new Set(doctors.map((d) => d.department).filter(Boolean))].sort();
  }, [doctors]);

  const uniqueSpecializations = useMemo(() => {
    return [...new Set(doctors.map((d) => d.specialization).filter(Boolean))].sort();
  }, [doctors]);

  // ---------------------------------------------------
  // CLEAN DATA BEFORE WRITE
  // ---------------------------------------------------
  const cleanDoctorData = (source) => {
    const data = { ...source };

    const cleanStringArray = (val) =>
      Array.isArray(val)
        ? val.filter((item) => typeof item === "string" && item.trim() !== "")
        : [];

    const cleanObjectArray = (val, hasVal) =>
      Array.isArray(val)
        ? val.filter((item) => item && typeof item === "object" && hasVal(item))
        : [];

    data.subSpecializations = cleanStringArray(data.subSpecializations);
    data.expertise = cleanStringArray(data.expertise);
    data.procedures = cleanStringArray(data.procedures);
    data.clinicalInterests = cleanStringArray(data.clinicalInterests);
    data.languages = cleanStringArray(data.languages);

    data.qualifications = cleanObjectArray(
      data.qualifications,
      (item) => item.degree || item.institution || item.year
    );

    data.fellowships = cleanObjectArray(
      data.fellowships,
      (item) => item.title || item.institution
    );

    data.professionalExperience = cleanObjectArray(
      data.professionalExperience,
      (item) =>
        item.hospital ||
        item.designation ||
        item.startMonth ||
        item.startYear ||
        item.endMonth ||
        item.endYear ||
        item.description
    );

    data.researchPublications = cleanObjectArray(
      data.researchPublications,
      (item) => item.title || item.journal || item.doi
    );

    data.awards = cleanObjectArray(
      data.awards,
      (item) => item.title || item.organization || item.year
    );

    data.availability = cleanObjectArray(
      data.availability,
      (item) => item.day || item.startTime || item.endTime
    );

    data.socialLinks = {
      email: data.socialLinks?.email || "",
      linkedin: data.socialLinks?.linkedin || "",
      instagram: data.socialLinks?.instagram || "",
      youtube: data.socialLinks?.youtube || "",
      website: data.socialLinks?.website || "",
    };

    return data;
  };

  // ---------------------------------------------------
  // SAVE DOCTOR (CREATE / UPDATE)
  // ---------------------------------------------------
  const handleSubmit = async () => {
    if (!form.name || !form.department || !form.specialization) {
      setFeedback({
        type: "error",
        message: "Full Name, Department, and Primary Specialization are required.",
      });
      return;
    }

    const cleanForm = cleanDoctorData(form);
    setIsSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      if (editingId) {
        // UPDATE
        await updateDoc(doc(db, "doctors", editingId), {
          ...cleanForm,
          updatedAt: serverTimestamp(),
        });

        setDoctors((prev) =>
          prev.map((d) => (d.id === editingId ? { ...d, ...cleanForm } : d))
        );

        setFeedback({
          type: "success",
          message: `Dr. ${cleanForm.name} profile updated successfully.`,
        });
      } else {
        // CREATE
        const newDoctorData = {
          ...cleanForm,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "doctors"), newDoctorData);

        setDoctors((prev) => [
          {
            id: docRef.id,
            ...cleanForm,
            createdAt: new Date(),
          },
          ...prev,
        ]);

        setFeedback({
          type: "success",
          message: `Dr. ${cleanForm.name} registered into hospital database.`,
        });
      }

      closeForm();
    } catch (error) {
      console.error("Error saving doctor:", error);
      setFeedback({ type: "error", message: "Failed to commit doctor record." });
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------
  // DELETE DOCTOR (OPTIMISTIC)
  // ---------------------------------------------------
  const handleDelete = async (id, doctorName) => {
    if (!window.confirm(`Permanently remove record for Dr. ${doctorName}?`)) {
      return;
    }

    const rollback = [...doctors];
    setDoctors((prev) => prev.filter((d) => d.id !== id));

    try {
      await deleteDoc(doc(db, "doctors", id));
      setFeedback({
        type: "success",
        message: `Dr. ${doctorName} was removed from the database.`,
      });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      setDoctors(rollback);
      setFeedback({ type: "error", message: "Delete operation failed. Reverted." });
    }
  };

  // ---------------------------------------------------
  // TOGGLE STATUS (OPTIMISTIC)
  // ---------------------------------------------------
  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";

    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: nextStatus } : d))
    );

    try {
      await updateDoc(doc(db, "doctors", id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: currentStatus } : d))
      );
      setFeedback({ type: "error", message: "Failed to update profile status." });
    }
  };

  // ---------------------------------------------------
  // TOGGLE FEATURED (OPTIMISTIC)
  // ---------------------------------------------------
  const toggleFeatured = async (id, currentFeatured) => {
    const nextFeatured = !currentFeatured;

    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, featured: nextFeatured } : d))
    );

    try {
      await updateDoc(doc(db, "doctors", id), {
        featured: nextFeatured,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating featured status:", error);
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, featured: currentFeatured } : d))
      );
      setFeedback({ type: "error", message: "Failed to update featured flag." });
    }
  };

  // ---------------------------------------------------
  // CLOUDINARY UPLOAD HANDLER
  // ---------------------------------------------------
  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback({ type: "", message: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "hospital_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dyt28werz/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Upload rejected.");
      }

      setForm((prev) => ({
        ...prev,
        [field]: data.secure_url,
      }));

      setFeedback({ type: "success", message: "Photo uploaded successfully." });
    } catch (error) {
      console.error("Upload failed:", error);
      setFeedback({ type: "error", message: "Image upload failed. Check file size." });
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------------------------------------------
  // ARRAY MANAGEMENT HELPERS
  // ---------------------------------------------------
  const handleObjArrayChange = (arrayName, id, field, value) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addObjArrayItem = (arrayName, emptyObj) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], emptyObj],
    }));
  };

  const removeObjArrayItem = (arrayName, id) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((item) => item.id !== id),
    }));
  };

  const handleStrArrayChange = (arrayName, index, value) => {
    setForm((prev) => {
      const copy = [...prev[arrayName]];
      copy[index] = value;
      return { ...prev, [arrayName]: copy };
    });
  };

  const addStrArrayItem = (arrayName) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ""],
    }));
  };

  const removeStrArrayItem = (arrayName, index) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  // ---------------------------------------------------
  // FORM OPEN / CLOSE
  // ---------------------------------------------------
  const openEditForm = (doctor) => {
    setForm({
      ...initialDoctorState,
      ...doctor,
      subSpecializations: Array.isArray(doctor.subSpecializations)
        ? doctor.subSpecializations
        : [""],
      qualifications:
        Array.isArray(doctor.qualifications) && doctor.qualifications.length > 0
          ? doctor.qualifications
          : [{ id: crypto.randomUUID(), degree: "", institution: "", year: "" }],
      fellowships:
        Array.isArray(doctor.fellowships) && doctor.fellowships.length > 0
          ? doctor.fellowships
          : [{ id: crypto.randomUUID(), title: "", institution: "" }],
      professionalExperience:
        Array.isArray(doctor.professionalExperience) &&
        doctor.professionalExperience.length > 0
          ? doctor.professionalExperience
          : [
              {
                id: crypto.randomUUID(),
                hospital: "",
                designation: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                isPresent: false,
                description: "",
              },
            ],
      expertise:
        Array.isArray(doctor.expertise) && doctor.expertise.length > 0
          ? doctor.expertise
          : [""],
      procedures:
        Array.isArray(doctor.procedures) && doctor.procedures.length > 0
          ? doctor.procedures
          : [""],
      clinicalInterests:
        Array.isArray(doctor.clinicalInterests) &&
        doctor.clinicalInterests.length > 0
          ? doctor.clinicalInterests
          : [""],
      researchPublications:
        Array.isArray(doctor.researchPublications) &&
        doctor.researchPublications.length > 0
          ? doctor.researchPublications
          : [{ id: crypto.randomUUID(), title: "", journal: "", doi: "" }],
      awards:
        Array.isArray(doctor.awards) && doctor.awards.length > 0
          ? doctor.awards
          : [{ id: crypto.randomUUID(), title: "", organization: "", year: "" }],
      languages: Array.isArray(doctor.languages) ? doctor.languages : [],
      availability:
        Array.isArray(doctor.availability) && doctor.availability.length > 0
          ? doctor.availability
          : [
              {
                id: crypto.randomUUID(),
                day: "",
                startTime: "",
                endTime: "",
              },
            ],
      socialLinks: {
        ...initialDoctorState.socialLinks,
        ...(doctor.socialLinks || {}),
      },
    });

    setEditingId(doctor.id);
    setIsFormOpen(true);
    setExpandedSections({ basic: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setForm(initialDoctorState);
    setEditingId(null);
    setIsFormOpen(false);
    setExpandedSections({ basic: true });
  };

  // ---------------------------------------------------
  // FILTERED DIRECTORY VIEW
  // ---------------------------------------------------
  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return doctors.filter((docItem) => {
      const matchName = docItem.name?.toLowerCase().includes(q);
      const matchDept = filterDept ? docItem.department === filterDept : true;
      const matchSpec = filterSpec
        ? docItem.specialization === filterSpec
        : true;
      const matchStatus = filterStatus ? docItem.status === filterStatus : true;
      return matchName && matchDept && matchSpec && matchStatus;
    });
  }, [doctors, searchQuery, filterDept, filterSpec, filterStatus]);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans p-4 sm:p-6 lg:p-8 selection:bg-[#1f9b90] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ===================================================
            HEADER & TOP ACTIONS
        =================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a365d] text-white shadow-xs">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a365d] tracking-tight">
                Physician & Specialist Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Manage doctor credentials, clinical focus, OPD schedules, and web visibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFormOpen ? (
              <PrimaryButton onClick={() => setIsFormOpen(true)} icon={Plus}>
                Register New Doctor
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={closeForm} variant="outline" icon={X}>
                Close Form
              </PrimaryButton>
            )}
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {feedback.message && (
          <div
            className={`flex items-center justify-between rounded-xl p-3.5 text-xs sm:text-sm font-semibold shadow-2xs border ${
              feedback.type === "error"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "error" ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback({ type: "", message: "" })}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ===================================================
            ACCORDION FORM (EDIT OR ADD)
        =================================================== */}
        {isFormOpen && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#1a365d]">
                  {editingId ? "Edit Doctor Profile" : "Register Doctor into Hospital Registry"}
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in clinical certifications, education, and consultation hours.
                </p>
              </div>

              {editingId && (
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Editing Mode
                </span>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {/* 1. BASIC INFORMATION */}
              <AccordionSection
                title="1. Core Personal & Departmental Info"
                sectionKey="basic"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <InputLabel>Full Name (with Title) *</InputLabel>
                    <MinimalInput
                      placeholder="e.g. Dr. Ramesh Rao"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <InputLabel>Designation / Academic Role</InputLabel>
                    <MinimalInput
                      placeholder="e.g. Senior Consultant Surgeon"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    />
                  </div>

                  <div>
                    <InputLabel>Department *</InputLabel>
                    <MinimalInput
                      placeholder="e.g. Obstetrics & Gynecology"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <InputLabel>Primary Clinical Specialty *</InputLabel>
                    <MinimalInput
                      placeholder="e.g. High-Risk Pregnancy & Laparoscopy"
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <InputLabel>Years of Experience</InputLabel>
                    <MinimalInput
                      placeholder="e.g. 14+ Years"
                      value={form.experienceYears}
                      onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                    />
                  </div>

                  {/* Sub-Specializations */}
                  <div className="md:col-span-3 pt-3 border-t border-slate-100">
                    <InputLabel>Sub-Specialties & Secondary Focus</InputLabel>
                    <div className="flex flex-wrap gap-2.5">
                      {form.subSpecializations.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 w-full sm:w-60">
                          <MinimalInput
                            placeholder="e.g. Fetal Echocardiography"
                            value={sub}
                            onChange={(e) =>
                              handleStrArrayChange("subSpecializations", idx, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeStrArrayItem("subSpecializations", idx)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addStrArrayItem("subSpecializations")}
                        className="text-xs font-bold text-[#1f9b90] hover:underline self-center px-2 py-1"
                      >
                        + Add Sub-Specialty
                      </button>
                    </div>
                  </div>

                  {/* Active / Featured Toggles */}
                  <div className="md:col-span-3 flex flex-wrap gap-6 pt-3 border-t border-slate-100">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.status === "active"}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            status: e.target.checked ? "active" : "inactive",
                          })
                        }
                        className="w-4 h-4 text-[#1f9b90] rounded border-slate-300 focus:ring-[#1f9b90]"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Profile Active (Visible to Public Directory)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="w-4 h-4 text-[#f6ac42] rounded border-slate-300 focus:ring-[#f6ac42]"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Mark as Featured Doctor (Highlight on Top)
                      </span>
                    </label>
                  </div>
                </div>
              </AccordionSection>

              {/* 2. SUMMARY & OBJECTIVE */}
              <AccordionSection
                title="2. Bio Summary & Objective"
                sectionKey="summary"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="space-y-4">
                  <div>
                    <InputLabel>Career Objective / Guiding Philosophy</InputLabel>
                    <MinimalInput
                      placeholder="e.g. Dedicated to patient-centric maternal safety and early newborn care."
                      value={form.careerObjective}
                      onChange={(e) => setForm({ ...form, careerObjective: e.target.value })}
                    />
                  </div>
                  <div>
                    <InputLabel>Comprehensive Clinical Biography / Profile Summary</InputLabel>
                    <MinimalTextarea
                      rows="4"
                      placeholder="Detail training history, surgical expertise, and clinical care philosophy..."
                      value={form.summary}
                      onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    />
                  </div>
                </div>
              </AccordionSection>

              {/* 3. QUALIFICATIONS */}
              <AccordionSection
                title="3. Medical Education & Degrees"
                sectionKey="qualifications"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="space-y-3">
                  {form.qualifications.map((qual) => (
                    <div
                      key={qual.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3.5 bg-white border border-slate-200 rounded-xl relative"
                    >
                      <div>
                        <InputLabel>Degree / Diploma</InputLabel>
                        <MinimalInput
                          placeholder="e.g. MBBS, MS (OBG), DNB"
                          value={qual.degree}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "qualifications",
                              qual.id,
                              "degree",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <InputLabel>Medical College / University</InputLabel>
                        <MinimalInput
                          placeholder="e.g. Bangalore Medical College & Research Institute"
                          value={qual.institution}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "qualifications",
                              qual.id,
                              "institution",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <InputLabel>Graduation Year</InputLabel>
                        <MinimalInput
                          placeholder="e.g. 2014"
                          value={qual.year}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "qualifications",
                              qual.id,
                              "year",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeObjArrayItem("qualifications", qual.id)}
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      addObjArrayItem("qualifications", {
                        id: crypto.randomUUID(),
                        degree: "",
                        institution: "",
                        year: "",
                      })
                    }
                    className="text-xs font-bold text-[#1f9b90] flex items-center gap-1.5 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Degree</span>
                  </button>
                </div>
              </AccordionSection>

              {/* 4. FELLOWSHIPS */}
              <AccordionSection
                title="4. Fellowships & Memberships"
                sectionKey="fellowships"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="space-y-3">
                  {form.fellowships.map((fell) => (
                    <div
                      key={fell.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-white border border-slate-200 rounded-xl relative"
                    >
                      <div>
                        <InputLabel>Fellowship Title / Role</InputLabel>
                        <MinimalInput
                          placeholder="e.g. Fellow in Minimally Invasive Surgery (FMAS)"
                          value={fell.title}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "fellowships",
                              fell.id,
                              "title",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <InputLabel>Awarding Board / Institution</InputLabel>
                        <MinimalInput
                          placeholder="e.g. World Association of Laparoscopic Surgeons"
                          value={fell.institution}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "fellowships",
                              fell.id,
                              "institution",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeObjArrayItem("fellowships", fell.id)}
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      addObjArrayItem("fellowships", {
                        id: crypto.randomUUID(),
                        title: "",
                        institution: "",
                      })
                    }
                    className="text-xs font-bold text-[#1f9b90] flex items-center gap-1.5 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Fellowship</span>
                  </button>
                </div>
              </AccordionSection>

              {/* 5. PROFESSIONAL EXPERIENCE */}
              <AccordionSection
                title="5. Hospital Work History & Positions"
                sectionKey="experience"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="space-y-3">
                  {form.professionalExperience.map((exp) => (
                    <div
                      key={exp.id}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-white border border-slate-200 rounded-xl relative"
                    >
                      <div className="md:col-span-2">
                        <InputLabel>Hospital / Medical Center</InputLabel>
                        <MinimalInput
                          placeholder="e.g. Manipal Hospital, Bengaluru"
                          value={exp.hospital}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "professionalExperience",
                              exp.id,
                              "hospital",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <InputLabel>Designation / Clinical Role</InputLabel>
                        <MinimalInput
                          placeholder="e.g. Registrar / Assistant Professor"
                          value={exp.designation}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "professionalExperience",
                              exp.id,
                              "designation",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <InputLabel>Start Month</InputLabel>
                        <MinimalSelect
                          value={exp.startMonth}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "professionalExperience",
                              exp.id,
                              "startMonth",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Month</option>
                          {MONTHS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </MinimalSelect>
                      </div>

                      <div>
                        <InputLabel>Start Year</InputLabel>
                        <MinimalInput
                          placeholder="YYYY"
                          value={exp.startYear}
                          onChange={(e) =>
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
                          onChange={(e) =>
                            handleObjArrayChange(
                              "professionalExperience",
                              exp.id,
                              "endMonth",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Month</option>
                          {MONTHS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </MinimalSelect>
                      </div>

                      <div>
                        <InputLabel>End Year</InputLabel>
                        <MinimalInput
                          disabled={exp.isPresent}
                          placeholder="YYYY"
                          value={exp.endYear}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "professionalExperience",
                              exp.id,
                              "endYear",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="md:col-span-4 flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.isPresent}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "professionalExperience",
                                exp.id,
                                "isPresent",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-[#1f9b90] rounded border-slate-300 focus:ring-[#1f9b90]"
                          />
                          <span className="text-xs font-bold text-slate-700">
                            Currently Serving in this Role
                          </span>
                        </label>
                      </div>

                      <div className="md:col-span-4">
                        <InputLabel>Responsibilities (Optional)</InputLabel>
                        <MinimalTextarea
                          rows="2"
                          placeholder="Summary of outpatient & surgical procedures managed..."
                          value={exp.description}
                          onChange={(e) =>
                            handleObjArrayChange(
                              "professionalExperience",
                              exp.id,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeObjArrayItem("professionalExperience", exp.id)
                        }
                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      addObjArrayItem("professionalExperience", {
                        id: crypto.randomUUID(),
                        hospital: "",
                        designation: "",
                        startMonth: "",
                        startYear: "",
                        endMonth: "",
                        endYear: "",
                        isPresent: false,
                        description: "",
                      })
                    }
                    className="text-xs font-bold text-[#1f9b90] flex items-center gap-1.5 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Hospital Position</span>
                  </button>
                </div>
              </AccordionSection>

              {/* 6. CLINICAL DATA */}
              <AccordionSection
                title="6. Clinical Expertise & Procedures"
                sectionKey="clinical"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: "expertise", label: "Core Areas of Expertise" },
                    { key: "procedures", label: "Procedures Performed" },
                    { key: "clinicalInterests", label: "Clinical Interests" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <InputLabel>{field.label}</InputLabel>
                      {form[field.key].map((val, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <MinimalInput
                            placeholder="e.g. Laparoscopy, Neonatal Resuscitation"
                            value={val}
                            onChange={(e) =>
                              handleStrArrayChange(field.key, idx, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeStrArrayItem(field.key, idx)}
                            className="p-2 text-slate-300 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addStrArrayItem(field.key)}
                        className="text-xs font-bold text-[#1f9b90] block pt-1 hover:underline"
                      >
                        + Add {field.label.slice(0, 12)}
                      </button>
                    </div>
                  ))}
                </div>
              </AccordionSection>

              {/* 7. RESEARCH & AWARDS */}
              <AccordionSection
                title="7. Research Papers & Awards"
                sectionKey="research"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="space-y-6">
                  {/* Publications */}
                  <div>
                    <InputLabel>Research Publications</InputLabel>
                    <div className="space-y-3 mt-1.5">
                      {form.researchPublications.map((pub) => (
                        <div
                          key={pub.id}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-white border border-slate-200 rounded-xl relative"
                        >
                          <MinimalInput
                            placeholder="Paper Title"
                            value={pub.title}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "researchPublications",
                                pub.id,
                                "title",
                                e.target.value
                              )
                            }
                          />
                          <MinimalInput
                            placeholder="Journal Name"
                            value={pub.journal}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "researchPublications",
                                pub.id,
                                "journal",
                                e.target.value
                              )
                            }
                          />
                          <MinimalInput
                            placeholder="DOI or Paper Link"
                            value={pub.doi}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "researchPublications",
                                pub.id,
                                "doi",
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeObjArrayItem("researchPublications", pub.id)
                            }
                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addObjArrayItem("researchPublications", {
                            id: crypto.randomUUID(),
                            title: "",
                            journal: "",
                            doi: "",
                          })
                        }
                        className="text-xs font-bold text-[#1f9b90] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Publication</span>
                      </button>
                    </div>
                  </div>

                  {/* Awards */}
                  <div className="pt-4 border-t border-slate-100">
                    <InputLabel>Awards & Distinctions</InputLabel>
                    <div className="space-y-3 mt-1.5">
                      {form.awards.map((award) => (
                        <div
                          key={award.id}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-white border border-slate-200 rounded-xl relative"
                        >
                          <MinimalInput
                            placeholder="Award Title"
                            value={award.title}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "awards",
                                award.id,
                                "title",
                                e.target.value
                              )
                            }
                          />
                          <MinimalInput
                            placeholder="Conferring Organization"
                            value={award.organization}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "awards",
                                award.id,
                                "organization",
                                e.target.value
                              )
                            }
                          />
                          <MinimalInput
                            placeholder="Year"
                            value={award.year}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "awards",
                                award.id,
                                "year",
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeObjArrayItem("awards", award.id)}
                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addObjArrayItem("awards", {
                            id: crypto.randomUUID(),
                            title: "",
                            organization: "",
                            year: "",
                          })
                        }
                        className="text-xs font-bold text-[#1f9b90] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Award</span>
                      </button>
                    </div>
                  </div>
                </div>
              </AccordionSection>

              {/* 8. LOGISTICS & OPD AVAILABILITY */}
              <AccordionSection
                title="8. Consultation Fees & OPD Schedule"
                sectionKey="logistics"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <InputLabel>Consultation Fee</InputLabel>
                      <MinimalInput
                        placeholder="e.g. ₹500"
                        value={form.consultationFee}
                        onChange={(e) =>
                          setForm({ ...form, consultationFee: e.target.value })
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <InputLabel>Languages Spoken</InputLabel>
                      <MultiSelectDropdown
                        options={LANGUAGES_LIST}
                        selected={form.languages}
                        setSelected={(val) => setForm({ ...form, languages: val })}
                        placeholder="Select Languages"
                      />
                    </div>
                  </div>

                  {/* Availability Slots */}
                  <div className="pt-3 border-t border-slate-100">
                    <InputLabel>Weekly OPD Consultation Slots</InputLabel>
                    <div className="space-y-3 mt-1.5">
                      {form.availability.map((av) => (
                        <div
                          key={av.id}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-white border border-slate-200 rounded-xl relative"
                        >
                          <MinimalSelect
                            value={av.day}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "availability",
                                av.id,
                                "day",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Day</option>
                            {DAYS_OF_WEEK.map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </MinimalSelect>

                          <MinimalInput
                            placeholder="Start (e.g. 09:00 AM)"
                            value={av.startTime}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "availability",
                                av.id,
                                "startTime",
                                e.target.value
                              )
                            }
                          />

                          <MinimalInput
                            placeholder="End (e.g. 01:00 PM)"
                            value={av.endTime}
                            onChange={(e) =>
                              handleObjArrayChange(
                                "availability",
                                av.id,
                                "endTime",
                                e.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() => removeObjArrayItem("availability", av.id)}
                            className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          addObjArrayItem("availability", {
                            id: crypto.randomUUID(),
                            day: "",
                            startTime: "",
                            endTime: "",
                          })
                        }
                        className="text-xs font-bold text-[#1f9b90] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Time Slot</span>
                      </button>
                    </div>
                  </div>

                  {/* Social Profiles */}
                  <div className="pt-3 border-t border-slate-100">
                    <InputLabel>Contact & Social Links</InputLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-1.5">
                      <MinimalInput
                        type="email"
                        placeholder="Official Email Address"
                        value={form.socialLinks.email}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            socialLinks: { ...form.socialLinks, email: e.target.value },
                          })
                        }
                      />
                      <MinimalInput
                        type="url"
                        placeholder="LinkedIn Profile URL"
                        value={form.socialLinks.linkedin}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            socialLinks: { ...form.socialLinks, linkedin: e.target.value },
                          })
                        }
                      />
                      <MinimalInput
                        type="url"
                        placeholder="Personal / Academic Website"
                        value={form.socialLinks.website}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            socialLinks: { ...form.socialLinks, website: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </AccordionSection>

              {/* 9. MEDIA UPLOADS */}
              <AccordionSection
                title="9. High-Res Doctor Photograph"
                sectionKey="media"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                getSectionStatus={getSectionStatus}
              >
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white border border-slate-200 rounded-2xl">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100 flex items-center justify-center shadow-xs">
                    {form.photoURL ? (
                      <img
                        src={form.photoURL}
                        alt="Preview"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <Users className="w-10 h-10 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <InputLabel>Upload Formal Medical Portrait</InputLabel>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, "photoURL")}
                      disabled={isUploading}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1a365d] file:text-white hover:file:opacity-90 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer"
                    />
                    {isUploading && (
                      <p className="text-xs font-semibold text-[#1f9b90] animate-pulse">
                        Uploading to secure medical storage...
                      </p>
                    )}
                  </div>
                </div>
              </AccordionSection>

              {/* STICKY BOTTOM FORM ACTIONS */}
              <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-end gap-3 rounded-2xl bg-white/95 p-3.5 backdrop-blur-md border border-slate-200 shadow-md">
                <PrimaryButton onClick={closeForm} variant="outline">
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  icon={Save}
                  disabled={isUploading || isSaving}
                >
                  {isSaving ? "Saving..." : editingId ? "Update Doctor Profile" : "Publish Record"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================
            DOCTORS DIRECTORY TABLE
        =================================================== */}
        {!isFormOpen && (
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
            {/* Filter Deck */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col lg:flex-row items-center justify-between gap-3">
              <div className="relative w-full lg:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1f9b90] rounded-xl shadow-2xs"
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
                <MinimalSelect
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </MinimalSelect>

                <MinimalSelect
                  value={filterSpec}
                  onChange={(e) => setFilterSpec(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {uniqueSpecializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </MinimalSelect>

                <MinimalSelect
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </MinimalSelect>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4 pl-6">Doctor Information</th>
                    <th className="p-4">Department & Specialty</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Directory Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white text-xs sm:text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400 animate-pulse font-medium">
                        Loading hospital specialist records...
                      </td>
                    </tr>
                  ) : filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                        No physician profiles match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* 1. Doctor Info */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
                              {doctor.photoURL ? (
                                <img
                                  src={doctor.photoURL}
                                  alt={doctor.name}
                                  className="h-full w-full object-cover object-top"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <Users className="w-6 h-6 text-slate-300 m-auto mt-3" />
                              )}
                              {doctor.featured && (
                                <div className="absolute top-0 right-0 h-3 w-3 bg-[#f6ac42] rounded-bl-md shadow-2xs" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-extrabold text-[#1a365d] leading-snug break-words">
                                {doctor.name}
                              </p>
                              <p className="text-[11px] font-semibold text-slate-500 truncate">
                                {doctor.designation || "Consultant"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* 2. Department */}
                        <td className="p-4">
                          <span className="inline-block rounded-md bg-teal-50 border border-teal-200/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1f9b90]">
                            {doctor.department || "General"}
                          </span>
                          <p className="mt-1 text-xs text-slate-600 font-medium truncate max-w-xs">
                            {doctor.specialization || "-"}
                          </p>
                        </td>

                        {/* 3. Experience */}
                        <td className="p-4 font-semibold text-slate-700">
                          {doctor.experienceYears || "-"}
                        </td>

                        {/* 4. Status Toggles */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1 items-start">
                            <button
                              type="button"
                              onClick={() => toggleStatus(doctor.id, doctor.status)}
                              className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${
                                doctor.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-600 border border-rose-200"
                              }`}
                            >
                              {doctor.status || "inactive"}
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleFeatured(doctor.id, doctor.featured)}
                              className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${
                                doctor.featured
                                  ? "text-[#f6ac42]"
                                  : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              <Star className={`w-3 h-3 ${doctor.featured ? "fill-current" : ""}`} />
                              <span>{doctor.featured ? "Featured" : "Set Featured"}</span>
                            </button>
                          </div>
                        </td>

                        {/* 5. Actions */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setViewDoctor(doctor)}
                              title="Inspect Full Profile Dossier"
                              className="p-2 text-slate-500 hover:text-[#1f9b90] hover:bg-teal-50 rounded-xl transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditForm(doctor)}
                              title="Edit Record"
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(doctor.id, doctor.name)}
                              title="Delete Record"
                              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

      {/* ===================================================
          FULL DOSSIER INSPECTOR DRAWER / MODAL
      =================================================== */}
      {viewDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setViewDoctor(null)}
          />

          <div className="relative bg-white w-full h-full sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col max-w-4xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#1a365d] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/10 border border-white/20">
                  {viewDoctor.photoURL ? (
                    <img
                      src={viewDoctor.photoURL}
                      alt={viewDoctor.name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <Users className="w-7 h-7 text-white/50 m-auto mt-3" />
                  )}
                </div>
                <div>
                  <span className="rounded-md bg-teal-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                    {viewDoctor.department}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold leading-snug">
                    {viewDoctor.name}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {viewDoctor.designation || "Consultant"} · {viewDoctor.specialization}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewDoctor(null)}
                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs sm:text-sm">
              {/* Summary */}
              {viewDoctor.summary && (
                <div>
                  <InputLabel>Doctor Overview</InputLabel>
                  <p className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed text-slate-600">
                    {viewDoctor.summary}
                  </p>
                </div>
              )}

              {/* Qualifications & Fellowships */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {viewDoctor.qualifications?.length > 0 && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <InputLabel>Education</InputLabel>
                    <div className="space-y-2 mt-2">
                      {viewDoctor.qualifications.map((q, i) => (
                        <div key={i}>
                          <p className="font-bold text-slate-800">{q.degree}</p>
                          <p className="text-slate-500 text-xs">{q.institution} {q.year && `(${q.year})`}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewDoctor.fellowships?.length > 0 && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <InputLabel>Fellowships</InputLabel>
                    <div className="space-y-2 mt-2">
                      {viewDoctor.fellowships.map((f, i) => (
                        <div key={i}>
                          <p className="font-bold text-slate-800">{f.title}</p>
                          <p className="text-slate-500 text-xs">{f.institution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clinical Focus */}
              {viewDoctor.expertise?.length > 0 && (
                <div>
                  <InputLabel>Core Expertise</InputLabel>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {viewDoctor.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-teal-50 border border-teal-200/60 px-2.5 py-1 text-xs font-semibold text-[#1a365d]"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* OPD Availability */}
              {viewDoctor.availability?.length > 0 && (
                <div>
                  <InputLabel>OPD Consultation Schedule</InputLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
                    {viewDoctor.availability.map((av, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <p className="font-bold text-slate-800">{av.day}</p>
                        <p className="text-slate-500 font-medium">
                          {av.startTime || "8:00 AM"} – {av.endTime || "2:00 PM"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Hospital Fee: {viewDoctor.consultationFee || "Standard OPD"}
              </span>
              <button
                type="button"
                onClick={() => setViewDoctor(null)}
                className="px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsAdmin;