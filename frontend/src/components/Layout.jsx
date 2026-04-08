import React, { useState } from 'react';
import { Home, ScanLine, BarChart3, Settings } from 'lucide-react';
import ScannerDrawer from './ScannerDrawer';

export default function Layout({ children }) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  // Hardcoded for demo
  const shopID = '666dbb7c0000000000000000'; 

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 glass">
        <div className="p-6">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase flex items-center">
            <span className="text-primary mr-1">0</span>Waste
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center space-x-3 bg-primary/10 text-primary px-4 py-3 rounded-xl transition-all">
            <Home size={20} />
            <span className="font-semibold">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="w-full flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all"
          >
            <ScanLine size={20} />
            <span className="font-semibold">Scan Item</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all">
            <BarChart3 size={20} />
            <span className="font-semibold">Analytics</span>
          </button>

          <button className="w-full flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all">
            <Settings size={20} />
            <span className="font-semibold">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="md:hidden p-4 flex justify-center items-center border-b border-white/10 glass sticky top-0 z-30">
          <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center">
            <span className="text-primary mr-1">0</span>Waste
          </h1>
        </div>
        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 pb-env-safe">
        <div className="flex justify-around items-center p-3">
          <button className="p-2 flex flex-col items-center text-primary">
            <Home size={24} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </button>
          
          <button 
            className="p-2 flex flex-col items-center text-gray-400 hover:text-white transition-colors"
          >
            <BarChart3 size={24} />
            <span className="text-[10px] mt-1 font-medium">Analytics</span>
          </button>
          
          <button className="p-2 flex flex-col items-center text-gray-400 hover:text-white transition-colors">
            <Settings size={24} />
            <span className="text-[10px] mt-1 font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* The Global Desktop Scanner Drawer triggered from sidebar */}
      <ScannerDrawer isOpen={isScannerOpen} setIsOpen={setIsScannerOpen} shopID={shopID} />
    </div>
  );
}
