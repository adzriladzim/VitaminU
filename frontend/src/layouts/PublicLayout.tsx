import { Outlet } from 'react-router-dom';
import Navbar from '@/components/section/Navbar'; // Sesuaikan path
import Footer from '@/components/section/Footer'; // Sesuaikan path

export default function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main className="pt-10 min-h-screen"> {/* Padding top agar tidak tertutup Navbar */}
        <Outlet /> {/* Halaman (Home, About, Faq) akan dirender di sini */}
      </main>
      <Footer />
    </div>
  );
}
