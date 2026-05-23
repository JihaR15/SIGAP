"use client";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onMouseDown={(e) =>
        e.target === e.currentTarget && !isProcessing && onClose()
      }
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm border border-gray-200 text-center p-6">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">
          warning
        </span>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          Hapus Log Insiden?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Aksi ini akan menyembunyikan data dari dashboard monitor. Riwayat
          mutasi data tetap tersimpan aman di berkas Audit Trail.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}