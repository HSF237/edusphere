import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserPlus, ClipboardCheck, BarChart, 
  MessageSquare, GraduationCap, LogOut, Search,
  Filter, ChevronRight, MoreVertical, Calendar,
  BarChart3, CheckCircle, Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TeacherDashboard({ profile }) {
  const [activeTab, setActiveTab] = useState('students');
  const [showExamModal, setShowExamModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Student Form
  const [newStudent, setNewStudent] = useState({ 
    admissionNumber: '', 
    rollNumber: '', 
    name: '', 
    gender: 'Male',
    parentName: '', 
    age: '', 
    dob: '', 
    gmail: '' 
  });

  useEffect(() => {
    fetchMyClasses();
  }, [profile]);

  const fetchMyClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/schools/${profile.schoolId}/classes`);
      setClasses(res.data);
      if (res.data.length > 0) setSelectedClass(res.data[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchStudents = async (classId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/students/class/${classId}`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/students`, { ...newStudent, classId: selectedClass, schoolId: profile.schoolId });
      setNewStudent({ admissionNumber: '', rollNumber: '', name: '', gender: 'Male', parentName: '', age: '', dob: '', gmail: '' });
      fetchStudents(selectedClass);
      alert('Student added successfully!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex text-white font-sans bg-black/10">
      {/* Add Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
          <div className="glass-panel w-full max-w-2xl p-8 border-white/20 animate-in zoom-in duration-300 relative">
            <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
               <div className="bg-pink-500/20 p-2 rounded-xl"><BarChart3 className="text-pink-400" /></div>
               Add New Exam
            </h3>
            
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 mb-8 flex justify-between items-center group hover:bg-white/10 transition-all">
               <div>
                  <p className="font-bold text-lg">Create exams for multiple subjects</p>
                  <p className="text-sm text-white/40 italic">Check this to batch create exams across subjects</p>
               </div>
               <button 
                onClick={() => setBulkMode(!bulkMode)}
                className={`w-16 h-9 rounded-full transition-all flex items-center px-1 border border-white/10 ${bulkMode ? 'bg-pink-600' : 'bg-white/5'}`}
               >
                 <div className={`w-7 h-7 bg-white rounded-full transition-all shadow-xl ${bulkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
               </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">Exam Name</label>
                <input required className="input-glass" placeholder="Unit Test 1" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">Type</label>
                <select className="input-glass">
                  <option className="bg-slate-900" value="UT">Unit Test (UT)</option>
                  <option className="bg-slate-900" value="TE">Term Exam (TE)</option>
                  <option className="bg-slate-900" value="FE">Final Exam (FE)</option>
                  <option className="bg-slate-900" value="OR">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">Assigned Class</label>
                <select className="input-glass">
                  {classes.map(c => <option key={c._id} value={c._id} className="bg-slate-900">Class {c.name}-{c.division}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">{bulkMode ? 'Subjects (Batch)' : 'Subject Name'}</label>
                <input required className="input-glass" placeholder={bulkMode ? "Math, Science, Bio..." : "Mathematics"} />
                {bulkMode && <p className="text-[10px] text-pink-400 mt-2 font-bold flex items-center gap-1"><Info size={12}/> Use commas for multiple subjects</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">Scheduled Date</label>
                <input type="date" className="input-glass" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">Max Marks</label>
                <input type="number" defaultValue={100} className="input-glass" />
              </div>

              <div className="md:col-span-2 flex gap-4 mt-6">
                <button type="button" onClick={() => setShowExamModal(false)} className="flex-1 p-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-white/5 hover:bg-white/10 border border-white/5 transition-all">Cancel</button>
                <button type="submit" className="flex-1 btn-primary h-16 font-black text-lg uppercase tracking-widest shadow-pink-500/20">Create Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 glass-panel m-6 p-8 flex flex-col gap-8 border-white/10 sticky top-6 self-start h-[calc(100vh-3rem)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">EduSphere</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavButton active={activeTab === 'students'} icon={<Users size={20}/>} label="My students" onClick={() => setActiveTab('students')} />
          <NavButton active={activeTab === 'attendance'} icon={<ClipboardCheck size={20}/>} label="Attendance" onClick={() => setActiveTab('attendance')} />
          <NavButton active={activeTab === 'exams'} icon={<BarChart3 size={20}/>} label="Gradebook" onClick={() => setActiveTab('exams')} />
          <NavButton active={activeTab === 'messages'} icon={<MessageSquare size={20}/>} label="Communications" onClick={() => setActiveTab('messages')} />
        </nav>

        <div className="mt-auto space-y-6">
          <div className="p-5 glass-panel bg-white/5 border-white/5 space-y-3">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px]">Switch class</label>
            <select 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full bg-transparent text-sm font-bold focus:outline-none cursor-pointer"
            >
              {classes.map(c => <option key={c._id} value={c._id} className="text-black">Class {c.name}-{c.division}</option>)}
            </select>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-3 p-4 rounded-2xl w-full text-red-400 font-bold hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pr-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-1">Hello, Prof. {profile.name.split(' ')[0]}</h2>
            <p className="text-white/40">Manage your students and insights efficiently.</p>
          </div>
          <div className="flex gap-4">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" size={20} />
               <input type="text" placeholder="Search student..." className="glass-panel py-3.5 pl-12 pr-6 bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all focus:outline-none text-sm w-64" />
             </div>
          </div>
        </header>

        {activeTab === 'students' && (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 border-white/5 group hover:border-purple-500/30 transition-all">
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-4">Class strength</p>
                <p className="text-5xl font-black group-hover:scale-110 transition-transform origin-left">{students.length}</p>
              </div>
              <div className="glass-panel p-6 border-white/5 group hover:border-emerald-500/30 transition-all">
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-4">Active today</p>
                <p className="text-5xl font-black text-emerald-400">0</p>
              </div>
              <div className="glass-panel p-6 border-white/5 group hover:border-pink-500/30 transition-all">
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-4">Average GPA</p>
                <p className="text-5xl font-black text-purple-400">3.8</p>
              </div>
            </div>

            {/* Form Section */}
            <section className="glass-panel p-8 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <div className="bg-purple-500/20 p-2 rounded-lg"><UserPlus className="text-purple-400" /></div>
                   Quick Enrolment
                </h3>
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Admission no</label>
                    <input required className="input-glass" placeholder="AD3042" value={newStudent.admissionNumber} onChange={e => setNewStudent({...newStudent, admissionNumber: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Roll number</label>
                    <input required type="number" className="input-glass" placeholder="01" value={newStudent.rollNumber} onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Student name</label>
                    <input required className="input-glass" placeholder="Alex Rivers" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Gender</label>
                    <select className="input-glass" value={newStudent.gender} onChange={e => setNewStudent({...newStudent, gender: e.target.value})}>
                      <option className="bg-slate-900" value="Male">Male</option>
                      <option className="bg-slate-900" value="Female">Female</option>
                      <option className="bg-slate-900" value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Parent name</label>
                    <input required className="input-glass" placeholder="James Rivers" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input type="date" className="input-glass pl-10" value={newStudent.dob} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Parent email</label>
                    <input type="email" className="input-glass" placeholder="parent@example.com" value={newStudent.gmail} onChange={e => setNewStudent({...newStudent, gmail: e.target.value})} />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="btn-primary w-full h-[46px] rounded-xl font-bold uppercase tracking-[2px] text-xs">Register</button>
                  </div>
                </form>
              </div>
            </section>

            {/* Roster Table */}
            <section className="glass-panel p-8 border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Class Roster</h3>
                <div className="flex gap-2">
                   <button className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"><Filter size={18} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-white/30 text-[10px] uppercase tracking-[3px] border-b border-white/10">
                      <th className="pb-4 font-bold"># Roll</th>
                      <th className="pb-4 font-bold">Admission</th>
                      <th className="pb-4 font-bold">Student</th>
                      <th className="pb-4 font-bold px-4">Gender</th>
                      <th className="pb-4 font-bold">Parent</th>
                      <th className="pb-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="py-5 font-black text-purple-400">{student.rollNumber < 10 ? `0${student.rollNumber}` : student.rollNumber}</td>
                        <td className="py-5 text-sm text-white/60">{student.admissionNumber}</td>
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold">{student.name.charAt(0)}</div>
                            <span className="font-bold">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-4"><span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase border border-white/10">{student.gender}</span></td>
                        <td className="py-5 text-sm text-white/60">{student.parentName}</td>
                        <td className="py-5 text-right">
                          <button className="p-2 text-white/20 hover:text-white transition-colors"><MoreVertical size={18} /></button>
                          <button className="text-white/20 hover:text-purple-400 transition-colors ml-2"><ChevronRight size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
             <div className="flex justify-between items-center">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Examination Hub</h3>
                <button 
                  onClick={() => setShowExamModal(true)}
                  className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs"
                >
                  <BarChart3 size={20} /> Add New Exam
                </button>
             </div>

             <div className="glass-panel p-0 border-white/5 overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] font-black tracking-widest text-white/40">
                      <tr>
                         <th className="p-6">Exam Name</th>
                         <th className="p-6">Type</th>
                         <th className="p-6">Class</th>
                         <th className="p-6">Subject</th>
                         <th className="p-6 text-center">Max Marks</th>
                         <th className="p-6 text-right">Status</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr className="border-b border-white/5 group hover:bg-white/[0.01] transition-all">
                          <td className="p-6 font-black text-xl italic tracking-tighter">Unit test I</td>
                          <td className="p-6">
                             <span className="px-3 py-1 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 font-black text-[10px]">UT</span>
                          </td>
                          <td className="p-6 font-bold">8-A</td>
                          <td className="p-6 text-white/60">Mathematics</td>
                          <td className="p-6 font-black text-center">100</td>
                          <td className="p-6 text-right">
                             <span className="text-emerald-400 font-bold flex items-center justify-end gap-2"><CheckCircle size={16}/> Scheduled</span>
                          </td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* Attendance Tab Placeholder */}
        {activeTab === 'attendance' && (
          <div className="glass-panel p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="bg-purple-500/10 w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center text-purple-400 shadow-inner">
                <ClipboardCheck size={48} />
             </div>
             <h3 className="text-4xl font-black mb-4">Mark Today's Attendance</h3>
             <p className="text-white/40 mb-10 max-w-sm mx-auto leading-relaxed">Select your class and start marking student presence. All logs undergo Principal verification.</p>
             <button className="btn-primary px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-purple-500/20">Mark Attendance Now</button>
          </div>
        )}
      </main>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl w-full text-sm font-bold transition-all border border-transparent ${active ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20 active:scale-95' : 'text-white/40 hover:text-white hover:bg-white/5 hover:border-white/5'}`}
    >
      {icon} {label}
    </button>
  );
}
