import { Outlet, NavLink } from "react-router-dom";
import { Plus, Settings, Mail } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-cyan-600 text-white flex flex-col shadow-lg">
        <div className=" text-center p-6 text-2xl font-bold border-b border-cyan-500">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="add-class"
            className={({ isActive }) =>
              `flex items-center justify-start gap-2
     px-5 py-3 rounded-xl transition-all duration-200
     font-medium hover:bg-cyan-500 ${isActive ? "bg-cyan-500" : ""
              }`
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
          <NavLink
            to="requests"
            className={({ isActive }) =>
              `flex items-center justify-start gap-2
     px-5 py-3 rounded-xl transition-all duration-200
     font-medium hover:bg-cyan-500 ${isActive ? "bg-cyan-500" : ""
              }`
            }
          >
            <Mail className="h-6 w-auto" />
            <span>Requests</span>
          </NavLink>
        </nav>
      </aside>

      {/* KONTEN */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
