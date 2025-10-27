import Navbar from "@/components/section/Navbar";
import Footer from "@/components/section/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50/30 to-white">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-md text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pusat Bantuan
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Pertanyaan <span className="text-cyan-600">Umum</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban atas pertanyaan yang sering ditanyakan seputar Classify
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-8 mb-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-b border-gray-200 pb-4">
              <AccordionTrigger className="text-left hover:text-cyan-600 transition-colors">
                <span className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 rounded-md flex items-center justify-center text-cyan-600 text-sm font-semibold mt-1">
                    1
                  </span>
                  <span className="font-semibold text-gray-900">
                    Bagaimana cara memesan atau meminjam kelas?
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed ml-9 pt-2">
                Kamu bisa melihat daftar kelas yang tersedia di halaman utama,
                lalu pilih kelas yang masih berstatus <strong className="text-green-600">"available"</strong> dan klik
                tombol booking. Setelah itu, tunggu persetujuan dari admin.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-200 pb-4">
              <AccordionTrigger className="text-left hover:text-cyan-600 transition-colors">
                <span className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 rounded-md flex items-center justify-center text-cyan-600 text-sm font-semibold mt-1">
                    2
                  </span>
                  <span className="font-semibold text-gray-900">
                    Berapa lama proses persetujuan peminjaman kelas?
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed ml-9 pt-2">
                Biasanya admin akan meninjau permintaan kamu dalam waktu
                <strong className="text-cyan-600"> 1x24 jam</strong>. Kamu bisa mengecek status peminjaman
                di dashboard akunmu.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-200 pb-4">
              <AccordionTrigger className="text-left hover:text-cyan-600 transition-colors">
                <span className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 rounded-md flex items-center justify-center text-cyan-600 text-sm font-semibold mt-1">
                    3
                  </span>
                  <span className="font-semibold text-gray-900">
                    Apakah saya bisa membatalkan permintaan peminjaman?
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed ml-9 pt-2">
                Ya, kamu bisa membatalkan selama statusnya masih{" "}
                <strong className="text-yellow-600">"pending approval"</strong>. Setelah disetujui admin,
                kamu perlu menghubungi admin untuk pembatalan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-200 pb-4">
              <AccordionTrigger className="text-left hover:text-cyan-600 transition-colors">
                <span className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 rounded-md flex items-center justify-center text-cyan-600 text-sm font-semibold mt-1">
                    4
                  </span>
                  <span className="font-semibold text-gray-900">
                    Siapa yang bisa menggunakan platform ini?
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed ml-9 pt-2">
                Semua mahasiswa dan dosen dapat menggunakan platform ini untuk
                memesan ruangan atau laboratorium sesuai kebutuhan akademik.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Help Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-md p-8 text-center text-white shadow-lg">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Masih Ada Pertanyaan?</h3>
          <p className="text-cyan-100 mb-6 max-w-md mx-auto">
            Jika kamu tidak menemukan jawaban yang kamu cari, jangan ragu untuk menghubungi tim support kami
          </p>
          <button className="bg-white text-cyan-600 px-6 py-3 rounded-md font-semibold hover:bg-cyan-50 transition-colors shadow-lg">
            Hubungi Support
          </button>
        </div>
      </main>

    </div>
  );
}
