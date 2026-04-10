import { useState } from 'react';
import axios from 'axios';
import { User, Shield, Users, ArrowRight, GraduationCap, X, ChevronRight } from 'lucide-react';

export default function Onboarding({ session, onComplete }) {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // --- MOCK ONBOARDING FOR TESTING ---
    setTimeout(() => {
        setLoading(false);
        onComplete({ id: 'mock-123', name, role, schoolId: 'school-789' });
    }, 1000);
    return;
    // ------------------------------------

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/onboard`, {
        userId: session.user.id,
        role,
        name,
        code
      });
      onComplete(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-pink-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="glass-panel w-full max-w-2xl p-12 relative z-10 border-white/5 shadow-2xl shadow-pink-500/5">
        <header className="text-center mb-12">
            <div className="bg-gradient-to-tr from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-6 scale-110">
                <GraduationCap size={40} />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Welcome to EduSphere</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Initialize your professional identity</p>
        </header>

        {!role ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
            <RoleCard 
                onClick={() => setRole('PRINCIPAL')} 
                icon={<Shield size={32} />} 
                title="Principal" 
                sub="ESTABLISH NEW SCHOOL"
                color="text-pink-400 group-hover:bg-pink-500"
            />
            <RoleCard 
                onClick={() => setRole('TEACHER')} 
                icon={<Users size={32} />} 
                title="Teacher" 
                sub="JOIN AS FACULTY"
                color="text-purple-400 group-hover:bg-purple-500"
            />
            <RoleCard 
                onClick={() => setRole('PARENT')} 
                icon={<User size={32} />} 
                title="Parent" 
                sub="CONNECT AS GUARDIAN"
                color="text-pink-300 group-hover:bg-pink-300"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className={`p-3 rounded-xl bg-white/5`}>
                    {role === 'PRINCIPAL' ? <Shield className="text-pink-400" /> : <Users className="text-purple-400" />}
                </div>
                <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Selected Role</p>
                    <p className="font-black text-lg text-white uppercase italic tracking-tighter">{role}</p>
                </div>
                <button type="button" onClick={() => setRole(null)} className="ml-auto p-2 text-white/20 hover:text-white"><X size={20}/></button>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Full Legal Identity</label>
                    <input
                        type="text"
                        required
                        className="input-glass h-14"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ENTER FULL NAME"
                    />
                </div>
                
                {role !== 'PRINCIPAL' && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                        {role === 'TEACHER' ? 'School Authorization Code' : 'Class Access Key'}
                    </label>
                    <input
                        type="text"
                        required
                        className="input-glass h-14 font-mono text-xl tracking-[0.4em] text-pink-500"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="XXXXXXXX"
                        maxLength={8}
                    />
                </div>
                )}
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center rounded-xl">{error}</div>}

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full h-16 text-lg font-black uppercase tracking-[4px] shadow-lg shadow-pink-500/20 group"
            >
                {loading ? 'PROCESSING...' : 'INITIALIZE SYSTEM'} <ArrowRight size={24} className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function RoleCard({ onClick, icon, title, sub, color }) {
    return (
        <button 
            onClick={onClick} 
            className="group glass-panel p-8 flex flex-col items-center gap-6 border-white/5 hover:border-white/20 hover:scale-[1.05] hover:bg-white/[0.02] transition-all duration-300 active:scale-95"
        >
            <div className={`p-5 rounded-2xl bg-white/5 transition-all duration-500 ${color} group-hover:text-black shadow-inner`}>
                {icon}
            </div>
            <div className="text-center">
                <p className="text-xl font-black uppercase tracking-tighter italic mb-1 group-hover:text-pink-500 transition-colors">{title}</p>
                <p className="text-[8px] font-black text-white/20 group-hover:text-white/40 tracking-[0.1em] transition-colors">{sub}</p>
            </div>
            <ChevronRight className="text-white/10 group-hover:text-white/40 transition-all translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 opacity-0" />
        </button>
    );
}
