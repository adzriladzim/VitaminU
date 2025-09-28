import { Outlet, Link } from "react-router-dom";
import { Plus, Settings, Mail } from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-cyan-600 text-white p-4 space-y-4">
        <h2 className="text-2xl font-bold">Hello there</h2>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/dashboard/add-class"
            className="hover:underline flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Class
          </Link>

          <Link
            to="/dashboard/manage-class"
            className="hover:underline flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Manage Class
          </Link>

          <Link
            to="/dashboard/requests"
            className="hover:underline flex items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Requests
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
