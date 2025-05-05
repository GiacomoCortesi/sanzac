// src/components/Header.tsx
import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            Prenotazioni SanZac
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 text-gray-600 font-medium">
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
            <a href="/calendar" className="hover:text-blue-600">
              Calendar
            </a>
            <a href="/about" className="hover:text-blue-600">
              About
            </a>
            <a href="/contacts" className="hover:text-blue-600">
              Contacts
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        >
          <div
            className="fixed top-0 left-0 w-64 h-full bg-white p-6 shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-6 text-blue-600">
              Prenotazioni SanZac
            </h2>
            <nav className="flex flex-col space-y-4 text-gray-700">
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
              <a href="/calendar" className="hover:text-blue-600">
                Calendar
              </a>
              <a href="/about" className="hover:text-blue-600">
                About
              </a>
              <a href="/contacts" className="hover:text-blue-600">
                Contacts
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
