import { Link } from 'react-router-dom';
import { 
  GraduationCap, ArrowRight, ShieldCheck, 
  Award, BellRing, Activity, Layers, 
  Zap, Globe, Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-pink-500/30">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[45rem] h-[45rem] bg-pink-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[30rem] h-[30rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse animation-delay-4000"></div>
      
      {/* Navbar */}
      <nav className="relative z-50 w-full p-8 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="bg-gradient-to-tr from-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
            <GraduationCap className="text-white" size={28} />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white uppercase italic">EduSphere</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/role-selection" className="text-white/60 hover:text-white font-bold text-sm uppercase tracking-widest transition-all">Sign In</Link>
          <Link to="/role-selection" className="btn-primary px-8 py-3 rounded-xl shadow-pink-500/20">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-48 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-pink-500/20 bg-pink-500/5 text-pink-300 text-xs font-black uppercase tracking-[3px] mb-12 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-1000">
           <Sparkles size={14} className="text-pink-400 animate-spin-slow" />
           The Intelligence Layer of Learning
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter italic uppercase animate-in fade-in slide-in-from-bottom-8 duration-700">
          Behold the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            360° Ecosystem
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-16 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          Transforming educational metrics into actionable 
          <span className="text-white font-medium"> performance intelligence</span>. 
          A unified cockpit for modern educational architecture.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <Link to="/role-selection" className="group relative inline-flex items-center justify-center gap-3 bg-white text-black font-black text-sm uppercase tracking-[2px] py-5 px-12 rounded-2xl shadow-2xl hover:bg-pink-500 hover:text-white transition-all hover:-translate-y-2 active:scale-95 duration-500">
            Enter the Portal <ArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
            <div className="absolute inset-0 rounded-2xl ring-4 ring-white/20 group-hover:ring-pink-500/50 transition-all duration-500 scale-110 opacity-0 group-hover:opacity-100"></div>
          </Link>
          <button className="flex items-center gap-3 text-white/40 hover:text-white font-bold uppercase text-xs tracking-widest transition-all">
             Watch Manifest <div className="w-12 h-[1px] bg-white/20"></div>
          </button>
        </div>
        
        {/* Abstract 360 Feature Bar */}
        <div className="mt-40 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
          <StatMini icon={<Layers className="text-purple-400" />} label="RBAC Architecture" />
          <StatMini icon={<Zap className="text-pink-400" />} label="Realtime Latency" />
          <StatMini icon={<Globe className="text-blue-400" />} label="Distributed Core" />
          <StatMini icon={<Activity className="text-orange-400" />} label="Deep Analytics" />
        </div>
      </main>

      {/* Feature Showcase Grid - Modern Bento Style */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 bg-white/[0.02] border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
           <div className="text-left">
             <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Master Every Dimension</h2>
             <p className="text-white/40 text-lg max-w-xl">EduSphere isn't just a database. It's an intelligence layer that connects every stakeholder in the learning journey.</p>
           </div>
           <Link to="/role-selection" className="text-pink-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 hover:gap-4 transition-all">
             View Protocol <ArrowRight size={18} />
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px]">
          <FeatureCard 
            colSpan="md:col-span-8" 
            icon={<ShieldCheck size={40} />} 
            title="Sovereign Control" 
            desc="Principal dashboard with bird's eye view over entire school mechanics and approval loops."
            bg="bg-purple-900/20"
          />
          <FeatureCard 
            colSpan="md:col-span-4" 
            icon={<Activity size={40} />} 
            title="Engagement IQ" 
            desc="Predictive student risk assessment powered by attendance patterns."
            bg="bg-pink-900/20"
          />
          <FeatureCard 
            colSpan="md:col-span-4" 
            icon={<Award size={40} />} 
            title="Certified Excellence" 
            desc="Automated gradebook generation with bulk examination tools."
            bg="bg-blue-900/20"
          />
          <FeatureCard 
            colSpan="md:col-span-8" 
            icon={<BellRing size={40} />} 
            title="Hyper-Connected" 
            desc="Real-time parent notifications via WhatsApp and integrated portal messaging system."
            bg="bg-indigo-900/20"
          />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="relative z-10 p-12 text-center border-t border-white/5 bg-black/40">
        <div className="flex justify-center gap-4 mb-8">
           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Globe size={16} /></div>
           <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Zap size={16} /></div>
        </div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[10px]">EduSphere Engine 2024 © Distributed Excellence</p>
      </footer>
    </div>
  );
}

function StatMini({ icon, label }) {
  return (
    <div className="flex items-center gap-4 glass-panel p-6 border-white/5 transition-all hover:border-white/10 group cursor-default">
      <div className="group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FeatureCard({ colSpan, icon, title, desc, bg }) {
  return (
    <div className={`${colSpan} glass-panel relative p-12 border-white/5 flex flex-col justify-end group hover:border-white/20 transition-all duration-700 overflow-hidden`}>
       <div className={`absolute inset-0 ${bg} opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>
       <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:text-white/10 transition-colors duration-700">
          {icon}
       </div>
       <div className="relative z-10">
         <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">{title}</h3>
         <p className="text-white/50 text-lg leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">{desc}</p>
       </div>
    </div>
  );
}
