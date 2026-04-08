import React from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Smartphone, Zap, CheckCircle, IndianRupee } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-white font-sans overflow-x-hidden selection:bg-primary/30">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass border-b border-white/10 top-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <span className="text-2xl font-black tracking-widest uppercase">
                <span className="text-primary mr-1 drop-shadow-[0_0_10px_rgba(0,255,148,0.5)]">0</span>Waste
              </span>
            </div>
            <div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full font-semibold transition-all mr-4"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-primary text-black px-5 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(0,255,148,0.3)] hover:shadow-[0_0_25px_rgba(0,255,148,0.5)] transition-all hover:scale-105"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full point-events-none opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8"
          >
            Stop Throwing Money <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
               in the Trash.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto font-medium"
          >
            Automate Your Expiry Tracking. Get WhatsApp alerts before items go bad. 
            Run Flash Sales in seconds. The Elite Engine for smart retail.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex justify-center gap-4"
          >
            <button className="bg-primary text-black text-lg px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(0,255,148,0.4)] hover:shadow-[0_0_50px_rgba(0,255,148,0.6)] transition-all hover:scale-105 flex items-center">
              Create Your Store <Zap className="ml-2" size={20} />
            </button>
          </motion.div>

          {/* Calculator Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 max-w-3xl mx-auto glass rounded-3xl p-8 border border-white/20 relative overflow-hidden"
          >
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 blur-[50px] rounded-full" />
             <h3 className="text-2xl font-bold mb-6 text-white text-left">Waste Savings Calculator</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                <div>
                  <label className="block text-gray-400 mb-2">Average items expired per month</label>
                  <input type="range" min="1" max="100" defaultValue="15" className="w-full accent-primary" />
                  <div className="flex justify-between text-sm mt-1 text-white font-bold">
                    <span>1</span>
                    <span>15 items</span>
                    <span>100</span>
                  </div>
                </div>
                
                <div className="bg-black/50 rounded-2xl p-6 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm mb-1">Potential Monthly Savings</p>
                  <h4 className="text-4xl font-extrabold text-primary flex items-center justify-center">
                    <IndianRupee size={32} strokeWidth={3} className="mr-1"/> 
                    3,500
                  </h4>
                  <p className="text-xs text-gray-500 mt-2">ZeroWaste pays for itself in ~2 days.</p>
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">The Elite Guardian Engine</h2>
            <p className="mt-4 text-gray-400">Everything you need to eliminate retail waste.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30">
                <ScanLine className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Scan in Seconds</h3>
              <p className="text-gray-400">Throw away the clipboard. Use your mobile camera to log new inventory batches in under 5 seconds natively from the app.</p>
            </div>

            <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                <Smartphone className="text-blue-400" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">WhatsApp Sentinels</h3>
              <p className="text-gray-400">Sleep easy. Our background cron-engine scans your shelf life and sends automated WhatsApp alerts exactly 7 days before expiry.</p>
            </div>

            <div className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="h-14 w-14 rounded-2xl bg-expiring/20 flex items-center justify-center mb-6 border border-expiring/30">
                <Zap className="text-expiring" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Flash Sale Engine</h3>
              <p className="text-gray-400">Stop tossing milk. Click one button to generate a pre-written WhatsApp promo for expiring items to blast to your local customer group.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to upgrade your store?</h2>
          <p className="text-xl text-gray-300 mb-10">Join the elite retail network. Start saving money today.</p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-xl flex items-center mx-auto">
            Get ZeroWaste Pro <CheckCircle className="ml-2" size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}
