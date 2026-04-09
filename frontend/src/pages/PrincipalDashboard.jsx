import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserPlus, ClipboardCheck, BarChart, Settings, 
  Plus, Bell, LogOut, Copy, CheckCircle, AlertTriangle, 
  FileText, BookOpen, GraduationCap 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PrincipalDashboard({ profile }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, classes: 0, teachers: 0, pending: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch school info
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/schools/${profile.schoolId}`);
      setSchoolData(res.data.school);
      
      // Realistically we'd fetch counts from backend
      setStats({
        students: 7, // Mocking based on screenshot
        classes: res.data.classes.length,
        teachers: 2,
        pending: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(schoolData?.schoolCode);
    alert('School Code copied!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Top Header */}
      <header className="glass-panel mx-6 mt-6 p-4 flex justify-between items-center border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{profile.name}</h1>
            <p className="text-xs text-white/50">Principal Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Code:</span>
            <span className="font-mono font-bold text-pink-400">{schoolData?.schoolCode}</span>
            <button onClick={copyCode} className="text-white/40 hover:text-white transition-colors">
              <Copy size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 transition-all">
              <Bell size={20} />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 transition-all">
              <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-all ml-2">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 mt-6">
        <StatsCard title="Total Students" value={stats.students} icon={<Users size={32}/>} color="bg-blue-600/20 border-blue-500/30 text-blue-400" />
        <StatsCard title="Total Classes" value={stats.classes} icon={<BookOpen size={32}/>} color="bg-emerald-600/20 border-emerald-500/30 text-emerald-400" />
        <StatsCard title="Teachers" value={stats.teachers} icon={<Users size={32}/>} color="bg-purple-600/20 border-purple-500/30 text-purple-400" />
        <StatsCard title="Pending Approval" value={stats.pending} icon={<AlertTriangle size={32}/>} color="bg-orange-600/20 border-orange-500/30 text-orange-400" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 px-6 mt-8">
        <ActionButton icon={<Plus size={18}/>} label="Add Class" color="from-blue-600 to-blue-500" />
        <ActionButton icon={<UserPlus size={18}/>} label="Add Student" color="from-purple-600 to-purple-500" />
        <ActionButton icon={<ClipboardCheck size={18}/>} label="Review Leave" color="from-pink-600 to-pink-500" outline />
        <ActionButton icon={<AlertTriangle size={18}/>} label="Unapproved Absences" color="from-red-600 to-red-500" outline />
        <ActionButton icon={<CheckCircle size={18}/>} label="Review Attendance" color="from-emerald-600 to-emerald-500" outline />
        <ActionButton icon={<BarChart size={18}/>} label="View Reports" color="from-blue-600 to-blue-500" outline />
        <ActionButton icon={<FileText size={18}/>} label="Manage Exams" color="from-purple-600 to-purple-500" outline />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 mt-8 overflow-x-auto">
        {['Overview', 'Classes', 'Teachers', 'Notifications'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all backdrop-blur-md ${activeTab === tab.toLowerCase() ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <main className="px-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activeTab === 'overview' && (
          <>
            {/* Attendance Card */}
            <div className="glass-panel p-8 border-white/10 flex items-center gap-12 group hover:border-white/20 transition-all">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5"/>
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.42} strokeDashoffset={364.42 * (1 - 0)} className="text-pink-500 transition-all duration-1000 ease-out"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">0%</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                  <CheckCircle size={24} className="text-emerald-400" /> Today's Attendance
                </h3>
                <p className="text-white/60 text-lg">0 of 7 students present</p>
                <p className="text-xs text-white/30 uppercase tracking-widest mt-2">Updated just now</p>
              </div>
            </div>

            {/* At-Risk Card */}
            <div className="glass-panel p-8 border-white/10 flex flex-col items-center justify-center text-center group hover:border-white/20 transition-all">
              <div className="bg-emerald-500/10 p-6 rounded-3xl mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle size={48} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                <AlertTriangle size={20} className="text-orange-400" /> At-Risk Students
              </h3>
              <p className="text-white/50 text-lg">No at-risk students!</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`glass-panel p-6 border-white/5 flex justify-between items-start transition-all hover:scale-[1.02] cursor-default ${color}`}>
      <div className="space-y-4">
        <p className="text-sm font-semibold opacity-60 uppercase tracking-widest">{title}</p>
        <p className="text-4xl font-black text-white">{value}</p>
      </div>
      <div className="opacity-40">{icon}</div>
    </div>
  );
}

function ActionButton({ icon, label, color, outline }) {
  if (outline) {
    return (
      <button className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl border bg-white/5 hover:bg-white/10 transition-all border-white/10 group`}>
        <span className="text-pink-400 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-white font-bold text-sm">{label}</span>
      </button>
    )
  }
  return (
    <button className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r ${color} shadow-lg hover:shadow-pink-500/20 transition-all text-white hover:-translate-y-0.5 active:scale-95 group`}>
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </button>
  );
}
