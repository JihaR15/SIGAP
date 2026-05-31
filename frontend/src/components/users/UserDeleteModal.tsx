"use client";

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function UserDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}: UserDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onMouseDown={(e) =>
        e.target === e.currentTarget && !isProcessing && onClose()
      }
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm border border-gray-200 text-center p-6 animate-in fade-in zoom-in duration-200">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">
          person_off
        </span>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Nonaktifkan Pengguna?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Aksi ini akan mencabut akses login pengguna. Riwayat insiden dan audit trail yang terkait dengan pengguna ini akan tetap tersimpan aman di sistem.
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
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
          >
            {isProcessing ? "Memproses..." : "Ya, Nonaktifkan"}
          </button>
        </div>
      </div>
    </div>
  );
}