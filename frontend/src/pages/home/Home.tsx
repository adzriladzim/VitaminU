import Navbar from '@/components/section/Navbar';
import Hero from '@/components/section/Hero';
import LabSection from '@/components/section/LabSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <LabSection />
    </div>
  );
}
