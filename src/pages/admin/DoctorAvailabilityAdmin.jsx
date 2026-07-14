import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
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
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const DoctorAvailabilityAdmin = () => {
  /*
  |--------------------------------------------------------------------------
  | MAIN STATE
  |--------------------------------------------------------------------------
  */

  const [doctors, setDoctors] = useState([]);

  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  /*
  |--------------------------------------------------------------------------
  | TABS
  |--------------------------------------------------------------------------
  |
  | schedule     = Regular Doctor Availability
  | block        = OT / Leave / Exceptions
  | specialist   = Weekly Specialists
  |--------------------------------------------------------------------------
  */

  const [activeTab, setActiveTab] = useState('schedule');

  /*
  |--------------------------------------------------------------------------
  | REGULAR AVAILABILITY STATE
  |--------------------------------------------------------------------------
  */

  const [scheduleType, setScheduleType] = useState('week');

  const [availability, setAvailability] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    customDates: [],
  });

  const [tempDate, setTempDate] = useState('');

  /*
  |--------------------------------------------------------------------------
  | BLOCK / OT STATE
  |--------------------------------------------------------------------------
  */

  const [blocks, setBlocks] = useState([]);

  const [newBlock, setNewBlock] = useState({
    title: '',
    details: '',
    date: '',
    startTime: '',
    endTime: '',
    notifyDoctor: true,
  });

  /*
  |--------------------------------------------------------------------------
  | WEEKLY SPECIALIST STATE
  |--------------------------------------------------------------------------
  */

  const [weeklySpecialists, setWeeklySpecialists] = useState([]);

  const [specialistForm, setSpecialistForm] = useState({
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

  /*
  |--------------------------------------------------------------------------
  | MESSAGE HELPER
  |--------------------------------------------------------------------------
  */

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        type: '',
        text: '',
      });
    }, 3000);
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH DOCTORS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const doctorsSnapshot = await getDocs(
          collection(db, 'doctors')
        );

        setDoctors(
          doctorsSnapshot.docs.map((doctorDocument) => ({
            id: doctorDocument.id,
            ...doctorDocument.data(),
          }))
        );
      } catch (error) {
        console.error('Error fetching doctors:', error);

        showMessage(
          'error',
          'Unable to load doctors.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FETCH SELECTED DOCTOR BLOCKS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedDoctorId) {
      setBlocks([]);
      return;
    }

    const fetchBlocks = async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | No orderBy here.
        |
        | This avoids requiring a Firestore composite index.
        | Sorting is done client-side.
        |--------------------------------------------------------------------------
        */

        const blocksQuery = query(
          collection(db, 'doctor_blocks'),
          where('doctorId', '==', selectedDoctorId)
        );

        const blocksSnapshot = await getDocs(blocksQuery);

        const blocksData = blocksSnapshot.docs.map(
          (blockDocument) => ({
            id: blockDocument.id,
            ...blockDocument.data(),
          })
        );

        blocksData.sort((a, b) =>
          (a.date || '').localeCompare(b.date || '')
        );

        setBlocks(blocksData);
      } catch (error) {
        console.error('Error fetching blocks:', error);

        showMessage(
          'error',
          'Unable to load doctor blocks.'
        );
      }
    };

    fetchBlocks();
  }, [selectedDoctorId]);

  /*
  |--------------------------------------------------------------------------
  | FETCH WEEKLY SPECIALISTS
  |--------------------------------------------------------------------------
  */

  const fetchWeeklySpecialists = async () => {
    try {
      const specialistsSnapshot = await getDocs(
        collection(db, 'weekly_specialists')
      );

      const specialistsData = specialistsSnapshot.docs.map(
        (specialistDocument) => ({
          id: specialistDocument.id,
          ...specialistDocument.data(),
        })
      );

      specialistsData.sort((a, b) => {
        const dayOrder = {
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
          Sunday: 7,
        };

        const firstDay = dayOrder[a.day] || 99;
        const secondDay = dayOrder[b.day] || 99;

        if (firstDay !== secondDay) {
          return firstDay - secondDay;
        }

        return (a.startTime || '').localeCompare(
          b.startTime || ''
        );
      });

      setWeeklySpecialists(specialistsData);
    } catch (error) {
      console.error(
        'Error fetching weekly specialists:',
        error
      );

      showMessage(
        'error',
        'Unable to load weekly specialists.'
      );
    }
  };

  useEffect(() => {
    fetchWeeklySpecialists();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CUSTOM DATE HELPERS
  |--------------------------------------------------------------------------
  */

  const handleAddCustomDate = () => {
    if (!tempDate) {
      return;
    }

    if (availability.customDates.includes(tempDate)) {
      showMessage(
        'error',
        'This date has already been selected.'
      );

      return;
    }

    setAvailability((previous) => ({
      ...previous,

      customDates: [
        ...previous.customDates,
        tempDate,
      ].sort(),
    }));

    setTempDate('');
  };

  const removeCustomDate = (dateToRemove) => {
    setAvailability((previous) => ({
      ...previous,

      customDates: previous.customDates.filter(
        (date) => date !== dateToRemove
      ),
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE REGULAR AVAILABILITY
  |--------------------------------------------------------------------------
  */

  const handleSaveAvailability = async () => {
    if (!selectedDoctorId) {
      showMessage(
        'error',
        'Please select a doctor first.'
      );

      return;
    }

    if (
      !availability.startTime ||
      !availability.endTime
    ) {
      showMessage(
        'error',
        'Please select consultation start and end time.'
      );

      return;
    }

    if (
      availability.startTime >= availability.endTime
    ) {
      showMessage(
        'error',
        'Available Until must be later than Available From.'
      );

      return;
    }

    if (
      scheduleType !== 'custom' &&
      (!availability.startDate ||
        !availability.endDate)
    ) {
      showMessage(
        'error',
        'Please select the start date and end date.'
      );

      return;
    }

    if (
      scheduleType !== 'custom' &&
      availability.startDate > availability.endDate
    ) {
      showMessage(
        'error',
        'End date cannot be earlier than start date.'
      );

      return;
    }

    if (
      scheduleType === 'custom' &&
      availability.customDates.length === 0
    ) {
      showMessage(
        'error',
        'Please add at least one custom date.'
      );

      return;
    }

    setSubmitting(true);

    try {
      /*
      |--------------------------------------------------------------------------
      | REMOVE EXISTING AVAILABILITY RECORDS
      |--------------------------------------------------------------------------
      |
      | Your previous file used addDoc every time.
      | That created multiple schedules for the same doctor.
      |
      | We remove previous records before creating the new schedule.
      |--------------------------------------------------------------------------
      */

      const existingScheduleQuery = query(
        collection(db, 'doctor_availability'),
        where('doctorId', '==', selectedDoctorId)
      );

      const existingScheduleSnapshot = await getDocs(
        existingScheduleQuery
      );

      const batch = writeBatch(db);

      existingScheduleSnapshot.docs.forEach(
        (existingDocument) => {
          batch.delete(existingDocument.ref);
        }
      );

      await batch.commit();

      /*
      |--------------------------------------------------------------------------
      | SAVE NEW SCHEDULE
      |--------------------------------------------------------------------------
      */

      const scheduleData = {
        doctorId: selectedDoctorId,

        type: scheduleType,

        startTime: availability.startTime,

        endTime: availability.endTime,

        updatedAt: serverTimestamp(),

        ...(scheduleType === 'custom'
          ? {
              customDates: availability.customDates,
            }
          : {
              startDate: availability.startDate,
              endDate: availability.endDate,
            }),
      };

      await addDoc(
        collection(db, 'doctor_availability'),
        scheduleData
      );

      showMessage(
        'success',
        'Doctor availability updated successfully!'
      );
    } catch (error) {
      console.error(
        'Error saving availability:',
        error
      );

      showMessage(
        'error',
        'Failed to save doctor availability.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE BLOCK / OT
  |--------------------------------------------------------------------------
  */

  const handleSaveBlock = async (event) => {
    event.preventDefault();

    if (!selectedDoctorId) {
      showMessage(
        'error',
        'Please select a doctor first.'
      );

      return;
    }

    if (
      !newBlock.date ||
      !newBlock.startTime ||
      !newBlock.endTime
    ) {
      showMessage(
        'error',
        'Please complete all required block fields.'
      );

      return;
    }

    if (newBlock.startTime >= newBlock.endTime) {
      showMessage(
        'error',
        'Block Until must be later than Block From.'
      );

      return;
    }

    setSubmitting(true);

    try {
      const blockData = {
        ...newBlock,

        doctorId: selectedDoctorId,

        createdAt: serverTimestamp(),
      };

      const blockDocument = await addDoc(
        collection(db, 'doctor_blocks'),
        blockData
      );

      const savedBlock = {
        id: blockDocument.id,
        ...blockData,
      };

      setBlocks((previous) =>
        [...previous, savedBlock].sort((a, b) =>
          (a.date || '').localeCompare(b.date || '')
        )
      );

      setNewBlock({
        title: '',
        details: '',
        date: '',
        startTime: '',
        endTime: '',
        notifyDoctor: true,
      });

      showMessage(
        'success',
        'Calendar slot blocked successfully!'
      );
    } catch (error) {
      console.error(
        'Error saving doctor block:',
        error
      );

      showMessage(
        'error',
        'Failed to block calendar slot.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE BLOCK
  |--------------------------------------------------------------------------
  */

  const handleDeleteBlock = async (blockId) => {
    if (
      !window.confirm(
        'Are you sure you want to remove this blocked time?'
      )
    ) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, 'doctor_blocks', blockId)
      );

      setBlocks((previous) =>
        previous.filter(
          (block) => block.id !== blockId
        )
      );

      showMessage(
        'success',
        'Blocked time removed successfully.'
      );
    } catch (error) {
      console.error(
        'Error deleting block:',
        error
      );

      showMessage(
        'error',
        'Failed to remove blocked time.'
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT EXISTING DOCTOR AS WEEKLY SPECIALIST
  |--------------------------------------------------------------------------
  */

  const handleSpecialistDoctorSelection = (
    doctorId
  ) => {
    const selectedDoctor = doctors.find(
      (doctorItem) =>
        doctorItem.id === doctorId
    );

    if (!selectedDoctor) {
      setSpecialistForm((previous) => ({
        ...previous,

        doctorId: '',

        doctorName: '',

        specialty: '',

        photoURL: '',
      }));

      return;
    }

    setSpecialistForm((previous) => ({
      ...previous,

      doctorId: selectedDoctor.id,

      doctorName: selectedDoctor.name || '',

      specialty: selectedDoctor.specialty || '',

      photoURL: selectedDoctor.photoURL || '',
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE WEEKLY SPECIALIST
  |--------------------------------------------------------------------------
  */

  const handleSaveSpecialist = async (
    event
  ) => {
    event.preventDefault();

    if (!specialistForm.doctorName.trim()) {
      showMessage(
        'error',
        'Please select or enter the specialist.'
      );

      return;
    }

    if (!specialistForm.expertise.trim()) {
      showMessage(
        'error',
        'Please enter the specialist expertise.'
      );

      return;
    }

    if (
      !specialistForm.startTime ||
      !specialistForm.endTime
    ) {
      showMessage(
        'error',
        'Please select specialist consultation hours.'
      );

      return;
    }

    if (
      specialistForm.startTime >=
      specialistForm.endTime
    ) {
      showMessage(
        'error',
        'Consultation end time must be later than start time.'
      );

      return;
    }

    if (
      specialistForm.startDate &&
      specialistForm.endDate &&
      specialistForm.startDate >
        specialistForm.endDate
    ) {
      showMessage(
        'error',
        'Effective end date cannot be earlier than start date.'
      );

      return;
    }

    setSubmitting(true);

    try {
      const specialistData = {
        doctorId:
          specialistForm.doctorId || '',

        doctorName:
          specialistForm.doctorName.trim(),

        specialty:
          specialistForm.specialty.trim(),

        expertise:
          specialistForm.expertise.trim(),

        day: specialistForm.day,

        startTime:
          specialistForm.startTime,

        endTime:
          specialistForm.endTime,

        startDate:
          specialistForm.startDate,

        endDate:
          specialistForm.endDate,

        photoURL:
          specialistForm.photoURL || '',

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, 'weekly_specialists'),
        specialistData
      );

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

      await fetchWeeklySpecialists();

      showMessage(
        'success',
        'Weekly specialist added successfully!'
      );
    } catch (error) {
      console.error(
        'Error saving weekly specialist:',
        error
      );

      showMessage(
        'error',
        'Failed to add weekly specialist.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE WEEKLY SPECIALIST
  |--------------------------------------------------------------------------
  */

  const handleDeleteSpecialist = async (
    specialistId
  ) => {
    if (
      !window.confirm(
        'Are you sure you want to remove this weekly specialist schedule?'
      )
    ) {
      return;
    }

    try {
      await deleteDoc(
        doc(
          db,
          'weekly_specialists',
          specialistId
        )
      );

      setWeeklySpecialists((previous) =>
        previous.filter(
          (specialist) =>
            specialist.id !== specialistId
        )
      );

      showMessage(
        'success',
        'Weekly specialist removed successfully.'
      );
    } catch (error) {
      console.error(
        'Error deleting weekly specialist:',
        error
      );

      showMessage(
        'error',
        'Failed to remove weekly specialist.'
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING SCREEN
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-6 lg:p-8 font-sans">

        <div className="min-h-[500px] bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center">

          <Loader2 className="w-10 h-10 animate-spin text-[#0EA5E9] mb-4" />

          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Loading Doctor Schedules...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 font-sans text-slate-800">

      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">

          <CalendarDays className="w-8 h-8 text-[#0EA5E9]" />

          Doctor Availability & Timetable

        </h1>

        <p className="text-slate-500 font-medium">
          Manage regular schedules, calendar blocks, OT,
          leaves and weekly specialist consultations.
        </p>

      </div>

      {/* ================================================================ */}
      {/* MESSAGE                                                           */}
      {/* ================================================================ */}

      <AnimatePresence>

        {message.text && (

          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${
              message.type === 'error'
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}
          >

            {message.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}

            {message.text}

          </motion.div>

        )}

      </AnimatePresence>

      {/* ================================================================ */}
      {/* MAIN CONTAINER                                                    */}
      {/* ================================================================ */}

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">

        {/* ================================================================ */}
        {/* LEFT PANEL                                                       */}
        {/* ================================================================ */}

        <div className="w-full lg:w-1/3 bg-slate-50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200">

          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
            Select Doctor
          </label>

          <div className="relative mb-8">

            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

            <select
              value={selectedDoctorId}
              onChange={(event) =>
                setSelectedDoctorId(
                  event.target.value
                )
              }
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] shadow-sm appearance-none cursor-pointer"
            >

              <option value="">
                -- Choose a Doctor --
              </option>

              {doctors.map((doctorItem) => (

                <option
                  key={doctorItem.id}
                  value={doctorItem.id}
                >

                  {doctorItem.name}

                  {doctorItem.specialty
                    ? ` (${doctorItem.specialty})`
                    : ''}

                </option>

              ))}

            </select>

          </div>

          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
            Select Action
          </label>

          <div className="flex flex-col gap-3">

            {/* REGULAR SCHEDULE */}

            <button
              onClick={() =>
                setActiveTab('schedule')
              }
              className={`p-4 rounded-xl flex items-center gap-4 text-left transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white border-2 border-[#0EA5E9] shadow-md'
                  : 'border-2 border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >

              <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">

                <Clock className="w-5 h-5 text-[#0EA5E9]" />

              </div>

              <div>

                <h4 className="font-bold text-slate-700">
                  Set Schedule
                </h4>

                <p className="text-xs text-slate-500 font-medium">
                  Regular working hours
                </p>

              </div>

            </button>

            {/* BLOCK */}

            <button
              onClick={() =>
                setActiveTab('block')
              }
              className={`p-4 rounded-xl flex items-center gap-4 text-left transition-all ${
                activeTab === 'block'
                  ? 'bg-white border-2 border-[#C19B6C] shadow-md'
                  : 'border-2 border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >

              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">

                <Ban className="w-5 h-5 text-[#C19B6C]" />

              </div>

              <div>

                <h4 className="font-bold text-slate-700">
                  Block Time / OT
                </h4>

                <p className="text-xs text-slate-500 font-medium">
                  Surgeries, leaves and exceptions
                </p>

              </div>

            </button>

            {/* WEEKLY SPECIALIST */}

            <button
              onClick={() =>
                setActiveTab('specialist')
              }
              className={`p-4 rounded-xl flex items-center gap-4 text-left transition-all ${
                activeTab === 'specialist'
                  ? 'bg-white border-2 border-emerald-500 shadow-md'
                  : 'border-2 border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">

                <Star className="w-5 h-5 text-emerald-600" />

              </div>

              <div>

                <h4 className="font-bold text-slate-700">
                  Weekly Specialists
                </h4>

                <p className="text-xs text-slate-500 font-medium">
                  Visiting specialist schedules
                </p>

              </div>

            </button>

          </div>

        </div>

        {/* ================================================================ */}
        {/* RIGHT PANEL                                                      */}
        {/* ================================================================ */}

        <div className="w-full lg:w-2/3 p-6 lg:p-8 min-h-[600px]">

          {/* ================================================================ */}
          {/* REGULAR SCHEDULE                                                 */}
          {/* ================================================================ */}

          {activeTab === 'schedule' && (

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
            >

              {!selectedDoctorId && (

                <div className="mb-6 p-4 bg-sky-50 border border-sky-100 rounded-xl flex items-center gap-3 text-sky-700 font-bold text-sm">

                  <Stethoscope className="w-5 h-5" />

                  Select a doctor before saving availability.

                </div>

              )}

              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Regular Availability
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">

                {[
                  'week',
                  'weekend',
                  'custom',
                ].map((type) => (

                  <button
                    key={type}
                    onClick={() =>
                      setScheduleType(type)
                    }
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold capitalize transition-colors border ${
                      scheduleType === type
                        ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >

                    {type === 'week'
                      ? 'Whole Week'
                      : type === 'weekend'
                      ? 'Weekends Only'
                      : 'Custom Dates'}

                  </button>

                ))}

              </div>

              {scheduleType !== 'custom' ? (

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={
                        availability.startDate
                      }
                      onChange={(event) =>
                        setAvailability({
                          ...availability,
                          startDate:
                            event.target.value,
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                    />

                  </div>

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={
                        availability.endDate
                      }
                      onChange={(event) =>
                        setAvailability({
                          ...availability,
                          endDate:
                            event.target.value,
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                    />

                  </div>

                </div>

              ) : (

                <div className="mb-6">

                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Select Multiple Dates
                  </label>

                  <div className="flex gap-2">

                    <input
                      type="date"
                      value={tempDate}
                      onChange={(event) =>
                        setTempDate(
                          event.target.value
                        )
                      }
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                    />

                    <button
                      type="button"
                      onClick={
                        handleAddCustomDate
                      }
                      className="bg-[#0EA5E9] text-white px-5 rounded-xl font-bold hover:bg-sky-600"
                    >
                      Add
                    </button>

                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {availability.customDates.map(
                      (dateValue) => (

                        <span
                          key={dateValue}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-[#0EA5E9] text-sm font-bold rounded-lg border border-sky-100"
                        >

                          {dateValue}

                          <button
                            type="button"
                            onClick={() =>
                              removeCustomDate(
                                dateValue
                              )
                            }
                          >

                            <X className="w-3.5 h-3.5 hover:text-red-500" />

                          </button>

                        </span>

                      )
                    )}

                    {availability.customDates
                      .length === 0 && (

                      <span className="text-sm text-slate-400 italic">
                        No dates selected.
                      </span>

                    )}

                  </div>

                </div>

              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                <div>

                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Available From
                  </label>

                  <input
                    type="time"
                    value={
                      availability.startTime
                    }
                    onChange={(event) =>
                      setAvailability({
                        ...availability,
                        startTime:
                          event.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Available Until
                  </label>

                  <input
                    type="time"
                    value={
                      availability.endTime
                    }
                    onChange={(event) =>
                      setAvailability({
                        ...availability,
                        endTime:
                          event.target.value,
                      })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                  />

                </div>

              </div>

              <button
                type="button"
                onClick={
                  handleSaveAvailability
                }
                disabled={
                  submitting ||
                  !selectedDoctorId
                }
                className="w-full bg-[#0EA5E9] hover:bg-sky-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Calendar className="w-5 h-5" />
                )}

                Update Availability

              </button>

            </motion.div>

          )}

          {/* ================================================================ */}
          {/* BLOCK TIME / OT                                                  */}
          {/* ================================================================ */}

          {activeTab === 'block' && (

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="flex flex-col xl:flex-row gap-8"
            >

              <div className="flex-1">

                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                  Add Exception / Block
                </h2>

                <form
                  onSubmit={handleSaveBlock}
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Title / Reason
                    </label>

                    <input
                      required
                      type="text"
                      value={newBlock.title}
                      onChange={(event) =>
                        setNewBlock({
                          ...newBlock,
                          title:
                            event.target.value,
                        })
                      }
                      placeholder="Surgery, OT, Leave..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C19B6C] font-medium"
                    />

                  </div>

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Date
                    </label>

                    <input
                      required
                      type="date"
                      value={newBlock.date}
                      onChange={(event) =>
                        setNewBlock({
                          ...newBlock,
                          date:
                            event.target.value,
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C19B6C] font-medium"
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <input
                      required
                      type="time"
                      value={
                        newBlock.startTime
                      }
                      onChange={(event) =>
                        setNewBlock({
                          ...newBlock,
                          startTime:
                            event.target.value,
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                    <input
                      required
                      type="time"
                      value={
                        newBlock.endTime
                      }
                      onChange={(event) =>
                        setNewBlock({
                          ...newBlock,
                          endTime:
                            event.target.value,
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                  <textarea
                    rows="3"
                    value={newBlock.details}
                    onChange={(event) =>
                      setNewBlock({
                        ...newBlock,
                        details:
                          event.target.value,
                      })
                    }
                    placeholder="Optional details..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                  />

                  <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl cursor-pointer">

                    <input
                      type="checkbox"
                      checked={
                        newBlock.notifyDoctor
                      }
                      onChange={(event) =>
                        setNewBlock({
                          ...newBlock,
                          notifyDoctor:
                            event.target.checked,
                        })
                      }
                    />

                    <Bell className="w-4 h-4 text-[#C19B6C]" />

                    <span className="text-sm font-bold">
                      Notify Doctor
                    </span>

                  </label>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !selectedDoctorId
                    }
                    className="w-full bg-[#C19B6C] hover:bg-amber-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 disabled:opacity-50"
                  >

                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Scissors className="w-5 h-5" />
                    )}

                    Block Calendar Slot

                  </button>

                </form>

              </div>

              <div className="flex-1 xl:border-l xl:border-slate-100 xl:pl-8">

                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Doctor Blocks
                </h3>

                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">

                  {blocks.length === 0 ? (

                    <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">

                      <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                      <p className="text-sm text-slate-500 font-medium">
                        No blocks configured.
                      </p>

                    </div>

                  ) : (

                    blocks.map((block) => (

                      <div
                        key={block.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4"
                      >

                        <div className="flex-1">

                          <h4 className="font-bold text-slate-900">
                            {block.title}
                          </h4>

                          <p className="text-xs text-slate-500 mt-1">
                            {block.date}
                          </p>

                          <p className="text-xs font-bold text-[#C19B6C] mt-1">
                            {block.startTime} -{' '}
                            {block.endTime}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteBlock(
                              block.id
                            )
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600"
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

          {/* ================================================================ */}
          {/* WEEKLY SPECIALISTS                                               */}
          {/* ================================================================ */}

          {activeTab === 'specialist' && (

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="flex flex-col xl:flex-row gap-8"
            >

              {/* FORM */}

              <div className="flex-1">

                <div className="mb-6 border-b border-slate-100 pb-4">

                  <h2 className="text-2xl font-bold text-slate-900">
                    Add Weekly Specialist
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Configure visiting specialists and their weekly consultation schedule.
                  </p>

                </div>

                <form
                  onSubmit={
                    handleSaveSpecialist
                  }
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Select Existing Doctor
                    </label>

                    <select
                      value={
                        specialistForm.doctorId ||
                        ''
                      }
                      onChange={(event) =>
                        handleSpecialistDoctorSelection(
                          event.target.value
                        )
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                    >

                      <option value="">
                        Manual Specialist Entry
                      </option>

                      {doctors.map(
                        (doctorItem) => (

                          <option
                            key={doctorItem.id}
                            value={doctorItem.id}
                          >

                            {doctorItem.name}

                            {doctorItem.specialty
                              ? ` (${doctorItem.specialty})`
                              : ''}

                          </option>

                        )
                      )}

                    </select>

                  </div>

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Specialist Name
                    </label>

                    <input
                      required
                      type="text"
                      value={
                        specialistForm.doctorName
                      }
                      onChange={(event) =>
                        setSpecialistForm({
                          ...specialistForm,
                          doctorName:
                            event.target.value,
                        })
                      }
                      placeholder="Dr. Specialist Name"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                    />

                  </div>

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Specialty
                    </label>

                    <input
                      type="text"
                      value={
                        specialistForm.specialty
                      }
                      onChange={(event) =>
                        setSpecialistForm({
                          ...specialistForm,
                          specialty:
                            event.target.value,
                        })
                      }
                      placeholder="Cardiology, Neurology..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                    />

                  </div>

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Expertise
                    </label>

                    <textarea
                      required
                      rows="3"
                      value={
                        specialistForm.expertise
                      }
                      onChange={(event) =>
                        setSpecialistForm({
                          ...specialistForm,
                          expertise:
                            event.target.value,
                        })
                      }
                      placeholder="Interventional Cardiology, Heart Failure Management..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium resize-none"
                    />

                  </div>

                  <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Consultation Day
                    </label>

                    <select
                      value={specialistForm.day}
                      onChange={(event) =>
                        setSpecialistForm({
                          ...specialistForm,
                          day:
                            event.target.value,
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
                    >

                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day) => (

                        <option
                          key={day}
                          value={day}
                        >
                          {day}
                        </option>

                      ))}

                    </select>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Consultation From
                      </label>

                      <input
                        required
                        type="time"
                        value={
                          specialistForm.startTime
                        }
                        onChange={(event) =>
                          setSpecialistForm({
                            ...specialistForm,
                            startTime:
                              event.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      />

                    </div>

                    <div>

                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Consultation Until
                      </label>

                      <input
                        required
                        type="time"
                        value={
                          specialistForm.endTime
                        }
                        onChange={(event) =>
                          setSpecialistForm({
                            ...specialistForm,
                            endTime:
                              event.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      />

                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Effective Start Date
                      </label>

                      <input
                        type="date"
                        value={
                          specialistForm.startDate
                        }
                        onChange={(event) =>
                          setSpecialistForm({
                            ...specialistForm,
                            startDate:
                              event.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      />

                    </div>

                    <div>

                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Effective End Date
                      </label>

                      <input
                        type="date"
                        value={
                          specialistForm.endDate
                        }
                        onChange={(event) =>
                          setSpecialistForm({
                            ...specialistForm,
                            endDate:
                              event.target.value,
                          })
                        }
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                      />

                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                  >

                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}

                    Add Weekly Specialist

                  </button>

                </form>

              </div>

              {/* SPECIALISTS LIST */}

              <div className="flex-1 xl:border-l xl:border-slate-100 xl:pl-8">

                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Weekly Specialist Schedule
                </h3>

                <div className="space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-2">

                  {weeklySpecialists.length === 0 ? (

                    <div className="py-16 px-5 text-center border-2 border-dashed border-slate-200 rounded-2xl">

                      <BriefcaseMedical className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                      <p className="text-sm text-slate-500 font-medium">
                        No weekly specialists configured.
                      </p>

                    </div>

                  ) : (

                    weeklySpecialists.map(
                      (specialist) => (

                        <div
                          key={specialist.id}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                        >

                          <div className="flex items-start gap-3">

                            <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">

                              {specialist.photoURL ? (

                                <img
                                  src={
                                    specialist.photoURL
                                  }
                                  alt={
                                    specialist.doctorName
                                  }
                                  className="w-full h-full object-cover"
                                />

                              ) : (

                                <User className="w-5 h-5 text-slate-400" />

                              )}

                            </div>

                            <div className="flex-1 min-w-0">

                              <h4 className="font-bold text-slate-900 truncate">
                                {
                                  specialist.doctorName
                                }
                              </h4>

                              <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 mt-0.5">
                                {specialist.specialty ||
                                  'Visiting Specialist'}
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSpecialist(
                                  specialist.id
                                )
                              }
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 shrink-0"
                            >

                              <Trash2 className="w-4 h-4" />

                            </button>

                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">

                            <div className="flex items-center gap-2 text-xs">

                              <Star className="w-3.5 h-3.5 text-[#C19B6C]" />

                              <span className="font-bold text-slate-600">
                                {specialist.expertise}
                              </span>

                            </div>

                            <div className="flex items-center gap-2 text-xs">

                              <Calendar className="w-3.5 h-3.5 text-[#0EA5E9]" />

                              <span className="font-bold text-slate-600">
                                {specialist.day}
                              </span>

                            </div>

                            <div className="flex items-center gap-2 text-xs">

                              <Clock className="w-3.5 h-3.5 text-emerald-500" />

                              <span className="font-bold text-slate-600">
                                {specialist.startTime}{' '}
                                -{' '}
                                {specialist.endTime}
                              </span>

                            </div>

                            {(specialist.startDate ||
                              specialist.endDate) && (

                              <p className="text-[10px] text-slate-400 font-medium pl-5">

                                Effective:{' '}

                                {specialist.startDate ||
                                  'No start date'}

                                {' → '}

                                {specialist.endDate ||
                                  'No end date'}

                              </p>

                            )}

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

            </motion.div>

          )}

        </div>

      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
            }
          `,
        }}
      />

    </div>
  );
};

export default DoctorAvailabilityAdmin;