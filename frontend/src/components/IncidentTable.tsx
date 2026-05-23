"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DetailModal } from "./DetailModal";
import { DeleteModal } from "./DeleteModal";

interface Incident {
  id: number;
  judul: string;
  deskripsi: string;
  severity_level: string;
  status: string;
  created_at: string;
}

interface AuditTrail {
  id: number;
  incident_title: string;
  aksi: string;
  data_baru: string;
  created_at: string;
}

export function IncidentTable({
  activeData,
  deletedData,
  auditData,
}: {
  activeData: Incident[];
  deletedData: Incident[];
  auditData: AuditTrail[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "DELETED" | "AUDIT">(
    "ACTIVE",
  );
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [incidentToDelete, setIncidentToDelete] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");

  const confirmDelete = async () => {
    if (!incidentToDelete) return;
    setIsProcessing(true);
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
      }
    } catch (error) {
      alert("Koneksi bermasalah");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolve = async (id: number) => {
    setIsProcessing(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/incidents/${id}/resolve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 2 }),
        },
      );
      if (res.ok) {
        setSelectedIncident(null);
        router.refresh();
      }
    } catch (error) {
      alert("Koneksi bermasalah");
    }
    {
      setIsProcessing(false);
    }
  };

  const handleAcknowledge = async (id: number) => {
    setIsProcessing(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/incidents/${id}/acknowledge`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 2 }),
        },
      );
      if (res.ok) router.refresh();
    } catch (error) {
      alert("Gagal memproses Acknowledge");
    } finally {
      setIsProcessing(false);
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full border border-gray-200">
            <span className="material-symbols-outlined text-[14px]">
              radio_button_unchecked
            </span>
            OPEN
          </span>
        );
      case "INVESTIGATING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full border border-blue-200">
            <span className="material-symbols-outlined text-[14px]">
              troubleshoot
            </span>
            INVESTIGATING
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-full border border-green-200">
            <span className="material-symbols-outlined text-[14px]">
              check_circle
            </span>
            RESOLVED
          </span>
        );
      default:
        return <span className="font-semibold">{status}</span>;
    }
  };

  const filteredActive = activeData.filter((log) => {
    return (
      (filterStatus === "ALL" || log.status === filterStatus) &&
      (filterSeverity === "ALL" || log.severity_level === filterSeverity)
    );
  });

  return (
    <>
      <div className="flex border-b bg-white px-4 rounded-t-xl border-t border-x border-gray-200 mt-6">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 ${activeTab === "ACTIVE" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            list_alt
          </span>{" "}
          Log Aktif
        </button>
        <button
          onClick={() => setActiveTab("DELETED")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 ${activeTab === "DELETED" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            delete_history
          </span>{" "}
          Sampah / Terhapus ({deletedData.length})
        </button>
        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 ${activeTab === "AUDIT" ? "border-purple-600 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          <span className="material-symbols-outlined text-[18px]">
            history_toggle_off
          </span>{" "}
          Audit Trail ({auditData.length})
        </button>
      </div>

      <div className="bg-white border-x border-b border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
        {activeTab === "ACTIVE" && (
          <>
            <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3 bg-gray-50/50">
              <span className="text-sm font-bold text-gray-700">
                Daftar Monitor Utama
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value="ALL">Semua Severity</option>
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs font-semibold text-gray-700 border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="OPEN">OPEN</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Waktu</th>
                    <th className="px-6 py-3 font-medium">Judul Insiden</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredActive.length > 0 ? (
                    filteredActive.map((log) => (
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
                        <td className="px-6 py-4">
                          {getStatusBadge(log.status)}
                        </td>
                        <td className="px-6 py-4">
                          {getSeverityBadge(log.severity_level)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {log.status === "OPEN" && (
                              <button
                                onClick={() => handleAcknowledge(log.id)}
                                disabled={isProcessing}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                                title="Acknowledge"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  done
                                </span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedIncident(log)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                info
                              </span>
                            </button>

                            <button
                              onClick={() => setIncidentToDelete(log.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
                        Tidak ada log data aktif.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "DELETED" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-red-50/50 text-xs font-semibold uppercase text-red-700 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Waktu Hapus</th>
                  <th className="px-6 py-3 font-medium">Judul Laporan</th>
                  <th className="px-6 py-3 font-medium">Status Terakhir</th>
                  <th className="px-6 py-3 font-medium">Severity</th>
                  <th className="px-6 py-3 font-medium text-right">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {deletedData.length > 0 ? (
                  deletedData.map((log) => (
                    <tr key={log.id} className="bg-gray-50/40 text-gray-500">
                      <td
                        className="px-6 py-4 text-sm font-mono"
                        suppressHydrationWarning
                      >
                        {new Date(log.created_at).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium line-through">
                        {log.judul}
                      </td>
                      <td className="px-6 py-4 opacity-60">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-6 py-4 opacity-60">
                        {getSeverityBadge(log.severity_level)}
                      </td>
                      <td className="px-6 py-4 text-right text-xs italic font-semibold text-red-600">
                        Soft Deleted
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      Kotak sampah kosong. All clear!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "AUDIT" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-purple-50/50 text-xs font-semibold uppercase text-purple-700 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Waktu Log</th>
                  <th className="px-6 py-3 font-medium">Referensi Insiden</th>
                  <th className="px-6 py-3 font-medium">Aksi</th>
                  <th className="px-6 py-3 font-medium">Detail Mutasi Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {auditData.length > 0 ? (
                  auditData.map((trail) => {
                    let parsedData = { message: "" };
                    try {
                      parsedData =
                        typeof trail.data_baru === "string"
                          ? JSON.parse(trail.data_baru)
                          : trail.data_baru;
                    } catch (e) {}

                    return (
                      <tr key={trail.id} className="text-sm text-gray-600">
                        <td
                          className="px-6 py-4 font-mono text-xs"
                          suppressHydrationWarning
                        >
                          {new Date(trail.created_at).toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {trail.incident_title || "N/A (Deleted)"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              trail.aksi === "CREATED"
                                ? "bg-green-100 text-green-800"
                                : trail.aksi === "RESOLVED"
                                  ? "bg-teal-100 text-teal-800"
                                  : trail.aksi === "ACKNOWLEDGED"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {trail.aksi}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                          {parsedData?.message || JSON.stringify(parsedData)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      Belum ada riwayat aktivitas sistem tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedIncident && (
        <DetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onResolve={handleResolve}
          isProcessing={isProcessing}
          getStatusBadge={getStatusBadge}
          getSeverityBadge={getSeverityBadge}
        />
      )}

      <DeleteModal
        isOpen={!!incidentToDelete}
        onClose={() => setIncidentToDelete(null)}
        onConfirm={confirmDelete}
        isProcessing={isProcessing}
      />
    </>
  );
}
