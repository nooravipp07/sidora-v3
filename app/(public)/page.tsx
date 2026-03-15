'use client';

import React, { useState } from 'react';
import { HeroSlider, StatisticsSection, AgendaSection, NewsSection, GallerySection } from '@/components/public/sections';

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
