// src/data/userBookings.ts

export interface UserBooking {
  id: number;
  username: string;
  className: string;
  date: string;
  status: "Finished" | "In Progress" | "Booked";
}

export const userBookings: UserBooking[] = [
  {
    id: 1,
    username: "John Doe",
    className: "Class A",
    date: "10 Oct 2025",
    status: "Finished",
  },
  {
    id: 2,
    username: "Jane Smith",
    className: "Class B",
    date: "12 Oct 2025",
    status: "Finished",
  },
  {
    id: 3,
    username: "Peter Jones",
    className: "Class C",
    date: "15 Oct 2025",
    status: "In Progress",
  },
  {
    id: 4,
    username: "Mary Jane",
    className: "Class D",
    date: "20 Oct 2025",
    status: "Booked",
  },
];
