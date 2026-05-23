import { DashboardView } from "@/components/DashboardView";

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

  return (
    <DashboardView 
      incidents={incidents} 
      deletedIncidents={deletedIncidents} 
      auditTrails={auditTrails} 
    />
  );
}