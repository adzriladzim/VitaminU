import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-cyan-600 text-white shadow-md">
      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo di Kiri */}
        <a href="/" className="text-xl font-bold tracking-wide">
          Classify
        </a>

        {/* Menu Tengah (Desktop) */}
        <ul
          className="
            hidden md:flex space-x-8 absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2
          "
        >
          {['Home', 'About', 'Faq'].map((item) => (
            <li key={item}>
              <a
                href={`/${item.toLowerCase()}`}
                className="hover:text-cyan-200 transition-colors duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Tombol Login di Kanan (Desktop) */}
        <a
          href="/login"
          className="hidden md:inline-block bg-white text-cyan-600 font-semibold px-5 py-2 rounded-md 
                     hover:bg-cyan-500 hover:text-white transition-all duration-300"
        >
          Login
        </a>

        {/* Tombol Menu (Mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none z-50 transition-transform duration-300 hover:scale-110"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Menu Mobile */}
        <div
          className={`
            absolute top-16 left-0 w-full bg-cyan-600 shadow-md flex flex-col items-center
            transition-all duration-300 ease-in-out origin-top md:hidden
            ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          `}
        >
          {['Home', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="w-full text-center py-3 hover:bg-cyan-500 transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            className="w-[90%] my-3 text-center bg-white text-cyan-600 font-semibold px-5 py-2 rounded-md 
                       hover:bg-cyan-500 hover:text-white transition-all duration-300"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
