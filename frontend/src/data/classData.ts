// Definisikan tipe dan interface di sini
export type ClassStatus = 'Available' | 'Booked' | 'Pending' | 'In Use';

export interface ClassData {
  id: number;
  name: string;
  status: ClassStatus;
}

// Definisikan dan ekspor data awal
export const initialClasses: ClassData[] = [
  { id: 1, name: "Lab Komputer 1", status: "Available" },
  { id: 2, name: "Lab Komputer 2", status: "Booked" },
  { id: 3, name: "Ruang Rapat A", status: "Pending" },
  { id: 4, name: "Aula Utama", status: "Available" },
];
