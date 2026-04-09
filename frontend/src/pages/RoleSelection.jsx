import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Users, UserRound, ArrowRight } from 'lucide-react';

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'principal',
      title: 'Principal',
      desc: 'School administration & global oversight.',
      icon: <ShieldCheck size={32} />,
      color: 'from-purple-600 to-indigo-600',
      shadow: 'shadow-purple-500/20'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      desc: 'Attendance, gradebooks & student tracking.',
      icon: <Users size={32} />,
      color: 'from-pink-600 to-rose-600',
      shadow: 'shadow-pink-500/20'
    },
    {
      id: 'parent',
      title: 'Parent',
      desc: '360° view of your child’s academics.',
      icon: <UserRound size={32} />,
      color: 'from-blue-600 to-cyan-600',
      shadow: 'shadow-blue-500/20'
    }
  ];

  const handleRoleSelect = (roleId) => {
    // We can store the intended role in localStorage so the Onboarding knows what was picked
    localStorage.setItem('intendedRole', roleId);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-5xl text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl">
            <GraduationCap className="text-white" size={28} />
          </div>
          <span className="text-4xl font-black tracking-tighter text-white uppercase italic">EduSphere</span>
        </div>
        <h2 className="text-5xl font-extrabold text-white mb-4 tracking-tight">Choose Your Entry Point</h2>
        <p className="text-white/50 text-xl max-w-2xl mx-auto">Select your role to access the tailored 360° analytics environment.</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="group relative glass-panel p-10 text-left border-white/10 hover:border-white/30 transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
          >
            {/* Hover Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-8 ${role.shadow} group-hover:scale-110 transition-transform duration-500`}>
              {role.icon}
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white/90 group-hover:to-white/50 transition-all">
              {role.title}
            </h3>
            <p className="text-white/40 text-lg mb-8 leading-relaxed italic group-hover:text-white/60 transition-colors">
              "{role.desc}"
            </p>
            
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 duration-500">
              Select Role <ArrowRight size={18} />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-16 text-white/30 text-sm font-bold uppercase tracking-[4px]">
        360° Educational Intelligence Portal
      </div>
    </div>
  );
}
