"use client";

import React from "react";

interface RestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function RestoreModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}: RestoreModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onMouseDown={(e) =>
        e.target === e.currentTarget && !isProcessing && onClose()
      }
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm border border-gray-200 text-center p-6">
        {/* Ikon panah melingkar hijau untuk menandakan pemulihan data */}
        <span className="material-symbols-outlined text-green-500 text-5xl mb-4">
          restore_from_trash
        </span>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Pulihkan Log Insiden?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Aksi ini akan mengembalikan data insiden ke dalam daftar monitor utama dan mengubah status pelaporan aktif kembali.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            {isProcessing ? "Memulihkan..." : "Ya, Pulihkan"}
          </button>
        </div>
      </div>
    </div>
  );
}