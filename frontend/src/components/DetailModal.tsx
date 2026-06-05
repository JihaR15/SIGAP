"use client";

import React, { useState } from "react";

interface Incident {
  id: number;
  judul: string;
  deskripsi: string;
  severity_level: string;
  status: string;
  created_at: string;
  reporter_id: number;
  reporter_name?: string;
}

interface DetailModalProps {
  incident: Incident;
  onClose: () => void;
  onResolve: (id: number) => void;
  isProcessing: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  getSeverityBadge: (severity: string) => React.ReactNode;
  currentUser: any;
}

export function DetailModal({
  incident,
  onClose,
  onResolve,
  isProcessing,
  getStatusBadge,
  getSeverityBadge,
  currentUser,
}: DetailModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">
              receipt_long
            </span>
            <h2 className="text-lg font-bold text-gray-900">
              Detail Insiden #{incident.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
              Judul Masalah
            </label>
            <p className="text-base font-medium text-gray-900">
              {incident.judul}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-gray-100 py-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Waktu Laporan
              </label>
              <p
                className="text-sm font-mono text-gray-700"
                suppressHydrationWarning
              >
                {new Date(incident.created_at).toLocaleString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Dilaporkan Oleh
              </label>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <span className="material-symbols-outlined text-[18px] text-gray-400">person</span>
                <span>{incident.reporter_name || (incident.reporter_id ? `User ID: ${incident.reporter_id}` : "Sistem")}</span>
              </div>
            </div>
          </div>

          {/* Baris 3: Status & Severity */}
          <div className="flex gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">
                Status
              </label>
              {getStatusBadge(incident.status)}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">
                Severity
              </label>
              {getSeverityBadge(incident.severity_level)}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">
              Deskripsi Lengkap
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-800 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
              {incident.deskripsi}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 items-center transition-all duration-300">
          {isConfirming ? (
            <div className="flex items-center gap-3 w-full justify-between">
              <span className="text-sm font-bold text-red-600 flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[18px]">
                  warning
                </span>
                Tutup insiden permanen?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsConfirming(false)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => onResolve(incident.id)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  <span>
                    {isProcessing ? "Menyimpan..." : "Ya, Selesaikan"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {currentUser.role === "Manager" &&
                incident.status !== "RESOLVED" && (
                  <button
                    onClick={() => setIsConfirming(true)}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      check_circle
                    </span>
                    <span>Mark as Resolved</span>
                  </button>
                )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
              >
                Tutup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}