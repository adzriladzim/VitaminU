export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string | null;
  location: string;
  status: 'available' | 'in_use' | 'maintenance' | 'pending' | 'approved' | 'rejected' | 'canceled' | 'booked' | 'completed';
  image_url: string | null;
}

export interface BookingCreatePayload {
  room_id: string;
  start_time: string;
  end_time: string;
  status?: 'pending' | 'approved' | 'rejected' | 'canceled' | 'completed';
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
}

export interface Booking {
  id: string; 
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'canceled' |'completed';
  owner: {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'student';
  };
  room: {
    id: string;
    name: string;
  };
  updated_by_admin?: { 
    id: string;
    full_name: string | null;
    email: string;
  };
}