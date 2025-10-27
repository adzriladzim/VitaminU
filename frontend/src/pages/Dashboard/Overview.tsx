import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { School } from "lucide-react";
import { logs } from "@/data/logs";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { Room, Booking } from "@/types";
import { format as formatTz, toZonedTime } from "date-fns-tz";

export default function Overview() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ambil data ruangan dan semua booking (endpoint admin) secara bersamaan
        const [roomsRes, bookingsRes] = await Promise.all([
          apiClient.get<Room[]>("/rooms/"),
          apiClient.get<Booking[]>("/bookings/"), // Pastikan ini endpoint admin
        ]);
        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
        setError("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateSummary = () => {
    const inUseCount = rooms.filter((r) => r.status === "in_use").length;
    const availableCount = rooms.filter((r) => r.status === "available").length;
    const maintenanceCount = rooms.filter(
      (r) => r.status === "maintenance"
    ).length;
    return { inUseCount, availableCount, maintenanceCount };
  };

  const summary = calculateSummary();

  if (isLoading) {
    return <div className="p-6 text-center">Loading dashboard data...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }
  return (
    <div className="p-6 space-y-6">
      {/* Top Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 border-t-4 border-orange-600 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-md font-medium text-center">
              In Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <School className="text-orange-600 h-8 w-8" />
              <div className="text-4xl font-bold">{summary.inUseCount}</div>
              <p className="text-sm text-muted-foreground">
                kelas yang digunakan saat ini
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 border-t-4 border-green-600 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-md font-medium text-center">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <School className="text-green-600 h-8 w-8" />
              <div className="text-4xl font-bold">{summary.availableCount}</div>
              <p className="text-sm text-muted-foreground">
                kelas yang tersedia
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 border-t-4 border-gray-600 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-md font-medium text-center">
              Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <School className="text-gray-600 h-8 w-8" />
              <div className="text-4xl font-bold">
                {summary.maintenanceCount}
              </div>
              <p className="text-sm text-muted-foreground">
                kelas sedang diperbaiki
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Activity Logs</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Admin
                </TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Action
                </TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Time
                </TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                bookings
                  .filter((log) => log.status !== "pending") // Hanya tampilkan yg sudah di-aksi
                  .sort(/* ... sort logic ... */)
                  .slice(0, 10)
                  .map((log) => {
                    // Tentukan teks "Action"
                    let actionText = `Requested ${log.room?.name || "room"}`;
                    if (log.status === "approved")
                      actionText = `Approved: ${log.room?.name || "room"}`;
                    if (log.status === "rejected")
                      actionText = `Rejected: ${log.room?.name || "room"}`;
                    if (log.status === "canceled")
                      actionText = `Canceled: ${log.room?.name || "room"}`;
                    if (log.status === "completed")
                      actionText = `Finished: ${log.room?.name || "room"}`;

                    // Format waktu ke WIB
                    const timeZone = "Asia/Jakarta";
                    let logTimeWib = "-";
                    let logDateWib = "-";
                    try {
                      // Gunakan start_time sebagai waktu log (atau updated_at jika ada)
                      const logDateTimeUtc = new Date(log.start_time); // Asumsi UTC dari backend
                      const logDateTimeWib = toZonedTime(
                        logDateTimeUtc,
                        timeZone
                      );
                      logTimeWib = formatTz(logDateTimeWib, "p", { timeZone }); // Format: 10:30 AM
                      logDateWib = formatTz(logDateTimeWib, "PP", { timeZone }); // Format: Oct 26, 2025
                    } catch (e) {
                      console.error("Date format error:", e);
                    }

                    const adminName =
                      log.updated_by_admin?.full_name ||
                      log.updated_by_admin?.email;
                    return (
                      <TableRow
                        key={log.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {/* Tampilkan nama user yang booking */}
                        <TableCell className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {adminName}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {actionText}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {logTimeWib}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {logDateWib}
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
