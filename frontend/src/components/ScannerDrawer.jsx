import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Drawer } from 'vaul';
import { X, Check } from 'lucide-react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export default function ScannerDrawer({ isOpen, setIsOpen, shopID }) {
  const [scanResult, setScanResult] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [needsName, setNeedsName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    let scanner;
    if (isOpen && !scanResult) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          scanner.clear();
          // Mocking checking if product exists. In real app, we'd GET /product/:barcode
          // If it doesn't exist, we set needsName(true)
          setNeedsName(true); 
        },
        (error) => {}
      );
    }

    return () => {
      if (scanner) scanner.clear().catch(e => console.error(e));
    };
  }, [isOpen, scanResult]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(expiryDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (selectedDate < today) {
      const confirmAdd = window.confirm("⚠️ This item is already expired. Are you sure you want to add it to inventory?");
      if (!confirmAdd) return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/v1/inventory/smart-add', {
        barcode: scanResult,
        shopID,
        quantity: Number(quantity),
        expiryDate: new Date(expiryDate).toISOString(),
        costPrice: Number(costPrice),
        ...(needsName && { productName })
      });
      queryClient.invalidateQueries(['dashboardOverview']);
      resetForm();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error adding item');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setScanResult('');
    setProductName('');
    setQuantity(1);
    setExpiryDate('');
    setCostPrice('');
    setNeedsName(false);
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 max-h-[96vh] rounded-t-[10px] glass p-4 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-4" />
          
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Scan Item</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {!scanResult && !isManualMode ? (
              <div className="w-full flex flex-col gap-4">
                 <div id="reader" className="w-full bg-white/5 rounded-xl overflow-hidden glass"></div>
                 <button 
                  onClick={() => { setIsManualMode(true); setScanResult('MANUAL'); setNeedsName(true); }}
                  className="w-full p-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                 >
                   Camera Failing? Enter Manually
                 </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-primary/20 border border-primary/50 text-white rounded-lg flex items-center justify-between">
                  {isManualMode ? (
                    <input 
                      type="text" 
                      value={scanResult}
                      onChange={(e) => setScanResult(e.target.value)}
                      className="bg-transparent border-b border-primary focus:outline-none focus:border-white w-full mr-2"
                      placeholder="Enter Barcode / SKU"
                    />
                  ) : (
                    <span>Barcode: {scanResult}</span>
                  )}
                  <Check className="text-primary flex-shrink-0" size={20} />
                </div>

                {needsName && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                      placeholder="e.g. Amul Milk 500ml"
                    />
                  </div>
                )}

                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-300 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm text-gray-300 mb-1">Cost Price</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      step="0.01"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-primary block"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-black font-bold text-lg p-4 rounded-xl shadow-[0_0_20px_rgba(0,255,148,0.3)] hover:shadow-[0_0_30px_rgba(0,255,148,0.5)] transition-all"
                  >
                    {loading ? 'Adding...' : 'Add to ZeroWaste'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
