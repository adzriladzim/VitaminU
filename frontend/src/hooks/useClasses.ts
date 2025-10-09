import { useState } from "react";
// Impor tipe dan data dari file yang baru kita buat
import { ClassData, ClassStatus, initialClasses } from "../data/classData";

// Nama fungsi hook biasanya diawali dengan "use"
export function useClasses() {
  // Semua state dipindahkan ke sini
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ClassStatus>('Available');

  // Semua fungsi handler juga dipindahkan ke sini
  const handleApprove = (id: number) => {
    setClasses(classes.map(cls =>
      cls.id === id ? { ...cls, status: 'In Use' } : cls
    ));
  };

  const handleEditClick = (cls: ClassData) => {
    setEditingId(cls.id);
    setCurrentStatus(cls.status);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = (id: number) => {
    setClasses(classes.map(cls =>
      cls.id === id ? { ...cls, status: currentStatus } : cls
    ));
    setEditingId(null);
  };

  // Kembalikan semua state dan fungsi yang dibutuhkan oleh UI
  return {
    classes,
    editingId,
    currentStatus,
    setCurrentStatus,
    handleApprove,
    handleEditClick,
    handleCancel,
    handleSave,
  };
}
