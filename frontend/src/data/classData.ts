export type ClassStatus = "Available" | "Booked" | "In Use";

export interface ClassData {
    id: number;
    name: string;
    status: ClassStatus;
    image: string;
    location: string;
    description?: string; // Optional description field
}

// Data for the LabSection component
export const classesForLabSection: ClassData[] = [
    {
        id: 1,
        name: 'Lab Komputer A',
        status: 'Available' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop',
        description: 'Ruang laboratorium dengan 30 unit komputer terbaru'
    },
    {
        id: 2,
        name: 'Lab Komputer B',
        status: 'Booked' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=300&fit=crop',
        description: 'Laboratorium dengan fasilitas multimedia'
    },
    {
        id: 3,
        name: 'Lab Komputer C',
        status: 'In Use' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
        description: 'Laboratorium jaringan dan server'
    },
    {
        id: 4,
        name: 'Lab Multimedia',
        status: 'Available' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop',
        description: 'Laboratorium multimedia dan desain grafis'
    },
    {
        id: 5,
        name: 'Lab Jaringan',
        status: 'In Use' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&h=300&fit=crop',
        description: 'Laboratorium jaringan komputer dan telekomunikasi'
    },
    {
        id: 6,
        name: 'Lab Programming',
        status: 'Available' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=300&fit=crop',
        description: 'Laboratorium pemrograman dan pengembangan software'
    }
];

// Keep the initialClasses for compatibility with other components
export const initialClasses: ClassData[] = [
    {
        id: 1,
        name: 'Lab Komputer 1',
        status: 'Available' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://plus.unsplash.com/premium_photo-1673545518947-ddf3240090b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
    },
    {
        id: 2,
        name: 'Lab Komputer 2',
        status: 'Booked' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://plus.unsplash.com/premium_photo-1673545518947-ddf3240090b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
    },
    {
        id: 3,
        name: 'Lab Komputer 3',
        status: 'Booked' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://plus.unsplash.com/premium_photo-1673545518947-ddf3240090b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
    },
    {
        id: 4,
        name: 'Lab Komputer 4',
        status: 'In Use' as ClassStatus,
        location: 'Sumbawa',
        image: 'https://plus.unsplash.com/premium_photo-1673545518947-ddf3240090b1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
    }
];
