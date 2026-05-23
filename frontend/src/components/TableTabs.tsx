"use client";

interface TableTabsProps {
  activeTab: "ACTIVE" | "DELETED" | "AUDIT";
  setActiveTab: (tab: "ACTIVE" | "DELETED" | "AUDIT") => void;
  deletedCount: number;
  auditCount: number;
  role: "MANAGER" | "OPERATOR";
}

export function TableTabs({
  activeTab,
  setActiveTab,
  deletedCount,
  auditCount,
  role,
}: TableTabsProps) {
  return (
    <div className="flex border-b bg-white px-2 sm:px-4 rounded-t-xl border-t border-x border-gray-200 mt-6 overflow-x-auto custom-scrollbar">
      <button
        onClick={() => setActiveTab("ACTIVE")}
        className={`py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === "ACTIVE" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
      >
        <span className="material-symbols-outlined text-[20px] sm:text-[18px]">
          list_alt
        </span>
        <span className="hidden sm:inline">Log Aktif</span>
      </button>

      {role === "MANAGER" && (
        <>
          <button
            onClick={() => setActiveTab("DELETED")}
            className={`py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === "DELETED" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[18px]">
              delete_history
            </span>
            <span className="hidden sm:inline">Sampah ({deletedCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === "AUDIT" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <span className="material-symbols-outlined text-[20px] sm:text-[18px]">
              history_toggle_off
            </span>
            <span className="hidden sm:inline">Audit Trail ({auditCount})</span>
          </button>
        </>
      )}
    </div>
  );
}
