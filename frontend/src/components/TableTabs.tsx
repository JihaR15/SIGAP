"use client";

interface TableTabsProps {
  activeTab: "ACTIVE" | "DELETED" | "AUDIT";
  setActiveTab: (tab: "ACTIVE" | "DELETED" | "AUDIT") => void;
  deletedCount: number;
  auditCount: number;
  role: "Manager" | "Operator";
}

export function TableTabs({
  activeTab,
  setActiveTab,
  deletedCount,
  auditCount,
  role,
}: TableTabsProps) {
  // Komponen ini hanya digunakan oleh Manager di mode Audit
  if (role !== "Manager") return null;

  return (
    <div className="flex border-b bg-white px-2 sm:px-4 rounded-t-xl border-t border-x border-slate-200 overflow-x-auto custom-scrollbar">
      <button
        onClick={() => setActiveTab("AUDIT")}
        className={`py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap ${
          activeTab === "AUDIT"
            ? "border-purple-600 text-purple-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <span className="material-symbols-outlined text-[20px] sm:text-[18px]">
          history_toggle_off
        </span>
        <span className="hidden sm:inline">Audit Trail ({auditCount})</span>
      </button>

      <button
        onClick={() => setActiveTab("DELETED")}
        className={`py-3 px-3 sm:px-4 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap ${
          activeTab === "DELETED"
            ? "border-red-600 text-red-600"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }`}
      >
        <span className="material-symbols-outlined text-[20px] sm:text-[18px]">
          delete_history
        </span>
        <span className="hidden sm:inline">Sampah ({deletedCount})</span>
      </button>
    </div>
  );
}