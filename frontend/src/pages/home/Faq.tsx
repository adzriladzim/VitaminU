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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-cyan-700 mb-8">
          Frequently Asked Questions
        </h1>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Bagaimana cara memesan atau meminjam kelas?
            </AccordionTrigger>
            <AccordionContent>
              Kamu bisa melihat daftar kelas yang tersedia di halaman utama,
              lalu pilih kelas yang masih berstatus <strong>“available”</strong> dan klik
              tombol booking. Setelah itu, tunggu persetujuan dari admin.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Berapa lama proses persetujuan peminjaman kelas?
            </AccordionTrigger>
            <AccordionContent>
              Biasanya admin akan meninjau permintaan kamu dalam waktu
              <strong> 1x24 jam</strong>. Kamu bisa mengecek status peminjaman
              di dashboard akunmu.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Apakah saya bisa membatalkan permintaan peminjaman?
            </AccordionTrigger>
            <AccordionContent>
              Ya, kamu bisa membatalkan selama statusnya masih{" "}
              <strong>“pending approval”</strong>. Setelah disetujui admin,
              kamu perlu menghubungi admin untuk pembatalan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Siapa yang bisa menggunakan platform ini?
            </AccordionTrigger>
            <AccordionContent>
              Semua mahasiswa dan dosen dapat menggunakan platform ini untuk
              memesan ruangan atau laboratorium sesuai kebutuhan akademik.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}
