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
  status?: string
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
}