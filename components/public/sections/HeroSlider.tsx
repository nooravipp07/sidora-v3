'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface HeroSlide {
  image: string;
  title: string;
  description: string;
}

interface HeroSliderProps {
  slides?: HeroSlide[];
}

const defaultSlides: HeroSlide[] = [
  {
    image: "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Selamat Datang di SIDORA",
    description: "Platform data olahraga, atlet, dan prestasi daerah yang terintegrasi."
  },
  {
    image: "https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Data Atlet & Klub Terlengkap",
    description: "Kelola dan pantau perkembangan atlet serta klub olahraga di daerah Anda."
  },
  {
    image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1200",
    title: "Prestasi & Event Terkini",
    description: "Dapatkan informasi terbaru tentang prestasi dan agenda olahraga daerah."
  }
];

const HeroSlider: React.FC<HeroSliderProps> = ({ slides = defaultSlides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id="home" className="relative h-screen sm:h-[600px] md:h-[700px] lg:h-[750px] flex items-center overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden={currentSlide !== idx}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center text-white">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">{slide.title}</h1>
            <p className="text-sm sm:text-lg md:text-2xl mb-6 md:mb-8 drop-shadow-lg max-w-2xl">{slide.description}</p>
            <Image
              src="/kab-bandung-logo.png"
              alt="Kabupaten Bandung Logo"
              width={200}
              height={80}
              className="hover:opacity-80 transition-opacity drop-shadow-lg"
            />
          </div>
        </div>
      ))}

      {/* Left Navigation Arrow */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Slider Controls - Dots */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`rounded-full border-2 border-white transition-all duration-300 ${currentSlide === idx ? 'bg-yellow-400 border-yellow-400 scale-125 w-4 h-4' : 'bg-white/40 w-3 h-3'}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
