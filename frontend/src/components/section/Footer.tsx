import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="w-full bg-cyan-600 ">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand / Logo */}
        <div className="text-lg font-semibold text-yellow-300 dark:text-gray-200">
          <img src="./vector.svg" alt="Logo classfy" className="h-8 w-auto"/>
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 text-sm text-white">
          <a href="#" className="hover:text-gray-600 ">
            Home
          </a>
          <a href="#" className="hover:text-gray-600 ">
            About
          </a>
          <a href="#" className="hover:text-gray-600 ">
            Faq
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-white  text-center md:text-right">
          © {new Date().getFullYear()} VitaminU. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
