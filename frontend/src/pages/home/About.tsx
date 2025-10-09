import Navbar from "@/components/section/Navbar";
import Footer from "@/components/section/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-cyan-600 mb-6">About VitaminU</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          VitaminU adalah platform sederhana yang membantu mahasiswa dan admin
          dalam mengelola peminjaman ruang kelas atau laboratorium. Dengan
          tampilan yang ramah pengguna, mahasiswa dapat melakukan booking kelas
          dengan mudah, sementara admin dapat mengelola permintaan tersebut
          secara efisien.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Tujuan kami adalah menyediakan sistem peminjaman yang transparan,
          mudah digunakan, dan dapat membantu mengoptimalkan penggunaan ruang
          di kampus.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Project ini dikembangkan sebagai bagian dari final project mata kuliah
          <span className="font-medium text-cyan-600"> Web Application </span>.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
