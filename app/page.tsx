'use client';

import HeroSlider from './(public)/components/sections/HeroSlider';
import StatisticsSection from './(public)/components/sections/StatisticsSection';
import AgendaSection from './(public)/components/sections/AgendaSection';
import NewsSection from './(public)/components/sections/NewsSection';
import GallerySection from './(public)/components/sections/GallerySection';
import Navbar from './(public)/components/Navbar';
import Footer from './(public)/components/Footer';
import React, { useState } from 'react';

export default function Home() {
  const [activeNews, setActiveNews] = useState(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <HeroSlider />

        {/* Data Section */}
        <StatisticsSection 
          onDataTableClick={() => {}}
        />

        {/* Agenda Section */}
        <AgendaSection />

        {/* News Section */}
        <NewsSection onNewsClick={setActiveNews} />

        {/* Gallery Section */}
        <GallerySection />
      </div>
      <Footer />
    </>
  );
}
