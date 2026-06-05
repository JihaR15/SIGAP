import { useRef, useState } from "react";
import * as XLSX from "xlsx";

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void; // Fungsi baru untuk melempar data JSON ke parent
}

export function ImportExcelModal({ isOpen, onClose, onImport }: ImportExcelModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      onImport(jsonData);
      setFileName("");
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Import Data Pengguna</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <span className="material-symbols-outlined text-[20px] mt-0.5">info</span>
            <p className="text-sm leading-relaxed">
              Pastikan format data sesuai dengan template yang tersedia. Kolom yang wajib ada di baris pertama Excel adalah: 
              <strong> Nama, Username, Peran, </strong> dan <strong> Password</strong>.
            </p>
          </div>

          {/* Input File Tersembunyi */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />
          
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm">Preview Template Data</h3>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600">
                    <th className="px-4 py-2 text-xs font-semibold uppercase">Nama</th>
                    <th className="px-4 py-2 text-xs font-semibold uppercase">Username</th>
                    <th className="px-4 py-2 text-xs font-semibold uppercase">Peran</th>
                    <th className="px-4 py-2 text-xs font-semibold uppercase">Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="text-sm">
                    <td className="px-4 py-2.5 text-slate-900">Jiha Ramdhan</td>
                    <td className="px-4 py-2.5 text-slate-600">jiha.r</td>
                    <td className="px-4 py-2.5">Operator</td>
                    <td className="px-4 py-2.5 text-slate-400">123456</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-blue-600 font-medium truncate">{fileName ? `File terpilih: ${fileName}` : ""}</span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all text-sm">Batal</button>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm text-sm"
            >
              Pilih File Excel & Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}