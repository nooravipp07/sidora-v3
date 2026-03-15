'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  logo?: {
    src: string;
    alt: string;
  };
  title?: string;
  navLinks?: NavLink[];
  loginUrl?: string;
}

const defaultNavLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/infrastruktur-keolahragaan', label: 'Infrastruktur Keolahragaan' },
  { href: '/olahraga-prestasi', label: 'Olahraga Prestasi' },
  { href: '/olahraga-masyarakat', label: 'Olahraga Masyarakat' },
  { href: '/berita', label: 'Berita' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/agenda', label: 'Agenda' },
];

const Navbar: React.FC<NavbarProps> = ({
  logo = {
    src: '/dispora-logo.png',
    alt: 'SIDORA Logo',
  },
  title = 'SIDORA',
  navLinks = defaultNavLinks,
  loginUrl = '/login',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Login and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link
              href={loginUrl}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Login
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
