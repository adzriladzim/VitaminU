import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/apiClient";
import { Room, Booking } from "@/types";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { toZonedTime, format as formatTz } from "date-fns-tz";

type ClassStatus = "available" | "maintenance";

export default function ManageClass() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // ID sekarang UUID (string)
  const [currentStatus, setCurrentStatus] = useState<ClassStatus>("available");
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ambil data ruangan dan booking secara paralel
        const [roomsRes, bookingsRes] = await Promise.all([
          apiClient.get<Room[]>("/rooms/"), 
          apiClient.get<Booking[]>("/bookings/"),
        ]);
        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (bookingId: string) => {
    setError(null);
    try {
      await apiClient.put(`/bookings/${bookingId}/status`, {
        status: "approved",
      });
      // Update state booking lokal atau fetch ulang data
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "approved" } : b))
      );
      // Mungkin perlu fetch ulang rooms juga jika status room berubah jadi 'booked'/'in_use'
      alert("Booking approved successfully!");
      // Reload data rooms untuk update status dinamis
      const roomsRes = await apiClient.get<Room[]>("/rooms/");
      setRooms(roomsRes.data);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to approve booking.";
      setError(msg);
      alert(`Error: ${msg}`);
    }
  };

  const handleReject = async (bookingId: string) => {
    setError(null);
    try {
      await apiClient.put(`/bookings/${bookingId}/status`, {
        status: "rejected",
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "rejected" } : b))
      );
      alert("Booking rejected.");
      // Reload data rooms mungkin diperlukan jika status room bergantung pada pending
      const roomsRes = await apiClient.get<Room[]>("/rooms/");
      setRooms(roomsRes.data);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to reject booking.";
      setError(msg);
      alert(`Error: ${msg}`);
    }
  };

  // Fungsi untuk memulai edit status ruangan
  const handleEditClick = (room: Room) => {
    setEditingId(room.id);
    setCurrentStatus(
      room.status === "maintenance" ? "maintenance" : "available"
    );
  };
  const handleCancel = () => {
    setEditingId(null);
  };

  // Fungsi untuk menyimpan perubahan status ruangan
  const handleSaveStatus = async (roomId: string) => {
    setError(null);
    try {
      // Panggil endpoint PUT /rooms/{room_id}
      await apiClient.put(`/rooms/${roomId}`, { status: currentStatus });
      // Update state rooms lokal atau fetch ulang
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, status: currentStatus } : r))
      );
      setEditingId(null); // Keluar dari mode edit
      alert("Room status updated successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to update room status.";
      setError(msg);
      alert(`Error: ${msg}`);
    }
  };

  // Fungsi untuk menandai kelas selesai (mengubah status jadi Available)
  const handleMarkFinished = async (roomId: string) => {
    setError(null);
    try {
      await apiClient.put(`/rooms/${roomId}`, { status: "available" });
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, status: "available" } : r))
      );
      alert("Room marked as finished and available.");
    } catch (err: any) {
      const msg =
        err.response?.data?.detail || "Failed to mark room as finished.";
      setError(msg);
      alert(`Error: ${msg}`);
    }
  };

  // Fungsi untuk menghapus kelas
  const handleDelete = async (roomId: string, roomName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete room "${roomName}"? This action cannot be undone.`
      )
    ) {
      setError(null);
      try {
        // Panggil endpoint DELETE /rooms/{room_id}
        await apiClient.delete(`/rooms/${roomId}`);
        // Hapus room dari state lokal
        setRooms((prev) => prev.filter((r) => r.id !== roomId));
        alert(`Room "${roomName}" deleted successfully!`);
      } catch (err: any) {
        const msg = err.response?.data?.detail || "Failed to delete room.";
        setError(msg);
        alert(`Error: ${msg}`);
      }
    }
  };

  // --- Logika Filter (Untuk bagian 'Currently In Use') ---
  // Status 'in_use' didapat dari backend
  const inUseClasses = rooms.filter((room) => room.status === "in_use");

  // --- Render ---
  if (isLoading) return <div>Loading dashboard data...</div>;
  // Tampilkan error global jika ada
  if (error && !isLoading)
    return <div className="text-red-600">Error: {error}</div>;

  // --- Cari Booking Pending untuk Ditampilkan ---
  // Kita perlu data booking untuk menampilkan tombol Approve/Reject
  const pendingBookingsMap = new Map<string, Booking>();
  bookings.forEach((booking) => {
    if (booking.status === "pending") {
      // Asumsi hanya satu pending booking per ruangan,
      // jika bisa > 1, logikanya perlu disesuaikan
      pendingBookingsMap.set(booking.room.id, booking);
    }
  });

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-700">Manage Classes</h1>

      {/* Tampilkan error global jika fetch awal gagal tapi loading selesai */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      {/* ============================== */}
      {/* 💡 BAGIAN 1: KELAS YANG SEDANG DIGUNAKAN (ACTIVE BOOKINGS) */}
      {/* ============================== */}
      <div className="mt-4 mb-10 p-5 border border-gray-200 rounded-xl bg-yellow-50">
        <h2 className="text-2xl font-bold mb-4 text-cyan-600 border-b pb-2">
          ⏳ Classes Currently In Use ({inUseClasses.length})
        </h2>

        {inUseClasses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No classes are currently in use.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inUseClasses.map((room) => (
              <div
                key={room.id}
                className="border-l-4 border-yellow-500 rounded-lg p-4 bg-white dark:bg-gray-700 shadow-sm"
              >
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">
                  {room.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Status:{" "}
                  <span className="font-medium text-yellow-700 dark:text-yellow-400">
                    {room.status}
                  </span>
                </p>
                <Button
                  onClick={() => handleMarkFinished(room.id)}
                  variant="outline" // Ganti variant sesuai design system
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5"
                >
                  ✅ Mark as Finished & Set to Available
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================== */}
      {/* 📦 BAGIAN 2: SEMUA KELAS (ALL CLASSES) */}
      {/* ============================== */}
      <h2 className="text-2xl font-bold mb-4 text-teal-700">
        All Class Status
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {rooms.map((room) => {
          const pendingBooking = pendingBookingsMap.get(room.id);
          return (
            <div
              key={room.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="font-semibold text-lg mb-2">{room.name}</h2>

              {editingId === room.id ? (
                <div className="space-y-3">
                  {/* Gunakan komponen Select dari UI library Anda */}
                  <Select
                    value={currentStatus}
                    // Pastikan onValueChange sesuai komponen Select Anda
                    onValueChange={(value) =>
                      setCurrentStatus(value as ClassStatus)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Opsi hanya yang bisa di-set admin */}
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="space-x-2">
                    <button
                      // Panggil handleSaveStatus dengan ID room yang benar
                      onClick={() => handleSaveStatus(room.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm" // Kecilkan tombol
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm" // Kecilkan tombol
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Status: <span className="font-medium">{room.status}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Tombol Approve/Reject hanya muncul jika ADA booking pending */}
                    {pendingBooking && (
                      <>
                        <button
                          // Gunakan ID dari objek pendingBooking
                          onClick={() => handleApprove(pendingBooking.id)}
                          className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 text-xs" // Kecilkan tombol
                        >
                          Approve Request
                        </button>
                        <button
                          onClick={() => handleReject(pendingBooking.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs" // Kecilkan tombol
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {!pendingBooking && (
                      <>
                        <button
                          // Gunakan objek 'room' untuk handleEditClick
                          onClick={() => handleEditClick(room)}
                          className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 text-xs" // Kecilkan tombol
                        >
                          Edit Status
                        </button>
                        <button
                          // Panggil handleDelete dengan ID dan nama room
                          onClick={() => handleDelete(room.id, room.name)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs" // Kecilkan tombol
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ============================== */}
      {/* 📜 BAGIAN 3: USER BOOKING LOG (Dinamis) */}
      {/* ============================== */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          User Booking Log
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  User
                </TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Class Name
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Start Time (WIB)
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  End Time (WIB)
                </TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No booking logs found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings
                  .sort(
                    (a, b) =>
                      new Date(b.start_time).getTime() -
                      new Date(a.start_time).getTime()
                  ) // Urutkan terbaru dulu
                  .map((booking) => {
                    const timeZone = "Asia/Jakarta"; // Zona Waktu Indonesia Barat
                    let startTimeWibFormatted = "Invalid Date";
                    let endTimeWibFormatted = "Invalid Date";

                    try {
                      // Buat objek Date dari string ISO (asumsi UTC dari backend)
                      const startTimeUtc = new Date(booking.start_time);
                      const endTimeUtc = new Date(booking.end_time);

                      // Konversi ke zona waktu WIB
                      const startTimeWib = toZonedTime(
                        startTimeUtc,
                        timeZone
                      );
                      const endTimeWib = toZonedTime(endTimeUtc, timeZone);

                      // Format waktu WIB
                      startTimeWibFormatted = formatTz(startTimeWib, "Pp", {
                        timeZone,
                      }); // 'Pp' = Tanggal pendek + Waktu panjang
                      endTimeWibFormatted = formatTz(endTimeWib, "Pp", {
                        timeZone,
                      });
                    } catch (e) {
                      console.error(
                        "Error formatting date:",
                        e,
                        booking.start_time,
                        booking.end_time
                      );
                    }
                    return (
                      <TableRow
                        key={booking.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {/* Asumsi 'owner' dan 'room' ada di data booking dari API */}
                        <TableCell className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {booking.owner?.full_name ||
                            booking.owner?.email ||
                            "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {booking.room?.name || "N/A"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(booking.start_time), "Pp")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(booking.end_time), "Pp")}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm font-medium">
                          {/* Beri warna status */}
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : booking.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : booking.status === "canceled"
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                : ""
                            }`}
                          >
                            {booking.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
