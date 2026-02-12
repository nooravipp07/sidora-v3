'use client';

import React, { useState } from 'react';
import HeroSlider from './components/sections/HeroSlider';
import StatisticsSection from './components/sections/StatisticsSection';
import AgendaSection from './components/sections/AgendaSection';
import NewsSection from './components/sections/NewsSection';
import GallerySection from './components/sections/GallerySection';

export default function Home() {
  const [activeNews, setActiveNews] = useState(null);

  return (
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

      {/* Modals (if needed) */}
      {/* {activeNews && (
        <NewsModal 
          news={activeNews} 
          onClose={() => setActiveNews(null)} 
        />
      )} */}
    </div>
  );
}
