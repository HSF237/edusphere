import { useState } from 'react';
import axios from 'axios';
import { User, Shield, Users, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-8 relative z-10">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 mb-8">
          Complete Your Profile
        </h2>

        {!role ? (
          <div className="space-y-4">
            <button onClick={() => setRole('PRINCIPAL')} className="w-full glass-panel hover:bg-white/20 p-6 flex flex-col items-center gap-4 transition-all">
              <Shield size={48} className="text-pink-400" />
              <span className="text-xl font-semibold">I am a Principal</span>
              <span className="text-sm text-white/60">Create a new school portal</span>
            </button>
            <button onClick={() => setRole('TEACHER')} className="w-full glass-panel hover:bg-white/20 p-6 flex flex-col items-center gap-4 transition-all">
              <Users size={48} className="text-purple-400" />
              <span className="text-xl font-semibold">I am a Teacher</span>
              <span className="text-sm text-white/60">Join with a School Code</span>
            </button>
            <button onClick={() => setRole('PARENT')} className="w-full glass-panel hover:bg-white/20 p-6 flex flex-col items-center gap-4 transition-all">
              <User size={48} className="text-pink-300" />
              <span className="text-xl font-semibold">I am a Parent</span>
              <span className="text-sm text-white/60">Join with a Class Code</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="input-glass"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            {role !== 'PRINCIPAL' && (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  {role === 'TEACHER' ? 'School Code' : 'Class Code'}
                </label>
                <input
                  type="text"
                  required
                  className="input-glass font-mono tracking-widest uppercase"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXXXX"
                  maxLength={8}
                />
              </div>
            )}

            {error && <div className="text-red-300 text-sm">{error}</div>}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary flex justify-center items-center gap-2"
              >
                {loading ? 'Processing...' : 'Continue'} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
