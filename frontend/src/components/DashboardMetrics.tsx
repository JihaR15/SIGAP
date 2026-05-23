'use client';

interface Incident {
  id: number;
  severity_level: string;
  status: string;
  created_at: string;
}

export function DashboardMetrics({ data }: { data: Incident[] }) {
  const today = new Date().toDateString();
  const totalToday = data.filter(
    (log) => new Date(log.created_at).toDateString() === today,
  ).length;

  const totalAllTime = data.length;

  const criticalCount = data.filter(
    (log) => log.severity_level === "CRITICAL" && log.status !== "RESOLVED",
  ).length;

  const investigatingCount = data.filter(
    (log) => log.status === "INVESTIGATING",
  ).length;

  const resolvedCount = data.filter((log) => log.status === "RESOLVED").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Total Logs Today
          </p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <h3 className="text-2xl font-bold text-gray-950">{totalToday}</h3>
            <span className="text-sm font-semibold text-gray-400" title="Total insiden sepanjang masa">
              / {totalAllTime}
            </span>
          </div>
        </div>
        <div className="text-blue-600 bg-blue-50 p-2.5 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">
            analytics
          </span>
        </div>
      </div>

      <div
        className={`p-5 rounded-xl border shadow-sm flex items-center justify-between transition-all ${
          criticalCount > 0
            ? "border-red-300 bg-red-50/50 ring-2 ring-red-500/20"
            : "bg-white border-gray-200"
        }`}
      >
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Critical Alerts
          </p>
          <h3
            className={`text-2xl font-bold mt-1 ${criticalCount > 0 ? "text-red-700 animate-pulse" : "text-gray-950"}`}
          >
            {criticalCount}
          </h3>
        </div>
        <div
          className={`p-2.5 rounded-lg flex items-center justify-center ${criticalCount > 0 ? "bg-red-100 text-red-600 animate-bounce" : "bg-gray-50 text-gray-400"}`}
        >
          <span className="material-symbols-outlined text-[24px]">
            {criticalCount > 0 ? "warning" : "health_and_safety"}
          </span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Investigating
          </p>
          <h3 className="text-2xl font-bold text-gray-950 mt-1">
            {investigatingCount}
          </h3>
        </div>
        <div className="text-orange-600 bg-orange-50 p-2.5 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">
            troubleshoot
          </span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Resolved Incidents
          </p>
          <h3 className="text-2xl font-bold text-gray-950 mt-1">
            {resolvedCount}
          </h3>
        </div>
        <div className="text-green-600 bg-green-50 p-2.5 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">
            task_alt
          </span>
        </div>
      </div>
    </div>
  );
}
