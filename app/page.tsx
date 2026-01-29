'use client';

import Image from "next/image";
import styles from "./page.module.css";

import React, { useState } from 'react';  
import { 
  Trophy, 
  Users, 
  MapPin, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  Play,
  Download,
  Mail,
  Phone,
  MapPin as Location,
  Menu,
  X,
  Star,
  ArrowRight,
  TrendingUp,
  Award,
  Building,
  Target,
  Medal,
  User,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [activeNews, setActiveNews] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeAgenda, setActiveAgenda] = useState(null);
  const [activeDataTable, setActiveDataTable] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  const [activeSportsBranch, setActiveSportsBranch] = useState(null);
  const [activeCommunityProgram, setActiveCommunityProgram] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentGallerySlide, setCurrentGallerySlide] = useState(0);
  const [selectedFacilityDistrict, setSelectedFacilityDistrict] = useState(null);

  // Website Analytics Data
  const analyticsData = {
    totalVisitors: 24587,
    visitorsToday: 156,
    previousPeriodVisitors: 22150,
    change: 11.3,
    isPositive: true,
    lastUpdated: 'Hari ini',
    weeklyVisitors: [3200, 2900, 3400, 3100, 2800, 3600, 4587],
    deviceBreakdown: [
      { device: 'Desktop', count: 14752, percentage: 60 },
      { device: 'Mobile', count: 7376, percentage: 30 },
      { device: 'Tablet', count: 2459, percentage: 10 }
    ]
  };

  // Gallery Data
  const galleryData = [
    {
      id: 1,
      title: "Kejuaraan Renang Daerah",
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "20 Desember 2023",
      description: "Dokumentasi kegiatan kejuaraan renang tingkat daerah dengan partisipasi 200 atlet dari berbagai kecamatan. Event ini menampilkan berbagai nomor renang mulai dari gaya bebas, gaya punggung, hingga gaya kupu-kupu."
    },
    {
      id: 2,
      title: "Turnamen Basket Antar Sekolah",
      image: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "18 Desember 2023",
      description: "Turnamen basket antar sekolah menengah atas se-kabupaten dengan 32 tim peserta. Kompetisi berlangsung sengit dengan menampilkan bakat-bakat muda basket daerah."
    },
    {
      id: 3,
      title: "Pelatihan Atletik Usia Dini",
      image: "https://images.pexels.com/photos/2834917/pexels-photo-2834917.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "15 Desember 2023",
      description: "Program pelatihan atletik untuk anak-anak usia dini sebagai bibit atlet masa depan. Program ini fokus pada pengembangan kemampuan dasar atletik dan pembentukan karakter."
    }
  ];

  // Gallery Auto-Rotation Effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGallerySlide((prev) => (prev + 1) % galleryData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [galleryData.length]);

  // Slider Data and State
  const sliderData = [
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
  const [currentSlide, setCurrentSlide] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  // Calendar State and Event Data
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [selectedCalendarDate, setSelectedCalendarDate] = React.useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = React.useState([]);

  const eventCalendarData = [
    // January 2026 events
    {
      id: 1,
      date: new Date(2026, 0, 5),
      name: "Kejuaraan Tenis Meja Regional",
      category: "Kompetisi",
      location: "GOR Tenis Meja Utama",
      level: "Regional",
      status: "Active",
      time: "08:00 - 17:00"
    },
    {
      id: 2,
      date: new Date(2026, 0, 5),
      name: "Pelatihan Wasit Badminton",
      category: "Pelatihan",
      location: "Stadion Utama",
      level: "Daerah",
      status: "Active",
      time: "09:00 - 16:00"
    },
    {
      id: 3,
      date: new Date(2026, 0, 12),
      name: "Pelatihan Wasit Sepak Bola",
      category: "Pelatihan",
      location: "Stadion Utama",
      level: "Nasional",
      status: "Active",
      time: "09:00 - 16:00"
    },
    {
      id: 4,
      date: new Date(2026, 0, 15),
      name: "Lomba Lari Marathon",
      category: "Event Komunitas",
      location: "Alun-alun Kota",
      level: "Lokal",
      status: "Active",
      time: "06:00 - 12:00"
    },
    {
      id: 5,
      date: new Date(2026, 0, 20),
      name: "Turnamen Basket Antar Klub",
      category: "Kompetisi",
      location: "GOR Basket",
      level: "Regional",
      status: "Active",
      time: "15:00 - 21:00"
    },
    {
      id: 6,
      date: new Date(2026, 0, 25),
      name: "Kejuaraan Renang Daerah",
      category: "Kompetisi",
      location: "Kolam Renang Olimpik",
      level: "Daerah",
      status: "Inactive",
      time: "08:00 - 15:00"
    },
    // February 2026 events
    {
      id: 7,
      date: new Date(2026, 1, 8),
      name: "Pembukaan Musim Olahraga 2026",
      category: "Acara",
      location: "Stadion Utama",
      level: "Nasional",
      status: "Active",
      time: "10:00 - 12:00"
    },
    {
      id: 8,
      date: new Date(2026, 1, 14),
      name: "Workshop Pelatih Muda",
      category: "Pelatihan",
      location: "Gedung Olahraga",
      level: "Regional",
      status: "Active",
      time: "09:00 - 17:00"
    },
    // March 2026 events
    {
      id: 9,
      date: new Date(2026, 2, 8),
      name: "Piala Walikota Sepak Bola",
      category: "Kompetisi",
      location: "Stadion Kota",
      level: "Lokal",
      status: "Active",
      time: "14:00 - 21:00"
    },
    {
      id: 10,
      date: new Date(2026, 2, 15),
      name: "Kejuaraan Voli Putri",
      category: "Kompetisi",
      location: "GOR Voli",
      level: "Daerah",
      status: "Active",
      time: "08:00 - 18:00"
    }
  ];

  // Helper function to get events for a specific date
  const getEventsForDate = (date) => {
    return eventCalendarData.filter(event => {
      return (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    });
  };

  // Handle date click
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const eventsOnDate = getEventsForDate(clickedDate);
    if (eventsOnDate.length > 0) {
      setSelectedCalendarDate(clickedDate);
      setSelectedDateEvents(eventsOnDate);
    }
  };

  // Get calendar days
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const monthName = new Date(currentYear, currentMonth).toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const statsData = [
    {
      icon: Trophy,
      title: "Atlet Terdaftar",
      value: "1,247",
      subtitle: "Atlet Aktif",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      change: "+12%",
      positive: true
    },
    {
      icon: Users,
      title: "Prestasi Atlet",
      value: "156",
      subtitle: "Klub Terverifikasi",
      color: "bg-gradient-to-r from-blue-500 to-blue-700",
      change: "+8%",
      positive: true
    },
    {
      icon: MapPin,
      title: "Sarana Olahraga",
      value: "89",
      subtitle: "Fasilitas Tersedia",
      color: "bg-gradient-to-r from-green-500 to-green-700",
      change: "+5%",
      positive: true
    },
    {
      icon: Calendar,
      title: "Parasarana Olahraga",
      value: "23",
      subtitle: "Kegiatan Mendatang",
      color: "bg-gradient-to-r from-purple-500 to-purple-700",
      change: "-2%",
      positive: false
    }
  ];

  // Data untuk tabel sarana prasarana
  const saranaData = [
    { kecamatan: 'Kec. Utara', lapangan: 12, gedung: 8, kolam: 3, kondisiBaik: 18, kondisiRusak: 5 },
    { kecamatan: 'Kec. Selatan', lapangan: 15, gedung: 6, kolam: 2, kondisiBaik: 20, kondisiRusak: 3 },
    { kecamatan: 'Kec. Timur', lapangan: 10, gedung: 4, kolam: 1, kondisiBaik: 12, kondisiRusak: 3 },
    { kecamatan: 'Kec. Barat', lapangan: 8, gedung: 5, kolam: 2, kondisiBaik: 13, kondisiRusak: 2 }
  ];

  // Data untuk tabel prestasi atlet
  const prestasiData = [
    { nama: 'Ahmad Suharto', cabor: 'Sepak Bola', kategori: 'Atlet', prestasi: 'Juara 1 POPDA 2023', medali: 'Emas', tahun: '2023' },
    { nama: 'Siti Nurhaliza', cabor: 'Renang', kategori: 'Pelatih', prestasi: 'Lisensi Pelatih A', medali: '-', tahun: '2023' },
    { nama: 'Budi Prasetyo', cabor: 'Badminton', kategori: 'Atlet', prestasi: 'Juara 2 PORDA 2023', medali: 'Perak', tahun: '2023' },
    { nama: 'Dewi Sartika', cabor: 'Voli', kategori: 'Wasit', prestasi: 'Lisensi Wasit Nasional', medali: '-', tahun: '2023' },
    { nama: 'Andi Wijaya', cabor: 'Basket', kategori: 'Atlet', prestasi: 'Juara 3 O2SN 2023', medali: 'Perunggu', tahun: '2023' }
  ];

  // Data untuk chart
  const chartData = {
    sarana: [
      { name: 'Lapangan', value: 45, color: '#3B82F6' },
      { name: 'Gedung', value: 23, color: '#10B981' },
      { name: 'Kolam', value: 8, color: '#F59E0B' },
      { name: 'Lainnya', value: 13, color: '#EF4444' }
    ],
    prestasi: [
      { name: 'Emas', value: 28, color: '#FFD700' },
      { name: 'Perak', value: 35, color: '#C0C0C0' },
      { name: 'Perunggu', value: 42, color: '#CD7F32' }
    ]
  };

  const newsData = [
    {
      id: 1,
      title: "Kejuaraan Daerah Bulu Tangkis 2024",
      category: "Trending",
      date: "15 Januari 2024",
      image: "https://images.pexels.com/photos/9072316/pexels-photo-9072316.jpeg?auto=compress&cs=tinysrgb&w=400",
      excerpt: "Turnamen bulu tangkis tingkat daerah yang diikuti oleh 150 atlet dari berbagai kecamatan...",
      content: "Kejuaraan Daerah Bulu Tangkis 2024 telah berlangsung dengan sukses di GOR Utama Kota. Turnamen ini diikuti oleh 150 atlet dari berbagai kecamatan yang berlomba dalam berbagai kategori usia. Para atlet menunjukkan kemampuan terbaik mereka dalam kompetisi yang berlangsung selama 3 hari. Kejuaraan ini merupakan bagian dari upaya pembinaan olahraga prestasi di tingkat daerah.",
      tags: ["Bulu Tangkis", "Kejuaraan", "Daerah"]
    },
    {
      id: 2,
      title: "Pembangunan Lapangan Sepak Bola Baru",
      category: "Latest",
      date: "12 Januari 2024",
      image: "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=400",
      excerpt: "Pemerintah daerah meresmikan pembangunan lapangan sepak bola baru di Kecamatan Selatan...",
      content: "Pembangunan lapangan sepak bola baru di Kecamatan Selatan telah dimulai dengan anggaran 2.5 miliar rupiah. Fasilitas ini diharapkan dapat menampung lebih banyak atlet muda dan meningkatkan prestasi olahraga sepak bola di daerah. Lapangan akan dilengkapi dengan fasilitas pendukung seperti tribun penonton, ruang ganti, dan sistem drainase yang baik.",
      tags: ["Sepak Bola", "Pembangunan", "Fasilitas"]
    },
    {
      id: 3,
      title: "Workshop Pelatihan Pelatih Muda",
      category: "Popular",
      date: "10 Januari 2024",
      image: "https://images.pexels.com/photos/3771045/pexels-photo-3771045.jpeg?auto=compress&cs=tinysrgb&w=400",
      excerpt: "Program pelatihan intensif untuk mengembangkan kemampuan pelatih muda di daerah...",
      content: "Workshop pelatihan pelatih muda telah diselenggarakan dengan menghadirkan narasumber berpengalaman dari tingkat nasional. Program ini bertujuan untuk meningkatkan kualitas pembinaan olahraga di daerah melalui pelatih-pelatih muda yang kompeten. Peserta workshop mendapatkan sertifikat dan akan menjadi bagian dari program pembinaan berkelanjutan.",
      tags: ["Pelatihan", "Pelatih", "Workshop"]
    }
  ];

  const agendaData = [
    {
      id: 1,
      title: "Kejuaraan Tenis Meja Regional",
      category: "Trending",
      date: "25 Februari 2024",
      time: "08:00 - 17:00",
      location: "GOR Tenis Meja Utama",
      image: "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Turnamen tenis meja tingkat regional dengan hadiah total 50 juta rupiah. Kompetisi terbuka untuk semua kategori usia dengan sistem gugur langsung.",
      link: "/register-event/1"
    },
    {
      id: 2,
      title: "Pelatihan Wasit Sepak Bola",
      category: "Latest",
      date: "20 Februari 2024",
      time: "09:00 - 16:00",
      location: "Stadion Utama",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Workshop pelatihan wasit sepak bola berlisensi dengan instruktur berpengalaman. Peserta akan mendapatkan sertifikat resmi setelah menyelesaikan pelatihan.",
      link: "/register-event/2"
    },
    {
      id: 3,
      title: "Lomba Lari Marathon",
      category: "Popular",
      date: "15 Februari 2024",
      time: "06:00 - 12:00",
      location: "Alun-alun Kota",
      image: "https://images.pexels.com/photos/2402235/pexels-photo-2402235.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Lomba lari marathon 10K dan 21K dengan rute mengelilingi kota. Event ini terbuka untuk umum dengan berbagai kategori usia.",
      link: "/register-event/3"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-red-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SIDORA</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">Home</a>
              <a href="#info" className="text-gray-700 hover:text-green-600 transition-colors">Cabang Olahraga</a>
              <a href="#data" className="text-gray-700 hover:text-green-600 transition-colors">Olahraga Masyarakat</a>
              <a href="#kegiatan" className="text-gray-700 hover:text-green-600 transition-colors">Agenda</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Login
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-green-600">Home</a>
              <a href="#info" className="block px-3 py-2 text-gray-700 hover:text-green-600">Info</a>
              <a href="#data" className="block px-3 py-2 text-gray-700 hover:text-green-600">Data</a>
              <a href="#kegiatan" className="block px-3 py-2 text-gray-700 hover:text-green-600">Kegiatan</a>
              <a href="#kontak" className="block px-3 py-2 text-gray-700 hover:text-green-600">Kontak</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Slider Section */}
      <section id="home" className="relative h-screen sm:h-[600px] md:h-[700px] lg:h-[750px] flex items-center overflow-hidden">
        {sliderData.map((slide, idx) => (
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
              <Link
                href="/register"
                className="inline-flex items-center bg-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-lg font-semibold hover:bg-yellow-700 transition-colors shadow-lg"
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Link>
            </div>
          </div>
        ))}
        
        {/* Left Navigation Arrow */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length)}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderData.length)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Slider Controls - Dots */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {sliderData.map((_, idx) => (
            <button
              key={idx}
              className={`rounded-full border-2 border-white transition-all duration-300 ${currentSlide === idx ? 'bg-yellow-400 border-yellow-400 scale-125 w-4 h-4' : 'bg-white/40 w-3 h-3'}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section id="data" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Data Keolahragaan
            </h2>
            <p className="text-xl text-gray-600">
              Informasi lengkap tentang perkembangan olahraga di daerah
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Data diperbarui per 29 Januari 2026
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsData.map((stat, index) => (
              <Link href={`/data/${stat.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer group">
                  {/* Icon and Change */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.positive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  </div>

                  {/* Main Value */}
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-700 font-semibold mb-1">{stat.title}</p>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>

                  {/* Context Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 group-hover:text-green-600 transition-colors">
                      Lihat Detail →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Key Insights Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 p-6 mb-12">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Insight Utama</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">📈 Pertumbuhan Atlet:</span> Peningkatan 12% atlet terdaftar bulan ini, dengan fokus pada kategori usia muda.
                  </p>
                  <p>
                    <span className="font-semibold">🏆 Prestasi Terdepan:</span> Kecamatan Selatan memimpin dengan 20 fasilitas dalam kondisi baik.
                  </p>
                  <p>
                    <span className="font-semibold">📅 Aktivitas Mendatang:</span> 23 kegiatan olahraga dijadwalkan untuk kuartal ini.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tables and Analytics */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sarana Prasarana Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Building className="w-6 h-6 mr-2 text-blue-600" />
                    Data Sarana Prasarana
                  </h3>
                  <button
                    onClick={() => setActiveDataTable({ type: 'sarana', data: saranaData })}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                  >
                    Analisis Data
                  </button>
                </div>

                {/* District Filter */}
                <div className="flex flex-wrap gap-2">
                  {['Semua', ...saranaData.map(d => d.kecamatan)].map((district) => (
                    <button
                      key={district}
                      onClick={() => setSelectedFacilityDistrict(district === 'Semua' ? null : district)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedFacilityDistrict === (district === 'Semua' ? null : district)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Kecamatan</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Lapangan</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Gedung</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Kondisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saranaData
                      .filter(item => !selectedFacilityDistrict || item.kecamatan === selectedFacilityDistrict)
                      .map((item, index) => {
                        const totalFacilities = item.lapangan + item.gedung;
                        const conditionPercentage = Math.round((item.kondisiBaik / totalFacilities) * 100);
                        return (
                          <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-gray-900">{item.kecamatan}</td>
                            <td className="text-center py-3 px-4">
                              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                {item.lapangan}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                {item.gedung}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      conditionPercentage >= 80
                                        ? 'bg-green-500'
                                        : conditionPercentage >= 60
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${conditionPercentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 min-w-fit">
                                  {conditionPercentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Footer Stats */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Fasilitas</p>
                    <p className="text-lg font-bold text-gray-900">89</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Kondisi Baik</p>
                    <p className="text-lg font-bold text-green-600">83</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Perlu Perbaikan</p>
                    <p className="text-lg font-bold text-orange-600">6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prestasi Atlet Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-yellow-600" />
                    Prestasi Terkini
                  </h3>
                  <button
                    onClick={() => setActiveDataTable({ type: 'prestasi', data: prestasiData })}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                  >
                    Lihat Semua
                  </button>
                </div>
              </div>

              {/* Medal Type Breakdown */}
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">28</div>
                    <p className="text-xs font-semibold text-gray-700">
                      <Medal className="w-4 h-4 inline-block mr-1 text-yellow-600" />
                      Emas
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-500 mb-1">35</div>
                    <p className="text-xs font-semibold text-gray-700">
                      <Medal className="w-4 h-4 inline-block mr-1 text-gray-500" />
                      Perak
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">42</div>
                    <p className="text-xs font-semibold text-gray-700">
                      <Medal className="w-4 h-4 inline-block mr-1 text-orange-600" />
                      Perunggu
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievement Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Atlet</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Cabor</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Medali</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestasiData
                      .sort((a, b) => {
                        const medalOrder = { 'Emas': 0, 'Perak': 1, 'Perunggu': 2 };
                        return (medalOrder[a.medali] || 999) - (medalOrder[b.medali] || 999);
                      })
                      .slice(0, 4)
                      .map((item, index) => (
                        <tr key={index} className="border-b hover:bg-yellow-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-gray-900">{item.nama}</td>
                          <td className="py-3 px-4 text-gray-600">
                            <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                              {item.cabor}
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">
                            {item.medali !== '-' ? (
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                item.medali === 'Emas'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : item.medali === 'Perak'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {item.medali === 'Emas' ? '🥇' : item.medali === 'Perak' ? '🥈' : '🥉'} {item.medali}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Footer CTA */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setActiveDataTable({ type: 'prestasi', data: prestasiData })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-semibold text-sm"
                >
                  Lihat Semua Prestasi ({prestasiData.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Agenda Kegiatan
            </h2>
            <p className="text-xl text-gray-600">
              Lihat jadwal lengkap event dan kompetisi olahraga daerah
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={() => {
                      setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
                      if (currentMonth === 0) setCurrentYear(currentYear - 1);
                      setSelectedCalendarDate(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <h3 className="text-2xl font-bold text-gray-900">{monthName}</h3>
                  <button
                    onClick={() => {
                      setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
                      if (currentMonth === 11) setCurrentYear(currentYear + 1);
                      setSelectedCalendarDate(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    const hasEvents = day && getEventsForDate(new Date(currentYear, currentMonth, day)).length > 0;
                    const isSelected = selectedCalendarDate && day === selectedCalendarDate.getDate();
                    
                    return (
                      <div key={index}>
                        {day ? (
                          <button
                            onClick={() => handleDateClick(day)}
                            className={`w-full aspect-square flex items-center justify-center rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                              hasEvents
                                ? isSelected
                                  ? 'bg-green-600 text-white shadow-lg scale-105'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-400'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span>{day}</span>
                              {hasEvents && (
                                <div className="flex gap-1">
                                  {[...Array(Math.min(getEventsForDate(new Date(currentYear, currentMonth, day)).length, 3))].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-600'}`} />
                                  ))}
                                </div>
                              )}
                            </div>
                          </button>
                        ) : (
                          <div className="aspect-square" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Keterangan:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded" />
                      <span className="text-sm text-gray-600">Ada Event</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-50 rounded" />
                      <span className="text-sm text-gray-600">Tidak Ada Event</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details Panel */}
            <div className="lg:col-span-1">
              {selectedCalendarDate && selectedDateEvents.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold uppercase">Event pada tanggal</p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedCalendarDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCalendarDate(null);
                        setSelectedDateEvents([]);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedDateEvents.map((event, idx) => (
                      <div key={event.id} className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                        {selectedDateEvents.length > 1 && (
                          <div className="text-xs font-semibold text-green-700 mb-2 uppercase">Event {idx + 1}</div>
                        )}
                        
                        <h4 className="font-bold text-gray-900 mb-3">{event.name}</h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-600">{event.time}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Location className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-600">{event.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              event.category === 'Kompetisi' ? 'bg-blue-100 text-blue-700' :
                              event.category === 'Pelatihan' ? 'bg-purple-100 text-purple-700' :
                              event.category === 'Event Komunitas' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {event.category}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              event.level === 'Internasional' ? 'bg-red-100 text-red-700' :
                              event.level === 'Nasional' ? 'bg-blue-100 text-blue-700' :
                              event.level === 'Regional' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {event.level}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              event.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {event.status === 'Active' ? '✓ Aktif' : '✗ Tidak Aktif'}
                            </span>
                          </div>
                        </div>

                        {idx < selectedDateEvents.length - 1 && (
                          <div className="mt-4 pt-4 border-t border-green-200" />
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    Daftar Event
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center sticky top-24">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    Pilih tanggal dengan event untuk melihat detail
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="info" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Berita Terkini
              </h2>
              <p className="text-xl text-gray-600">
                Update terbaru dari dunia olahraga daerah
              </p>
            </div>
            <button className="hidden md:flex items-center text-green-600 hover:text-green-800 font-semibold">
              Lihat Semua
              <ChevronRight className="ml-1 w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((news) => (
              <div key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="relative">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      news.category === 'Trending' ? 'bg-red-500 text-white' :
                      news.category === 'Latest' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{news.title}</h3>
                  <p className="text-gray-600 mb-4">{news.excerpt}</p>
                  <button
                    onClick={() => setActiveNews(news)}
                    className="text-green-600 hover:text-green-800 font-semibold flex items-center"
                  >
                    Baca Selengkapnya
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Grid Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Galeri Kegiatan
              </h2>
              <p className="text-xl text-gray-600">
                Dokumentasi kegiatan olahraga dan prestasi atlet
              </p>
            </div>
            <button className="hidden md:flex items-center text-green-600 hover:text-green-800 font-semibold">
              Lihat Semua
              <ChevronRight className="ml-1 w-5 h-5" />
            </button>
          </div>

          {/* Gallery Grid Carousel */}
          <div className="relative w-full">
            {/* Carousel Container - with proper responsive padding for navigation controls */}
            <div className="relative w-full mx-auto px-0 sm:px-2 lg:px-0">
              {/* Carousel Wrapper */}
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
                  style={{
                    transform: `translateX(calc(-${currentGallerySlide} * (100% / 1 + (${currentGallerySlide === 0 ? 0 : 1} * 16px / 1))))`,
                  }}
                >
                  {galleryData.map((item) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
                    >
                      <div className="relative h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-lg group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Title Overlay - Top Left */}
                        <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-20">
                          <p className="text-xs sm:text-sm text-gray-200 mb-1">
                            {item.date}
                          </p>
                          <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white drop-shadow-lg max-w-xs leading-tight">
                            {item.title}
                          </h3>
                        </div>

                        {/* Description - Bottom (Hidden on Mobile, Visible on Larger Screens) */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 z-20 hidden sm:block">
                          <p className="text-xs sm:text-sm text-gray-100 drop-shadow-lg line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Controls - Overlaid on Carousel */}
                {/* Left Navigation Arrow */}
                <button
                  onClick={() =>
                    setCurrentGallerySlide((prev) =>
                      prev === 0 ? galleryData.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 group hover:shadow-xl"
                  aria-label="Previous gallery items"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  onClick={() =>
                    setCurrentGallerySlide((prev) =>
                      prev === galleryData.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-900 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 group hover:shadow-xl"
                  aria-label="Next gallery items"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Carousel Indicators - Below Carousel */}
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {galleryData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGallerySlide(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    currentGallerySlide === idx
                      ? 'bg-gray-900 w-8 h-3'
                      : 'bg-gray-400 w-3 h-3 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to gallery item ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SIDORA</h3>
                </div>
              </div>
              <p className="text-gray-400">
                Sistem informasi terpadu untuk mengelola data olahraga, atlet, dan prestasi daerah.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Link Terkait</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-300 transition-colors">Tentang SIDORA</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Panduan Penggunaan</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Bantuan</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Data</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-300 transition-colors">Data Atlet</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Data Klub</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Sarana Olahraga</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Prestasi</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@sidora.go.id</li>
                <li>(022) 5895643</li>
                <li>Pamekaran, Soreang, Bandung Regency, West Java 40912</li>
                <li>Kab.Bandung, Jawa Barat</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">👥 Pengunjung</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total Pengunjung</p>
                  <p className="text-2xl font-bold text-green-400">
                    {analyticsData.totalVisitors.toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Hari Ini</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {analyticsData.visitorsToday}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SIDORA - Sistem Informasi Data Keolahragaan. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals
      {activeNews && (
        <NewsModal 
          news={activeNews} 
          onClose={() => setActiveNews(null)} 
        />
      )}
      
      {activeGallery && (
        <GalleryModal 
          gallery={activeGallery} 
          onClose={() => setActiveGallery(null)} 
        />
      )}
      
      {activeAgenda && (
        <AgendaModal 
          agenda={activeAgenda} 
          onClose={() => setActiveAgenda(null)} 
        />
      )}

      {activeDataTable && (
        <DataTableModal 
          data={activeDataTable} 
          onClose={() => setActiveDataTable(null)} 
        />
      )}

      {activeChart && (
        <ChartModal 
          data={activeChart} 
          onClose={() => setActiveChart(null)} 
        />
      )}

      {activeSportsBranch && (
        <SportsBranchModal 
          sport={activeSportsBranch} 
          onClose={() => setActiveSportsBranch(null)} 
        />
      )}

      {activeCommunityProgram && (
        <CommunityProgramModal 
          program={activeCommunityProgram} 
          onClose={() => setActiveCommunityProgram(null)} 
        />
      )} */}
    </div>
  );
}
