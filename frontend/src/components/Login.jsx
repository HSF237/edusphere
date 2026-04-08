import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Login() {
  const [formData, setFormData] = useState({ ownerPhone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-16">
      <div className="glass p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Store Login</h2>
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Phone Number</label>
            <input type="tel" required minLength="10" value={formData.ownerPhone} onChange={e => setFormData({...formData, ownerPhone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-black font-bold py-3 rounded-xl mt-6 hover:bg-emerald-400 transition-colors">
            {loading ? 'Entering...' : 'Access Dashboard'}
          </button>
        </form>
        
        <p className="text-gray-400 text-center mt-6">
          New here? <button onClick={() => navigate('/register')} className="text-primary font-bold">Create Store</button>
        </p>
      </div>
    </div>
  );
}
