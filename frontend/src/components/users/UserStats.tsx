import { User } from "@/types/user";

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const totalManager = users.filter(u => u.role === "Manager").length;
  const totalOperator = users.filter(u => u.role === "Operator").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:border-blue-300 transition-colors">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Pengguna</p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-slate-900 leading-none">{users.length}</h3>
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:border-blue-300 transition-colors">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Manager</p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-slate-900 leading-none">{totalManager}</h3>
          <span className="text-blue-600 text-xs font-medium pb-1">Admin Ops</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:border-blue-300 transition-colors">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Operator</p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-slate-900 leading-none">{totalOperator}</h3>
          <span className="text-green-600 text-xs font-medium pb-1">Staf Lapangan</span>
        </div>
      </div>
    </div>
  );
}