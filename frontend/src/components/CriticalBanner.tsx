"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserSession } from "./DashboardView";

interface Incident {
  id: number;
  judul: string;
  deskripsi: string;
  severity_level: string;
  status: string;
  created_at: string;
}

export function CriticalBanner({
  data,
  currentUser,
}: {
  data: Incident[];
  currentUser: UserSession;
}) {
  const router = useRouter();

  const [processingTarget, setProcessingTarget] = useState<
    number | "ALL" | null
  >(null);

  const activeCriticals = data.filter((log) => log.status === "OPEN");

  if (!activeCriticals || activeCriticals.length === 0) return null;

  const handleAcknowledgeAll = async () => {
    setProcessingTarget("ALL");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/incidents/acknowledge`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentUser.token}` },
          body: JSON.stringify({ user_id: currentUser.id }),
        },
      );

      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal memproses Acknowledge All.");
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    } finally {
      setProcessingTarget(null);
    }
  };

  const handleAcknowledgeSingle = async (id: number) => {
    setProcessingTarget(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/incidents/${id}/acknowledge`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentUser.token}` },
          body: JSON.stringify({ user_id: currentUser.id }),
        },
      );

      if (res.ok) {
        router.refresh();
      } else {
        alert("Gagal memproses Acknowledge.");
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    } finally {
      setProcessingTarget(null);
    }
  };

  return (
    <section
      className="bg-red-50 border-b border-red-500 p-4 sm:px-6 sm:py-4 flex flex-col gap-4 relative mt-6 rounded-xl shadow-sm"
      suppressHydrationWarning
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2 text-red-700">
          <span className="material-symbols-outlined animate-pulse font-bold text-[24px] sm:text-[28px] mt-0.5 sm:mt-0">
            emergency_home
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-red-900 leading-tight">
            Critical System Alerts ({activeCriticals.length})
          </h2>
        </div>

        {currentUser.role === "Manager" && (
          <button
            onClick={handleAcknowledgeAll}
            disabled={processingTarget !== null}
            className="w-full sm:w-auto text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2.5 sm:py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[16px]">
              done_all
            </span>
            {processingTarget === "ALL" ? "Processing..." : "Acknowledge All"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {activeCriticals.map((incident) => (
          <div
            key={incident.id}
            className="flex flex-col bg-white/70 p-4 rounded-lg border border-red-200 backdrop-blur-sm hover:bg-white transition-all shadow-sm group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter">
                CRITICAL
              </span>
              <span
                className="text-xs text-red-600 font-medium flex items-center gap-1"
                suppressHydrationWarning
              >
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

            <p className="text-sm text-red-800/80 line-clamp-2 leading-relaxed flex-1 mb-3">
              {incident.deskripsi}
            </p>

            {currentUser.role === "Manager" && (
              <div className="mt-auto border-t border-red-100 pt-3">
                <button
                  onClick={() => handleAcknowledgeSingle(incident.id)}
                  disabled={processingTarget !== null}
                  className="w-full text-xs font-bold text-white bg-red-500 hover:bg-red-600 py-2 sm:py-1.5 rounded-lg sm:rounded flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    done
                  </span>
                  {processingTarget === incident.id
                    ? "Memproses..."
                    : "Acknowledge"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
