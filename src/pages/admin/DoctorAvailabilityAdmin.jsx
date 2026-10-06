import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  Loader2,
  CalendarDays,
  Ban,
  CheckCircle2,
  Scissors,
  Stethoscope,
  Bell,
  Plus,
  Trash2,
  X,
  Star,
  BriefcaseMedical,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAY_ORDER = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const DoctorAvailabilityAdmin = () => {
  // ---------------------------------------------------
  // MAIN STATE
  // ---------------------------------------------------
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Active Tab: 'schedule' | 'block' | 'specialist'
  const [activeTab, setActiveTab] = useState('schedule');

  // ---------------------------------------------------
  // SCHEDULE STATE
  // ---------------------------------------------------
  const [scheduleType, setScheduleType] = useState('week');
  const [availability, setAvailability] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    customDates: [],
  });
  const [tempDate, setTempDate] = useState('');

  // ---------------------------------------------------
  // BLOCK / OT STATE
  // ---------------------------------------------------
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({
    title: '',
    details: '',
    date: '',
    startTime: '',
    endTime: '',
    notifyDoctor: true,
  });

  // ---------------------------------------------------
  // WEEKLY SPECIALISTS STATE
  // ---------------------------------------------------
  const [weeklySpecialists, setWeeklySpecialists] = useState([]);
  const [specialistForm, setSpecialistForm] = useState({
    doctorId: '',
    doctorName: '',
    specialty: '',
    expertise: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    startDate: '',
    endDate: '',
    photoURL: '',
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3200);
  };

  // ---------------------------------------------------
  // 1. FETCH ACTIVE DOCTORS
  // ---------------------------------------------------
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
        setDoctors(
          doctorsSnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      } catch (error) {
        console.error('Error fetching doctors:', error);
        showMessage('error', 'Unable to load hospital doctors list.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // ---------------------------------------------------
  // 2. FETCH BLOCKS FOR SELECTED DOCTOR
  // ---------------------------------------------------
  useEffect(() => {
    if (!selectedDoctorId) {
      setBlocks([]);
      return;
    }

    const fetchBlocks = async () => {
      try {
        const blocksQuery = query(
          collection(db, 'doctor_blocks'),
          where('doctorId', '==', selectedDoctorId)
        );
        const snapshot = await getDocs(blocksQuery);
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        data.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        setBlocks(data);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        showMessage('error', 'Unable to load doctor exceptions.');
      }
    };

    fetchBlocks();
  }, [selectedDoctorId]);

  // ---------------------------------------------------
  // 3. FETCH WEEKLY SPECIALISTS
  // ---------------------------------------------------
  useEffect(() => {
    const fetchWeeklySpecialists = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'weekly_specialists'));
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        data.sort((a, b) => {
          const first = DAY_ORDER[a.day] || 99;
          const second = DAY_ORDER[b.day] || 99;
          if (first !== second) return first - second;
          return (a.startTime || '').localeCompare(b.startTime || '');
        });

        setWeeklySpecialists(data);
      } catch (error) {
        console.error('Error fetching weekly specialists:', error);
        showMessage('error', 'Unable to load visiting specialists.');
      }
    };

    fetchWeeklySpecialists();
  }, []);

  // ---------------------------------------------------
  // CUSTOM DATE ACTIONS
  // ---------------------------------------------------
  const handleAddCustomDate = () => {
    if (!tempDate) return;
    if (availability.customDates.includes(tempDate)) {
      showMessage('error', 'This date is already added.');
      return;
    }

    setAvailability((prev) => ({
      ...prev,
      customDates: [...prev.customDates, tempDate].sort(),
    }));
    setTempDate('');
  };

  const removeCustomDate = (dateToRemove) => {
    setAvailability((prev) => ({
      ...prev,
      customDates: prev.customDates.filter((d) => d !== dateToRemove),
    }));
  };

  // ---------------------------------------------------
  // SAVE AVAILABILITY (ATOMIC FIRESTORE BATCH)
  // ---------------------------------------------------
  const handleSaveAvailability = async () => {
    if (!selectedDoctorId) {
      showMessage('error', 'Please select a doctor first.');
      return;
    }

    if (!availability.startTime || !availability.endTime) {
      showMessage('error', 'Please specify consultation hours.');
      return;
    }

    if (availability.startTime >= availability.endTime) {
      showMessage('error', 'End time must be later than start time.');
      return;
    }

    if (
      scheduleType !== 'custom' &&
      (!availability.startDate || !availability.endDate)
    ) {
      showMessage('error', 'Please choose start and end dates.');
      return;
    }

    if (
      scheduleType !== 'custom' &&
      availability.startDate > availability.endDate
    ) {
      showMessage('error', 'End date cannot be earlier than start date.');
      return;
    }

    if (
      scheduleType === 'custom' &&
      availability.customDates.length === 0
    ) {
      showMessage('error', 'Add at least one custom consultation date.');
      return;
    }

    setSubmitting(true);

    try {
      const existingQuery = query(
        collection(db, 'doctor_availability'),
        where('doctorId', '==', selectedDoctorId)
      );
      const existingSnapshot = await getDocs(existingQuery);

      const batch = writeBatch(db);

      // Clean existing records in atomic batch
      existingSnapshot.docs.forEach((d) => {
        batch.delete(d.ref);
      });

      const schedulePayload = {
        doctorId: selectedDoctorId,
        type: scheduleType,
        startTime: availability.startTime,
        endTime: availability.endTime,
        updatedAt: serverTimestamp(),
        ...(scheduleType === 'custom'
          ? { customDates: availability.customDates }
          : {
              startDate: availability.startDate,
              endDate: availability.endDate,
            }),
      };

      const newDocRef = doc(collection(db, 'doctor_availability'));
      batch.set(newDocRef, schedulePayload);

      await batch.commit();

      showMessage('success', 'Doctor consultation hours updated successfully!');
    } catch (error) {
      console.error('Error saving availability:', error);
      showMessage('error', 'Failed to update schedule in database.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------
  // SAVE BLOCK / OT LEAVE
  // ---------------------------------------------------
  const handleSaveBlock = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId) {
      showMessage('error', 'Please select a doctor first.');
      return;
    }

    if (!newBlock.date || !newBlock.startTime || !newBlock.endTime) {
      showMessage('error', 'Complete all required block fields.');
      return;
    }

    if (newBlock.startTime >= newBlock.endTime) {
      showMessage('error', 'Block end time must be later than start time.');
      return;
    }

    setSubmitting(true);

    try {
      const blockPayload = {
        ...newBlock,
        doctorId: selectedDoctorId,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'doctor_blocks'), blockPayload);

      const saved = {
        id: docRef.id,
        ...blockPayload,
      };

      setBlocks((prev) =>
        [...prev, saved].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      );

      setNewBlock({
        title: '',
        details: '',
        date: '',
        startTime: '',
        endTime: '',
        notifyDoctor: true,
      });

      showMessage('success', 'Time slot blocked successfully.');
    } catch (error) {
      console.error('Error saving block:', error);
      showMessage('error', 'Failed to save blocked time slot.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------
  // DELETE BLOCK (OPTIMISTIC)
  // ---------------------------------------------------
  const handleDeleteBlock = async (blockId) => {
    if (!window.confirm('Remove this blocked time slot?')) return;

    const rollback = [...blocks];
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));

    try {
      await deleteDoc(doc(db, 'doctor_blocks', blockId));
      showMessage('success', 'Blocked time removed.');
    } catch (error) {
      console.error('Error deleting block:', error);
      setBlocks(rollback);
      showMessage('error', 'Failed to remove block. Reverted.');
    }
  };

  // ---------------------------------------------------
  // SPECIALIST FORM DOCTOR PICKER
  // ---------------------------------------------------
  const handleSpecialistDoctorSelection = (doctorId) => {
    const selected = doctors.find((d) => d.id === doctorId);

    if (!selected) {
      setSpecialistForm((prev) => ({
        ...prev,
        doctorId: '',
        doctorName: '',
        specialty: '',
        photoURL: '',
      }));
      return;
    }

    setSpecialistForm((prev) => ({
      ...prev,
      doctorId: selected.id,
      doctorName: selected.name || '',
      specialty: selected.specialty || selected.department || '',
      photoURL: selected.photoURL || '',
    }));
  };

  // ---------------------------------------------------
  // SAVE WEEKLY SPECIALIST
  // ---------------------------------------------------
  const handleSaveSpecialist = async (e) => {
    e.preventDefault();

    if (!specialistForm.doctorName.trim()) {
      showMessage('error', 'Please enter or select the doctor name.');
      return;
    }

    if (!specialistForm.expertise.trim()) {
      showMessage('error', 'Please provide clinical expertise description.');
      return;
    }

    if (!specialistForm.startTime || !specialistForm.endTime) {
      showMessage('error', 'Please choose consultation timings.');
      return;
    }

    if (specialistForm.startTime >= specialistForm.endTime) {
      showMessage('error', 'End time must be later than start time.');
      return;
    }

    if (
      specialistForm.startDate &&
      specialistForm.endDate &&
      specialistForm.startDate > specialistForm.endDate
    ) {
      showMessage('error', 'End date cannot be earlier than start date.');
      return;
    }

    setSubmitting(true);

    try {
      const specialistPayload = {
        doctorId: specialistForm.doctorId || '',
        doctorName: specialistForm.doctorName.trim(),
        specialty: specialistForm.specialty.trim(),
        expertise: specialistForm.expertise.trim(),
        day: specialistForm.day,
        startTime: specialistForm.startTime,
        endTime: specialistForm.endTime,
        startDate: specialistForm.startDate,
        endDate: specialistForm.endDate,
        photoURL: specialistForm.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, 'weekly_specialists'),
        specialistPayload
      );

      const saved = { id: docRef.id, ...specialistPayload };

      setWeeklySpecialists((prev) => {
        const updated = [...prev, saved];
        return updated.sort((a, b) => {
          const first = DAY_ORDER[a.day] || 99;
          const second = DAY_ORDER[b.day] || 99;
          if (first !== second) return first - second;
          return (a.startTime || '').localeCompare(b.startTime || '');
        });
      });

      setSpecialistForm({
        doctorId: '',
        doctorName: '',
        specialty: '',
        expertise: '',
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        startDate: '',
        endDate: '',
        photoURL: '',
      });

      showMessage('success', 'Visiting specialist registered successfully!');
    } catch (error) {
      console.error('Error saving specialist:', error);
      showMessage('error', 'Failed to register weekly specialist.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------
  // DELETE WEEKLY SPECIALIST
  // ---------------------------------------------------
  const handleDeleteSpecialist = async (specialistId) => {
    if (!window.confirm('Remove this specialist schedule?')) return;

    const rollback = [...weeklySpecialists];
    setWeeklySpecialists((prev) => prev.filter((s) => s.id !== specialistId));

    try {
      await deleteDoc(doc(db, 'weekly_specialists', specialistId));
      showMessage('success', 'Specialist schedule removed.');
    } catch (error) {
      console.error('Error deleting specialist:', error);
      setWeeklySpecialists(rollback);
      showMessage('error', 'Failed to remove specialist.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[450px] bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center p-8">
        <Loader2 className="w-9 h-9 animate-spin text-[#1f9b90] mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Loading Timetables & Schedules...
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans text-slate-800 space-y-6">
      
      {/* ===================================================
          FEEDBACK TOAST
      =================================================== */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold border shadow-2xs ${
              message.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================
          MAIN CARD WORKBENCH
      =================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col lg:flex-row items-stretch">
        
        {/* ===============================================
            LEFT PANEL: DOCTOR SELECTOR & ACTION NAV (1/3)
        =============================================== */}
        <div className="w-full lg:w-1/3 bg-slate-50/70 p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Physician
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1f9b90] shadow-2xs cursor-pointer appearance-none"
              >
                <option value="">-- Choose Doctor from Directory --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.specialty || d.department ? `(${d.specialty || d.department})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Schedule Action
            </label>
            <div className="flex flex-col gap-2">
              {/* TAB 1: SCHEDULE */}
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={[
                  "p-3.5 rounded-2xl flex items-center gap-3.5 text-left transition-all border",
                  activeTab === 'schedule'
                    ? "bg-white border-[#1f9b90] shadow-sm ring-1 ring-[#1f9b90]/20"
                    : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300",
                ].join(" ")}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === 'schedule'
                      ? 'bg-teal-50 text-[#1f9b90]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1a365d]">
                    Set Working Hours
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Regular weekly OPD consultation slots
                  </p>
                </div>
              </button>

              {/* TAB 2: BLOCK / OT */}
              <button
                type="button"
                onClick={() => setActiveTab('block')}
                className={[
                  "p-3.5 rounded-2xl flex items-center gap-3.5 text-left transition-all border",
                  activeTab === 'block'
                    ? "bg-white border-[#f6ac42] shadow-sm ring-1 ring-[#f6ac42]/20"
                    : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300",
                ].join(" ")}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === 'block'
                      ? 'bg-amber-50 text-[#f6ac42]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Ban className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1a365d]">
                    Block Time / OT Leave
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Emergency surgeries, leaves & exceptions
                  </p>
                </div>
              </button>

              {/* TAB 3: WEEKLY SPECIALIST */}
              <button
                type="button"
                onClick={() => setActiveTab('specialist')}
                className={[
                  "p-3.5 rounded-2xl flex items-center gap-3.5 text-left transition-all border",
                  activeTab === 'specialist'
                    ? "bg-white border-[#1a365d] shadow-sm ring-1 ring-[#1a365d]/20"
                    : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300",
                ].join(" ")}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === 'specialist'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1a365d]">
                    Visiting Specialists
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Weekly super-specialist clinics
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ===============================================
            RIGHT PANEL: TAB WORKSPACE (2/3)
        =============================================== */}
        <div className="w-full lg:w-2/3 p-5 sm:p-7 min-h-[550px]">
          
          {/* ===========================================
              TAB 1: REGULAR SCHEDULE
          =========================================== */}
          {activeTab === 'schedule' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <h2 className="text-lg font-bold text-[#1a365d]">
                    Configure Regular Consultation Hours
                  </h2>
                  <p className="text-xs text-slate-500">
                    Define active OPD working hours shown on public booking channels.
                  </p>
                </div>

                {!selectedDoctorId && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Select a doctor on left
                  </span>
                )}
              </div>

              {/* Schedule Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Repeat Schedule Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'week', label: 'All Week (Mon-Sat)' },
                    { id: 'weekend', label: 'Weekends Only' },
                    { id: 'custom', label: 'Custom Specific Dates' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setScheduleType(item.id)}
                      className={[
                        "py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center",
                        scheduleType === item.id
                          ? "bg-[#1a365d] text-white border-[#1a365d] shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white",
                      ].join(" ")}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Pickers */}
              {scheduleType !== 'custom' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Effective Start Date
                    </label>
                    <input
                      type="date"
                      value={availability.startDate}
                      onChange={(e) =>
                        setAvailability((prev) => ({ ...prev, startDate: e.target.value }))
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#1f9b90]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Effective End Date
                    </label>
                    <input
                      type="date"
                      value={availability.endDate}
                      onChange={(e) =>
                        setAvailability((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#1f9b90]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Add Specific Custom Dates
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1f9b90]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDate}
                      className="rounded-xl bg-[#1f9b90] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#188077]"
                    >
                      Add Date
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {availability.customDates.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-[#1a365d] text-xs font-bold rounded-lg border border-teal-200/60"
                      >
                        <span>{d}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomDate(d)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {availability.customDates.length === 0 && (
                      <span className="text-xs text-slate-400 italic">No custom dates added yet.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Consultation Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Consultation Starts From
                  </label>
                  <input
                    type="time"
                    value={availability.startTime}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, startTime: e.target.value }))
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1f9b90]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Consultation Closes At
                  </label>
                  <input
                    type="time"
                    value={availability.endTime}
                    onChange={(e) =>
                      setAvailability((prev) => ({ ...prev, endTime: e.target.value }))
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1f9b90]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={submitting || !selectedDoctorId}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#1f9b90] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-slate-900/10 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Committing Schedule...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Save Consultation Hours</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ===========================================
              TAB 2: BLOCK TIME / OT / LEAVE
          =========================================== */}
          {activeTab === 'block' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start"
            >
              {/* Block Form */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#1a365d]">
                    Add Schedule Exception / OT
                  </h3>
                  <p className="text-xs text-slate-500">
                    Blocks booking slots for emergencies or leaves.
                  </p>
                </div>

                <form onSubmit={handleSaveBlock} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Reason / Title *
                    </label>
                    <input
                      required
                      type="text"
                      value={newBlock.title}
                      onChange={(e) => setNewBlock((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Emergency OT Surgery, Conference, Leave"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#f6ac42]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={newBlock.date}
                      onChange={(e) => setNewBlock((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#f6ac42]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Block Starts
                      </label>
                      <input
                        required
                        type="time"
                        value={newBlock.startTime}
                        onChange={(e) =>
                          setNewBlock((prev) => ({ ...prev, startTime: e.target.value }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Block Ends
                      </label>
                      <input
                        required
                        type="time"
                        value={newBlock.endTime}
                        onChange={(e) =>
                          setNewBlock((prev) => ({ ...prev, endTime: e.target.value }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Internal Details (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={newBlock.details}
                      onChange={(e) =>
                        setNewBlock((prev) => ({ ...prev, details: e.target.value }))
                      }
                      placeholder="Additional notes for reception staff..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-2 p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newBlock.notifyDoctor}
                      onChange={(e) =>
                        setNewBlock((prev) => ({ ...prev, notifyDoctor: e.target.checked }))
                      }
                      className="w-4 h-4 text-[#f6ac42] rounded border-slate-300 focus:ring-[#f6ac42]"
                    />
                    <Bell className="w-3.5 h-3.5 text-[#f6ac42]" />
                    <span className="text-xs font-bold text-slate-800">
                      Send reminder to doctor's calendar
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting || !selectedDoctorId}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f6ac42] hover:bg-amber-500 text-slate-950 font-bold py-2.5 text-xs uppercase tracking-wider shadow-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Scissors className="w-4 h-4" />
                    )}
                    <span>Block Calendar Slot</span>
                  </button>
                </form>
              </div>

              {/* Block List */}
              <div className="space-y-3 xl:border-l xl:border-slate-100 xl:pl-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Configured Blocks ({blocks.length})
                </h4>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {blocks.length === 0 ? (
                    <div className="py-14 text-center border border-dashed border-slate-200 rounded-2xl">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No active exceptions configured.</p>
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-[#1a365d] truncate">{block.title}</p>
                          <p className="text-[11px] text-slate-500">{block.date}</p>
                          <p className="text-[11px] font-semibold text-[#f6ac42]">
                            {block.startTime} – {block.endTime}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ===========================================
              TAB 3: WEEKLY SPECIALIST
          =========================================== */}
          {activeTab === 'specialist' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start"
            >
              {/* Form */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#1a365d]">
                    Register Visiting Specialist
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publishes weekly visiting consultants on hospital schedule.
                  </p>
                </div>

                <form onSubmit={handleSaveSpecialist} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Choose from Doctors Directory
                    </label>
                    <select
                      value={specialistForm.doctorId || ''}
                      onChange={(e) => handleSpecialistDoctorSelection(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none"
                    >
                      <option value="">Manual Specialist Entry</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} {d.specialty ? `(${d.specialty})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Specialist Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={specialistForm.doctorName}
                      onChange={(e) =>
                        setSpecialistForm((prev) => ({ ...prev, doctorName: e.target.value }))
                      }
                      placeholder="e.g. Dr. K. N. Hegde"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={specialistForm.specialty}
                        onChange={(e) =>
                          setSpecialistForm((prev) => ({ ...prev, specialty: e.target.value }))
                        }
                        placeholder="e.g. Neurology"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Consultation Day *
                      </label>
                      <select
                        value={specialistForm.day}
                        onChange={(e) =>
                          setSpecialistForm((prev) => ({ ...prev, day: e.target.value }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                      >
                        {Object.keys(DAY_ORDER).map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Clinical Expertise Summary *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={specialistForm.expertise}
                      onChange={(e) =>
                        setSpecialistForm((prev) => ({ ...prev, expertise: e.target.value }))
                      }
                      placeholder="e.g. Stroke management, Neuro-rehabilitation..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Visiting Starts
                      </label>
                      <input
                        required
                        type="time"
                        value={specialistForm.startTime}
                        onChange={(e) =>
                          setSpecialistForm((prev) => ({ ...prev, startTime: e.target.value }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Visiting Ends
                      </label>
                      <input
                        required
                        type="time"
                        value={specialistForm.endTime}
                        onChange={(e) =>
                          setSpecialistForm((prev) => ({ ...prev, endTime: e.target.value }))
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#1f9b90] text-white font-bold py-2.5 text-xs uppercase tracking-wider shadow-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>Publish Weekly Specialist</span>
                  </button>
                </form>
              </div>

              {/* Specialist List */}
              <div className="space-y-3 xl:border-l xl:border-slate-100 xl:pl-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Weekly Registry ({weeklySpecialists.length})
                </h4>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {weeklySpecialists.length === 0 ? (
                    <div className="py-14 text-center border border-dashed border-slate-200 rounded-2xl">
                      <BriefcaseMedical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">No visiting specialists scheduled.</p>
                    </div>
                  ) : (
                    weeklySpecialists.map((specialist) => (
                      <div
                        key={specialist.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {specialist.photoURL ? (
                                <img
                                  src={specialist.photoURL}
                                  alt={specialist.doctorName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#1a365d] truncate">
                                {specialist.doctorName}
                              </p>
                              <p className="text-[10px] uppercase font-bold text-[#1f9b90]">
                                {specialist.specialty || 'Visiting Consultant'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteSpecialist(specialist.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#1f9b90]" />
                            <span>{specialist.day}</span>
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-[#f6ac42]" />
                            <span>{specialist.startTime} - {specialist.endTime}</span>
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DoctorAvailabilityAdmin;