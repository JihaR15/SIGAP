import { CriticalBanner } from "@/components/CriticalBanner";
import { IncidentTable } from "@/components/IncidentTable";
import { NewIncidentAction } from "@/components/NewIncidentAction";
import { DashboardMetrics } from "@/components/DashboardMetrics";

async function fetchFromBackend(endpoint: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Gagal memuat ${endpoint}`);
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Dashboard() {
  const [incidents, deletedIncidents, auditTrails] = await Promise.all([
    fetchFromBackend("incidents"),
    fetchFromBackend("incidents/archived/deleted"),
    fetchFromBackend("audit-trails"),
  ]);

  const criticalLogs = incidents.filter(
    (log: any) => log.severity_level === "CRITICAL" && log.status === "OPEN",
  );
  const tableLogs = incidents;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto space-y-6" suppressHydrationWarning>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm" suppressHydrationWarning>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Greenfields Ops Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time Infrastructure Monitoring & Incident Logs
            </p>
          </div>
          <NewIncidentAction />
        </div>

        <DashboardMetrics data={incidents} />

        <CriticalBanner data={criticalLogs} />

        <IncidentTable
          activeData={tableLogs}
          deletedData={deletedIncidents}
          auditData={auditTrails}
        />
      </div>
    </main>
  );
}
