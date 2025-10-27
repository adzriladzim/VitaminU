import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
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
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[70] transition-all duration-300 ${
          isScrolled ? "bg-white shadow-xl" : "bg-cyan-600/95 backdrop-blur-sm"
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={`text-xl font-bold tracking-wide transition-colors duration-300 ${
              isScrolled ? "text-cyan-600" : "text-white"
            }`}
          >
            <img
              src="./vector.svg"
              alt="Logo classfy"
              className={`h-8 w-auto transition-transform duration-300 ${
                isScrolled ? "scale-90" : "scale-100"
              }`}
            />
          </Link>

          {/* Menu Tengah (Desktop) */}
          <ul className="hidden md:flex space-x-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`transition-colors font-semibold duration-300 relative group text-sm tracking-wider
                    ${
                      isScrolled
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
                  className={`flex items-center space-x-2 p-2 rounded-md focus:outline-none transition-all duration-300 ${
                    isScrolled
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-md bg-cyan-500 flex items-center justify-center text-white font-semibold shadow-md">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className={`font-semibold hidden sm:block transition-colors duration-300 ${
                    isScrolled ? "text-cyan-700" : "text-white"
                  }`}>
                    {user?.full_name}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'
                    } ${isScrolled ? "text-cyan-600" : "text-white"}`}
                  />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in-0 slide-in-from-top-1">
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
                    ${
                      !isScrolled
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
                    ${
                      !isScrolled
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
            className={`md:hidden focus:outline-none relative z-[100] transition-transform duration-300 hover:scale-110 ${
              isMenuOpen ? "text-white" : (isScrolled ? "text-cyan-600" : "text-white")
            }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile Full Screen Overlay */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-cyan-600 to-cyan-700 z-[60] transition-all duration-500 ease-in-out md:hidden ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        <div className="h-full overflow-y-auto pt-20 pb-8 px-6">
          <div className="max-w-md mx-auto">
            {/* Navigation Items */}
            <div className="space-y-2 mb-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block w-full text-left py-4 px-6 text-lg text-white font-semibold bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 font-medium">Selamat datang,</p>
                      <p className="font-bold text-cyan-700 text-lg truncate">{user?.full_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold px-4 py-3 rounded-xl hover:bg-red-100 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center border-2 border-cyan-600 text-cyan-600 font-bold px-6 py-3 rounded-xl hover:bg-cyan-600 hover:text-white transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
