import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School } from "lucide-react";
import { logs } from "@/data/Logs";

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
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center font-semibold">Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table className="min-w-full border border-gray-200 rounded-md overflow-hidden shadow-sm">
  <TableHeader>
    <TableRow className="bg-orange-50 text-gray-700 text-sm uppercase">
      <TableHead className="py-3 px-4 font-semibold text-center">Admin</TableHead>
      <TableHead className="py-3 px-4 font-semibold text-center">Action</TableHead>
      <TableHead className="py-3 px-4 font-semibold text-center">Time</TableHead>
      <TableHead className="py-3 px-4 font-semibold text-center">Date</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {logs.map((log, index) => (
      <TableRow
        key={log.id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        } hover:bg-orange-100/50 transition-colors duration-200`}
      >
        <TableCell className="py-3 px-4 text-gray-800 font-medium text-center">
          {log.admin}
        </TableCell>
        <TableCell className="py-3 px-4 text-gray-600 text-center">
          {log.action}
        </TableCell>
        <TableCell className="py-3 px-4 text-gray-600 text-center">
          {log.time}
        </TableCell>
        <TableCell className="py-3 px-4 text-gray-600 text-center">
          {log.date}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
