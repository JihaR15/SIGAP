'use client';

interface Incident {
  id: number;
  severity_level: string;
  status: string;
}

export function DashboardMetrics({ data }: { data: Incident[] }) {
  const totalIncidents = data.length;
  const criticalCount = data.filter(log => log.severity_level === 'CRITICAL' && log.status !== 'RESOLVED').length;
  const resolvedCount = data.filter(log => log.status === 'RESOLVED').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Logs Today</p>
          <h3 className="text-3xl font-bold text-gray-950 mt-1">{totalIncidents}</h3>
        </div>
        <div className="text-blue-600 bg-blue-50 p-3 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">analytics</span>
        </div>
      </div>

      <div className={`bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between transition-all ${
        criticalCount > 0 ? 'border-red-300 bg-red-50/30 ring-2 ring-red-500/10' : 'border-gray-200'
      }`}>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Critical Alerts</p>
          <h3 className={`text-3xl font-bold mt-1 ${criticalCount > 0 ? 'text-red-600 animate-pulse' : 'text-gray-950'}`}>
            {criticalCount}
          </h3>
        </div>
        <div className={`p-3 rounded-lg flex items-center justify-center ${criticalCount > 0 ? 'bg-red-100 text-red-600 animate-bounce' : 'bg-gray-50 text-gray-400'}`}>
           <span className="material-symbols-outlined text-[28px]">{criticalCount > 0 ? 'warning' : 'health_and_safety'}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Resolved Incidents</p>
          <h3 className="text-3xl font-bold text-gray-950 mt-1">{resolvedCount}</h3>
        </div>
        <div className="text-green-600 bg-green-50 p-3 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">task_alt</span>
        </div>
      </div>

    </div>
  );
}