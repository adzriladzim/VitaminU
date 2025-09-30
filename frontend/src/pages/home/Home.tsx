import Navbar from '@/components/section/Navbar';
import Hero from '@/components/section/Hero';
import LabSection from '@/components/section/LabSection';
import Footer from '@/components/section/Footer'

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Hero />
      <LabSection />
      <Footer />
    </div>
  );
}
