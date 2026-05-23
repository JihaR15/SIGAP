"use client";

import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function PaginationControls({
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
      <span className="text-sm text-gray-700 hidden sm:inline">
        Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} log
      </span>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-1.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          title="Halaman Sebelumnya"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_left
          </span>
        </button>
        <span className="text-sm text-gray-700 font-medium">
          Hal {currentPage} <span className="text-gray-400 mx-1">/</span>{" "}
          {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          title="Halaman Selanjutnya"
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
