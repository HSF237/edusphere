import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ClipboardCheck, MessageSquare, GraduationCap, LogOut, 
  ChevronRight, MoreVertical, Calendar, BarChart3, CheckCircle, 
  X, Clock, FileText, Plus, Loader2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TeacherDashboard({ profile }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(true);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassData();
    }
  }, [selectedClass]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const teacherClasses = await base44.entities.Class.filter({ school_id: user.school_id });
      setClasses(teacherClasses);
      if (teacherClasses.length > 0) {
        setSelectedClass(teacherClasses[0].id);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  const fetchClassData = async () => {
    try {
      const classStudents = await base44.entities.Student.filter({ class_id: selectedClass });
      setStudents(classStudents.map(s => ({ ...s, status: 'PRESENT' })));

      const classExams = await base44.entities.Exam.filter({ class_id: selectedClass });
      setExams(classExams);

      const classAssignments = await base44.entities.Assignment.filter({ class_id: selectedClass });
      setAssignments(classAssignments);
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };

  const toggleAttendance = (id) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' } : s
    ));
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
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <GraduationCap size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">EduSphere</span>
        </div>

        <nav className="flex flex-col gap-1">
          <NavButton active={activeTab === 'attendance'} icon={<ClipboardCheck size={18}/>} label="Attendance" onClick={() => setActiveTab('attendance')} />
          <NavButton active={activeTab === 'students'} icon={<Users size={18}/>} label="Students" onClick={() => setActiveTab('students')} />
          <NavButton active={activeTab === 'assignments'} icon={<FileText size={18}/>} label="Assignments" onClick={() => setActiveTab('assignments')} />
          <NavButton active={activeTab === 'exams'} icon={<BarChart3 size={18}/>} label="Exams" onClick={() => setActiveTab('exams')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="mb-6 px-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Active Class</label>
            <select 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-medium focus:outline-none"
            >
              {classes.map(c => <option key={c.id} value={c.id}>GRADE {c.name}</option>)}
            </select>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-lg w-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 pr-16 overflow-y-auto">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Hello, {profile?.name || 'Teacher'}</h2>
            <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest text-blue-600">{activeTab}</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <Calendar className="text-blue-600" size={20} />
             <span className="font-bold text-slate-700">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </header>

        {activeTab === 'attendance' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold">Today's Attendance</h3>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Mark All Present</button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Confirm Sync</button>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => (
                  <div 
                    key={student.id}
                    className={`cursor-pointer transition-all p-6 rounded-2xl flex items-center justify-between border ${student.status === 'PRESENT' ? 'bg-white border-slate-100 shadow-sm' : 'bg-red-50 border-red-100 shadow-sm'}`}
                    onClick={() => toggleAttendance(student.id)}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${student.status === 'PRESENT' ? 'bg-blue-50 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                          {student.roll_number || 'N/A'}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.gender || 'Student'}</p>
                       </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${student.status === 'PRESENT' ? 'bg-green-100 text-green-600' : 'bg-red-200 text-red-700'}`}>
                       {student.status === 'PRESENT' ? <CheckCircle size={18} /> : <X size={18} />}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Other tabs follow same pattern ... */}
      </main>

      {/* MODALS */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">New Assignment</h3>
                <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-900"><X size={24}/></button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              try {
                await base44.entities.Assignment.create({
                  title: String(data.get('title')),
                  type: String(data.get('type')),
                  due_date: String(data.get('due_date')),
                  class_id: selectedClass,
                  school_id: profile.school_id
                });
                fetchClassData();
                setShowAssignModal(false);
              } catch (err) { alert('Deployment Error'); }
            }} className="space-y-4">
               <div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Title</label>
                 <input name="title" required className="w-full h-11 border border-slate-200 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                 <select name="type" className="w-full h-11 border border-slate-200 rounded-lg px-4 bg-white">
                   <option value="homework">HOMEWORK</option>
                   <option value="reading">READING</option>
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Due Date</label>
                 <input name="due_date" type="date" required className="w-full h-11 border border-slate-200 rounded-lg px-4" />
               </div>
               <button type="submit" className="w-full bg-blue-600 text-white h-12 rounded-lg font-bold uppercase tracking-widest text-xs">Deploy Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-bold transition-all ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      {icon} {label}
    </button>
  );
}
