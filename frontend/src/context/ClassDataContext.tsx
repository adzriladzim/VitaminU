import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ClassData, classesForLabSection } from '../data/classData';

// Definisikan Tipe untuk Log Pemesanan
interface UserLog {
  id: number;
  username: string;
  className: string;
  date: string;
  status: string; // Deskripsi aksi
}

interface ClassDataContextType {
  classes: ClassData[];
  userLogs: UserLog[];
  updateClassStatus: (id: number, newStatus: "Available" | "Booked" | "In Use") => void;
  addUserLog: (username: string, classItemName: string, action: string) => void;
  bookClass: (id: number, userName: string) => boolean;
  approveClass: (id: number) => void;
  finishClass: (id: number) => void;
  updateClassManually: (id: number, newStatus: "Available" | "Booked" | "In Use") => void;
}

const ClassDataContext = createContext<ClassDataContextType | undefined>(undefined);

export const useClassData = () => {
  const context = useContext(ClassDataContext);
  if (!context) {
    throw new Error('useClassData must be used within a ClassDataProvider');
  }
  return context;
};

export const ClassDataProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<ClassData[]>(() => [...classesForLabSection]);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);

  const updateClassStatus = useCallback((id: number, newStatus: "Available" | "Booked" | "In Use") => {
    setClasses(prevClasses => {
      return prevClasses.map(cls => 
        cls.id === id ? { ...cls, status: newStatus } : cls
      );
    });
  }, []);

  const addUserLog = useCallback((username: string, classItemName: string, action: string) => {
    const newLog: UserLog = {
      id: Date.now(),
      username: username,
      className: classItemName,
      date: new Date().toLocaleString('id-ID'), // Menggunakan format lokal
      status: action,
    };
    // Tambahkan log baru di paling atas
    setUserLogs(prevLogs => {
      // Create new array to ensure React detects the change
      return [newLog, ...prevLogs];
    });
  }, []);

  const bookClass = useCallback((id: number, userName: string): boolean => {
    // Note: 'classes' here refers to the value at the time this function is created
    // We need to pass the current classes state or find a way to access fresh data
    setClasses(prevClasses => {
      const bookedClass = prevClasses.find((cls: ClassData) => cls.id === id);

      if (!bookedClass || bookedClass.status !== 'Available') {
        alert(`Booking failed. Class ${bookedClass?.name} is ${bookedClass?.status}.`);
        return prevClasses; // Return the same array to avoid update
      }

      // Update status to 'Booked' in the new array
      const newClasses = prevClasses.map(cls => 
        cls.id === id ? { ...cls, status: 'Booked' as const } : cls
      );
      
      // Add log entry separately
      const logEntry: UserLog = {
        id: Date.now(),
        username: userName,
        className: bookedClass.name,
        date: new Date().toLocaleString('id-ID'),
        status: 'Requested Booking (Status: Booked)'
      };
      setUserLogs(prevLogs => [logEntry, ...prevLogs]);
      
      // In a real app, we would use a more sophisticated notification system
      console.log(`Successfully booked ${bookedClass.name}! Waiting for Admin approval.`);
      
      return newClasses;
    });
    
    return true;
  }, []);

  const approveClass = useCallback((id: number) => {
    setClasses(prevClasses => {
      const approvedClass = prevClasses.find(cls => cls.id === id);
      
      if (!approvedClass) return prevClasses;

      // Update status to 'In Use' in the new array
      const newClasses = prevClasses.map(cls => 
        cls.id === id ? { ...cls, status: 'In Use' as const } : cls
      );
      
      // Add log entry separately
      const logEntry: UserLog = {
        id: Date.now(),
        username: "Admin",
        className: approvedClass.name,
        date: new Date().toLocaleString('id-ID'),
        status: 'Request Approved (Status: In Use)'
      };
      setUserLogs(prevLogs => [logEntry, ...prevLogs]);
      
      return newClasses;
    });
  }, []);

  const finishClass = useCallback((id: number) => {
    setClasses(prevClasses => {
      const finishedClass = prevClasses.find(cls => cls.id === id);
      
      if (!finishedClass) return prevClasses;

      // Update status to 'Available' in the new array
      const newClasses = prevClasses.map(cls => 
        cls.id === id ? { ...cls, status: 'Available' as const } : cls
      );
      
      // Add log entry separately
      const logEntry: UserLog = {
        id: Date.now(),
        username: "Admin",
        className: finishedClass.name,
        date: new Date().toLocaleString('id-ID'),
        status: 'Finished. Status set to Available'
      };
      setUserLogs(prevLogs => [logEntry, ...prevLogs]);
      
      return newClasses;
    });
  }, []);

  const updateClassManually = useCallback((id: number, newStatus: "Available" | "Booked" | "In Use") => {
    setClasses(prevClasses => {
      const cls = prevClasses.find(c => c.id === id);
      if (!cls) return prevClasses;

      // Update status to newStatus in the new array
      const newClasses = prevClasses.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      );
      
      // Add log entry separately
      const logEntry: UserLog = {
        id: Date.now(),
        username: "Admin",
        className: cls.name,
        date: new Date().toLocaleString('id-ID'),
        status: `Status manually changed to ${newStatus}`
      };
      setUserLogs(prevLogs => [logEntry, ...prevLogs]);
      
      return newClasses;
    });
  }, []);

  return (
    <ClassDataContext.Provider value={{ 
      classes, 
      userLogs,
      updateClassStatus,
      addUserLog,
      bookClass,
      approveClass,
      finishClass,
      updateClassManually
    }}>
      {children}
    </ClassDataContext.Provider>
  );
};