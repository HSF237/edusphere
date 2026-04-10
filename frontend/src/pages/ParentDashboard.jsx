import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, BarChart3, MessageSquare, 
  LogOut, GraduationCap, ChevronRight, User,
  FileText, TrendingUp, AlertCircle, CheckCircle2,
  Clock, CreditCard, Bell, Loader2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ParentDashboard({ profile }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(null);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      if (user.selected_student_id) {
        const student = await base44.entities.Student.get(user.selected_student_id);
        setChild({
           name: student.name,
           rollNumber: String(student.roll_number || 'N/A'),
           class: 'Assigned Unit',
           status: 'Active',
           attendance: Number(student.attendance || 0), 
           engagement: Number(student.engagement || 0),
           lastExam: '92%'
        });
      }
    } catch (error) {
      console.error('Error fetching parent data:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
         <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
               <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Identify Your Child</h2>
            <p className="text-slate-500 mb-8">No student identity is currently linked to this guardian account. Please contact the administrator.</p>
            <button onClick={handleLogout} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 h-12 rounded-xl font-bold transition-all">Logout Portal</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Observer View</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Guardianship Protocol</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 relative">
             <Bell size={20} />
             <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 border-red-100 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-10">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
           <div className="flex-1 w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                 <User size={40} />
              </div>
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight leading-none mb-1">{child.name}</h2>
                 <p className="text-slate-500 text-sm">Roll ID: {child.rollNumber} • Status: <span className="text-green-600 font-bold">{child.status}</span></p>
              </div>
           </div>

           <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2">
              <StatBlock label="Attendance" value={`${child.attendance}%`} color="text-blue-600" />
              <StatBlock label="Engagement" value={`${child.engagement}%`} color="text-purple-600" />
           </div>
        </div>

        <div className="flex gap-1 mb-8 bg-slate-200/50 p-1 rounded-xl w-fit">
           {['Overview', 'Report Card', 'Attendance'].map(t => (
             <button 
              key={t}
              onClick={() => setActiveTab(t.toLowerCase())}
              className={`px-8 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === t.toLowerCase() ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {t}
             </button>
           ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
            {activeTab === 'overview' ? (
              <div className="max-w-md mx-auto py-10">
                 <p className="text-slate-400 italic mb-4">Daily stream initialized. Activity levels for this session look optimal.</p>
                 <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
                 </div>
              </div>
            ) : (
              <div className="py-20 text-slate-300 uppercase tracking-widest text-xs font-bold">
                 Syncing {activeTab} details from central database...
              </div>
            )}
        </div>
      </main>
    </div>
  );
}

function StatBlock({ label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-w-[160px]">
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
