"use client";

import { useState, useEffect } from "react";
import { UserSession } from "./DashboardView";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession & { username?: string }; 
  onLogout: () => void;
}

export function ProfileModal({ isOpen, onClose, currentUser, onLogout }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    nama: currentUser.nama || "",
    username: currentUser.username || "",
    password: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nama: currentUser.nama || "",
        username: currentUser.username || "",
        password: "",
      });
      setShowPasswordInput(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({
          nama: formData.nama,
          username: formData.username,
          ...(showPasswordInput && formData.password ? { password: formData.password } : {}),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        onClose();
        
        if (showPasswordInput && formData.password) {
          onLogout();
        } else {
          window.location.reload(); 
        }
      } else {
        alert(result.error || "Gagal memperbarui profil.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Profil Anda</h2>
            <p className="text-sm text-slate-500 mt-1">Perbarui informasi akun kredensial Anda di sistem SIGAP.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-8 overflow-y-auto space-y-6 flex-grow">
            
            <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                {(currentUser.nama || "U").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Peran: {currentUser.role}</p>
                <p className="text-xs text-blue-700 mt-0.5">Tingkat hak akses tidak dapat diubah dari menu ini.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nama Lengkap</label>
                <input 
                  type="text" required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Username</label>
                <input 
                  type="text" required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Ketik username Anda"
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none bg-slate-50 focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-400">Digunakan untuk login sistem.</p>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Keamanan Akun</label>
                
                {!showPasswordInput ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <input 
                      type="password" disabled value="••••••••"
                      className="grow px-4 py-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPasswordInput(true)}
                      className="px-4 py-3 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                      Ubah Password
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <input 
                      type="password" 
                      placeholder="Masukkan kata sandi baru Anda..."
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none bg-white transition-all shadow-sm"
                    />
                    <p className="text-[11px] text-orange-600 mt-2 font-medium">
                      Perhatian: Jika Anda mengubah kata sandi, Anda akan otomatis dikeluarkan dan harus login kembali.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl mt-auto">
            <button 
              type="button" onClick={onClose} disabled={isProcessing}
              className="px-6 py-2.5 text-slate-700 font-semibold text-sm hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 bg-white"
            >
              Batal
            </button>
            <button 
              type="submit" disabled={isProcessing}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isProcessing ? (
                <>Menyimpan...</>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}