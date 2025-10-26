// Type matching the GET /rooms response
export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string | null;
  location: string;
  status: 'available' | 'in_use' | 'maintenance' | 'pending' | 'approved' | 'rejected' | 'canceled' | 'booked';
  image_url: string | null;
}

export interface BookingCreatePayload {
  room_id: string;
  start_time: string;
  end_time: string;
  status?: 'pending' | 'approved' | 'rejected' | 'canceled';
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
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
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
}