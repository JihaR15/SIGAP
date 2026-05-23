"use client";

interface Incident {
  id: number;
  judul: string;
  deskripsi: string;
  severity_level: string;
  created_at: string;
}

export function CriticalBanner({ data }: { data: Incident[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="bg-red-50 border-b border-red-500 px-6 py-4 flex flex-col gap-4 relative overflow-hidden mt-6 rounded-xl shadow-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-700">
          <span className="material-symbols-outlined animate-pulse font-bold text-[28px]">
            emergency_home
          </span>
          <h2 className="text-xl font-bold text-red-900">
            Critical System Alerts ({data.length})
          </h2>
        </div>
        <button className="text-xs font-bold text-red-700 hover:underline uppercase tracking-widest flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">
            done_all
          </span>
          Acknowledge All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((incident) => (
          <div
            key={incident.id}
            className="flex flex-col bg-white/70 p-4 rounded-lg border border-red-200 backdrop-blur-sm hover:bg-white transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter">
                CRITICAL
              </span>
              <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>
                {new Date(incident.created_at).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h3 className="font-bold text-red-900 leading-tight mb-1">
              {incident.judul}
            </h3>

            <p className="text-sm text-red-800/80 line-clamp-2 leading-relaxed">
              {incident.deskripsi}
            </p>

            <div className="mt-3 flex justify-end">
              <span className="material-symbols-outlined text-red-300 group-hover:text-red-500 transition-colors text-[20px]">
                arrow_forward_ios
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
