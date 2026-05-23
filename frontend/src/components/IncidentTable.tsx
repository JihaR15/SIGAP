"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DetailModal } from "./DetailModal";
import { DeleteModal } from "./DeleteModal";
import { RestoreModal } from "./RestoreModal";
import { TableTabs } from "./TableTabs";
import { TableFilters } from "./TableFilters";
import { PaginationControls } from "./PaginationControls";
import { UserSession } from "./Login";

interface Incident {
  id: number;
  judul: string;
  deskripsi: string;
  severity_level: string;
  status: string;
  created_at: string;
  reporter_id: number;
}

interface AuditTrail {
  id: number;
  incident_title: string;
  aksi: string;
  data_baru: string;
  created_at: string;
}

type SortColumn = "created_at" | "judul" | "status" | "severity_level" | "aksi";
type SortDirection = "asc" | "desc";

export function IncidentTable({
  activeData,
  deletedData,
  auditData,
  currentUser,
}: {
  activeData: Incident[];
  deletedData: Incident[];
  auditData: AuditTrail[];
  currentUser: UserSession;
}) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"ACTIVE" | "DELETED" | "AUDIT">(
    "ACTIVE",
  );
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const [incidentToDelete, setIncidentToDelete] = useState<number | null>(null);
  const [incidentToRestore, setIncidentToRestore] = useState<number | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLive, setIsLive] = useState(true);

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterDate, setFilterDate] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>("severity_level");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const itemsPerPage = 10;

  React.useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive, router]);

  React.useEffect(() => {
    setCurrentPage(1);
    if (activeTab === "ACTIVE") {
      setSortColumn("severity_level");
      setSortDirection("desc");
    } else {
      setSortColumn("created_at");
      setSortDirection("desc");
    }
  }, [activeTab, filterStatus, filterSeverity, filterDate]);

  const checkDateFilter = (dateStr: string) => {
    if (filterDate === "ALL") return true;
    const date = new Date(dateStr);
    const today = new Date();

    if (filterDate === "TODAY") {
      return date.toDateString() === today.toDateString();
    }
    if (filterDate === "THIS_WEEK") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return date >= weekAgo;
    }
    return true;
  };

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
    } finally {
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

  const handleRestore = async () => {
    if (!incidentToRestore) return;
    setIsProcessing(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/incidents/${incidentToRestore}/restore`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: 2 }),
        },
      );
      if (res.ok) {
        setIncidentToRestore(null);
        router.refresh();
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
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
    if (
      currentUser.role === "Operator" &&
      Number(log.reporter_id) !== currentUser.id
    ) {
      return false;
    }

    return (
      (filterStatus === "ALL" || log.status === filterStatus) &&
      (filterSeverity === "ALL" || log.severity_level === filterSeverity) &&
      checkDateFilter(log.created_at)
    );
  });

  const currentTabData =
    activeTab === "ACTIVE"
      ? filteredActive
      : activeTab === "DELETED"
        ? deletedData
        : auditData;

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleResetSort = () => {
    if (activeTab === "ACTIVE") {
      setSortColumn("severity_level");
      setSortDirection("desc");
    } else {
      setSortColumn("created_at");
      setSortDirection("desc");
    }
  };

  const isCustomSorted =
    activeTab === "ACTIVE"
      ? sortColumn !== "severity_level" || sortDirection !== "desc"
      : sortColumn !== "created_at" || sortDirection !== "desc";

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column)
      return (
        <span className="text-[11px] text-gray-400 ml-1 font-sans">⇅</span>
      );
    return (
      <span className="text-[12px] font-bold text-blue-600 ml-1 font-sans">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const sortedData = [...currentTabData].sort((a: any, b: any) => {
    if (activeTab === "ACTIVE") {
      if (a.status === "RESOLVED" && b.status !== "RESOLVED") return 1;
      if (b.status === "RESOLVED" && a.status !== "RESOLVED") return -1;
    }

    let valA = a[sortColumn];
    let valB = b[sortColumn];

    const severityMap: any = { INFO: 1, WARNING: 2, CRITICAL: 3 };
    const statusMap: any = { RESOLVED: 1, INVESTIGATING: 2, OPEN: 3 };

    if (sortColumn === "severity_level") {
      valA = severityMap[valA] || 0;
      valB = severityMap[valB] || 0;
    } else if (sortColumn === "status") {
      valA = statusMap[valA] || 0;
      valB = statusMap[valB] || 0;
    } else if (sortColumn === "created_at") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    } else if (activeTab === "AUDIT" && sortColumn === "judul") {
      valA = a.incident_title || "";
      valB = b.incident_title || "";
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;

    if (activeTab === "ACTIVE") {
      const statA = statusMap[a.status] || 0;
      const statB = statusMap[b.status] || 0;
      if (statA !== statB) return statB - statA;

      const sevA = severityMap[a.severity_level] || 0;
      const sevB = severityMap[b.severity_level] || 0;
      if (sevA !== sevB) return sevB - sevA;

      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB;
    }

    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      <TableTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deletedCount={deletedData.length}
        auditCount={auditData.length}
        role={currentUser.role}
      />

      <div className="bg-white border-x border-b border-gray-200 rounded-b-xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === "ACTIVE" ? (
          <TableFilters
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterSeverity={filterSeverity}
            setFilterSeverity={setFilterSeverity}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            isLive={isLive}
            setIsLive={setIsLive}
            isCustomSorted={isCustomSorted}
            onResetSort={handleResetSort}
          />
        ) : (
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <span className="text-sm font-bold text-gray-700">
              {activeTab === "DELETED"
                ? "Laporan Terhapus"
                : "Catatan Audit Sistem"}
            </span>

            {isCustomSorted && (
              <button
                onClick={handleResetSort}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">
                  restart_alt
                </span>
                Reset Sort
              </button>
            )}
          </div>
        )}

        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-left table-auto">
            <thead
              className={`text-xs font-semibold uppercase border-b border-gray-200 select-none ${
                activeTab === "ACTIVE"
                  ? "bg-gray-50 text-gray-500"
                  : activeTab === "DELETED"
                    ? "bg-red-50/50 text-red-700"
                    : "bg-purple-50/50 text-purple-700"
              }`}
            >
              {activeTab === "ACTIVE" && (
                <tr>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200/50 transition-colors"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-1">
                      Waktu <SortIcon column="created_at" />
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium min-w-50 cursor-pointer hover:bg-gray-200/50 transition-colors"
                    onClick={() => handleSort("judul")}
                  >
                    <div className="flex items-center gap-1">
                      Judul Insiden <SortIcon column="judul" />
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium cursor-pointer hover:bg-gray-200/50 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status <SortIcon column="status" />
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium cursor-pointer hover:bg-gray-200/50 transition-colors"
                    onClick={() => handleSort("severity_level")}
                  >
                    <div className="flex items-center gap-1">
                      Severity <SortIcon column="severity_level" />
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">
                    Aksi
                  </th>
                </tr>
              )}
              {activeTab === "DELETED" && (
                <tr>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-red-100/50 transition-colors"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-1 text-red-700">
                      Waktu Hapus <SortIcon column="created_at" />
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium min-w-50 cursor-pointer hover:bg-red-100/50 transition-colors"
                    onClick={() => handleSort("judul")}
                  >
                    <div className="flex items-center gap-1 text-red-700">
                      Judul Laporan <SortIcon column="judul" />
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 font-medium">
                    Status Terakhir
                  </th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">
                    Aksi
                  </th>
                </tr>
              )}
              {activeTab === "AUDIT" && (
                <tr>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap cursor-pointer hover:bg-purple-100/50 transition-colors"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-1 text-purple-700">
                      Waktu Log <SortIcon column="created_at" />
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium min-w-37.5 cursor-pointer hover:bg-purple-100/50 transition-colors"
                    onClick={() => handleSort("judul")}
                  >
                    <div className="flex items-center gap-1 text-purple-700">
                      Insiden <SortIcon column="judul" />
                    </div>
                  </th>
                  <th
                    className="px-4 sm:px-6 py-3 font-medium cursor-pointer hover:bg-purple-100/50 transition-colors"
                    onClick={() => handleSort("aksi")}
                  >
                    <div className="flex items-center gap-1 text-purple-700">
                      Aksi <SortIcon column="aksi" />
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Detail</th>
                </tr>
              )}
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.length > 0 ? (
                activeTab === "ACTIVE" ? (
                  (paginatedData as Incident[]).map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td
                        className="px-4 sm:px-6 py-4 text-sm text-gray-500 font-mono whitespace-nowrap"
                        suppressHydrationWarning
                      >
                        {new Date(log.created_at).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">
                        {log.judul}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {getSeverityBadge(log.severity_level)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {log.status === "OPEN" &&
                            currentUser.role === "Manager" && (
                              <button
                                onClick={() => handleAcknowledge(log.id)}
                                disabled={isProcessing}
                                className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                                title="Acknowledge"
                              >
                                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                                  done
                                </span>
                              </button>
                            )}

                          <button
                            onClick={() => setSelectedIncident(log)}
                            className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Detail Info"
                          >
                            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                              info
                            </span>
                          </button>

                          {(currentUser.role === "Manager" ||
                            (currentUser.role === "Operator" &&
                              log.status === "OPEN")) && (
                            <button
                              onClick={() => setIncidentToDelete(log.id)}
                              className="p-1 sm:p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Hapus Data"
                            >
                              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                                delete
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === "DELETED" ? (
                  (paginatedData as Incident[]).map((log) => (
                    <tr
                      key={log.id}
                      className="bg-gray-50/40 text-gray-500 hover:bg-gray-50 transition-colors group"
                    >
                      <td
                        className="px-4 sm:px-6 py-4 text-sm font-mono whitespace-nowrap"
                        suppressHydrationWarning
                      >
                        {new Date(log.created_at).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-medium line-through">
                        {log.judul}
                      </td>
                      <td className="px-4 sm:px-6 py-4 opacity-60">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <button
                          onClick={() => setIncidentToRestore(log.id)}
                          disabled={isProcessing}
                          className="p-1 sm:p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                          title="Kembalikan Log"
                        >
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                            restore_from_trash
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  (paginatedData as AuditTrail[]).map((trail) => {
                    let parsedData = { message: "" };
                    try {
                      parsedData =
                        typeof trail.data_baru === "string"
                          ? JSON.parse(trail.data_baru)
                          : trail.data_baru;
                    } catch (e) {}
                    return (
                      <tr
                        key={trail.id}
                        className="text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <td
                          className="px-4 sm:px-6 py-4 font-mono text-xs whitespace-nowrap"
                          suppressHydrationWarning
                        >
                          {new Date(trail.created_at).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-semibold text-gray-900">
                          {trail.incident_title || "N/A (Deleted)"}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded whitespace-nowrap ${
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
                        <td className="px-4 sm:px-6 py-4 text-xs font-medium text-gray-500 min-w-50">
                          {parsedData?.message || JSON.stringify(parsedData)}
                        </td>
                      </tr>
                    );
                  })
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Tidak ada data yang tersedia di tab ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {selectedIncident && (
        <DetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onResolve={handleResolve}
          isProcessing={isProcessing}
          getStatusBadge={getStatusBadge}
          getSeverityBadge={getSeverityBadge}
          currentUser={currentUser}
        />
      )}
      <DeleteModal
        isOpen={!!incidentToDelete}
        onClose={() => setIncidentToDelete(null)}
        onConfirm={confirmDelete}
        isProcessing={isProcessing}
      />
      <RestoreModal
        isOpen={!!incidentToRestore}
        onClose={() => setIncidentToRestore(null)}
        onConfirm={handleRestore}
        isProcessing={isProcessing}
      />
    </>
  );
}
