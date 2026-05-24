import { DashboardView } from "@/components/DashboardView";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function fetchFromBackend(endpoint: string, token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/${endpoint}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Gagal memuat ${endpoint}`);
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>Sesi tidak valid. Silakan login kembali.</div>;
  }

  const isManager = session.user.role === "Manager";

  const incidentsPromise = fetchFromBackend("incidents", session.accessToken);

  const deletedIncidentsPromise = isManager
    ? fetchFromBackend("incidents/archived/deleted", session.accessToken)
    : Promise.resolve([]);

  const auditTrailsPromise = isManager
    ? fetchFromBackend("audit-trails", session.accessToken)
    : Promise.resolve([]);

  const [incidents, deletedIncidents, auditTrails] = await Promise.all([
    incidentsPromise,
    deletedIncidentsPromise,
    auditTrailsPromise,
  ]);

  return (
    <DashboardView
      incidents={incidents}
      deletedIncidents={deletedIncidents}
      auditTrails={auditTrails}
      currentUser={{
        id: Number(session.user.id),
        nama: session.user.name || "Pengguna",
        role: session.user.role as "Manager" | "Operator",
        token: session.accessToken,
      }}
    />
  );
}