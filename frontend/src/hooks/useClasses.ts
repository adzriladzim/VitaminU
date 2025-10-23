// File: src/hooks/useClasses.ts

import { useState } from "react";
// Pastikan Anda memiliki tipe dan data ini, misalnya dari ../data/classData
import { ClassData, ClassStatus, initialClasses } from "../data/classData";
import { useAuth } from './useAuth'; // Import hook otentikasi (Auth) Anda di sini


// Definisikan Tipe untuk Log Pemesanan
interface UserLog {
  id: number;
  username: string;
  className: string;
  date: string;
  status: string; // Deskripsi aksi
}

// Data Log Awal (Bisa kosong atau dummy logs)
const initialLogs: UserLog[] = [];


export function useClasses() {
  const { user, isLoggedIn } = useAuth(); // Get authentication state
  // Use initialClasses as the starting point but allow it to be updated
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ClassStatus>('Available');
  const [userLogs, setUserLogs] = useState<UserLog[]>(initialLogs); // 💡 State Log

  // 💡 FUNGSI BANTU untuk Menambahkan Log
  const addUserLog = (username: string, classItemName: string, action: string) => {
    const newLog: UserLog = {
      id: Date.now(),
      username: username,
      className: classItemName,
      date: new Date().toLocaleString('id-ID'), // Menggunakan format lokal
      status: action,
    };
    // Tambahkan log baru di paling atas
    setUserLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // 💡 FUNGSI BARU: Logika Pemesanan dari Sisi User/Frontend
  const handleBook = (id: number, userName: string) => {
    // Periksa apakah user sudah login
    if (!isLoggedIn) {
      alert('Anda harus login terlebih dahulu untuk melakukan pemesanan.');
      // Dalam konteks hook, kita tidak dapat menggunakan navigation secara langsung
      // Dev harus menangani redirect di komponen
      return false;
    }

    // Pastikan bookedClass memiliki tipe ClassData
    const bookedClass = classes.find((cls: ClassData) => cls.id === id);

    if (!bookedClass || bookedClass.status !== 'Available') {
      alert(`Booking failed. Class ${bookedClass?.name} is ${bookedClass?.status}.`);
      return false;
    }

    // Terapkan tipe eksplisit pada prevClasses dan cls
    setClasses((prevClasses: ClassData[]) => prevClasses.map((cls: ClassData) => {
      if (cls.id === id) {
        return { ...cls, status: 'Booked' };
      }
      return cls;
    }));

    addUserLog(userName, bookedClass.name, 'Requested Booking (Status: Booked)');
    alert(`Successfully booked ${bookedClass.name}! Waiting for Admin approval.`);
    return true;
  };

  // 💡 FUNGSI ADMIN: handleApprove (Admin mengubah dari Booked ke In Use, dan logging)
  // Terapkan tipe eksplisit pada prevClasses dan cls
  const handleApprove = (id: number) => {
    setClasses((prevClasses: ClassData[]) => prevClasses.map((cls: ClassData) => {
      if (cls.id === id) {
        addUserLog("Admin", cls.name, 'Request Approved (Status: In Use)');
        return { ...cls, status: 'In Use' };
      }
      return cls;
    }));
  };

  // 💡 FUNGSI ADMIN: handleSave (logging)
  // Terapkan tipe eksplisit pada prevClasses dan cls
  const handleSave = (id: number) => {
    setClasses((prevClasses: ClassData[]) => prevClasses.map((cls: ClassData) => {
      if (cls.id === id) {
        addUserLog("Admin", cls.name, `Status manually changed to ${currentStatus}`);
        return { ...cls, status: currentStatus };
      }
      return cls;
    }));
    setEditingId(null);
  };

  // 💡 FUNGSI ADMIN: handleFinish (logging)
  // Terapkan tipe eksplisit pada prevClasses dan cls
  const handleFinish = (id: number) => {
    setClasses((prevClasses: ClassData[]) => prevClasses.map((cls: ClassData) => {
      if (cls.id === id) {
        addUserLog("Admin", cls.name, 'Finished. Status set to Available');
        return { ...cls, status: 'Available' };
      }
      return cls;
    }));
  };

  // (handleEditClick, handleCancel tetap sama)
  const handleEditClick = (cls: ClassData) => { setEditingId(cls.id); setCurrentStatus(cls.status); };
  const handleCancel = () => { setEditingId(null); };

  return {
    classes,
    editingId,
    currentStatus,
    setCurrentStatus,
    handleApprove,
    handleEditClick,
    handleCancel,
    handleSave,
    handleFinish,
    handleBook,
    userLogs,
  };
}
