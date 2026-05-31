"use client";

import { useState, useEffect } from "react";
import { UserSession } from "./DashboardView";
import { User } from "@/types/user";

import { UserStats } from "./users/UserStats";
import { UserTable } from "./users/UserTable";
import { UserFormModal } from "./users/UserFormModal";
import { UserDeleteModal } from "./users/UserDeleteModal";
import { UserRestoreModal } from "./users/UserRestoreModal"; // Import modal baru

import * as XLSX from "xlsx";
import { ImportExcelModal } from "./users/ImportExcelModal";

interface UserManagementViewProps {
  currentUser: UserSession;
}

export default function UserManagementView({ currentUser }: UserManagementViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [userToRestore, setUserToRestore] = useState<number | null>(null); // State baru
  const [isRestoring, setIsRestoring] = useState(false); // State baru
  
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({ id: 0, nama: "", username: "", role: "Operator", password: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Gagal memuat pengguna:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = modalMode === "add" ? `${API_URL}/users` : `${API_URL}/users/${formData.id}`;
    const method = modalMode === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchUsers();
        setIsModalOpen(false);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan data pengguna");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const confirmDeactivate = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/users/${userToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (res.ok) {
        fetchUsers();
        setUserToDelete(null);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menonaktifkan pengguna");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fungsi baru untuk memulihkan pengguna
  const confirmRestore = async () => {
    if (!userToRestore) return;
    setIsRestoring(true);
    try {
      const res = await fetch(`${API_URL}/users/${userToRestore}/restore`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (res.ok) {
        fetchUsers();
        setUserToRestore(null);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal mengaktifkan pengguna");
      }
    } catch (error) {
      console.error("Error restoring user:", error);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleExport = () => {
    const exportData = users.map((u, i) => ({
      No: i + 1,
      Nama: u.nama,
      Username: u.username,
      Peran: u.role,
      Status: u.status || "Aktif",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pengguna");
    XLSX.writeFile(workbook, "Data_Pengguna_SIGAP.xlsx");
  };

  const handleImportData = async (jsonData: any[]) => {
    try {
      const res = await fetch(`${API_URL}/users/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ users: jsonData }),
      });

      const result = await res.json();

      if (res.ok) {
        let alertMsg = result.message;
        if (result.errors && result.errors.length > 0) {
          alertMsg += `\n\nBeberapa baris gagal:\n${result.errors.join("\n")}`;
        }
        alert(alertMsg);
        fetchUsers();
        setIsImportModalOpen(false);
      } else {
        alert(result.error || "Gagal import data");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan saat import.");
    }
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setFormData({
      id: user.id,
      nama: user.nama,
      username: user.username || "",
      role: user.role,
      password: "",
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      id: 0,
      nama: "",
      username: "",
      role: "Operator",
      password: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola hak akses, peran, dan status pengguna dalam ekosistem SIGAP.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExport} className="border border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm text-sm">
            <span className="material-symbols-outlined text-[20px]">download</span> Export Excel
          </button>
          <button onClick={() => setIsImportModalOpen(true)} className="border border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm text-sm">
            <span className="material-symbols-outlined text-[20px]">upload</span> Import Excel
          </button>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 text-sm">
            <span className="material-symbols-outlined text-[20px]">add</span> Tambah Pengguna
          </button>
        </div>
      </div>

      <UserStats users={users} />

      <UserTable
        users={users}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onEdit={openEditModal}
        onDelete={(id) => setUserToDelete(id)}
        onRestore={(id) => setUserToRestore(id)} // Lempar fungsi ke tabel
      />

      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportData}
      />

      <UserDeleteModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeactivate}
        isProcessing={isDeleting}
      />

      {/* Modal Konfirmasi Pengaktifan Kembali */}
      <UserRestoreModal
        isOpen={!!userToRestore}
        onClose={() => setUserToRestore(null)}
        onConfirm={confirmRestore}
        isProcessing={isRestoring}
      />
    </div>
  );
}