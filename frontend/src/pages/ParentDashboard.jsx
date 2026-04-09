import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Calendar, BarChart3, MessageSquare, 
  LogOut, GraduationCap, ChevronRight, User,
  FileText, TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ParentDashboard({ profile }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [child, setChild] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mocking child profile discovery based on legacy inspection
  const handleSearchChild = (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, this would query the backend
    setTimeout(() => {
      setChild({ 
        name: 'Hasan', 
        rollNumber: '002', 
        class: '8-A', 
        status: 'At Risk', 
        attendance: 25, 
        engagement: 85 
      });
      // Mocking classmates list as seen in screenshot
      setClassmates([
        { roll: '5', name: 'fahad', status: 'Good', attendance: 100, engagement: 100 },
        { roll: '12', name: 'Aadil', status: 'Average', attendance: 50, engagement: 95 },
        { roll: '12', name: 'fadil', status: 'Good', attendance: 100, engagement: 100 }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-panel w-full max-w-md p-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-2xl">
            <User size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Connect Your Child</h2>
          <p className="text-white/50 mb-8 leading-relaxed">Enter your child's Admission Number or Roll Number to access the 360° analytics portal.</p>
          
          <form onSubmit={handleSearchChild} className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-pink-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or roll number..." 
                className="input-glass pl-12 h-14"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full h-14 text-lg font-bold">
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Header */}
      <header className="glass-panel mx-6 mt-6 p-4 flex justify-between items-center bg-purple-600/20 border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">{child.name}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Class {child.class}</p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <HeaderLink active={activeTab === 'marks'} icon={<BarChart3 size={18}/>} label="View Marks" onClick={() => setActiveTab('marks')} />
          <HeaderLink active={activeTab === 'messages'} icon={<MessageSquare size={18}/>} label="Messages" onClick={() => setActiveTab('messages')} />
          <HeaderLink active={activeTab === 'leave'} icon={<Calendar size={18}/>} label="Apply Leave" onClick={() => setActiveTab('leave')} />
          <button onClick={handleLogout} className="p-2 text-white/40 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8 pb-12">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Users className="text-pink-400" size={20} />
              Class Students ({classmates.length + 1})
            </h2>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input type="text" placeholder="Search by name or roll number..." className="input-glass pl-12 bg-white/5 border-white/10" />
            </div>

            {/* Main Child Card */}
            <div className="animate-in slide-in-from-top-4 duration-500">
              <StudentCard student={child} isMain />
            </div>

            {/* Others */}
            <div className="space-y-4">
              {classmates.map((s, i) => (
                <StudentCard key={i} student={s} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
           <div className="glass-panel p-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-pink-500/20 p-3 rounded-2xl"><Calendar className="text-pink-400" /></div>
                <h3 className="text-3xl font-bold">Apply Leave</h3>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Student Name</label>
                    <input disabled value={child.name} className="input-glass opacity-50" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">From Date</label>
                    <input type="date" className="input-glass" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">To Date</label>
                    <input type="date" className="input-glass" />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Reason</label>
                    <textarea className="input-glass min-h-[120px]" placeholder="State the reason clearly..."></textarea>
                 </div>
                 <button className="btn-primary h-14 font-bold text-lg md:col-span-2">Submit Request</button>
              </form>
           </div>
        )}

        {activeTab === 'marks' && (
          <div className="glass-panel p-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-500/20 p-3 rounded-2xl"><BarChart3 className="text-blue-400" /></div>
                <h3 className="text-3xl font-bold">Academic Marks</h3>
              </div>
              <div className="overflow-hidden border border-white/10 rounded-2xl">
                 <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] font-black tracking-widest text-white/40">
                       <tr>
                          <th className="p-5">Subject</th>
                          <th className="p-5">Exam</th>
                          <th className="p-5 text-center">Marks</th>
                          <th className="p-5 text-right">Progress</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       <tr className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-5 font-bold">Mathematics</td>
                          <td className="p-5 text-sm text-white/60">Unit Test I</td>
                          <td className="p-5 text-center font-black">88/100</td>
                          <td className="p-5 text-right font-black text-emerald-400">Pass</td>
                       </tr>
                       <tr className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-5 font-bold">Science</td>
                          <td className="p-5 text-sm text-white/60">Unit Test I</td>
                          <td className="p-5 text-center font-black">92/100</td>
                          <td className="p-5 text-right font-black text-emerald-400">Pass</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StudentCard({ student, isMain }) {
  const statusColors = {
    'Good': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Average': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'At Risk': 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div className={`glass-panel p-6 border-white/10 ${isMain ? 'ring-2 ring-purple-500/30' : ''} group hover:bg-white/[0.02] transition-all`}>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-xl font-black text-purple-400 shadow-inner">
          {student.roll}
        </div>
        <div>
          <h4 className="text-xl font-bold mb-1">{student.name}</h4>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusColors[student.status]}`}>
            {student.status}
          </span>
        </div>
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
           <ChevronRight size={20} className="text-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2 flex items-center gap-2">
            <TrendingUp size={12} /> Attendance
          </p>
          <div className="flex items-end justify-between">
             <span className="text-2xl font-black">{student.attendance}%</span>
             <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${student.attendance > 75 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                  style={{width: `${student.attendance}%`}}
                ></div>
             </div>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2 flex items-center gap-2">
            <TrendingUp size={12} /> Engagement
          </p>
          <div className="flex items-end justify-between">
             <span className="text-2xl font-black">{student.engagement}</span>
             <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-purple-500 transition-all duration-1000`} 
                  style={{width: `${student.engagement}%`}}
                ></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderLink({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-xl ${active ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
    >
      {icon} <span className="hidden md:inline">{label}</span>
    </button>
  );
}
