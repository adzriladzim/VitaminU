import Navbar from "@/components/section/Navbar";
import Footer from "@/components/section/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-cyan-50/30 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-md text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Platform Peminjaman Ruangan Kampus
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Tentang <span className="text-cyan-600">Classify</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Solusi modern untuk mengelola peminjaman ruang kelas dan laboratorium
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-md p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-cyan-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mudah Digunakan</h3>
            <p className="text-gray-600 text-sm">
              Interface intuitif untuk booking ruangan dalam beberapa klik
            </p>
          </div>

          <div className="bg-white rounded-md p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-cyan-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Efisien</h3>
            <p className="text-gray-600 text-sm">
              Sistem manajemen yang cepat dan terorganisir untuk admin
            </p>
          </div>

          <div className="bg-white rounded-md p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-cyan-100 rounded-md flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparan</h3>
            <p className="text-gray-600 text-sm">
              Proses peminjaman tercatat jelas untuk penggunaan optimal
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/5 bg-gradient-to-br from-cyan-500 to-cyan-600 p-12 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center mx-auto mb-6">
                  <img src="/vector.svg" alt="" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Classify</h2>
                <p className="text-cyan-100">Temukan ruangan untuk berkembang</p>
              </div>
            </div>

            <div className="md:w-3/5 p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Apa itu Classify?</h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Classify adalah platform sederhana yang membantu mahasiswa dan admin dalam mengelola peminjaman ruang kelas atau laboratorium. Dengan tampilan yang ramah pengguna, mahasiswa dapat melakukan booking kelas dengan mudah, sementara admin dapat mengelola permintaan tersebut secara efisien.
                </p>

                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-md">
                  <p className="font-medium text-gray-900 mb-2">Misi Kami</p>
                  <p className="text-sm">
                    Tujuan kami adalah menyediakan sistem peminjaman yang transparan, mudah digunakan, dan dapat membantu mengoptimalkan penggunaan ruang di kampus.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Project ini dikembangkan sebagai bagian dari final project mata kuliah{' '}
                    <span className="font-semibold text-cyan-600">Web Application</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 mt-12 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-600 mb-2">100%</div>
            <div className="text-gray-600 text-sm">Gratis</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-600 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">Akses Online</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-600 mb-2">Fast</div>
            <div className="text-gray-600 text-sm">Respon Cepat</div>
          </div>
        </div>
      </main>

    </div>
  );
}
