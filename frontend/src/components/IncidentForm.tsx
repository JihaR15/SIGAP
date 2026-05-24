"use client";

import React, { useState } from "react";
import { UserSession } from "./DashboardView";

export function IncidentForm({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: UserSession;
}) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [severity, setSeverity] = useState("INFO");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentUser.token}` },
        body: JSON.stringify({
          judul,
          deskripsi,
          severity_level: severity,
          reporter_id: currentUser.id,
        }),
      });

      if (res.ok) {
        setJudul("");
        setDeskripsi("");
        setSeverity("INFO");
        onSuccess();
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Log New Incident</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Judul Insiden
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              placeholder="Contoh: Suhu mesin A naik..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi Detail
            </label>
            <textarea
              required
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              placeholder="Jelaskan detail temuan di lapangan..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tingkat Urgensi (Severity)
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold text-gray-900"
            >
              <option value="INFO">🔵 INFO - Operasional Normal</option>
              <option value="WARNING">🟡 WARNING - Perlu Perhatian</option>
              <option value="CRITICAL">🔴 CRITICAL - Darurat/Mesin Mati</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
