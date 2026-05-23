"use client";

import { useState, useEffect } from "react";
import { Login, UserSession } from "@/components/Login";
import { CriticalBanner } from "@/components/CriticalBanner";
import { IncidentTable } from "@/components/IncidentTable";
import { NewIncidentAction } from "@/components/NewIncidentAction";
import { DashboardMetrics } from "@/components/DashboardMetrics";

interface DashboardViewProps {
  incidents: any[];
  deletedIncidents: any[];
  auditTrails: any[];
}

export function DashboardView({
  incidents,
  deletedIncidents,
  auditTrails,
}: DashboardViewProps) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem("greenfields_session");
    if (savedSession) {
      try {
        setCurrentUser(JSON.parse(savedSession));
      } catch (e) {
        console.error("Gagal membaca sesi", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleLogin = (user: UserSession) => {
    localStorage.setItem("greenfields_session", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("greenfields_session");
    setCurrentUser(null);
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const allowedIncidents = incidents.filter((log: any) => {
    if (
      currentUser.role === "Operator" &&
      Number(log.reporter_id) !== currentUser.id
    ) {
      return false;
    }
    return true;
  });

  const criticalLogs = allowedIncidents.filter(
    (log: any) => log.severity_level === "CRITICAL" && log.status === "OPEN",
  );
  //   const tableLogs = incidents;

  return (
    <main className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <header className="w-full h-16 px-6 md:px-12 flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-700 flex items-center justify-center rounded-lg shadow-sm">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_person
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-700 tracking-tight leading-none">
              SIGAP
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 truncate max-w-50 sm:max-w-none block">
              Sistem Informasi Gangguan dan Audit Perusahaan
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right mr-2">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {currentUser.nama}
            </p>
            <p
              className={`text-[10px] font-bold uppercase ${currentUser.role === "Manager" ? "text-indigo-600" : "text-blue-600"}`}
            >
              {currentUser.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div
        className="max-w-7xl mx-auto space-y-6 p-6 md:p-12"
        suppressHydrationWarning
      >
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          suppressHydrationWarning
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hi, {currentUser.nama}
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm sm:text-base max-w-2xl">
              {currentUser.role === "Operator"
                ? "Silakan masukkan log insiden terbaru dan pantau pergerakan status infrastruktur di lapangan secara real-time."
                : "Review audit log, pantau performa sistem, dan kelola persetujuan resolusi untuk insiden kritis perusahaan."}
            </p>
          </div>
          <NewIncidentAction currentUser={currentUser} />
        </div>

        <DashboardMetrics data={allowedIncidents} />

        <CriticalBanner data={criticalLogs} currentUser={currentUser} />

        <IncidentTable
          activeData={allowedIncidents}
          deletedData={deletedIncidents}
          auditData={auditTrails}
          currentUser={currentUser}
        />
      </div>
    </main>
  );
}
