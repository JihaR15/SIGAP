"use client";

interface TableFiltersProps {
  filterDate: string;
  setFilterDate: (val: string) => void;
  filterSeverity: string;
  setFilterSeverity: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  isLive: boolean;
  setIsLive: (val: boolean) => void;
  isCustomSorted: boolean;
  onResetSort: () => void;
}

export function TableFilters({
  filterDate,
  setFilterDate,
  filterSeverity,
  setFilterSeverity,
  filterStatus,
  setFilterStatus,
  isLive,
  setIsLive,
  isCustomSorted,
  onResetSort,
}: TableFiltersProps) {
  return (
    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-700 hidden sm:inline">Monitor Utama</span>
        
        {isCustomSorted && (
          <button
            onClick={onResetSort}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
            Reset Sort
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 bg-white flex-1 sm:flex-none cursor-pointer"
        >
          <option value="ALL">Semua Waktu</option>
          <option value="TODAY">Hari Ini</option>
          <option value="THIS_WEEK">7 Hari Terakhir</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 bg-white flex-1 sm:flex-none cursor-pointer"
        >
          <option value="ALL">Semua Severity</option>
          <option value="INFO">INFO</option>
          <option value="WARNING">WARN</option>
          <option value="CRITICAL">CRIT</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 bg-white flex-1 sm:flex-none cursor-pointer"
        >
          <option value="ALL">Semua Status</option>
          <option value="OPEN">OPEN</option>
          <option value="INVESTIGATING">INVESTIGATING</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
          <input
            id="live-stream"
            type="checkbox"
            className="rounded text-blue-600 focus:ring-blue-600 h-4 w-4 cursor-pointer"
            checked={isLive}
            onChange={(e) => setIsLive(e.target.checked)}
          />
          <label htmlFor="live-stream" className="text-xs font-semibold uppercase text-gray-600 cursor-pointer">
            {isLive ? "🔴 Live" : "⚪ Off"}
          </label>
        </div>
      </div>
    </div>
  );
}