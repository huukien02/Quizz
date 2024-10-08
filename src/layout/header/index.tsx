import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-3xl font-bold text-blue-600">
              MyLogo
            </a>
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex space-x-10">
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Home
            </a>
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              About
            </a>
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Services
            </a>
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Contact
            </a>
          </nav>
          {/* CTA Button */}
          <div className="hidden md:flex">
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
            >
              Get Started
            </a>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
