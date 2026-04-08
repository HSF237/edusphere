import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Register() {
  const [formData, setFormData] = useState({ shopName: '', ownerPhone: '', password: '', referralCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register-shop', formData);
      localStorage.setItem('token', res.data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-16">
      <div className="glass p-8 rounded-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Store</h2>
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Shop Name</label>
            <input type="text" required value={formData.shopName} onChange={e => setFormData({...formData, shopName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Phone Number</label>
            <input type="tel" required minLength="10" value={formData.ownerPhone} onChange={e => setFormData({...formData, ownerPhone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Referral Code (Optional)</label>
            <input type="text" value={formData.referralCode} onChange={e => setFormData({...formData, referralCode: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" placeholder="e.g. RAJU1234" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-black font-bold py-3 pt-3 rounded-xl mt-6 hover:bg-emerald-400 transition-colors">
            {loading ? 'Creating...' : 'Launch ZeroWaste'}
          </button>
        </form>
        
        <p className="text-gray-400 text-center mt-6">
          Already have a store? <button onClick={() => navigate('/login')} className="text-primary font-bold">Log in</button>
        </p>
      </div>
    </div>
  );
}
