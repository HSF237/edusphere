import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserPlus, ClipboardCheck, Settings, 
  Plus, Bell, LogOut, Copy, CheckCircle, 
  FileText, BookOpen, GraduationCap, X, ChevronRight, Loader2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PrincipalDashboard({ profile }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, classes: 0, teachers: 0, pending: 0 });
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const schoolId = user.school_id;

      const [allClasses, allStudents, allTeachers] = await Promise.all([
        base44.entities.Class.filter({ school_id: schoolId }),
        base44.entities.Student.filter({ school_id: schoolId }),
        base44.entities.Teacher.filter({ school_id: schoolId })
      ]);

      setClasses(allClasses);
      setStudents(allStudents);
      setStats({
        students: allStudents.length,
        classes: allClasses.length,
        teachers: allTeachers.length,
        pending: 0
      });
    } catch (error) {
      console.error('Error fetching principal data:', error);
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{profile?.name || 'Administrator'}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Command Center</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Bell size={20} /></button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-100 flex items-center gap-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatsCard title="Total Students" value={stats.students} icon={<Users size={24}/>} color="text-blue-600 bg-blue-50" />
          <StatsCard title="Active Classes" value={stats.classes} icon={<BookOpen size={24}/>} color="text-emerald-600 bg-emerald-50" />
          <StatsCard title="Total Teachers" value={stats.teachers} icon={<Users size={24}/>} color="text-purple-600 bg-purple-50" />
          <StatsCard title="Alerts" value={stats.pending} icon={<AlertTriangle size={24}/>} color="text-orange-600 bg-orange-50" />
        </div>

        <div className="flex gap-4 mb-10">
           <button onClick={() => setShowAddClass(true)} className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-blue-500/10">
              <Plus size={18} className="inline mr-2" /> Create Class
           </button>
           <button onClick={() => setShowAddStudent(true)} className="bg-white border border-slate-200 text-slate-700 h-12 px-8 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-slate-50 transition-all">
              <UserPlus size={18} className="inline mr-2" /> Onboard Student
           </button>
        </div>

        <div className="flex gap-1 mb-8 bg-slate-200/50 p-1 rounded-xl w-fit">
           {['Overview', 'Classes', 'Students'].map(t => (
             <button 
              key={t}
              onClick={() => setActiveTab(t.toLowerCase())}
              className={`px-8 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === t.toLowerCase() ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               {t}
             </button>
           ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === 'classes' && (
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                  <tr>
                     <th className="p-5 pl-8">Class Name</th>
                     <th className="p-5">Department</th>
                     <th className="p-5 text-right pr-8">Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {classes.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 pl-8 font-bold text-slate-900">{c.name}</td>
                      <td className="p-5 text-slate-500">{c.section || 'General'}</td>
                      <td className="p-5 text-right pr-8 font-bold text-blue-600">{students.filter(s => s.class_id === c.id).length}</td>
                    </tr>
                  ))}
                  {classes.length === 0 && (
                    <tr><td colSpan="3" className="p-10 text-center text-slate-400 italic">No classes registered.</td></tr>
                  )}
                </tbody>
             </table>
          )}

          {activeTab === 'students' && (
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                  <tr>
                     <th className="p-5 pl-8">Full Name</th>
                     <th className="p-5">Assigned Class</th>
                     <th className="p-5 text-right pr-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {students.map(s => (
                     <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5 pl-8 font-bold text-slate-900">{s.name}</td>
                        <td className="p-5 text-slate-500 text-sm">{classes.find(c => c.id === s.class_id)?.name || 'Unassigned'}</td>
                        <td className="p-5 text-right pr-8">
                           <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] uppercase font-bold rounded">Active</span>
                        </td>
                     </tr>
                   ))}
                   {students.length === 0 && (
                    <tr><td colSpan="3" className="p-10 text-center text-slate-400 italic">No student records found.</td></tr>
                   )}
                </tbody>
             </table>
          )}
        </div>
      </main>

      {/* MODAL */}
      {showAddClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Register New Class</h3>
                <button onClick={() => setShowAddClass(false)} className="text-slate-400 hover:text-slate-900"><X size={24}/></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              try {
                await base44.entities.Class.create({
                  name: String(data.get('name')),
                  section: String(data.get('section')),
                  school_id: profile.school_id
                });
                fetchDashboardData();
                setShowAddClass(false);
              } catch (err) { alert('Creation Error'); }
            }} className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Class Identity (e.g. 10-A)</label>
                  <input name="name" required className="w-full h-11 border border-slate-200 rounded-lg px-4" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
                  <input name="section" className="w-full h-11 border border-slate-200 rounded-lg px-4" />
               </div>
               <button type="submit" className="w-full bg-blue-600 text-white h-12 rounded-lg font-bold uppercase tracking-widest text-xs">Deploy Unit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between p-6">
       <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
       </div>
       <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
       </div>
    </div>
  );
}
