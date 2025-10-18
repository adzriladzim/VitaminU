import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School } from "lucide-react";
import { logs } from "@/data/logs";

export default function Overview() {
  return (
    <div className="p-6 space-y-6">
      {/* Top Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 border-t-4 border-orange-600 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-md font-medium text-center">In Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <School className="text-orange-600 h-8 w-8" />
              <div className="text-4xl font-bold">20</div>
              <p className="text-sm text-muted-foreground">kelas yang digunakan saat ini</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 border-t-4 border-green-600 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-md font-medium text-center">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <School className="text-green-600 h-8 w-8" />
              <div className="text-4xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">kelas yang tersedia</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 border-t-4 border-gray-600 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-md font-medium text-center">Booked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <School className="text-gray-600 h-8 w-8" />
              <div className="text-4xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">kelas sedang diperbaiki</p>
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
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Admin</TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Time</TableHead>
                <TableHead className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-b border-gray-200">
                  <TableCell className="px-4 py-2 text-sm text-gray-800">{log.admin}</TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-600">{log.action}</TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-600">{log.time}</TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-600">{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}
