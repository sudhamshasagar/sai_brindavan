import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { 
  collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { 
  Calendar, Clock, User, AlertCircle, Loader2, CalendarDays, 
  Ban, CheckCircle2, Scissors, Stethoscope, Bell, Plus, Trash2 ,X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorAvailabilityAdmin = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // View Toggle: 'schedule' (Regular) | 'block' (OT/Leaves)
  const [activeTab, setActiveTab] = useState('schedule');

  // --- SCHEDULE STATE ---
  const [scheduleType, setScheduleType] = useState('week'); // week, weekend, custom
  const [availability, setAvailability] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    customDates: [] // For multiple specific dates
  });
  const [tempDate, setTempDate] = useState('');

  // --- BLOCK / OT STATE ---
  const [blocks, setBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({
    title: '',
    details: '',
    date: '',
    startTime: '',
    endTime: '',
    notifyDoctor: true
  });

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const docSnap = await getDocs(collection(db, 'doctors'));
        setDoctors(docSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch blocks when a doctor is selected
  useEffect(() => {
    if (!selectedDoctorId) {
      setBlocks([]);
      return;
    }
    const fetchBlocks = async () => {
      try {
        const q = query(
          collection(db, 'doctor_blocks'), 
          where('doctorId', '==', selectedDoctorId),
          orderBy('date', 'asc')
        );
        const snap = await getDocs(q);
        setBlocks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching blocks:", err);
      }
    };
    fetchBlocks();
  }, [selectedDoctorId]);

  // Handle adding custom dates for availability
  const handleAddCustomDate = () => {
    if (tempDate && !availability.customDates.includes(tempDate)) {
      setAvailability(prev => ({ ...prev, customDates: [...prev.customDates, tempDate] }));
      setTempDate('');
    }
  };

  const removeCustomDate = (dateToRemove) => {
    setAvailability(prev => ({
      ...prev,
      customDates: prev.customDates.filter(d => d !== dateToRemove)
    }));
  };

  // --- SUBMISSIONS ---
  const handleSaveAvailability = async () => {
    if (!selectedDoctorId) {
      setMessage({ type: 'error', text: 'Please select a doctor first.' });
      return;
    }
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      // Logic to save availability to Firestore
      const dataToSave = {
        doctorId: selectedDoctorId,
        type: scheduleType,
        startTime: availability.startTime,
        endTime: availability.endTime,
        updatedAt: serverTimestamp(),
        ...(scheduleType !== 'custom' ? { startDate: availability.startDate, endDate: availability.endDate } : { customDates: availability.customDates })
      };
      
      await addDoc(collection(db, 'doctor_availability'), dataToSave);
      setMessage({ type: 'success', text: 'Availability updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save availability.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveBlock = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setMessage({ type: 'error', text: 'Please select a doctor first.' });
      return;
    }
    setSubmitting(true);
    try {
      const blockData = {
        ...newBlock,
        doctorId: selectedDoctorId,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'doctor_blocks'), blockData);
      
      setBlocks(prev => [...prev, { id: docRef.id, ...blockData }].sort((a, b) => new Date(a.date) - new Date(b.date)));
      
      setMessage({ type: 'success', text: 'Time blocked successfully!' });
      setNewBlock({ title: '', details: '', date: '', startTime: '', endTime: '', notifyDoctor: true });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to block time.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlock = async (id) => {
    if (!window.confirm("Remove this block?")) return;
    try {
      await deleteDoc(doc(db, 'doctor_blocks', id));
      setBlocks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 lg:p-8 font-sans text-slate-800">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
          <CalendarDays className="w-8 h-8 text-[#0EA5E9]" />
          Doctor Availability & Timetable
        </h1>
        <p className="text-slate-500 font-medium">Manage weekly schedules, set working hours, and block times for surgeries (OT) or leaves.</p>
      </div>

      {/* Global Message Banner */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${
              message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}
          >
            {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        
        {/* ========================================== */}
        {/* LEFT PANEL: DOCTOR SELECTOR & TABS         */}
        {/* ========================================== */}
        <div className="w-full lg:w-1/3 bg-slate-50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
          
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
            1. Select Doctor
          </label>
          <div className="relative mb-8">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>-- Choose a Doctor --</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} {doc.specialty ? `(${doc.specialty})` : ''}</option>
              ))}
            </select>
          </div>

          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
            2. Select Action
          </label>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`p-4 rounded-xl flex items-center gap-4 text-left transition-all ${
                activeTab === 'schedule' 
                  ? 'bg-white border-2 border-[#0EA5E9] shadow-md' 
                  : 'bg-transparent border-2 border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'schedule' ? 'bg-sky-50' : 'bg-slate-200'}`}>
                <Clock className={`w-5 h-5 ${activeTab === 'schedule' ? 'text-[#0EA5E9]' : 'text-slate-500'}`} />
              </div>
              <div>
                <h4 className={`font-bold ${activeTab === 'schedule' ? 'text-[#0EA5E9]' : 'text-slate-700'}`}>Set Schedule</h4>
                <p className="text-xs text-slate-500 font-medium">Regular working hours</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('block')}
              className={`p-4 rounded-xl flex items-center gap-4 text-left transition-all ${
                activeTab === 'block' 
                  ? 'bg-white border-2 border-[#C19B6C] shadow-md' 
                  : 'bg-transparent border-2 border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'block' ? 'bg-amber-50' : 'bg-slate-200'}`}>
                <Ban className={`w-5 h-5 ${activeTab === 'block' ? 'text-[#C19B6C]' : 'text-slate-500'}`} />
              </div>
              <div>
                <h4 className={`font-bold ${activeTab === 'block' ? 'text-[#C19B6C]' : 'text-slate-700'}`}>Block Time / OT</h4>
                <p className="text-xs text-slate-500 font-medium">Surgeries, leaves, exceptions</p>
              </div>
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT PANEL: DYNAMIC CONTENT               */}
        {/* ========================================== */}
        <div className="w-full lg:w-2/3 p-6 lg:p-8 relative min-h-[500px]">
          
          {!selectedDoctorId ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-white/50 backdrop-blur-sm z-10">
              <Stethoscope className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-bold text-slate-500">Please select a doctor to continue.</p>
            </div>
          ) : null}

          {/* --- TAB: SET SCHEDULE --- */}
          {activeTab === 'schedule' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Regular Availability</h2>
              
              {/* Presets */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {['week', 'weekend', 'custom'].map(type => (
                  <button
                    key={type}
                    onClick={() => setScheduleType(type)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold capitalize transition-colors border ${
                      scheduleType === type 
                        ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-md shadow-sky-500/20' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'week' ? 'Whole Week' : type === 'weekend' ? 'Weekends Only' : 'Custom Dates'}
                  </button>
                ))}
              </div>

              {/* Date Inputs based on Type */}
              {scheduleType !== 'custom' ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date (Range)</label>
                    <input 
                      type="date" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                      value={availability.startDate}
                      onChange={e => setAvailability({...availability, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">End Date (Range)</label>
                    <input 
                      type="date" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                      value={availability.endDate}
                      onChange={e => setAvailability({...availability, endDate: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Select Multiple Dates</label>
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                      value={tempDate}
                      onChange={e => setTempDate(e.target.value)}
                    />
                    <button onClick={handleAddCustomDate} className="bg-[#0EA5E9] text-white px-5 rounded-xl font-bold hover:bg-sky-600 transition-colors">
                      Add
                    </button>
                  </div>
                  {/* Selected Dates Chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {availability.customDates.map(d => (
                      <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-[#0EA5E9] text-sm font-bold rounded-lg border border-sky-100">
                        {d} <button onClick={() => removeCustomDate(d)}><X className="w-3.5 h-3.5 hover:text-red-500" /></button>
                      </span>
                    ))}
                    {availability.customDates.length === 0 && <span className="text-sm text-slate-400 italic">No dates selected.</span>}
                  </div>
                </div>
              )}

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Available From</label>
                  <input 
                    type="time" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                    value={availability.startTime}
                    onChange={e => setAvailability({...availability, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Available Until</label>
                  <input 
                    type="time" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0EA5E9] font-medium"
                    value={availability.endTime}
                    onChange={e => setAvailability({...availability, endTime: e.target.value})}
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveAvailability}
                disabled={submitting}
                className="w-full bg-[#0EA5E9] hover:bg-sky-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-sky-500/20 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                Update Availability
              </button>
            </motion.div>
          )}

          {/* --- TAB: BLOCK TIME / OT --- */}
          {activeTab === 'block' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col lg:flex-row gap-8">
              
              {/* Block Form */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Add Exception / Block</h2>
                <form onSubmit={handleSaveBlock} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Title / Reason <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g., Surgery - Patient XYZ"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C19B6C] font-medium"
                      value={newBlock.title}
                      onChange={e => setNewBlock({...newBlock, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="date" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C19B6C] font-medium"
                      value={newBlock.date}
                      onChange={e => setNewBlock({...newBlock, date: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Block From <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="time" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C19B6C] font-medium"
                        value={newBlock.startTime}
                        onChange={e => setNewBlock({...newBlock, startTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Block Until <span className="text-red-500">*</span></label>
                      <input 
                        required
                        type="time" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C19B6C] font-medium"
                        value={newBlock.endTime}
                        onChange={e => setNewBlock({...newBlock, endTime: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Details (Optional)</label>
                    <textarea 
                      rows="2"
                      placeholder="Add OT room number or specific notes..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#C19B6C] font-medium resize-none"
                      value={newBlock.details}
                      onChange={e => setNewBlock({...newBlock, details: e.target.value})}
                    />
                  </div>

                  {/* Notification Toggle (UI Requirement) */}
                  <label className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded text-[#C19B6C] focus:ring-[#C19B6C] border-amber-300"
                      checked={newBlock.notifyDoctor}
                      onChange={e => setNewBlock({...newBlock, notifyDoctor: e.target.checked})}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-[#C19B6C]" /> Notify Doctor</span>
                      <span className="text-[10px] text-slate-500">Sends SMS/Email alert (Requires backend integration)</span>
                    </div>
                  </label>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#C19B6C] hover:bg-amber-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-70 mt-2"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                    Block Calendar Slot
                  </button>
                </form>
              </div>

              {/* Block List */}
              <div className="flex-1 lg:border-l lg:border-slate-100 lg:pl-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Upcoming Blocks</h3>
                <div className="space-y-3 h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {blocks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-2xl p-6">
                      <Calendar className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-slate-500 font-medium text-sm">No upcoming blocked times for this doctor.</p>
                    </div>
                  ) : (
                    blocks.map(block => (
                      <div key={block.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 group">
                        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center shrink-0 border border-slate-100">
                          <span className="text-xs font-bold text-[#C19B6C] uppercase">{new Date(block.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-lg font-black text-slate-800 leading-none">{new Date(block.date).getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{block.title}</h4>
                          <p className="text-xs text-slate-500 font-medium mb-1">
                            {block.startTime} - {block.endTime}
                          </p>
                          {block.details && <p className="text-[10px] text-slate-400 truncate">{block.details}</p>}
                        </div>
                        <button 
                          onClick={() => handleDeleteBlock(block.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                          title="Remove Block"
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

        </div>
      </div>
      
      {/* Scrollbar styling for the blocks list */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default DoctorAvailabilityAdmin;