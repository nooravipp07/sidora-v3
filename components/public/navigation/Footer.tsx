'use client';

import React from 'react';
import Image from 'next/image';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title?: string;
  links?: FooterLink[];
  content?: React.ReactNode;
}

interface FooterConfig {
  logo?: {
    src: string;
    alt: string;
  };
  title?: string;
  description?: string;
  sections?: FooterSection[];
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  analytics?: {
    totalVisitors?: number;
    visitorsToday?: number;
  };
  copyright?: string;
}

const defaultConfig: FooterConfig = {
  logo: {
    src: '/dispora-logo.png',
    alt: 'SIDORA Logo',
  },
  title: 'SIDORA',
  description: 'Sistem informasi terpadu untuk mengelola data olahraga, atlet, dan prestasi daerah.',
  sections: [
    {
      title: 'Link Terkait',
      links: [
        { label: 'Tentang SIDORA', href: '#' },
        { label: 'Panduan Penggunaan', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Bantuan', href: '#' },
      ],
    },
    {
      title: 'Data',
      links: [
        { label: 'Data Atlet', href: '#' },
        { label: 'Data Klub', href: '#' },
        { label: 'Sarana Olahraga', href: '#' },
        { label: 'Prestasi', href: '#' },
      ],
    },
    {
      title: 'Kontak',
      content: (
        <ul className="space-y-2 text-gray-400">
          <li>info@sidora.go.id</li>
          <li>(022) 5895643</li>
          <li>Pamekaran, Soreang, Bandung Regency 40912</li>
          <li>Kab.Bandung, Jawa Barat</li>
        </ul>
      ),
    },
  ],
  analytics: {
    totalVisitors: 24587,
    visitorsToday: 156,
  },
  copyright: '© 2024 SIDORA - Sistem Informasi Data Keolahragaan. All rights reserved.',
};

const Footer: React.FC<{ config?: FooterConfig }> = ({ config = defaultConfig }) => {
  const {
    logo,
    title,
    description,
    sections,
    analytics,
    copyright,
  } = { ...defaultConfig, ...config };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div>
            {logo && (
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold">{title}</h3>
                </div>
              </div>
            )}
            <p className="text-gray-400">
              {description}
            </p>
          </div>

          {/* Footer Sections */}
          {sections?.map((section, index) => (
            <div key={index}>
              {section.title && (
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              )}
              
              {section.links ? (
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="hover:text-green-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                section.content
              )}
            </div>
          ))}

          {/* Analytics Section */}
          {analytics && (
            <div>
              <h4 className="text-lg font-semibold mb-4">👥 Pengunjung</h4>
              <div className="space-y-4">
                {analytics.totalVisitors !== undefined && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total Pengunjung</p>
                    <p className="text-2xl font-bold text-green-400">
                      {analytics.totalVisitors.toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
                {analytics.visitorsToday !== undefined && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Hari Ini</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {analytics.visitorsToday}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
