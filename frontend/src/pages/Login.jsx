import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('intendedRole');
    if (savedRole) {
      setRole(savedRole);
    } else {
      // If no role, go back to selection
      navigate('/role-selection');
    }
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verification email sent! Check your inbox.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 via-black to-pink-900 opacity-50"></div>
      
      <div className="glass-panel w-full max-w-lg p-12 relative z-10 border-white/10 animate-in fade-in zoom-in duration-500">
        <button onClick={() => navigate('/role-selection')} className="absolute top-8 left-8 text-white/40 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-10 mt-6">
          <div className="bg-white/10 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-pink-400 shadow-inner">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
            {isSignUp ? 'Create Gateway' : 'Portal Access'}
          </h2>
          <div className="flex items-center justify-center gap-2">
             <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Entering as</span>
             <span className="px-3 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-widest">{role}</span>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">Universal Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pink-400 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="identity@eduspere.xyz"
                className="input-glass pl-12 h-14" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[3px] ml-1">Security Key</label>
            <div className="relative group">
              <ShieldCheckIcon />
              <input 
                type="password" 
                placeholder="••••••••"
                className="input-glass pl-12 h-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="btn-primary w-full h-16 text-lg font-black uppercase tracking-[4px] shadow-pink-500/20 group"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Initialize Instance' : 'Enter Engine')}
            <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[5px]"><span className="bg-black/20 px-4 text-white/30 backdrop-blur-md">Or Secure Path</span></div>
        </div>

        <button 
          onClick={signInWithGoogle}
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-white font-bold hover:bg-white/10 transition-all hover:-translate-y-1"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
          Continue via Google Protocol
        </button>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-pink-400 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
          >
            {isSignUp ? 'Existing Instance? Log in' : 'No Instance? Create one'}
          </button>
        </div>
      </div>
    </div>
  );
}

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);
