'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Incident {
  id: number;
  judul: string;
  deskripsi: string;
  severity_level: string;
  status: string;
  created_at: string;
}

export function IncidentTable({ data }: { data: Incident[] }) {
  const router = useRouter();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [incidentToDelete, setIncidentToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center text-gray-500 mt-6">
        Tidak ada data log operasional saat ini.
      </div>
    );
  }

  const confirmDelete = async () => {
    if (!incidentToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/incidents/${incidentToDelete}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 2 }),
        },
      );

      if (res.ok) {
        setIncidentToDelete(null);
        router.refresh();
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      alert("Gagal terhubung ke server backend.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded border border-red-200">
            CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-200">
            WARN
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200">
            INFO
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full border border-gray-200 uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">
              radio_button_unchecked
            </span>
            OPEN
          </span>
        );
      case "INVESTIGATING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full border border-blue-200 uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">
              troubleshoot
            </span>
            INVESTIGATING
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-200 uppercase tracking-wide">
            <span className="material-symbols-outlined text-[14px]">
              check_circle
            </span>
            RESOLVED
          </span>
        );
      default:
        return <span className="font-semibold text-gray-900">{status}</span>;
    }
  };


  const filteredData = data.filter((log) => {
    const matchStatus = filterStatus === "ALL" || log.status === filterStatus;
    const matchSeverity =
      filterSeverity === "ALL" || log.severity_level === filterSeverity;
    return matchStatus && matchSeverity;
  });

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-600">
              list_alt
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              Live Infrastructure Logs
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Semua Severity</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>

            {/* <div className="flex items-center gap-2 ml-2 pl-3 border-l border-gray-200">
              <input
                id="live-stream"
                type="checkbox"
                className="rounded text-blue-600 focus:ring-blue-600 h-4 w-4"
                defaultChecked
              />
              <label
                htmlFor="live-stream"
                className="text-xs font-semibold uppercase text-gray-600"
              >
                Live Stream
              </label>
            </div> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Waktu & Tanggal</th>
                <th className="px-6 py-3 font-medium">Insiden / Judul</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredData.length > 0 ? (
                filteredData.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td
                      className="px-6 py-4 text-sm text-gray-500 font-mono"
                      suppressHydrationWarning
                    >
                      {new Date(log.created_at).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.judul}
                    </td>

                    {/* Render Status Badge */}
                    <td className="px-6 py-4">{getStatusBadge(log.status)}</td>

                    <td className="px-6 py-4">
                      {getSeverityBadge(log.severity_level)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedIncident(log)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center justify-center"
                          title="Detail Info"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            info
                          </span>
                        </button>
                        <button
                          onClick={() => setIncidentToDelete(log.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex items-center justify-center"
                          title="Hapus Data"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Tidak ada log yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIncident && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          onMouseDown={(e) =>
            e.target === e.currentTarget && setSelectedIncident(null)
          }
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">
                  receipt_long
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  Detail Insiden #{selectedIncident.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Judul Masalah
                </label>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {selectedIncident.judul}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Waktu Laporan
                </label>
                <p
                  className="text-sm font-mono text-gray-700 mt-1"
                  suppressHydrationWarning
                >
                  {new Date(selectedIncident.created_at).toLocaleString(
                    "id-ID",
                    { dateStyle: "full", timeStyle: "long" },
                  )}
                </p>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
                    Status
                  </label>
                  {getStatusBadge(selectedIncident.status)}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
                    Severity
                  </label>
                  {getSeverityBadge(selectedIncident.severity_level)}
                </div>
              </div>
              <div className="pt-2">
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                  Deskripsi Lengkap
                </label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {selectedIncident.deskripsi}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {incidentToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isDeleting)
              setIncidentToDelete(null);
          }}
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm border border-gray-200 overflow-hidden text-center p-6">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">
              warning
            </span>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Hapus Log Insiden?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Aksi ini akan menyembunyikan data dari dashboard operasional.
              Riwayat tetap tercatat di Audit Trail.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIncidentToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
