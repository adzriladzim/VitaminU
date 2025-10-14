// src/data/logs.ts

export interface Log {
  id: number;
  admin: string;
  action: string;
  time: string;
  date: string;
}

export const logs: Log[] = [
  {
    id: 1,
    admin: "Khidhir",
    action: "Approved Class A",
    time: "10:30 AM",
    date: "14 Oct 2025",
  },
  {
    id: 2,
    admin: "Aisyah",
    action: "Approved Class B",
    time: "01:45 PM",
    date: "14 Oct 2025",
  },
  {
    id: 3,
    admin: "Ahmad",
    action: "Approved Class C",
    time: "09:10 AM",
    date: "13 Oct 2025",
  },
  {
    id: 3,
    admin: "Ahmad",
    action: "Approved Class C",
    time: "09:10 AM",
    date: "13 Oct 2025",
  },
  {
    id: 3,
    admin: "Ahmad",
    action: "Approved Class C",
    time: "09:10 AM",
    date: "13 Oct 2025",
  },
];
