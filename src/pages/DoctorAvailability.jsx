import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
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
  RefreshCw,
  Info,
  ShieldCheck,
  CheckCircle2,
  X,
  PhoneCall,
} from 'lucide-react';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DoctorAvailability = () => {
  // ---------------------------------------------------
  // DATE & TIME UTILITIES
  // ---------------------------------------------------
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const getDayNumber = (dateString) => {
    const date = parseLocalDate(dateString);
    return date ? date.getDay() : null;
  };

  const getDayName = (dateString) => {
    const dayNumber = getDayNumber(dateString);
    return dayNumber !== null ? DAY_NAMES[dayNumber] : '';
  };

  const formatSelectedDate = (dateString) => {
    const date = parseLocalDate(dateString);
    if (!date) return '';
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hourString, minuteString] = time24.split(':');
    let hours = Number(hourString);
    if (Number.isNaN(hours) || !minuteString) return time24;
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

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------
  const [doctors, setDoctors] = useState([]);
  const [availabilityRecords, setAvailabilityRecords] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [weeklySpecialists, setWeeklySpecialists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [specialistsLoading, setSpecialistsLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewType, setViewType] = useState('availability'); // 'availability' | 'specialists'

  // Clock tick (every 30 seconds, strictly local)
  useEffect(() => {
    setCurrentTime(getCurrentTime());
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------
  // 1. FETCH ACTIVE DOCTORS & SCHEDULES
  // ---------------------------------------------------
  const fetchDoctorsAndAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const doctorsQuery = query(
        collection(db, 'doctors'),
        where('status', '==', 'active')
      );

      const doctorsSnapshot = await getDocs(doctorsQuery);
      const doctorsData = doctorsSnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Order by featured first, then alphabetical name
      doctorsData.sort((a, b) => {
        if (Boolean(b.featured) !== Boolean(a.featured)) {
          return Boolean(b.featured) ? 1 : -1;
        }
        return (a.name || '').localeCompare(b.name || '');
      });

      setDoctors(doctorsData);

      if (doctorsData.length === 0) {
        setAvailabilityRecords([]);
        return;
      }

      // Chunk Firestore "in" queries (30 IDs max)
      const doctorIds = doctorsData.map((d) => d.id);
      const doctorIdChunks = chunkArray(doctorIds, 30);

      const availabilitySnapshots = await Promise.all(
        doctorIdChunks.map((chunk) =>
          getDocs(
            query(
              collection(db, 'doctor_availability'),
              where('doctorId', 'in', chunk)
            )
          )
        )
      );

      const availabilityData = availabilitySnapshots.flatMap((snap) =>
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setAvailabilityRecords(availabilityData);
    } catch (err) {
      console.error('Error fetching doctors availability:', err);
      setError('We could not load the doctor consultation schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctorsAndAvailability();
  }, [fetchDoctorsAndAvailability]);

  // ---------------------------------------------------
  // 2. FETCH BLOCKS FOR SELECTED DATE
  // ---------------------------------------------------
  const fetchBlocksForDate = useCallback(async (dateString) => {
    if (!dateString) {
      setBlocks([]);
      return;
    }

    try {
      setBlocksLoading(true);
      const blocksQuery = query(
        collection(db, 'doctor_blocks'),
        where('date', '==', dateString)
      );
      const blocksSnapshot = await getDocs(blocksQuery);
      setBlocks(
        blocksSnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (err) {
      console.error('Error fetching doctor blocks:', err);
      setBlocks([]);
    } finally {
      setBlocksLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocksForDate(selectedDate);
  }, [selectedDate, fetchBlocksForDate]);

  // ---------------------------------------------------
  // 3. FETCH WEEKLY SPECIALISTS
  // ---------------------------------------------------
  const isDateInsideRange = (date, startDate, endDate) => {
    if (!date) return false;
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  };

  const fetchWeeklySpecialists = useCallback(async (dayName) => {
    if (!dayName) {
      setWeeklySpecialists([]);
      return;
    }

    try {
      setSpecialistsLoading(true);
      const [daySnapshot, weekdaySnapshot] = await Promise.all([
        getDocs(
          query(collection(db, 'weekly_specialists'), where('day', '==', dayName))
        ),
        getDocs(
          query(collection(db, 'weekly_specialists'), where('weekday', '==', dayName))
        ),
      ]);

      const specialistMap = new Map();
      daySnapshot.docs.forEach((d) => specialistMap.set(d.id, { id: d.id, ...d.data() }));
      weekdaySnapshot.docs.forEach((d) => {
        if (!specialistMap.has(d.id)) {
          specialistMap.set(d.id, { id: d.id, ...d.data() });
        }
      });

      const specialistsData = Array.from(specialistMap.values());
      const filteredData = specialistsData.filter((s) =>
        isDateInsideRange(selectedDate, s.startDate, s.endDate)
      );

      filteredData.sort((a, b) =>
        (a.startTime || '').localeCompare(b.startTime || '')
      );

      setWeeklySpecialists(filteredData);
    } catch (err) {
      console.error('Error fetching weekly specialists:', err);
      setWeeklySpecialists([]);
    } finally {
      setSpecialistsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (viewType !== 'specialists') return;
    fetchWeeklySpecialists(getDayName(selectedDate));
  }, [viewType, selectedDate, fetchWeeklySpecialists]);

  // ---------------------------------------------------
  // SCHEDULE ACTIVE CHECK
  // ---------------------------------------------------
  const isScheduleActiveOnDate = (schedule, dateString) => {
    if (!schedule || !dateString) return false;
    const dayNumber = getDayNumber(dateString);

    if (schedule.type === 'custom') {
      return Boolean(schedule.customDates?.includes(dateString));
    }

    if (!isDateInsideRange(dateString, schedule.startDate, schedule.endDate)) {
      return false;
    }

    if (schedule.type === 'week') return true;
    if (schedule.type === 'weekend') return dayNumber === 0 || dayNumber === 6;

    return false;
  };

  // ---------------------------------------------------
  // COMPUTE REAL-TIME STATUS PER DOCTOR
  // ---------------------------------------------------
  const processedDoctors = useMemo(() => {
    const isToday = selectedDate === getTodayDate();

    return doctors.map((doctor) => {
      const doctorSchedules = availabilityRecords
        .filter((r) => r.doctorId === doctor.id)
        .filter((r) => isScheduleActiveOnDate(r, selectedDate));

      const doctorBlocks = blocks.filter(
        (b) => b.doctorId === doctor.id && b.date === selectedDate
      );

      if (doctorSchedules.length === 0) {
        return {
          ...doctor,
          status: 'leave',
          schedule: 'No Scheduled OPD',
          nextSlot: 'Not Available Today',
          blockTitle: '',
        };
      }

      // Pick the most recent record
      const sortedSchedules = [...doctorSchedules].sort((a, b) => {
        const aT = a.updatedAt?.seconds || a.createdAt?.seconds || 0;
        const bT = b.updatedAt?.seconds || b.createdAt?.seconds || 0;
        return aT - bT;
      });

      const activeSchedule = sortedSchedules[sortedSchedules.length - 1];
      const startTime = activeSchedule.startTime;
      const endTime = activeSchedule.endTime;

      let status = 'available';
      let nextSlot = `${formatTime(startTime)} – ${formatTime(endTime)}`;
      let blockTitle = '';

      if (isToday) {
        if (currentTime < startTime) {
          status = 'upcoming';
          nextSlot = `Starts at ${formatTime(startTime)}`;
        } else if (currentTime >= endTime) {
          status = 'leave';
          nextSlot = 'OPD Completed for Today';
        } else {
          status = 'available';
          nextSlot = 'Consulting Now';
        }
      }

      // Check for calendar blocks or emergency OT
      if (doctorBlocks.length > 0) {
        if (isToday) {
          const activeBlock = doctorBlocks.find(
            (b) => currentTime >= b.startTime && currentTime < b.endTime
          );

          if (activeBlock) {
            status = 'busy';
            blockTitle = activeBlock.title || 'In Surgery / OT';
            nextSlot = `Available after ${formatTime(activeBlock.endTime)}`;
          } else {
            const upcomingBlock = doctorBlocks
              .filter((b) => b.startTime > currentTime)
              .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))[0];

            if (upcomingBlock) {
              blockTitle = upcomingBlock.title || 'Scheduled Block';
            }
          }
        } else {
          const fullDayBlock = doctorBlocks.find(
            (b) => b.startTime <= startTime && b.endTime >= endTime
          );

          if (fullDayBlock) {
            status = 'busy';
            blockTitle = fullDayBlock.title || 'Doctor on Leave / Surgery';
            nextSlot = 'Unavailable for selected date';
          }
        }
      }

      return {
        ...doctor,
        status,
        schedule: `${formatTime(startTime)} – ${formatTime(endTime)}`,
        nextSlot,
        blockTitle,
      };
    });
  }, [doctors, availabilityRecords, blocks, selectedDate, currentTime]);

  // Filter Doctors by Search and Status
  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return processedDoctors.filter((docItem) => {
      const matchSearch =
        !q ||
        (docItem.name || '').toLowerCase().includes(q) ||
        (docItem.specialty || docItem.department || '').toLowerCase().includes(q);

      const matchStatus =
        statusFilter === 'all' || docItem.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [processedDoctors, searchTerm, statusFilter]);

  // Filter Weekly Specialists
  const selectedDayName = getDayName(selectedDate);
  const filteredWeeklySpecialists = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return weeklySpecialists.filter((s) => {
      const sDay = s.day || s.weekday || '';
      const dayMatch = sDay.toLowerCase() === selectedDayName.toLowerCase();
      const rangeMatch = isDateInsideRange(selectedDate, s.startDate, s.endDate);
      const searchMatch =
        !q ||
        (s.doctorName || '').toLowerCase().includes(q) ||
        (s.expertise || '').toLowerCase().includes(q) ||
        (s.specialty || '').toLowerCase().includes(q);

      return dayMatch && rangeMatch && searchMatch;
    });
  }, [weeklySpecialists, selectedDayName, selectedDate, searchTerm]);

  // Booking CTA Handler
  const handleBooking = (doctor = null, specialist = null) => {
    const docName = doctor?.name || specialist?.doctorName || '';
    const bookingSection = document.getElementById('book');

    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.dispatchEvent(
      new CustomEvent('hospital:booking-request', {
        detail: {
          doctorId: doctor?.id || '',
          doctorName: docName,
        },
      })
    );
  };

  const handleRetry = async () => {
    setError('');
    await fetchDoctorsAndAvailability();
    if (viewType === 'availability') {
      await fetchBlocksForDate(selectedDate);
    } else {
      await fetchWeeklySpecialists(selectedDayName);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {selectedDate === getTodayDate() ? 'Consulting Now' : 'Available'}
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-[#1f9b90] text-[10px] font-bold uppercase tracking-wider border border-teal-200">
            <Clock className="w-3 h-3" />
            Upcoming Shift
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            In Surgery / OT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
            <Ban className="w-3 h-3" />
            Not on Duty
          </span>
        );
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-[#f8fafc] py-24 px-4 min-h-[60vh] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center justify-center py-20 px-8 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Loader2 className="w-9 h-9 animate-spin text-[#1f9b90] mb-3" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Checking Clinical Timetables...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="availability"
      aria-labelledby="availability-heading"
      className="w-full bg-[#f8fafc] py-14 sm:py-20 lg:py-24 font-sans text-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================
            SECTION TITLE & REFRESH ACTION
        =================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200/80 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-[#1f9b90]">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Real-Time Consultation Timetable</span>
            </div>

            <h2
              id="availability-heading"
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1a365d]"
            >
              Doctor Availability & OPD Hours
            </h2>

            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Inspect on-duty specialists, surgery blockages, and visiting doctors for Sagara Hospital.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              disabled={blocksLoading || specialistsLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 hover:border-[#1f9b90] hover:text-[#1f9b90] transition-colors shadow-2xs disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${blocksLoading || specialistsLoading ? 'animate-spin' : ''}`}
              />
              <span>Refresh Schedule</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between gap-4 text-xs sm:text-sm text-red-800"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-50 shrink-0"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===================================================
            UNIFIED CONTROLS & DATE DECK (Wrapped, No Scroll)
        =================================================== */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
            
            {/* 1. Date Picker */}
            <div>
              <label
                htmlFor="availability-date"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Consultation Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1f9b90] pointer-events-none" />
                <input
                  id="availability-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#1f9b90] focus:bg-white"
                />
              </div>
            </div>

            {/* 2. Schedule Mode Switcher */}
            <div>
              <label
                htmlFor="availability-view"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Schedule View Mode
              </label>
              <select
                id="availability-view"
                value={viewType}
                onChange={(e) => {
                  setViewType(e.target.value);
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#1f9b90] focus:bg-white cursor-pointer"
              >
                <option value="availability">Regular Hospital Doctors</option>
                <option value="specialists">Weekly Visiting Specialists</option>
              </select>
            </div>

            {/* 3. Search Box */}
            <div>
              <label
                htmlFor="availability-search"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Search Directory
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="availability-search"
                  type="search"
                  placeholder={viewType === 'availability' ? "Doctor or specialty..." : "Specialist or expertise..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-[#1f9b90] focus:bg-white"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 4. Live Duty Filter */}
            <div>
              <label
                htmlFor="availability-status"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Status Filter
              </label>
              <select
                id="availability-status"
                value={statusFilter}
                disabled={viewType === 'specialists'}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:border-[#1f9b90] focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available / Consulting</option>
                <option value="upcoming">Upcoming Shift</option>
                <option value="busy">In Surgery / OT</option>
                <option value="leave">Not on Duty</option>
              </select>
            </div>

          </div>

          {/* Date Summary Row */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <CalendarCheck className="w-4 h-4 text-[#1f9b90]" />
              <span>
                Schedule for: <strong>{formatSelectedDate(selectedDate)}</strong>
              </span>
              {selectedDate === getTodayDate() && (
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase">
                  Today
                </span>
              )}
            </div>

            {selectedDate !== getTodayDate() && (
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayDate())}
                className="text-xs font-bold uppercase tracking-wider text-[#1f9b90] hover:underline self-start sm:self-auto"
              >
                Jump to Today's Schedule →
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            VIEW 1: REGULAR DOCTOR AVAILABILITY (ADAPTIVE GRID)
        =================================================== */}
        {viewType === 'availability' && (
          <div className="space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
                <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800">
                  No doctors found for this date
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  No physician matches your search filter for {formatSelectedDate(selectedDate)}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 rounded-xl bg-[#1a365d] px-4 py-2 text-xs font-semibold text-white hover:bg-[#122846]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDoctors.map((doctor) => {
                  const dept = doctor.specialty || doctor.department || 'Consultant Specialist';

                  return (
                    <div
                      key={doctor.id}
                      className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all"
                    >
                      <div>
                        {/* Top Profile Header */}
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                            {doctor.photoURL ? (
                              <img
                                src={doctor.photoURL}
                                alt={doctor.name}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover object-top"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <User className="w-8 h-8 text-slate-300 m-auto mt-4" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="inline-block rounded-md bg-teal-50 border border-teal-200/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1f9b90]">
                              {dept}
                            </span>
                            <h3 className="mt-1.5 text-base font-extrabold text-[#1a365d] leading-snug break-words">
                              {doctor.name}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 truncate">
                              {doctor.designation || 'Consultant'}
                            </p>
                          </div>
                        </div>

                        {/* Status + Hours Breakdown */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5 text-xs">
                          {/* Live Status Pill */}
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Status
                            </span>
                            {renderStatusBadge(doctor.status)}
                          </div>

                          {/* Consultation Hours */}
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#1f9b90]" />
                              <span>OPD Hours</span>
                            </span>
                            <span className="font-bold text-slate-800">{doctor.schedule}</span>
                          </div>

                          {/* Live Real-Time Slot Indicator */}
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Token Window
                            </span>
                            <span className="font-semibold text-slate-700">{doctor.nextSlot}</span>
                          </div>

                          {/* Block Reason Note (If Surgery or Leave) */}
                          {doctor.blockTitle && (
                            <div className="rounded-xl bg-amber-50 border border-amber-200/70 p-2 text-xs text-amber-800 font-medium">
                              Note: {doctor.blockTitle}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100">
                        <button
                          type="button"
                          disabled={doctor.status === 'leave' || doctor.status === 'busy'}
                          onClick={() => handleBooking(doctor)}
                          className="w-full py-2.5 bg-[#1a365d] hover:bg-[#122846] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span>Request Consultation</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            VIEW 2: WEEKLY VISITING SPECIALISTS
        =================================================== */}
        {viewType === 'specialists' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-[#1f9b90] border border-teal-200">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-[#1a365d]">
                    Visiting Specialists — {selectedDayName}s
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Consulting panel scheduled for {formatSelectedDate(selectedDate)}
                  </p>
                </div>
              </div>

              {specialistsLoading && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1f9b90]" />
                  <span>Loading specialist registry...</span>
                </div>
              )}
            </div>

            {filteredWeeklySpecialists.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center">
                <BriefcaseMedical className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-base text-slate-800">
                  No visiting specialists scheduled for {selectedDayName}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Visiting consultants operate on designated weekdays. Pick another day on the calendar above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredWeeklySpecialists.map((specialist) => (
                  <div
                    key={specialist.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Specialist Header */}
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center">
                          {specialist.photoURL ? (
                            <img
                              src={specialist.photoURL}
                              alt={specialist.doctorName}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-slate-300 m-auto mt-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="inline-block rounded-md bg-teal-50 border border-teal-200/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1f9b90]">
                            {specialist.specialty || 'Visiting Super-Specialist'}
                          </span>
                          <h4 className="mt-1.5 text-base font-extrabold text-[#1a365d] break-words">
                            {specialist.doctorName}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 truncate">
                            Visiting Consultant
                          </p>
                        </div>
                      </div>

                      {/* Specialist Details */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                        {specialist.expertise && (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                              Clinical Expertise
                            </span>
                            <p className="font-semibold text-slate-800 leading-relaxed">
                              {specialist.expertise}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Visiting Day
                          </span>
                          <span className="font-bold text-[#1a365d]">{specialist.day}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Consultation Hours
                          </span>
                          <span className="font-bold text-slate-800">
                            {formatTime(specialist.startTime)} – {formatTime(specialist.endTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleBooking(null, specialist)}
                        className="w-full py-2.5 bg-gradient-to-r from-[#1a365d] to-[#1f9b90] hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <span>Book Token with Specialist</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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