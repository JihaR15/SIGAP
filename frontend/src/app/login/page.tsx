"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg(res.error);
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center w-full px-4 md:px-8 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span 
            className="material-symbols-outlined text-blue-700 text-3xl" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield_with_heart
          </span>
          <span className="text-xl font-bold text-blue-700 tracking-tight">SIGAP</span>
        </div>
        <div className="hidden md:flex items-center">
          <a 
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 hover:text-blue-600 transition-colors" 
            href="https://github.com/JihaR15/SIGAP"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            GITHUB REPOSITORY
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-[440px] animate-fade-in">
          
          {/* Login Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm transition-all duration-300 hover:shadow-md">
            
            {/* Branding & Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                <span 
                  className="material-symbols-outlined text-blue-600 text-4xl" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  security
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Masuk ke SIGAP</h1>
              <p className="text-sm text-slate-500">Sistem Informasi Gangguan dan Audit Perusahaan</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Pesan Error */}
              {errorMsg && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                  <p className="text-sm text-red-700 font-medium">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-2 group/input1">
                <label className="text-[11px] font-bold tracking-widest text-slate-500 block" htmlFor="username">
                  USERNAME
                </label>
                <div className="relative focus-within:scale-[1.01] transition-transform">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input1:text-blue-600 transition-colors text-[20px]">
                    person
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    placeholder="Masukkan username Anda"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2 group/input2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold tracking-widest text-slate-500 block" htmlFor="password">
                    PASSWORD
                  </label>
                </div>
                <div className="relative focus-within:scale-[1.01] transition-transform">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input2:text-blue-600 transition-colors text-[20px]">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] focus:ring-4 focus:ring-blue-100 disabled:opacity-70 transition-all shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      Memproses...
                    </>
                  ) : (
                    "Masuk ke Sistem"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer for Mobile */}
          <div className="mt-10 md:hidden flex flex-col items-center gap-4 text-xs font-semibold tracking-wide text-slate-500">
            <a 
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors" 
              href="https://github.com/JihaR15/SIGAP"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              GITHUB REPOSITORY
            </a>
            <p className="text-slate-400 font-normal">© 2026 SIGAP Enterprise System</p>
          </div>
        </div>
      </main>

      {/* Global Footer (Desktop) */}
      <footer className="hidden md:block py-6 border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Versi MVP 1.0.0</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>© 2026 SIGAP Enterprise System.</span>
          </div>
          <div className="flex tracking-wide uppercase text-[10px]">
             <a 
              className="hover:text-blue-600 transition-colors flex items-center gap-1" 
              href="https://greenfieldsdairy.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              PT. Greenfields Indonesia
            </a>
          </div>
        </div>
      </footer>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-blue-500 blur-[120px] opacity-10"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-indigo-500 blur-[120px] opacity-10"></div>
      </div>
    </div>
  );
}