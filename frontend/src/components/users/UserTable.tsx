import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { UserSession } from "../DashboardView";
import { PaginationControls } from "../PaginationControls";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: UserSession;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void; // Tambahan properti baru
}

export function UserTable({
  users, isLoading, searchQuery, setSearchQuery, currentUser, onEdit, onDelete, onRestore
}: UserTableProps) {
  
  const [activeTab, setActiveTab] = useState<"Aktif" | "Nonaktif">("Aktif");
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset halaman ke 1 jika tab atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const filteredUsers = users.filter(u => {
    const matchesTab = (u.status || "Aktif") === activeTab;
    const matchesSearch = (u.nama || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.username || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeCount = users.filter(u => (u.status || "Aktif") === "Aktif").length;
  const inactiveCount = users.filter(u => u.status === "Nonaktif").length;

  // Logika Pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 pt-4">
        <button
          onClick={() => setActiveTab("Aktif")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "Aktif" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          Pengguna Aktif <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-200 text-[10px]">{activeCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("Nonaktif")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "Nonaktif" ? "border-red-600 text-red-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          Nonaktif <span className="ml-1.5 px-2 py-0.5 rounded-full bg-slate-200 text-[10px]">{inactiveCount}</span>
        </button>
      </div>

      <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Cari nama atau username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Peran</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Memuat data pengguna...</td></tr>
            ) : paginatedUsers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Tidak ada pengguna ditemukan di tab ini.</td></tr>
            ) : (
              paginatedUsers.map((user) => {
                const isSelf = user.id === Number(currentUser.id);
                return (
                  <tr key={user.id} className={`transition-colors group ${activeTab === 'Nonaktif' ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          activeTab === 'Nonaktif' ? 'bg-slate-200 text-slate-500' :
                          user.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {(user.nama || "U").substring(0, 2).toUpperCase()}
                        </div>
                        <span className={`font-semibold ${activeTab === 'Nonaktif' ? 'text-slate-500' : 'text-slate-900'}`}>{user.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{user.username || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        activeTab === 'Nonaktif' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                        user.role === 'Manager' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'Nonaktif' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {user.status || 'Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isSelf ? (
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium">Dirimu Sendiri</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {activeTab === 'Aktif' ? (
                            <>
                              <button onClick={() => onEdit(user)} className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-500 transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button onClick={() => onDelete(user.id)} className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 transition-all shadow-sm" title="Nonaktifkan User">
                                <span className="material-symbols-outlined text-[18px]">person_off</span>
                              </button>
                            </>
                          ) : (
                            <button onClick={() => onRestore(user.id)} className="p-1.5 rounded-md bg-white border border-slate-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 text-slate-500 transition-all shadow-sm" title="Aktifkan Kembali">
                              <span className="material-symbols-outlined text-[18px]">person_check</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Kontrol Paginasi */}
      <PaginationControls 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        totalPages={totalPages} 
        totalItems={totalItems} 
        itemsPerPage={itemsPerPage} 
      />
    </div>
  );
}