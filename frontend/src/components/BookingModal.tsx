import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  onBook: (classId: string, startTime: string, endTime: string, className: string) => void;
}

// Fungsi bantu untuk memformat Date object kembali ke format datetime-local (YYYY-MM-DDThh:mm)
// dengan menggunakan komponen Waktu LOKAL.
const formatLocalDatetime = (date: Date): string => {
  const year = date.getFullYear();
  // getMonth() mengembalikan nilai 0-11, jadi perlu ditambah 1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  classId,
  className,
  onBook
}) => {
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1); // in hours, default 1 hour
  const [endTime, setEndTime] = useState<string>('');

  // Perbaikan Logic: Menggunakan formatLocalDatetime
  useEffect(() => {
    if (startTime) {
      // 1. Membuat Date object. Karena input dari datetime-local,
      //    start di-parse sebagai waktu lokal (sesuai yang kita inginkan).
      const start = new Date(startTime);

      // 2. Clone objek tanggal untuk perhitungan
      const end = new Date(start);

      end.setHours(start.getHours() + duration);
      setEndTime(formatLocalDatetime(end));
    } else {
      setEndTime('');
    }
  }, [startTime, duration]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startTime && endTime) {
      onBook(classId, startTime, endTime, className);
      onClose();
    }
  };

  return (
    // Backdrop yang lebih gelap dan blur
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl border border-gray-300 animate-in fade-in-0 zoom-in-95">
        <CardHeader className="relative pr-10">
          <CardTitle className="text-2xl font-bold text-cyan-700">Book Class: {className}</CardTitle>
          <CardDescription>Pilih waktu mulai dan durasi untuk sesi kelas Anda.</CardDescription>
          {/* Tombol Tutup dengan Icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-300"
          >
            <X className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Start Time */}
              <div className="space-y-2">
                <Label htmlFor="start-time">Waktu Mulai</Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={startTime}
                  className='border-cyan-400'
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              {/* Select Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (Jam)</Label>
                <Select

                  value={duration.toString()}

                  onValueChange={(value) => setDuration(Number(value))}

                >
                  <SelectTrigger className="w-full border-cyan-400">
                    <SelectValue placeholder="Pilih durasi"  />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    <SelectItem value="1">1 Jam</SelectItem>
                    <SelectItem value="2">2 Jam</SelectItem>
                    <SelectItem value="3">3 Jam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Input End Time (Calculated) */}
            <div className="space-y-2">
              <Label>Waktu Selesai (Otomatis)</Label>
              <Input
                type="datetime-local"
                value={endTime}
                readOnly
                className="bg-cyan-50/50 border-cyan-200 text-cyan-800 font-medium cursor-not-allowed"
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end space-x-3  pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="hover:bg-gray-300 border-gray-300 shadow-sm"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={!startTime || !endTime} // Disabled jika waktu belum dipilih
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
              >
                Konfirmasi Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingModal;
