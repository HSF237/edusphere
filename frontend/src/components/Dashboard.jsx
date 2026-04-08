import React, { useState } from 'react';
import { Package, TrendingDown, IndianRupee, ScanLine } from 'lucide-react';
import ScannerDrawer from './ScannerDrawer';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

// Hardcoded for Phase 2 demo. Phase 3 will get this dynamically after Login.
const SHOP_ID = '666dbb7c0000000000000000'; 

export default function Dashboard() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Fetch dashboard overview
  const { data: overview, isLoading } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: async () => {
      // Return dummy data if backend is down while developing UI
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/dashboard/overview?shopID=${SHOP_ID}`);
        return res.data.data;
      } catch (e) {
        return { expiringNow: 12, expiringSoon: 34 };
      }
    }
  });

  // Dummy timeline data for UI purposes
  const timeline = [
    { id: 1, name: "Amul Milk 500ml", daysLeft: 2, status: "waste" },
    { id: 2, name: "Britannia Bread", daysLeft: 5, status: "expiring" },
    { id: 3, name: "Farm Fresh Eggs", daysLeft: 12, status: "safe" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'waste': return 'text-waste bg-waste/20 border-waste/50';
      case 'expiring': return 'text-expiring bg-expiring/20 border-expiring/50';
      case 'safe': return 'text-safe bg-safe/20 border-safe/50';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case 'waste': return 'bg-waste';
      case 'expiring': return 'bg-expiring';
      case 'safe': return 'bg-safe';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="pb-24 pt-8 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Overview
          </h1>
          <p className="text-gray-400">Raju's Supermarket</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1 */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-waste/20 rounded-lg">
              <TrendingDown className="text-waste" size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Potential Waste</p>
            <h2 className="text-2xl font-bold mt-1 text-white flex items-center">
              <IndianRupee size={20} className="mr-1" />
              12,450
            </h2>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-expiring/20 rounded-lg">
              <Package className="text-expiring" size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Items to Clear</p>
            <h2 className="text-2xl font-bold mt-1 text-white">
              {isLoading ? '...' : overview?.expiringSoon || 0}
            </h2>
          </div>
        </motion.div>

        {/* Card 3 (Hidden on very small screens, visible on md) */}
        <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-4 flex-col justify-between hidden md:flex">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-safe/20 rounded-lg">
              <IndianRupee className="text-safe" size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Money Saved</p>
            <h2 className="text-2xl font-bold mt-1 text-white">₹ 4,320</h2>
          </div>
        </motion.div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">Expiry Timeline</h2>
        <div className="space-y-3">
          {timeline.map((item) => (
            <div key={item.id} className="glass rounded-xl p-4 transition-all">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-white">{item.name}</h3>
                <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getStatusColor(item.status))}>
                  {item.daysLeft} Days Left
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={cn("h-1.5 rounded-full transition-all duration-1000", getProgressBarColor(item.status))} 
                  style={{ width: `${Math.max(10, item.daysLeft * 5)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button for Scanner (Mobile primarily) */}
      <div className="fixed bottom-20 right-4 md:hidden z-40">
        <button 
          onClick={() => setIsScannerOpen(true)}
          className="bg-primary text-black p-4 rounded-full shadow-[0_0_20px_rgba(0,255,148,0.4)] flex items-center justify-center transform hover:scale-105 transition-all"
        >
          <ScanLine size={32} />
        </button>
      </div>

      <ScannerDrawer isOpen={isScannerOpen} setIsOpen={setIsScannerOpen} shopID={SHOP_ID} />
    </div>
  );
}
