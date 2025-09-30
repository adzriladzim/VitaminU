import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="w-full mt-10 border-t bg-cyan-600 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand / Logo */}
        <div className="text-lg font-semibold text-yellow-300 dark:text-gray-200">
          Classify
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 text-sm text-white dark:text-gray-400">
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">
            Home
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">
            About
          </a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">
            Faq
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-white dark:text-gray-500 text-center md:text-right">
          © {new Date().getFullYear()} VitaminU. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
