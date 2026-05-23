"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Incident {
  id: number;
  judul: string;
  deskripsi: string;
  severity_level: string;
  status: string;
  created_at: string;
}

export function CriticalBanner({ data }: { data: Incident[] }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const activeCriticals = data.filter(log => log.status === 'OPEN');

  if (!activeCriticals || activeCriticals.length === 0) return null;

  const handleAcknowledgeAll = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('http://localhost:3000/api/incidents/acknowledge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 2 })
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Gagal memproses Acknowledge.');
      }
    } catch (error) {
      alert('Gagal terhubung ke server.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-red-50 border-b border-red-500 px-6 py-4 flex flex-col gap-4 relative overflow-hidden mt-6 rounded-xl shadow-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-700">
          <span className="material-symbols-outlined animate-pulse font-bold text-[28px]">
            emergency_home
          </span>
          <h2 className="text-xl font-bold text-red-900">
            Critical System Alerts ({activeCriticals.length})
          </h2>
        </div>
        
        <button 
          onClick={handleAcknowledgeAll}
          disabled={isProcessing}
          className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">done_all</span>
          {isProcessing ? 'Processing...' : 'Acknowledge All'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeCriticals.map((incident) => (
          <div 
            key={incident.id}
            className="flex flex-col bg-white/70 p-4 rounded-lg border border-red-200 backdrop-blur-sm hover:bg-white transition-all shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter">
                CRITICAL
              </span>
              <span className="text-xs text-red-600 font-medium flex items-center gap-1" suppressHydrationWarning>
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {new Date(incident.created_at).toLocaleString('id-ID', { 
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                })}
              </span>
            </div>
            
            <h3 className="font-bold text-red-900 leading-tight mb-1">{incident.judul}</h3>
            
            <p className="text-sm text-red-800/80 line-clamp-2 leading-relaxed">
              {incident.deskripsi}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}