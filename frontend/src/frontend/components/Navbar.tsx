import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔹 Deteksi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-300
        ${isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'}
      `}
    >
      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className={`text-xl font-bold tracking-wide transition-colors duration-300 
            ${isScrolled ? 'text-cyan-600' : 'text-yellow-300'}
          `}
        >
          Classify
        </a>

        {/* Menu Tengah (Desktop) */}
        <ul
          className={`
            hidden md:flex space-x-8 absolute left-1/2 top-1/2 
            -translate-x-1/2 -translate-y-1/2
          `}
        >
          {['Home', 'About', 'Faq'].map((item) => (
            <li key={item}>
              <a
                href={`/${item.toLowerCase()}`}
                className={`
                  transition-colors duration-300
                  ${isScrolled ? 'text-gray-800 hover:text-cyan-600' : 'text-white hover:text-cyan-200'}
                `}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Tombol Login (Desktop) */}
        <a
          href="/login"
          className={`
            hidden md:inline-block font-semibold px-5 py-2 rounded-md transition-all duration-300
            ${isScrolled
              ? 'bg-cyan-600 text-white hover:bg-cyan-500'
              : 'bg-white text-cyan-600 hover:bg-cyan-500 hover:text-white'}
          `}
        >
          Login
        </a>

        {/* Tombol Menu (Mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`
            md:hidden focus:outline-none z-50 transition-transform duration-300 hover:scale-110
            ${isScrolled ? 'text-cyan-600' : 'text-white'}
          `}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Menu Mobile */}
        <div
          className={`
            absolute top-15 left-1/2 -translate-x-1/2
            w-[90%] bg-cyan-600 shadow-lg rounded-lg p-4
            flex flex-col items-center
            transition-all duration-300 ease-in-out origin-top md:hidden
            ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          `}
        >
          {['Home', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`/${item.toLowerCase()}`}
              className="w-full text-center py-3 text-white hover:bg-cyan-500 rounded-md transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            className="w-full mt-3 text-center bg-white text-cyan-600 font-semibold px-5 py-2 rounded-md 
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
