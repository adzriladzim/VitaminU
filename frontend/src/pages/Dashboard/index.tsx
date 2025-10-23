import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Plus, Settings, Mail, Home, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    contextLogout(); // This will clear the auth state and localStorage
    navigate("/"); // Navigate to the landing page instead of login
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-cyan-600 text-white flex flex-col shadow-lg">
        <div className=" text-center p-6 text-2xl font-bold border-b border-cyan-500">
          Dashboard Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center justify-start gap-2
             px-5 py-3 rounded-xl transition-all duration-200
             font-medium hover:bg-cyan-500 ${isActive ? "bg-cyan-500" : ""}`
            }
          >
            <Home className="h-6 w-6" />
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="add-class"
            className={({ isActive }) =>
              `flex items-center justify-start gap-2
             px-5 py-3 rounded-xl transition-all duration-200
             font-medium hover:bg-cyan-500 ${isActive ? "bg-cyan-500" : ""}`
            }
          >
            <Plus className="h-6 w-6" />
            <span>Add Class</span>

          </NavLink>
          <NavLink
            to="manage-class"
            className={({ isActive }) =>
              `flex items-center justify-start gap-2
     px-5 py-3 rounded-xl transition-all duration-200
     font-medium hover:bg-cyan-500 ${isActive ? "bg-cyan-500" : ""
              }`
            }
          >
            <Settings className="h-6 w-auto" /> <span>Manage Class</span>
          </NavLink>
        </nav>

        {/* Logout Button positioned at the bottom */}
        <div className="p-4 mt-auto border-t border-cyan-500">
          <button
            onClick={handleLogout}
            className="flex items-center justify-start gap-2
             px-5 py-3 rounded-xl transition-all duration-200
             font-medium bg-red-500 hover:bg-red-700 w-full text-left"
          >
            
            <LogOut className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* KONTEN */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
