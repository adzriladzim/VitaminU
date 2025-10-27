import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ClassData, classesForLabSection } from '../data/classData';
import apiClient from '../lib/apiClient';

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
  bookClassWithTime: (id: number, userName: string, startTime: string, endTime: string, className: string) => void;
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
    alert('Please use the time-based booking form to make a reservation with specific times.');
    return false;
  }, []);

  const bookClassWithTime = useCallback(async (id: number, userName: string, startTime: string, endTime: string, className: string) => {
    // Convert the datetime-local strings to ISO format for the API
    const startDateTime = new Date(startTime).toISOString();
    const endDateTime = new Date(endTime).toISOString();
    
    // Validate that end time is after start time
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      alert('End time must be after start time');
      return;
    }

    try {
      // Make API call to create the booking
      const response = await apiClient.post('/bookings/', {
        room_id: id,
        start_time: startDateTime,
        end_time: endDateTime
      });

      // Add log entry separately (without changing room status)
      const logEntry: UserLog = {
        id: Date.now(),
        username: userName,
        className: className,
        date: `${startDateTime} to ${endDateTime}`,
        status: 'Time-based Booking Requested'
      };
      setUserLogs(prevLogs => [logEntry, ...prevLogs]);
      
      console.log(`Successfully booked ${className} from ${startDateTime} to ${endDateTime}! Waiting for Admin approval.`);
      
      alert('Booking request submitted successfully! Please wait for admin approval.');
    } catch (error: any) {
      console.error('Booking error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        alert(`Booking failed: ${error.response.data.detail || 'Server error'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.log('Request object:', error.request);
        alert('Error: No response from server. Please check if the backend is running on http://localhost:8000.');
      } else {
        // Something else happened
        console.log('General error:', error.message);
        alert(`Booking error: ${error.message}`);
      }
    }
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
      bookClassWithTime,
      approveClass,
      finishClass,
      updateClassManually
    }}>
      {children}
    </ClassDataContext.Provider>
  );
};