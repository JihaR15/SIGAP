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
    if (currentUser.role === "OPERATOR" && Number(log.reporter_id) !== currentUser.id) {
      return false;
    }
    return true;
  });

  const criticalLogs = allowedIncidents.filter(
    (log: any) => log.severity_level === "CRITICAL" && log.status === "OPEN"
  );
//   const tableLogs = incidents;

  return (
    <main className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <header className="bg-white border-b border-gray-200 px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg text-white ${currentUser.role === 'MANAGER' ? 'bg-blue-600' : 'bg-green-600'}`}>
            <span className="material-symbols-outlined block text-[20px]">
              {currentUser.role === 'MANAGER' ? 'manage_accounts' : 'engineering'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{currentUser.nama}</h2>
            <p className={`text-xs font-bold uppercase ${currentUser.role === 'MANAGER' ? 'text-blue-600' : 'text-green-600'}`}>
              {currentUser.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="max-w-7xl mx-auto space-y-6 p-6 md:p-12" suppressHydrationWarning>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm" suppressHydrationWarning>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Greenfields Ops Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time Infrastructure Monitoring & Incident Logs
            </p>
          </div>
          <NewIncidentAction currentUser={currentUser} />
        </div>

        <DashboardMetrics data={allowedIncidents} />

        <CriticalBanner data={criticalLogs} currentUser={currentUser}/>

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