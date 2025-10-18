import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-cyan-600 text-white h-[80vh] flex items-center justify-center">
      {/* Overlay (opsional kalau mau efek gradient/transparan) */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Konten Utama */}
      <div className="relative text-center max-w-2xl px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Selamat Datang di <span className="text-yellow-300">
            Classify
          </span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Kelola dan booking ruang kelas dengan mudah. Temukan ruangan yang
          <span className="font-semibold"> available</span>, sedang digunakan,
          atau sudah dibooking.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#LabSection"
            className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-cyan-100 transition"
          >
            Lihat Kelas
          </a>
          <Link
            to="/about"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition"
          >
            Tentang Kami
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
