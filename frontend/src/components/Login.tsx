"use client";

import React, { useState, useEffect } from "react";

export interface UserSession {
  id: number;
  nama: string;
  role: "Manager" | "Operator";
}

interface LoginProps {
  onLogin: (user: UserSession) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [users, setUsers] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          throw new Error("API belum siap");
        }
      } catch (error) {
        setUsers([
          { id: 2, nama: "Jiha Ramdhan", role: "Manager" },
          { id: 1, nama: "Budi Santoso", role: "Operator" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const manager = users.find((u) => u.role === "Manager");
  const operator = users.find((u) => u.role === "Operator");

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl"></div>
      </div>

      <main className="grow flex items-center justify-center p-4 md:p-8 z-10">
        <div className="w-full max-w-200 flex flex-col items-center">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-blue-800 mb-2 tracking-tight">
              Welcome to SIGAP
            </h1>
            <p className="text-base text-gray-600 max-w-lg mx-auto">
              Sistem Informasi Gangguan dan Audit Perusahaan
            </p>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-12 bg-blue-700 rounded-full"></div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <span className="material-symbols-outlined animate-spin text-blue-600 text-4xl">
                progress_activity
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <button
                onClick={() => operator && onLogin(operator)}
                disabled={!operator}
                className="group relative bg-white border border-gray-200 rounded-xl p-8 text-left transition-all duration-300 hover:shadow-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <span className="material-symbols-outlined text-[32px]">
                      engineering
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Operator
                  </h2>
                  <p className="text-sm font-semibold text-blue-600 mb-3">
                    {operator?.nama || "Tidak ada data"}
                  </p>
                  <p className="text-sm text-gray-500 mb-8 grow leading-relaxed">
                    Catat laporan insiden secara real-time dan pantau status penanganan gangguan infrastruktur yang Anda temukan di lapangan.
                  </p>
                  <div className="flex items-center text-blue-700 text-xs font-bold tracking-widest gap-2">
                    <span>ACCESS DASHBOARD</span>
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => manager && onLogin(manager)}
                disabled={!manager}
                className="group relative bg-white border border-gray-200 rounded-xl p-8 text-left transition-all duration-300 hover:shadow-lg hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50"
              >
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-indigo-700 group-hover:text-white">
                    <span className="material-symbols-outlined text-[32px]">
                      analytics
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Manager
                  </h2>
                  <p className="text-sm font-semibold text-indigo-600 mb-3">
                    {manager?.nama || "Tidak ada data"}
                  </p>
                  <p className="text-sm text-gray-500 mb-8 grow leading-relaxed">
                    Lihat kondisi infrastruktur, tanggapi peringatan penting, dan kelola penyelesaian insiden serta riwayat audit.
                  </p>
                  <div className="flex items-center text-indigo-700 text-xs font-bold tracking-widest gap-2">
                    <span>ADMINISTRATIVE PORTAL</span>
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}

          <div className="mt-16 flex flex-col items-center gap-6 w-full">
            <div className="flex gap-8 items-center justify-center text-gray-500 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  verified_user
                </span>
                <span className="text-xs font-bold">
                  Tes Intern PT. Greenfields
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400">© 2026 | Jiha Ramdhan</p>
          </div>
        </div>
      </main>
    </div>
  );
}
