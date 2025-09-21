import Navbar from '@/frontend/components/Navbar';
import Hero from '@/frontend/components/Hero';
import Card from './frontend/components/Card';

function App() {
  const labs = [
    {
      title: 'Lab Komputer 1',
      description: 'Ruang 40 PC',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'booked' as const,
    },
    {
      title: 'Lab Komputer 2',
      description: 'Ruang 35 PC',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'in use' as const,
    },
    {
      title: 'Lab Komputer 3',
      description: 'Ruang 50 PC',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      status: 'available' as const,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Hero />

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
