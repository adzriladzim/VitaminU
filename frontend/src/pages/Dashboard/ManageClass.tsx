import { useClasses } from "../../hooks/useClasses";
import { userBookings } from "../../data/userBookings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type ClassStatus = "Available" | "Booked" | "In Use";

export default function ManageClass() {
  // Panggil hook untuk mendapatkan semua yang kita butuhkan
  const {
    classes,
    editingId,
    currentStatus,
    setCurrentStatus,
    handleApprove,
    handleEditClick,
    handleCancel,
    handleSave,
    handleFinish,
  } = useClasses();


  const inUseClasses = classes.filter((cls) => cls.status === "In Use");

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-700">Manage Classes</h1>

      <div className="mt-4 mb-10 p-5 border border-gray-200 rounded-xl bg-yellow-50">
        <h2 className="text-2xl font-bold mb-4 text-cyan-600 border-b pb-2">
          Classes Currently In Use ({inUseClasses.length})
        </h2>

        {inUseClasses.length === 0 ? (
          <p className="text-gray-500 italic">No classes are currently in use.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {inUseClasses.map((cls) => (
              <div
                key={cls.id}
                className="border-l-4 border-green-500 rounded-lg p-4 bg-white shadow-sm"
              >
                <h3 className="font-bold text-xl mb-1 text-orange-800">
                  {cls.name}
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Status: <span className="font-semibold">{cls.status}</span>
                </p>
                <button
                  onClick={() => handleFinish(cls.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors"
                >
                  Mark as Finished & Set to Available
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================== */}
      {/* 📦 BAGIAN SEMUA KELAS (ALL CLASSES) */}
      {/* ============================== */}
      <h2 className="text-2xl font-bold mb-4 text-teal-700">All Class Status</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="font-semibold text-lg mb-2">{cls.name}</h2>

            {editingId === cls.id ? (
              <div className="space-y-3">
                <select
                  value={currentStatus}
                  onChange={(e) =>
                    setCurrentStatus(e.target.value as ClassStatus)
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="In Use">In Use</option>
                </select>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSave(cls.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Status: <span className="font-medium">{cls.status}</span>
                </p>
                <div className="space-x-2">
                  {cls.status === "Available" && (
                    <button
                      onClick={() => handleApprove(cls.id)}
                      className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(cls)}
                    className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
                  >
                    Edit Status
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ============================== */}
      {/* 📜 BAGIAN LOG BOOKING PENGGUNA (USER BOOKING LOG) */}
      {/* ============================== */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Booking Log</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">User</TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Class Name</TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userBookings.map((booking) => (
                <TableRow key={booking.id} className="border-b border-gray-200">
                  <TableCell className="px-4 py-2 text-sm text-gray-800">{booking.username}</TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-600">{booking.className}</TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-600">{booking.date}</TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-600">{booking.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
