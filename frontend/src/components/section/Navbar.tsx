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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
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
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-xl" : "bg-cyan-600/95 backdrop-blur-sm"
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img
              src="./vector.svg"
              alt="Logo"
              className={`h-8 w-auto transition-transform duration-300 ${
                isScrolled ? "scale-90" : "scale-100"
              }`}
            />
          </Link>

          {/* Menu Tengah (Desktop) */}
          <ul className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`relative group text-sm font-medium tracking-wide transition-colors ${
                    isScrolled
                      ? "text-cyan-400 font-semibold hover:text-cyan-600"
                      : "text-white font-semibold hover:text-cyan-100"
                  }`}
                >
                  {item.name}

                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Profile/Login */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 ${
                    isScrolled
                      ? "bg-gray-100 hover:bg-gray-200 text-cyan-700"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center font-semibold shadow-md">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block font-medium">
                    {user?.full_name}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${
                      isProfileDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`px-5 py-2 rounded-md text-sm font-semibold border transition-all duration-300 ${
                    isScrolled
                      ? "text-cyan-600 border-cyan-600 hover:bg-cyan-50"
                      : "text-white border-white hover:bg-white hover:text-cyan-600"
                  }`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`px-5 py-2 rounded-md text-sm font-semibold shadow-md transition-all duration-300 ${
                    isScrolled
                      ? "text-white bg-cyan-600 hover:bg-cyan-700"
                      : "text-cyan-700 bg-white hover:bg-cyan-100"
                  }`}
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Tombol Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden focus:outline-none transition-transform duration-300 hover:scale-110 ${
              isScrolled ? "text-cyan-700" : "text-white"
            }`}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 bg-cyan-700/95 backdrop-blur-md z-40 transition-all duration-500 transform ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-6 h-full text-white text-lg font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:text-cyan-200 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="flex flex-col w-3/4 gap-3 mt-10">
            {isLoggedIn ? (
              <>
                <div className="bg-white text-cyan-700 font-bold rounded-md p-3 text-center">
                  {user?.full_name}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-600 font-semibold rounded-md p-3 hover:bg-red-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-cyan-600 font-bold text-center rounded-md p-3 hover:bg-cyan-50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white font-bold text-center rounded-md p-3 hover:bg-white hover:text-cyan-700 transition-all"
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
