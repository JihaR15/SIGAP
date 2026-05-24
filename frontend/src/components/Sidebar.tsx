import { UserSession } from "./DashboardView";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  currentUser: UserSession;
  onLogout: () => void;
}

export function Sidebar({
  activeMenu,
  setActiveMenu,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentUser,
  onLogout,
}: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Dashboard Metrics", icon: "dashboard" },
    { id: "incidents", label: "Tabel Insiden Aktif", icon: "table_chart" },
    ...(currentUser.role === "Manager" 
      ? [{ id: "audit", label: "Log Audit & Sampah", icon: "history" }]
      : [])
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen
          bg-white/95 backdrop-blur-xl md:backdrop-blur-none
          border-r border-slate-200/80 shadow-2xl md:shadow-lg
          w-72 flex flex-col
          transition-all duration-300 ease-in-out z-50
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="relative px-5 py-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl" />
                <div className="relative bg-linear-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
                  <span 
                    className="material-symbols-outlined text-white text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    security
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-linear-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  SIGAP
                </span>
                <span className="block text-[10px] font-medium text-slate-400 tracking-wide">
                  Incident & Audit System
                </span>
              </div>
            </div>
            
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  relative group w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? "text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100/50" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-500 rounded-r-full" />
                )}
                
                <span className={`material-symbols-outlined text-[22px] transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                }`}>
                  {item.icon}
                </span>
                
                <span className="flex-1 text-left">{item.label}</span>
                
                {isActive && (
                  <span className="material-symbols-outlined text-[18px] text-blue-600">
                    chevron_right
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="px-4 py-5 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {currentUser.nama?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-slate-900 truncate">
                {currentUser.nama}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 
                       bg-gradient-to-r from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200
                       text-red-600 rounded-xl font-semibold text-sm 
                       transition-all duration-200 hover:shadow-md active:scale-95
                       border border-red-200/50"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:-translate-x-0.5">
              logout
            </span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}