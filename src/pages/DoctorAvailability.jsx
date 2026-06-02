import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  Search, Calendar, Clock, User, 
  AlertCircle, Ban, ChevronRight, CalendarCheck, Loader2
} from 'lucide-react';

const DoctorAvailability = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // Fetch all necessary collections simultaneously
        const [docsSnap, availSnap, blocksSnap] = await Promise.all([
          getDocs(collection(db, 'doctors')),
          getDocs(collection(db, 'doctor_availability')),
          getDocs(collection(db, 'doctor_blocks'))
        ]);

        const doctorsData = docsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const availData = availSnap.docs.map(a => ({ id: a.id, ...a.data() }));
        const blocksData = blocksSnap.docs.map(b => ({ id: b.id, ...b.data() }));

        const now = new Date();
        const currentTimeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' });
        const currentDateStr = now.toISOString().split('T')[0];
        const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

        // Process and merge data
        const processedDoctors = doctorsData.map(doc => {
          const myAvail = availData.find(a => a.doctorId === doc.id);
          const myBlocks = blocksData.filter(b => b.doctorId === doc.id);

          let status = 'leave'; // Default status
          let scheduleText = 'Not Scheduled';
          let nextSlotText = 'Contact Front Desk';

          if (myAvail) {
            // Format Schedule Text based on Admin Selection
            const tStart = formatTime(myAvail.startTime);
            const tEnd = formatTime(myAvail.endTime);
            
            if (myAvail.type === 'week') scheduleText = `Mon - Sun: ${tStart} - ${tEnd}`;
            else if (myAvail.type === 'weekend') scheduleText = `Sat - Sun: ${tStart} - ${tEnd}`;
            else if (myAvail.type === 'custom') scheduleText = `Custom Dates: ${tStart} - ${tEnd}`;

            // Calculate Real-Time Status
            let isWorkingDay = false;
            if (myAvail.type === 'week') isWorkingDay = true;
            if (myAvail.type === 'weekend' && (currentDay === 0 || currentDay === 6)) isWorkingDay = true;
            if (myAvail.type === 'custom' && myAvail.customDates?.includes(currentDateStr)) isWorkingDay = true;

            const isWithinHours = currentTimeStr >= myAvail.startTime && currentTimeStr <= myAvail.endTime;

            if (isWorkingDay && isWithinHours) {
              status = 'available';
            }

            // Check if currently blocked (Surgery/OT/Leave)
            const activeBlock = myBlocks.find(b => 
              b.date === currentDateStr && 
              currentTimeStr >= b.startTime && 
              currentTimeStr <= b.endTime
            );

            if (activeBlock) {
              status = 'busy'; // Overrides availability if blocked
            }

            // Basic Next Slot Calculation
            if (status === 'available') {
              nextSlotText = `Today, Available Now`;
            } else if (status === 'busy') {
              nextSlotText = `Today, After ${formatTime(activeBlock.endTime)}`;
            } else if (isWorkingDay && currentTimeStr < myAvail.startTime) {
              nextSlotText = `Today, ${tStart}`;
            } else {
              nextSlotText = `Tomorrow, ${tStart}`;
            }
          }

          return {
            ...doc,
            status,
            schedule: scheduleText,
            nextSlot: nextSlotText
          };
        });

        setDoctorsList(processedDoctors);
      } catch (err) {
        console.error("Error fetching availability:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
    
    // Auto-refresh every 5 minutes to keep statuses accurate
    const interval = setInterval(fetchSchedules, 300000);
    return () => clearInterval(interval);
  }, []);

  // Helper to convert 24h time "14:30" to 12h time "02:30 PM"
  const formatTime = (time24) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${m} ${ampm}`;
  };

  // Filter Logic
  const filteredDoctors = doctorsList.filter(doc => {
    const searchMatch = (doc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (doc.specialty || '').toLowerCase().includes(searchTerm.toLowerCase());
    const filterMatch = filter === "all" || doc.status === filter;
    return searchMatch && filterMatch;
  });

  // Helper for Status Badge Rendering
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-widest border border-emerald-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Available Now
          </span>
        );
      case 'busy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold uppercase tracking-widest border border-amber-100 whitespace-nowrap">
            <AlertCircle className="w-3 h-3" /> In Surgery / OT
          </span>
        );
      case 'leave':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-widest border border-slate-200 whitespace-nowrap">
            <Ban className="w-3 h-3" /> Unavailable
          </span>
        );
    }
  };

  return (
    <section id="availability" className="w-full bg-[#f8fafc] py-20 px-4 sm:px-6 lg:px-8 font-sans min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck className="w-5 h-5 text-[#c19b6c]" />
              <span className="text-[#c19b6c] font-bold uppercase tracking-widest text-xs">Live Schedule</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Doctor Availability</h2>
            <p className="text-slate-500 font-medium mt-2">Check real-time availability and upcoming consultation slots.</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search doctors or specialties..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-all shadow-sm"
              />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] shadow-sm cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available Now</option>
              <option value="busy">In Surgery/OT</option>
              <option value="leave">Unavailable</option>
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-[#0EA5E9] mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Syncing Live Schedules...</p>
          </div>
        ) : (
          <>
            {/* ========================================== */}
            {/* DESKTOP VIEW: PREMIUM TABLE                */}
            {/* ========================================== */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Doctor Profile</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Current Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Standard Hours</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Next Available</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Doctor Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                            {doc.photoURL ? (
                              <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{doc.name}</h4>
                            <p className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider mt-0.5">{doc.specialty}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        {renderStatusBadge(doc.status)}
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Calendar className="w-4 h-4 text-[#c19b6c]" /> {doc.schedule}
                        </div>
                      </td>

                      {/* Next Slot */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <Clock className="w-4 h-4 text-[#0EA5E9]" /> {doc.nextSlot}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <button className="px-5 py-2.5 bg-white border border-slate-200 hover:border-[#0EA5E9] text-slate-700 hover:text-[#0EA5E9] rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow">
                          Book Now
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredDoctors.length === 0 && (
                <div className="py-16 text-center">
                  <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold text-lg">No doctors found.</p>
                  <p className="text-slate-400 text-sm">Try adjusting your search filters.</p>
                </div>
              )}
            </div>

            {/* ========================================== */}
            {/* MOBILE & TABLET VIEW: INFO CARDS           */}
            {/* ========================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {filteredDoctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                        {doc.photoURL ? (
                          <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{doc.name}</h4>
                        <p className="text-[10px] font-bold text-[#0EA5E9] uppercase tracking-wider mt-1">{doc.specialty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-3 border-y border-slate-100 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                      {renderStatusBadge(doc.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Next Slot</span>
                      <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0EA5E9]" /> {doc.nextSlot}
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-3.5 bg-slate-50 border border-slate-200 hover:bg-[#0EA5E9] hover:text-white hover:border-[#0EA5E9] text-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-sm">
                    Book Appointment <ChevronRight className="w-4 h-4" />
                  </button>

                </div>
              ))}
              
              {filteredDoctors.length === 0 && (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500 font-medium">
                  No doctors found matching your criteria.
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default DoctorAvailability;