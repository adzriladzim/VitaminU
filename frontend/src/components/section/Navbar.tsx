import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react"; // Menambahkan ChevronDown dan LogOut
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50); // Menambah threshold scroll
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        isProfileDropdownOpen
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);


  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Faq", path: "/faq" },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-xl" : "bg-cyan-600/95 backdrop-blur-sm"
          }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={`text-xl font-bold tracking-wide transition-colors duration-300 ${isScrolled ? "text-cyan-600" : "text-white"
              }`}
          >
            <img src="./vector.svg" alt="Logo classfy" className={`h-8 w-auto transition-transform duration-300 ${isScrolled ? "scale-90" : "scale-100"}`} />
          </Link>

          {/* Menu Tengah (Desktop) */}
          <ul className="hidden md:flex space-x-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`transition-colors font-semibold duration-300 relative group text-sm tracking-wider
                    ${isScrolled
                      ? "text-cyan-600 hover:text-cyan-800 font-medium"
                      : "text-white hover:text-cyan-100 font-medium"
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Tombol Login/Profil (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  className={`flex items-center space-x-2 p-2 rounded-md focus:outline-none transition-all duration-300 ${isScrolled ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/20 text-white"}`}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-md bg-cyan-500 flex items-center justify-center text-white font-semibold shadow-md">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className={`font-semibold hidden sm:block transition-colors duration-300 ${isScrolled ? "text-cyan-700" : "text-white"}`}>
                    {user?.full_name}
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'} ${isScrolled ? "text-cyan-600" : "text-white"}`} />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounde-md shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in-0 slide-in-from-top-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`
                    px-5 py-2 rounded-md text-sm font-semibold transition-all duration-300 shadow-md
                    ${!isScrolled
                      ? "text-white border border-white hover:bg-white hover:text-cyan-600"
                      : "text-cyan-600 border border-cyan-600 hover:bg-cyan-50"
                    }`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`
                    px-5 py-2 rounded-md text-sm font-semibold transition-all duration-300 shadow-md
                    ${!isScrolled
                      ? "text-cyan-800 bg-white hover:bg-cyan-100"
                      : "text-white bg-cyan-600 hover:bg-cyan-700"
                    }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Tombol Menu (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden focus:outline-none z-[100] transition-transform duration-300 hover:scale-110 ${isScrolled ? "text-cyan-600" : "text-white"
              }`}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile Full Screen Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-cyan-700/95 backdrop-blur-md z-[60] transition-all duration-500 ease-in-out md:hidden ${isMenuOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
          }`}
      >
        <div className="p-4 pt-20 flex flex-col items-center justify-start h-full">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="w-full text-center py-4 text-xl text-white font-medium hover:bg-cyan-600/50 transition-colors duration-300 border-b border-cyan-500/50"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="flex flex-col gap-4 w-full mt-10 p-4 border-t border-cyan-500/50">
            {isLoggedIn ? (
              <div className="w-full text-center bg-white rounded-md shadow-lg p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-bold text-cyan-700 text-lg">{user?.full_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-red-50 text-red-600 font-medium px-3 py-2 rounded-md hover:bg-red-100 transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center bg-white text-cyan-600 font-bold px-5 py-3 rounded-md shadow-lg hover:bg-cyan-500 hover:text-white transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center border-2 border-white text-white font-bold px-5 py-3 rounded-md shadow-lg hover:bg-white hover:text-cyan-600 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
