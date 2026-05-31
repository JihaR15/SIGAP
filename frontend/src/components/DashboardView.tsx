"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { CriticalBanner } from "@/components/CriticalBanner";
import { IncidentTable } from "@/components/IncidentTable";
import { NewIncidentAction } from "@/components/NewIncidentAction";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { Sidebar } from "@/components/Sidebar";
import UserManagementView from "@/components/UserManagementView";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useRouter } from "next/navigation";
import { ProfileModal } from "./ProfileModal";

export interface UserSession {
  id: number | string;
  nama: string;
  role: "Manager" | "Operator";
  username: string;
  token?: string;
}

interface DashboardViewProps {
  incidents: any[];
  deletedIncidents: any[];
  auditTrails: any[];
  currentUser: UserSession;
}

export function DashboardView({
  incidents,
  deletedIncidents,
  auditTrails,
  currentUser,
}: DashboardViewProps) {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const allowedIncidents = incidents.filter((log: any) => {
    if (
      currentUser.role === "Operator" &&
      Number(log.reporter_id) !== Number(currentUser.id)
    )
      return false;
    return true;
  });

  const criticalLogs = allowedIncidents.filter(
    (log: any) => log.severity_level === "CRITICAL" && log.status === "OPEN",
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const chartData = [
    {
      name: "Open",
      jumlah: allowedIncidents.filter((i) => i.status === "OPEN").length,
    },
    {
      name: "Investigating",
      jumlah: allowedIncidents.filter((i) => i.status === "INVESTIGATING")
        .length,
    },
    {
      name: "Resolved",
      jumlah: allowedIncidents.filter((i) => i.status === "RESOLVED").length,
    },
  ];

  const severityData = [
    {
      name: "CRITICAL",
      value: allowedIncidents.filter((i) => i.severity_level === "CRITICAL")
        .length,
      color: "#ef4444",
    },
    {
      name: "WARNING",
      value: allowedIncidents.filter((i) => i.severity_level === "WARNING")
        .length,
      color: "#f97316",
    },
    {
      name: "INFO",
      value: allowedIncidents.filter((i) => i.severity_level === "INFO").length,
      color: "#22c55e",
    },
  ];

  const getTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => ({
      date: date.slice(5),
      incidents: allowedIncidents.filter(
        (i) => i.created_at?.split("T")[0] === date,
      ).length,
      resolved: allowedIncidents.filter(
        (i) => i.resolved_at?.split("T")[0] === date,
      ).length,
    }));
  };

  const trendData = getTrendData();

  const resolutionData = [
    {
      name: "CRITICAL",
      resolved: allowedIncidents.filter(
        (i) => i.severity_level === "CRITICAL" && i.status === "RESOLVED",
      ).length,
      total: allowedIncidents.filter((i) => i.severity_level === "CRITICAL")
        .length,
    },
    {
      name: "WARNING",
      resolved: allowedIncidents.filter(
        (i) => i.severity_level === "WARNING" && i.status === "RESOLVED",
      ).length,
      total: allowedIncidents.filter((i) => i.severity_level === "WARNING")
        .length,
    },
    {
      name: "INFO",
      resolved: allowedIncidents.filter(
        (i) => i.severity_level === "INFO" && i.status === "RESOLVED",
      ).length,
      total: allowedIncidents.filter((i) => i.severity_level === "INFO").length,
    },
  ];

  const hasValidData = (data: any[]) => {
    return data.some((item) => item.value > 0 || item.total > 0);
  };

  const maxYValue = Math.max(
    ...chartData.map((d) => d.jumlah),
    ...resolutionData.map((d) => Math.max(d.total, d.resolved)),
    ...trendData.map((d) => Math.max(d.incidents, d.resolved)),
  );

  const getYAxisDomain = () => {
    if (maxYValue === 0) return [0, 10];
    const roundedMax = Math.ceil(maxYValue * 1.1);
    return [0, roundedMax];
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-blue-700"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
            <span className="font-bold text-blue-700">SIGAP</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <span className="material-symbols-outlined text-slate-600 text-2xl">
              menu
            </span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeMenu === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Overview Sistem
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Pantauan ringkas status infrastruktur saat ini.
                </p>
              </div>

              <CriticalBanner data={criticalLogs} currentUser={currentUser} />
              <DashboardMetrics data={allowedIncidents} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
                  <h2 className="text-sm font-bold text-slate-700 mb-4 tracking-wide uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-lg">
                      donut_large
                    </span>
                    Sebaran Status Insiden
                  </h2>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        allowDecimals={false}
                        domain={getYAxisDomain()}
                        tickFormatter={formatNumber}
                      />
                      <Tooltip
                        cursor={{ fill: "#f1f5f9" }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value: any) => [
                          `${formatNumber(value)} insiden`,
                          "Jumlah",
                        ]}
                      />
                      <Bar
                        dataKey="jumlah"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                        barSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
                  <h2 className="text-sm font-bold text-slate-700 mb-4 tracking-wide uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600 text-lg">
                      warning
                    </span>
                    Distribusi Severity
                  </h2>
                  {hasValidData(severityData) ? (
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie
                          data={severityData.filter((item) => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => {
                            const percentage = percent
                              ? (percent * 100).toFixed(0)
                              : "0";
                            return `${name} ${percentage}%`;
                          }}
                          labelLine={false}
                        >
                          {severityData
                            .filter((item) => item.value > 0)
                            .map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [
                            `${formatNumber(value)} insiden`,
                            "Jumlah",
                          ]}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[85%] text-slate-400">
                      Belum ada data insiden
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-slate-700 tracking-wide uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-lg">
                        trending_up
                      </span>
                      Trend Insiden (7 Hari)
                    </h2>
                  </div>
                  <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        allowDecimals={false}
                        domain={getYAxisDomain()}
                        tickFormatter={formatNumber}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value: any) => [formatNumber(value), ""]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="incidents"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: "#2563eb", strokeWidth: 2 }}
                        name="New Incidents"
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: "#22c55e", strokeWidth: 2 }}
                        name="Resolved"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
                  <h2 className="text-sm font-bold text-slate-700 mb-4 tracking-wide uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">
                      check_circle
                    </span>
                    Tingkat Resolusi per Severity
                  </h2>
                  {hasValidData(resolutionData) ? (
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={resolutionData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          allowDecimals={false}
                          domain={getYAxisDomain()}
                          tickFormatter={formatNumber}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                          formatter={(value: any, name: any) => {
                            const formattedValue = formatNumber(value);
                            if (name === "resolved")
                              return [
                                `${formattedValue} insiden`,
                                "Terselesaikan",
                              ];
                            return [
                              `${formattedValue} insiden`,
                              "Total Insiden",
                            ];
                          }}
                        />
                        <Legend
                          formatter={(value: any) => {
                            if (value === "resolved") return "Terselesaikan";
                            if (value === "total") return "Total Insiden";
                            return value;
                          }}
                        />
                        <Bar
                          dataKey="total"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                          name="total"
                        />
                        <Bar
                          dataKey="resolved"
                          fill="#22c55e"
                          radius={[4, 4, 0, 0]}
                          name="resolved"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[85%] text-slate-400">
                      Belum ada data insiden
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeMenu === "incidents" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Tabel Insiden
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Manajemen dan pelaporan gangguan aktif.
                  </p>
                </div>
                <NewIncidentAction currentUser={currentUser} />
              </div>

              <IncidentTable
                activeData={allowedIncidents}
                deletedData={[]}
                auditData={[]}
                currentUser={currentUser}
                viewMode="active"
              />
            </div>
          )}

          {activeMenu === "audit" && currentUser.role === "Manager" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Log Audit & Sampah
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Rekam jejak sistem dan data yang diarsipkan.
                </p>
              </div>

              <IncidentTable
                activeData={[]}
                deletedData={deletedIncidents}
                auditData={auditTrails}
                currentUser={currentUser}
                viewMode="audit"
              />
            </div>
          )}

          {activeMenu === "users" && currentUser.role === "Manager" && (
            <div className="space-y-6 animate-fade-in">
              <UserManagementView currentUser={currentUser} />
            </div>
          )}
        </main>
      </div>
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  );
}
