import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

import {
  Search,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Ban,
  ChevronRight,
  CalendarCheck,
  Loader2,
  Stethoscope,
  Star,
  BriefcaseMedical,
} from 'lucide-react';

const DoctorAvailability = () => {
  const getTodayDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const [doctors, setDoctors] = useState([]);
  const [availabilityRecords, setAvailabilityRecords] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [weeklySpecialists, setWeeklySpecialists] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');

  const [viewType, setViewType] = useState('availability');

  /*
  |--------------------------------------------------------------------------
  | FETCH FIRESTORE DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);

        const [
          doctorsSnapshot,
          availabilitySnapshot,
          blocksSnapshot,
          weeklySpecialistsSnapshot,
        ] = await Promise.all([
          getDocs(collection(db, 'doctors')),

          getDocs(collection(db, 'doctor_availability')),

          getDocs(collection(db, 'doctor_blocks')),

          getDocs(collection(db, 'weekly_specialists')),
        ]);

        setDoctors(
          doctorsSnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );

        setAvailabilityRecords(
          availabilitySnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );

        setBlocks(
          blocksSnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );

        setWeeklySpecialists(
          weeklySpecialistsSnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );
      } catch (error) {
        console.error('Error fetching doctor availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();

    /*
    |--------------------------------------------------------------------------
    | REFRESH DATA EVERY 5 MINUTES
    |--------------------------------------------------------------------------
    */

    const interval = setInterval(fetchSchedules, 300000);

    return () => clearInterval(interval);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | DATE HELPERS
  |--------------------------------------------------------------------------
  */

  const parseLocalDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(year, month - 1, day);
  };

  const getDayNumber = (dateString) => {
    const date = parseLocalDate(dateString);

    return date ? date.getDay() : null;
  };

  const getDayName = (dateString) => {
    const date = parseLocalDate(dateString);

    if (!date) {
      return '';
    }

    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
    });
  };

  const formatSelectedDate = (dateString) => {
    const date = parseLocalDate(dateString);

    if (!date) {
      return '';
    }

    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = selectedDate === getTodayDate();

  /*
  |--------------------------------------------------------------------------
  | TIME HELPERS
  |--------------------------------------------------------------------------
  */

  const formatTime = (time24) => {
    if (!time24) {
      return '';
    }

    const [hourString, minuteString] = time24.split(':');

    let hours = Number(hourString);

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return `${hours}:${minuteString} ${ampm}`;
  };

  const getCurrentTime = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  /*
  |--------------------------------------------------------------------------
  | AVAILABILITY HELPERS
  |--------------------------------------------------------------------------
  */

  const isDateInsideRange = (date, startDate, endDate) => {
    if (!date) {
      return false;
    }

    if (startDate && date < startDate) {
      return false;
    }

    if (endDate && date > endDate) {
      return false;
    }

    return true;
  };

  const isScheduleActiveOnDate = (schedule, dateString) => {
    if (!schedule || !dateString) {
      return false;
    }

    const dayNumber = getDayNumber(dateString);

    /*
    |--------------------------------------------------------------------------
    | CUSTOM DATES
    |--------------------------------------------------------------------------
    */

    if (schedule.type === 'custom') {
      return schedule.customDates?.includes(dateString) || false;
    }

    /*
    |--------------------------------------------------------------------------
    | DATE RANGE VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !isDateInsideRange(
        dateString,
        schedule.startDate,
        schedule.endDate
      )
    ) {
      return false;
    }

    /*
    |--------------------------------------------------------------------------
    | WHOLE WEEK
    |--------------------------------------------------------------------------
    */

    if (schedule.type === 'week') {
      return true;
    }

    /*
    |--------------------------------------------------------------------------
    | WEEKENDS
    |--------------------------------------------------------------------------
    */

    if (schedule.type === 'weekend') {
      return dayNumber === 0 || dayNumber === 6;
    }

    return false;
  };

  const getSchedulesForDoctor = (doctorId) => {
    return availabilityRecords
      .filter((record) => record.doctorId === doctorId)
      .filter((record) =>
        isScheduleActiveOnDate(record, selectedDate)
      );
  };

  const getBlocksForDoctor = (doctorId) => {
    return blocks.filter(
      (block) =>
        block.doctorId === doctorId &&
        block.date === selectedDate
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PROCESS DOCTOR AVAILABILITY
  |--------------------------------------------------------------------------
  */

  const processedDoctors = useMemo(() => {
    const currentTime = getCurrentTime();

    return doctors.map((doctor) => {
      const doctorSchedules = getSchedulesForDoctor(doctor.id);

      const doctorBlocks = getBlocksForDoctor(doctor.id);

      /*
      |--------------------------------------------------------------------------
      | NO SCHEDULE
      |--------------------------------------------------------------------------
      */

      if (doctorSchedules.length === 0) {
        return {
          ...doctor,

          status: 'leave',

          schedule: 'Not Scheduled',

          nextSlot: 'No Availability',

          blockTitle: '',
        };
      }

      /*
      |--------------------------------------------------------------------------
      | IF MULTIPLE RECORDS EXIST
      |
      | We use the last record returned.
      | Admin file will later prevent duplicate availability records.
      |--------------------------------------------------------------------------
      */

      const activeSchedule =
        doctorSchedules[doctorSchedules.length - 1];

      const startTime = activeSchedule.startTime;

      const endTime = activeSchedule.endTime;

      let status = 'available';

      let nextSlot = `${formatTime(startTime)} - ${formatTime(
        endTime
      )}`;

      let blockTitle = '';

      /*
      |--------------------------------------------------------------------------
      | TODAY'S REAL-TIME STATUS
      |--------------------------------------------------------------------------
      */

      if (isToday) {
        if (currentTime < startTime) {
          status = 'upcoming';

          nextSlot = `Available from ${formatTime(startTime)}`;
        } else if (currentTime > endTime) {
          status = 'leave';

          nextSlot = 'Consultation Hours Completed';
        } else {
          status = 'available';

          nextSlot = 'Available Now';
        }
      }

      /*
      |--------------------------------------------------------------------------
      | CHECK BLOCKS / OT
      |--------------------------------------------------------------------------
      */

      if (doctorBlocks.length > 0) {
        /*
        |--------------------------------------------------------------------------
        | TODAY
        |--------------------------------------------------------------------------
        */

        if (isToday) {
          const activeBlock = doctorBlocks.find(
            (block) =>
              currentTime >= block.startTime &&
              currentTime <= block.endTime
          );

          if (activeBlock) {
            status = 'busy';

            blockTitle = activeBlock.title || 'Blocked';

            nextSlot = `Available after ${formatTime(
              activeBlock.endTime
            )}`;
          }
        } else {
          /*
          |--------------------------------------------------------------------------
          | FUTURE / OTHER DATE
          |
          | If the entire doctor schedule is blocked, mark unavailable.
          |--------------------------------------------------------------------------
          */

          const fullDayBlock = doctorBlocks.find(
            (block) =>
              block.startTime <= startTime &&
              block.endTime >= endTime
          );

          if (fullDayBlock) {
            status = 'busy';

            blockTitle = fullDayBlock.title || 'Unavailable';

            nextSlot = 'Unavailable for selected date';
          }
        }
      }

      return {
        ...doctor,

        status,

        schedule: `${formatTime(startTime)} - ${formatTime(
          endTime
        )}`,

        nextSlot,

        blockTitle,
      };
    });
  }, [
    doctors,
    availabilityRecords,
    blocks,
    selectedDate,
    isToday,
  ]);

  /*
  |--------------------------------------------------------------------------
  | FILTER DOCTORS
  |--------------------------------------------------------------------------
  */

  const filteredDoctors = processedDoctors.filter((doctor) => {
    const searchValue = searchTerm.toLowerCase();

    const searchMatch =
      (doctor.name || '').toLowerCase().includes(searchValue) ||
      (doctor.specialty || '')
        .toLowerCase()
        .includes(searchValue);

    const statusMatch =
      statusFilter === 'all' ||
      doctor.status === statusFilter;

    return searchMatch && statusMatch;
  });

  /*
  |--------------------------------------------------------------------------
  | PROCESS WEEKLY SPECIALISTS
  |--------------------------------------------------------------------------
  */

  const selectedDayName = getDayName(selectedDate);

  const filteredWeeklySpecialists = weeklySpecialists.filter(
    (specialist) => {
      /*
      |--------------------------------------------------------------------------
      | SUPPORT BOTH day AND weekday FIELD NAMES
      |--------------------------------------------------------------------------
      */

      const specialistDay =
        specialist.day || specialist.weekday || '';

      const dayMatch =
        specialistDay.toLowerCase() ===
        selectedDayName.toLowerCase();

      const rangeMatch = isDateInsideRange(
        selectedDate,
        specialist.startDate,
        specialist.endDate
      );

      const searchValue = searchTerm.toLowerCase();

      const searchMatch =
        (specialist.doctorName || '')
          .toLowerCase()
          .includes(searchValue) ||
        (specialist.expertise || '')
          .toLowerCase()
          .includes(searchValue) ||
        (specialist.specialty || '')
          .toLowerCase()
          .includes(searchValue);

      return dayMatch && rangeMatch && searchMatch;
    }
  );

  /*
  |--------------------------------------------------------------------------
  | STATUS BADGE
  |--------------------------------------------------------------------------
  */

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-widest border border-emerald-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

            {isToday ? 'Available Now' : 'Available'}
          </span>
        );

      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[11px] font-bold uppercase tracking-widest border border-sky-100 whitespace-nowrap">
            <Clock className="w-3 h-3" />

            Upcoming
          </span>
        );

      case 'busy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold uppercase tracking-widest border border-amber-100 whitespace-nowrap">
            <AlertCircle className="w-3 h-3" />

            In Surgery / OT
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-widest border border-slate-200 whitespace-nowrap">
            <Ban className="w-3 h-3" />

            Unavailable
          </span>
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
      <section className="w-full bg-[#f8fafc] py-20 px-4 min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-[#0EA5E9] mb-4" />

            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
              Loading Doctor Schedules...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="availability"
      className="w-full bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 font-sans min-h-screen"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck className="w-5 h-5 text-[#c19b6c]" />

            <span className="text-[#c19b6c] font-bold uppercase tracking-widest text-xs">
              Consultation Schedule
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Doctor Availability
          </h2>

          <p className="text-slate-500 font-medium mt-2">
            Check doctor availability and weekly specialist schedules.
          </p>
        </motion.div>

        {/* ================================================================ */}
        {/* DATE + VIEW CONTROLS                                              */}
        {/* ================================================================ */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* DATE */}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Select Date
              </label>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0EA5E9] pointer-events-none" />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) =>
                    setSelectedDate(event.target.value)
                  }
                  className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
                />
              </div>
            </div>

            {/* VIEW DROPDOWN */}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Schedule View
              </label>

              <select
                value={viewType}
                onChange={(event) =>
                  setViewType(event.target.value)
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] cursor-pointer"
              >
                <option value="availability">
                  Doctor Availability
                </option>

                <option value="specialists">
                  Weekly Specialists
                </option>
              </select>
            </div>

            {/* SEARCH */}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Search
              </label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder={
                    viewType === 'availability'
                      ? 'Doctor or specialty...'
                      : 'Specialist or expertise...'
                  }
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9]"
                />
              </div>
            </div>

            {/* STATUS FILTER */}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                disabled={viewType === 'specialists'}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#0EA5E9] disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
              >
                <option value="all">All Statuses</option>

                <option value="available">Available</option>

                <option value="upcoming">Upcoming</option>

                <option value="busy">In Surgery / OT</option>

                <option value="leave">Unavailable</option>
              </select>
            </div>

          </div>

          {/* SELECTED DATE SUMMARY */}

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <CalendarCheck className="w-4 h-4 text-[#c19b6c]" />

              {isToday ? "Today's Availability" : formatSelectedDate(selectedDate)}
            </div>

            {!isToday && (
              <button
                onClick={() => setSelectedDate(getTodayDate())}
                className="text-xs font-bold uppercase tracking-widest text-[#0EA5E9] hover:text-sky-600"
              >
                Show Today
              </button>
            )}

          </div>
        </div>

        {/* ================================================================ */}
        {/* DOCTOR AVAILABILITY VIEW                                         */}
        {/* ================================================================ */}

        {viewType === 'availability' && (
          <>

            {/* DESKTOP TABLE */}

            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

              <table className="w-full text-left border-collapse">

                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">

                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Doctor Profile
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Status
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Consultation Hours
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Availability
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >

                      <td className="py-4 px-6">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">

                            {doctor.photoURL ? (
                              <img
                                src={doctor.photoURL}
                                alt={doctor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-slate-400" />
                            )}

                          </div>

                          <div>

                            <h4 className="font-bold text-slate-900">
                              {doctor.name}
                            </h4>

                            <p className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider mt-0.5">
                              {doctor.specialty}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="py-4 px-6">
                        {renderStatusBadge(doctor.status)}

                        {doctor.blockTitle && (
                          <p className="text-[10px] text-amber-600 font-bold mt-1.5">
                            {doctor.blockTitle}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-6">

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">

                          <Clock className="w-4 h-4 text-[#c19b6c]" />

                          {doctor.schedule}

                        </div>

                      </td>

                      <td className="py-4 px-6">

                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">

                          <Calendar className="w-4 h-4 text-[#0EA5E9]" />

                          {doctor.nextSlot}

                        </div>

                      </td>

                      <td className="py-4 px-6 text-right">

                        <button
                          disabled={
                            doctor.status === 'leave' ||
                            doctor.status === 'busy'
                          }
                          className="px-5 py-2.5 bg-white border border-slate-200 hover:border-[#0EA5E9] text-slate-700 hover:text-[#0EA5E9] rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Book Now
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

              {filteredDoctors.length === 0 && (
                <div className="py-16 text-center">

                  <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />

                  <p className="text-slate-500 font-bold text-lg">
                    No doctors available.
                  </p>

                  <p className="text-slate-400 text-sm">
                    No schedules were found for the selected date.
                  </p>

                </div>
              )}

            </div>

            {/* MOBILE / TABLET CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">

              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">

                      {doctor.photoURL ? (
                        <img
                          src={doctor.photoURL}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}

                    </div>

                    <div>

                      <h4 className="font-bold text-slate-900">
                        {doctor.name}
                      </h4>

                      <p className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider mt-1">
                        {doctor.specialty}
                      </p>

                    </div>

                  </div>

                  <div className="py-3 border-y border-slate-100 space-y-3">

                    <div className="flex justify-between items-center gap-4">

                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Status
                      </span>

                      {renderStatusBadge(doctor.status)}

                    </div>

                    <div className="flex justify-between items-center gap-4">

                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Hours
                      </span>

                      <span className="text-sm font-bold text-slate-700 text-right">
                        {doctor.schedule}
                      </span>

                    </div>

                    <div className="flex justify-between items-center gap-4">

                      <span className="text-xs font-bold text-slate-400 uppercase">
                        Availability
                      </span>

                      <span className="text-sm font-bold text-slate-700 text-right">
                        {doctor.nextSlot}
                      </span>

                    </div>

                  </div>

                  <button
                    disabled={
                      doctor.status === 'leave' ||
                      doctor.status === 'busy'
                    }
                    className="w-full py-3.5 bg-slate-50 border border-slate-200 hover:bg-[#0EA5E9] hover:text-white hover:border-[#0EA5E9] text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Book Appointment

                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              ))}

              {filteredDoctors.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">

                  <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                  <p className="text-slate-500 font-bold">
                    No doctors available for the selected date.
                  </p>

                </div>
              )}

            </div>

          </>
        )}

        {/* ================================================================ */}
        {/* WEEKLY SPECIALISTS VIEW                                          */}
        {/* ================================================================ */}

        {viewType === 'specialists' && (
          <div>

            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">

                <Star className="w-5 h-5 text-[#c19b6c]" />

              </div>

              <div>

                <h3 className="font-black text-xl text-slate-900">
                  {selectedDayName} Specialists
                </h3>

                <p className="text-sm text-slate-500 font-medium">
                  Specialists consulting on {formatSelectedDate(selectedDate)}.
                </p>

              </div>

            </div>

            {filteredWeeklySpecialists.length === 0 ? (

              <div className="bg-white rounded-2xl border border-slate-200 border-dashed py-20 px-6 text-center">

                <BriefcaseMedical className="w-12 h-12 text-slate-300 mx-auto mb-4" />

                <h4 className="font-bold text-lg text-slate-600">
                  No Weekly Specialists Scheduled
                </h4>

                <p className="text-sm text-slate-400 mt-1">
                  No specialist consultation has been configured for this day.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {filteredWeeklySpecialists.map((specialist) => (

                  <motion.div
                    key={specialist.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
                  >

                    <div className="flex items-center gap-4 mb-5">

                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">

                        {specialist.photoURL ? (
                          <img
                            src={specialist.photoURL}
                            alt={specialist.doctorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-7 h-7 text-slate-400" />
                        )}

                      </div>

                      <div className="min-w-0">

                        <h4 className="font-bold text-slate-900 truncate">
                          {specialist.doctorName}
                        </h4>

                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#0EA5E9] mt-1">
                          {specialist.specialty || 'Visiting Specialist'}
                        </p>

                      </div>

                    </div>

                    <div className="space-y-3 border-y border-slate-100 py-4">

                      <div className="flex gap-3">

                        <BriefcaseMedical className="w-4 h-4 text-[#c19b6c] mt-0.5 shrink-0" />

                        <div>

                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Expertise
                          </p>

                          <p className="text-sm font-bold text-slate-700 mt-0.5">
                            {specialist.expertise || 'Specialist Consultation'}
                          </p>

                        </div>

                      </div>

                      <div className="flex gap-3">

                        <Calendar className="w-4 h-4 text-[#0EA5E9] mt-0.5 shrink-0" />

                        <div>

                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Consultation Day
                          </p>

                          <p className="text-sm font-bold text-slate-700 mt-0.5">
                            {specialist.day ||
                              specialist.weekday ||
                              selectedDayName}
                          </p>

                        </div>

                      </div>

                      <div className="flex gap-3">

                        <Clock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

                        <div>

                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                            Consultation Time
                          </p>

                          <p className="text-sm font-bold text-slate-700 mt-0.5">
                            {formatTime(specialist.startTime)} -{' '}
                            {formatTime(specialist.endTime)}
                          </p>

                        </div>

                      </div>

                    </div>

                    <button className="mt-5 w-full py-3 bg-slate-50 border border-slate-200 hover:bg-[#0EA5E9] hover:text-white hover:border-[#0EA5E9] text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">

                      Book Consultation

                      <ChevronRight className="w-4 h-4" />

                    </button>

                  </motion.div>

                ))}

              </div>

            )}

          </div>
        )}

      </div>
    </section>
  );
};

export default DoctorAvailability;