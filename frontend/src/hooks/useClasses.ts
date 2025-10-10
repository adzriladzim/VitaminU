import { useState } from "react";
import { ClassData, ClassStatus, initialClasses } from "../data/classData";

export function useClasses() {
  // Semua state dipindahkan ke sini
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ClassStatus>('Available');


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
