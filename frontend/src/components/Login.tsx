"use client";

export interface UserSession {
  id: number;
  nama: string;
  role: "MANAGER" | "OPERATOR";
}

interface LoginProps {
  onLogin: (user: UserSession) => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
        <div className="mb-8">
          <span className="material-symbols-outlined text-6xl text-green-600 mb-2">
            admin_panel_settings
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">Greenfields MVP</h1>
          <p className="text-sm text-gray-500 mt-1">Pilih role akses untuk simulasi sistem</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onLogin({ id: 2, nama: "Jiha Ramdhan", role: "MANAGER" })}
            className="w-full flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">manage_accounts</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Jiha Ramdhan</p>
                <p className="text-xs font-semibold text-blue-600 uppercase">Ops Manager</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-600">arrow_forward_ios</span>
          </button>

          <button
            onClick={() => onLogin({ id: 1, nama: "Operator Lapangan", role: "OPERATOR" })}
            className="w-full flex items-center justify-between p-4 border-2 border-green-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">engineering</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Budi Santoso</p>
                <p className="text-xs font-semibold text-green-600 uppercase">Operator</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 group-hover:text-green-600">arrow_forward_ios</span>
          </button>
        </div>
      </div>
    </div>
  );
}