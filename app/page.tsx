'use client';

import { HeroSlider, StatisticsSection, AgendaSection, NewsSection, GallerySection } from '@/components/public/sections';
import { Navbar, Footer } from '@/components/public/navigation';
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
