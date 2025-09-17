import Navbar from '@/frontend/components/Navbar';
import Card from './frontend/components/Card';

function App() {
  const labs = [
    {
      title: 'Lab Komputer 1',
      description: 'Ruang 40 PC',
      image: '/images/lab1.jpg',
      status: 'booked' as const,
    },
    {
      title: 'Lab Komputer 2',
      description: 'Ruang 35 PC',
      image: '/images/lab2.jpg',
      status: 'in use' as const,
    },
    {
      title: 'Lab Komputer 3',
      description: 'Ruang 50 PC',
      image: '/images/lab3.jpg',
      status: 'available' as const,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {labs.map((lab, i) => (
            <Card
              key={i}
              title={lab.title}
              description={lab.description}
              image={lab.image}
              status={lab.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
