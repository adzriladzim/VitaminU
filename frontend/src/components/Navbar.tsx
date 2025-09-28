import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Faq", path: "/faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`
      }
    >
      <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between" >
        {/* Logo */}
        < Link
          to="/"
          className={`text-xl font-bold tracking-wide transition-colors duration-300 ${isScrolled ? "text-cyan-600" : "text-yellow-300"
            }`}
        >
          Classify
        </Link>

        {/* Menu Tengah (Desktop) */}
        <ul className="hidden md:flex space-x-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" >
          {
            navItems.map((item) => (
              <li key={item.name} >
                <Link
                  to={item.path}
                  className={`transition-colors duration-300 ${isScrolled
                    ? "text-cyan-600 hover:text-cyan-800 font-bold"
                    : "text-white hover:text-cyan-200 font-bold"
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
        </ul>

        {/* Tombol Login (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/register"
            className={`
    px-4 py-2 rounded-lg font-semibold transition-all duration-300
    ${!isScrolled
                ? "text-white border border-white hover:bg-white/10"
                : "text-cyan-600 border-cyan-600 border hover:bg-cyan-100" // Teks cyan, border cyan, hover cyan terang
              }`}
          >
            Register
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-800 transition-colors duration-300"
          >
            Login
          </Link>
        </div>

        {/* Tombol Menu (Mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden focus:outline-none z-50 transition-transform duration-300 hover:scale-110 ${isScrolled ? "text-cyan-600" : "text-white"
            }`}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Menu Mobile */}
        <div
          className={
            `absolute top-16 left-1/2 -translate-x-1/2 w-[90%] bg-cyan-600 shadow-lg rounded-lg p-4 flex flex-col gap-y-1 items-center transition-all duration-300 ease-in-out origin-top md:hidden ${isMenuOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
            }`
          }
        >
          {
            navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="w-full text-center py-3 text-white hover:bg-cyan-500 rounded-md transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

          <div className="flex flex-col gap-2 w-full">

            <Link
              to="/login"
              className="w-full text-center bg-white text-cyan-600 font-semibold px-5 py-2 rounded-md hover:bg-cyan-500 hover:text-white transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/login"
              className="w-full  text-center border border-white text-white font-semibold px-5 py-2 rounded-md hover:bg-white hover:text-cyan-600 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
