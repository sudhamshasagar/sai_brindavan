import React, { useCallback, useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Activity,
  Eye,
  EyeOff,
  Stethoscope,
  BriefcaseMedical,
  Pencil,
  X,
  Save,
  Users,
  Search,
  CheckCircle2,
  Filter,
} from "lucide-react";

const DEFAULT_FORM = {
  name: "",
  description: "",
  doctorIds: [],
  isActive: true,
  isVisible: true,
};

const ServiceAdmin = () => {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  // Filters for Admin view
  const [serviceSearch, setServiceSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  // ---------------------------------------------------
  // 1. FETCH SERVICES & DOCTORS
  // ---------------------------------------------------
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const servicesQuery = query(
        collection(db, "services"),
        orderBy("createdAt", "desc")
      );

      const [doctorsSnapshot, servicesSnapshot] = await Promise.all([
        getDocs(collection(db, "doctors")),
        getDocs(servicesQuery),
      ]);

      const doctorsData = doctorsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      const servicesData = servicesSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setDoctors(doctorsData);
      setServices(servicesData);
    } catch (err) {
      console.error("Error fetching service admin data:", err);
      setError("Failed to load services and doctors. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Doctor map for fast O(1) doctor lookups
  const doctorMap = useMemo(() => {
    const map = new Map();
    doctors.forEach((docItem) => map.set(docItem.id, docItem));
    return map;
  }, [doctors]);

  // ---------------------------------------------------
  // 2. FORM ACTIONS & HANDLERS
  // ---------------------------------------------------
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorToggle = (doctorId) => {
    setFormData((prev) => {
      const exists = prev.doctorIds.includes(doctorId);
      return {
        ...prev,
        doctorIds: exists
          ? prev.doctorIds.filter((id) => id !== doctorId)
          : [...prev.doctorIds, doctorId],
      };
    });
  };

  const handleSelectAllDoctors = () => {
    setFormData((prev) => ({
      ...prev,
      doctorIds: doctors.map((d) => d.id),
    }));
  };

  const handleClearSelectedDoctors = () => {
    setFormData((prev) => ({
      ...prev,
      doctorIds: [],
    }));
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setEditingService(null);
    setDoctorSearch("");
  };

  const handleEditService = (service) => {
    clearMessages();
    setEditingService(service);
    setFormData({
      name: service.name || "",
      description: service.description || "",
      doctorIds: Array.isArray(service.doctorIds) ? service.doctorIds : [],
      isActive: service.isActive !== false,
      isVisible: service.isVisible !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------------------------------------------
  // 3. SUBMIT (CREATE OR UPDATE)
  // ---------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name || !description) {
      setError("Service Name and Description are required.");
      return;
    }

    try {
      setSubmitting(true);

      const servicePayload = {
        name,
        description,
        doctorIds: formData.doctorIds,
        isActive: formData.isActive,
        isVisible: formData.isVisible,
      };

      if (editingService) {
        // UPDATE
        const serviceRef = doc(db, "services", editingService.id);
        await updateDoc(serviceRef, servicePayload);

        setServices((prev) =>
          prev.map((s) =>
            s.id === editingService.id ? { ...s, ...servicePayload } : s
          )
        );
        setSuccess(`"${name}" was updated successfully.`);
      } else {
        // CREATE
        const createdService = {
          ...servicePayload,
          createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "services"), createdService);

        setServices((prev) => [
          {
            id: docRef.id,
            ...servicePayload,
            createdAt: new Date(),
          },
          ...prev,
        ]);
        setSuccess(`"${name}" has been published successfully.`);
      }

      resetForm();
    } catch (err) {
      console.error("Error saving service:", err);
      setError(
        editingService
          ? "Failed to update service. Please try again."
          : "Failed to publish service. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------
  // 4. DELETE SERVICE
  // ---------------------------------------------------
  const handleDeleteService = async (service) => {
    clearMessages();
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?\nThis cannot be undone.`
    );
    if (!confirmed) return;

    // Optimistic UI Removal
    const previousServices = [...services];
    setServices((prev) => prev.filter((item) => item.id !== service.id));
    if (editingService?.id === service.id) resetForm();

    try {
      await deleteDoc(doc(db, "services", service.id));
      setSuccess(`"${service.name}" was permanently removed.`);
    } catch (err) {
      console.error("Error deleting service:", err);
      setServices(previousServices); // Rollback on error
      setError("Failed to delete service. Changes reverted.");
    }
  };

  // ---------------------------------------------------
  // 5. QUICK TOGGLES (OPTIMISTIC UPDATES)
  // ---------------------------------------------------
  const toggleServiceVisibility = async (service) => {
    clearMessages();
    const nextVal = !service.isVisible;

    // Optimistic Update
    setServices((prev) =>
      prev.map((item) =>
        item.id === service.id ? { ...item, isVisible: nextVal } : item
      )
    );
    if (editingService?.id === service.id) {
      setFormData((prev) => ({ ...prev, isVisible: nextVal }));
    }

    try {
      await updateDoc(doc(db, "services", service.id), { isVisible: nextVal });
      setSuccess(
        nextVal
          ? `"${service.name}" is now visible on the website.`
          : `"${service.name}" is now hidden from the website.`
      );
    } catch (err) {
      console.error("Error toggling visibility:", err);
      // Rollback
      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id ? { ...item, isVisible: !nextVal } : item
        )
      );
      setError("Failed to update visibility. Reverted.");
    }
  };

  const toggleServiceActive = async (service) => {
    clearMessages();
    const nextVal = !service.isActive;

    // Optimistic Update
    setServices((prev) =>
      prev.map((item) =>
        item.id === service.id ? { ...item, isActive: nextVal } : item
      )
    );
    if (editingService?.id === service.id) {
      setFormData((prev) => ({ ...prev, isActive: nextVal }));
    }

    try {
      await updateDoc(doc(db, "services", service.id), { isActive: nextVal });
      setSuccess(
        nextVal
          ? `"${service.name}" is now marked active.`
          : `"${service.name}" is now marked inactive.`
      );
    } catch (err) {
      console.error("Error toggling active state:", err);
      // Rollback
      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id ? { ...item, isActive: !nextVal } : item
        )
      );
      setError("Failed to update active state. Reverted.");
    }
  };

  // ---------------------------------------------------
  // 6. FILTERED LISTS
  // ---------------------------------------------------
  const filteredDoctorsForForm = useMemo(() => {
    const q = doctorSearch.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.specialty?.toLowerCase().includes(q)
    );
  }, [doctors, doctorSearch]);

  const filteredServicesList = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [services, serviceSearch]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 font-sans text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a365d] text-white shadow-xs">
                <BriefcaseMedical className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#1a365d] sm:text-2xl">
                Clinical Services Admin
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage hospital departments, doctor assignments, and public availability.
            </p>
          </div>

          {editingService && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95"
            >
              <X className="h-4 w-4" />
              Cancel Editing
            </button>
          )}
        </div>

        {/* NOTIFICATIONS */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs sm:text-sm text-red-800 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <p className="font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs sm:text-sm text-emerald-800 shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <p className="font-medium">{success}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-emerald-500 hover:text-emerald-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* MAIN SPLIT GRID */}
        <div className="grid items-start gap-8 lg:grid-cols-12">

          {/* ===================================================
              FORM PANEL (Sticky on Large Screens)
          =================================================== */}
          <div className="lg:sticky lg:top-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
              
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="flex items-center gap-2 text-base font-bold text-[#1a365d]">
                  {editingService ? (
                    <>
                      <Pencil className="h-4 w-4 text-[#1f9b90]" />
                      Edit Department
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 text-[#1f9b90]" />
                      Create New Specialty
                    </>
                  )}
                </h2>
                {editingService && (
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                    Editing Mode
                  </span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Service Name */}
                <div>
                  <label
                    htmlFor="service-name"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="service-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Pediatric Care, Cardiology, Orthopedics"
                    disabled={submitting}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#1f9b90] focus:bg-white focus:ring-2 focus:ring-[#1f9b90]/15 disabled:bg-slate-100"
                  />
                </div>

                {/* 2. Description */}
                <div>
                  <label
                    htmlFor="service-description"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Clinical Scope / Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="service-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe treatments, inpatient facilities, and consultations offered..."
                    rows={3}
                    disabled={submitting}
                    required
                    maxLength={1000}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-[#1f9b90] focus:bg-white focus:ring-2 focus:ring-[#1f9b90]/15 disabled:bg-slate-100"
                  />
                </div>

                {/* 3. Assign Doctors */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Assigned Specialists
                    </label>
                    <span className="text-[11px] font-semibold text-[#1f9b90]">
                      {formData.doctorIds.length} Selected
                    </span>
                  </div>

                  {/* Doctor Search & Quick Select Bar */}
                  <div className="mb-2 flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={doctorSearch}
                        onChange={(e) => setDoctorSearch(e.target.value)}
                        placeholder="Search doctor name/specialty..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-2.5 text-xs placeholder:text-slate-400 focus:border-[#1f9b90] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSelectAllDoctors}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 whitespace-nowrap"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSelectedDoctors}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 whitespace-nowrap"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Doctor Checklist Window */}
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-2 custom-scrollbar">
                    {doctors.length === 0 ? (
                      <p className="p-3 text-center text-xs text-slate-400 italic">
                        No doctors found. Add doctors in directory first.
                      </p>
                    ) : filteredDoctorsForForm.length === 0 ? (
                      <p className="p-3 text-center text-xs text-slate-400">
                        No doctors match "{doctorSearch}"
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {filteredDoctorsForForm.map((doctor) => {
                          const isChecked = formData.doctorIds.includes(doctor.id);
                          return (
                            <label
                              key={doctor.id}
                              className={`flex cursor-pointer items-center gap-2.5 rounded-lg p-2 text-xs transition ${
                                isChecked
                                  ? "bg-teal-50/80 border border-teal-200/60 font-semibold"
                                  : "hover:bg-white border border-transparent"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleDoctorToggle(doctor.id)}
                                disabled={submitting}
                                className="h-4 w-4 rounded border-slate-300 text-[#1f9b90] focus:ring-[#1f9b90]"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="block truncate text-slate-800">
                                  {doctor.name || "Doctor"}
                                </span>
                                {doctor.specialty && (
                                  <span className="block truncate text-[10px] text-slate-400 font-normal">
                                    {doctor.specialty}
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Active & Visibility Switches */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  
                  {/* Active Toggle */}
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={() => handleToggle("isActive")}
                      disabled={submitting}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-800">
                        Operational
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Active department
                      </span>
                    </div>
                  </label>

                  {/* Visibility Toggle */}
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={() => handleToggle("isVisible")}
                      disabled={submitting}
                      className="h-4 w-4 rounded border-slate-300 text-[#1f9b90] focus:ring-[#1f9b90]"
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-800">
                        Public Visible
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Show on website
                      </span>
                    </div>
                  </label>

                </div>

                {/* 5. Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#1f9b90] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-slate-900/10 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Data...</span>
                    </>
                  ) : editingService ? (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Service</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Publish Service</span>
                    </>
                  )}
                </button>

                {editingService && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                )}

              </form>
            </div>
          </div>

          {/* ===================================================
              SERVICES DIRECTORY LIST
          =================================================== */}
          <div className="space-y-4 lg:col-span-7">
            
            {/* Top Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#1f9b90]" />
                <h2 className="text-base font-bold text-[#1a365d]">
                  Published Services ({services.length})
                </h2>
              </div>

              {/* Service Quick Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Filter published services..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#1f9b90] focus:outline-none"
                />
              </div>
            </div>

            {/* List Body */}
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-slate-400">
                <Loader2 className="mb-3 h-7 w-7 animate-spin text-[#1f9b90]" />
                <p className="text-xs font-medium">Loading clinical directory...</p>
              </div>
            ) : filteredServicesList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                <BriefcaseMedical className="mx-auto mb-2 h-10 w-10 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">No Services Found</p>
                <p className="mt-1 text-xs text-slate-400">
                  {serviceSearch
                    ? `No departments match "${serviceSearch}"`
                    : "Add your first hospital service using the form on the left."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredServicesList.map((service) => {
                  const isBeingEdited = editingService?.id === service.id;
                  const docCount = service.doctorIds?.length || 0;

                  return (
                    <div
                      key={service.id}
                      className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-2xs transition hover:shadow-xs ${
                        isBeingEdited
                          ? "border-[#1f9b90] ring-2 ring-[#1f9b90]/15"
                          : service.isVisible === false
                          ? "border-slate-200 bg-slate-50/60 opacity-80"
                          : "border-slate-200/90"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        
                        {/* Information Section */}
                        <div className="min-w-0 flex-1">
                          
                          {/* Title & Status Pills */}
                          <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-[#1a365d]">
                              {service.name}
                            </h3>

                            {/* Active/Inactive badge */}
                            {service.isActive === false && (
                              <span className="rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                                Inactive
                              </span>
                            )}

                            {/* Hidden badge */}
                            {service.isVisible === false && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                <EyeOff className="h-2.5 w-2.5" />
                                Hidden
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                            {service.description}
                          </p>

                          {/* Doctors Tag Pills */}
                          <div>
                            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Assigned Specialists ({docCount}):
                            </span>

                            {docCount === 0 ? (
                              <span className="text-xs italic text-slate-400">
                                No doctors assigned
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {service.doctorIds.map((id) => {
                                  const docInfo = doctorMap.get(id);
                                  return (
                                    <span
                                      key={id}
                                      className="inline-flex items-center gap-1 rounded-lg border border-teal-100 bg-teal-50/70 px-2 py-0.5 text-[11px] font-semibold text-[#1f9b90]"
                                    >
                                      <Stethoscope className="h-3 w-3" />
                                      {docInfo?.name || "Doctor"}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex shrink-0 items-center gap-1.5 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
                          
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleEditService(service)}
                            disabled={submitting}
                            title="Edit Service"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#1f9b90] hover:text-[#1f9b90] transition shadow-2xs"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Visibility button */}
                          <button
                            type="button"
                            onClick={() => toggleServiceVisibility(service)}
                            disabled={submitting}
                            title={
                              service.isVisible
                                ? "Hide from website"
                                : "Make visible on website"
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition shadow-2xs ${
                              service.isVisible
                                ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                : "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                            }`}
                          >
                            {service.isVisible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>

                          {/* Active / Inactive button */}
                          <button
                            type="button"
                            onClick={() => toggleServiceActive(service)}
                            disabled={submitting}
                            title={
                              service.isActive
                                ? "Set as Inactive"
                                : "Set as Active"
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition shadow-2xs ${
                              service.isActive
                                ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            <Activity className="h-4 w-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteService(service)}
                            disabled={submitting}
                            title="Delete Service"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-500 hover:border-red-200 hover:bg-red-50 transition shadow-2xs"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceAdmin;