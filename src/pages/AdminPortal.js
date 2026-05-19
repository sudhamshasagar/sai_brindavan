import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  Users, Activity, Settings, Upload, Plus, 
  Search, Edit, Trash2, Download, CheckCircle2,
  Save, LayoutDashboard
} from 'lucide-react';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [isUploading, setIsUploading] = useState(false);

  // Mock data states to simulate the portal's functionality
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Naveen Sagar H M', specialty: 'Pediatrician', experience: '12+ Years' },
    { id: 2, name: 'Dr. Dhanalaxmi Billava', specialty: 'ENT Specialist', experience: '10+ Years' },
  ]);

  const [contactSettings, setContactSettings] = useState({
    phone: '+91 8000 123 456',
    email: 'contact@saibrindavan.com',
    address: '123 Health Avenue, Medical District, City',
  });

  // Simulating a CSV upload process for HR
  const handleCSVUpload = (e) => {
    setIsUploading(true);
    // Simulate network request/processing time
    setTimeout(() => {
      setIsUploading(false);
      alert("CSV Uploaded Successfully! Doctors list updated.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] font-sans flex flex-col selection:bg-[#1f9b90] selection:text-white">
      
      {/* Reusing your global Navbar */}
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row pt-6 pb-12 px-4 sm:px-6 gap-6">
        
        {/* ================= SIDEBAR / MOBILE TABS ================= */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-[100px]">
            
            <div className="p-6 border-b border-stone-100 bg-[#2b4c7e]/5">
              <h2 className="font-black text-[#2b4c7e] text-lg flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#1f9b90]" />
                HR Portal
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-1">Manage website content</p>
            </div>

            {/* Navigation (Horizontal scroll on mobile, Vertical on Desktop) */}
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible p-2 gap-1 hide-scroll">
              <button 
                onClick={() => setActiveTab('doctors')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === 'doctors' 
                    ? 'bg-[#1f9b90]/10 text-[#1f9b90]' 
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Users className="w-4 h-4" /> Manage Doctors
              </button>
              
              <button 
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === 'services' 
                    ? 'bg-[#1f9b90]/10 text-[#1f9b90]' 
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Activity className="w-4 h-4" /> Medical Services
              </button>
              
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === 'settings' 
                    ? 'bg-[#1f9b90]/10 text-[#1f9b90]' 
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Settings className="w-4 h-4" /> Footer & Contact
              </button>
            </nav>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1">
          
          {/* ----- TAB 1: DOCTORS MANAGEMENT ----- */}
          {activeTab === 'doctors' && (
            <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out_forwards]">
              
              {/* Top Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <div>
                  <h1 className="text-2xl font-black text-[#2b4c7e]">Doctors Roster</h1>
                  <p className="text-sm text-stone-500 font-medium mt-1">Upload CSV or add doctors manually.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-4 h-4" /> Template
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2.5 bg-[#2b4c7e] hover:bg-[#1a365d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md relative overflow-hidden">
                    <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleCSVUpload} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Upload CSV"
                    />
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Upload CSV'}
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                  <div className="relative w-full max-w-xs">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search doctors..." 
                      className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#1f9b90] focus:ring-1 focus:ring-[#1f9b90] transition-all"
                    />
                  </div>
                  <button className="hidden sm:flex items-center gap-2 text-[#1f9b90] hover:text-[#16786f] font-bold text-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add Manual
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider text-stone-500 font-bold">
                        <th className="p-4">Name</th>
                        <th className="p-4">Specialty</th>
                        <th className="p-4">Experience</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc) => (
                        <tr key={doc.id} className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors">
                          <td className="p-4 font-bold text-[#2b4c7e]">{doc.name}</td>
                          <td className="p-4 text-sm text-stone-600 font-medium">
                            <span className="bg-[#1f9b90]/10 text-[#1f9b90] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                              {doc.specialty}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-stone-600 font-medium">{doc.experience}</td>
                          <td className="p-4 flex items-center justify-end gap-3">
                            <button className="text-stone-400 hover:text-[#2b4c7e] transition-colors"><Edit className="w-4 h-4" /></button>
                            <button className="text-stone-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ----- TAB 2: SERVICES MANAGEMENT ----- */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-[fadeSlideUp_0.3s_ease-out_forwards]">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <div>
                  <h1 className="text-2xl font-black text-[#2b4c7e]">Medical Services</h1>
                  <p className="text-sm text-stone-500 font-medium mt-1">Add or update hospital departments.</p>
                </div>
                <button className="px-4 py-2.5 bg-[#f6ac42] hover:bg-[#e09830] text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-md">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>

              {/* Placeholder for Services List */}
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-12 flex flex-col items-center justify-center text-center border-dashed">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="font-bold text-lg text-stone-700">No Services Added</h3>
                <p className="text-stone-500 text-sm mt-1 max-w-sm">Start building your services page by adding your first medical department.</p>
              </div>
            </div>
          )}

          {/* ----- TAB 3: SETTINGS (FOOTER/CONTACT) ----- */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden animate-[fadeSlideUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-stone-100">
                <h1 className="text-2xl font-black text-[#2b4c7e]">Site Settings</h1>
                <p className="text-sm text-stone-500 font-medium mt-1">Update global footer and contact information.</p>
              </div>

              <div className="p-6 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Emergency Hotline</label>
                    <input 
                      type="text" 
                      value={contactSettings.phone}
                      onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Contact Email</label>
                    <input 
                      type="email" 
                      value={contactSettings.email}
                      onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-700 focus:outline-none focus:border-[#1f9b90] focus:ring-2 focus:ring-[#1f9b90]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Address Input */}
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
                  <button className="px-6 py-3 bg-[#1f9b90] hover:bg-[#16786f] text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Required CSS for animations and hiding scrollbars on mobile tabs */}
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