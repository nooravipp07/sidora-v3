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
  Activity
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
      title: "Klub Olahraga",
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
      title: "Event Terjadwal",
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
                <p className="text-xs text-gray-500">Sistem Informasi Data Keolahragaan</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">Home</a>
              <a href="#info" className="text-gray-700 hover:text-green-600 transition-colors">Info</a>
              <a href="#data" className="text-gray-700 hover:text-green-600 transition-colors">Data</a>
              <a href="#cabang-olahraga" className="text-gray-700 hover:text-green-600 transition-colors">Cabang Olahraga</a>
              <a href="#olahraga-masyarakat" className="text-gray-700 hover:text-green-600 transition-colors">Olahraga Masyarakat</a>
              <a href="#kegiatan" className="text-gray-700 hover:text-green-600 transition-colors">Kegiatan</a>
              <a href="#kontak" className="text-gray-700 hover:text-green-600 transition-colors">Kontak</a>
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
              <a href="#cabang-olahraga" className="block px-3 py-2 text-gray-700 hover:text-green-600">Cabang Olahraga</a>
              <a href="#olahraga-masyarakat" className="block px-3 py-2 text-gray-700 hover:text-green-600">Olahraga Masyarakat</a>
              <a href="#kegiatan" className="block px-3 py-2 text-gray-700 hover:text-green-600">Kegiatan</a>
              <a href="#kontak" className="block px-3 py-2 text-gray-700 hover:text-green-600">Kontak</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Sistem Informasi
                <span className="block text-yellow-400">Data Keolahragaan</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-green-100">
                Platform terpadu untuk mengelola data olahraga, atlet, dan prestasi daerah
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="bg-yellow-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center"
                >
                  Daftar Sekarang
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {statsData.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                      <p className="text-blue-100 text-sm">{stat.subtitle}</p>
                      <div className={`flex items-center justify-center mt-1 text-xs ${stat.positive ? 'text-green-300' : 'text-red-300'}`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section id="data" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Data Keolahragaan Terkini
            </h2>
            <p className="text-xl text-gray-600">
              Informasi lengkap tentang perkembangan olahraga di daerah
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600 mb-1">{stat.title}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Data Tables and Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sarana Prasarana Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Building className="w-6 h-6 mr-2 text-blue-600" />
                  Data Sarana Prasarana
                </h3>
                <button
                  onClick={() => setActiveDataTable({ type: 'sarana', data: saranaData })}
                  className="text-green-600 hover:text-green-800 font-semibold flex items-center"
                >
                  Lihat Detail
                  <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Kecamatan</th>
                      <th className="text-center py-2">Lapangan</th>
                      <th className="text-center py-2">Gedung</th>
                      <th className="text-center py-2">Kondisi Baik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saranaData.slice(0, 3).map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{item.kecamatan}</td>
                        <td className="text-center py-2">{item.lapangan}</td>
                        <td className="text-center py-2">{item.gedung}</td>
                        <td className="text-center py-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {item.kondisiBaik}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setActiveChart({ type: 'sarana', data: chartData.sarana })}
                  className="text-green-600 hover:text-green-800 flex items-center"
                >
                  <PieChart className="w-4 h-4 mr-1" />
                  Lihat Grafik
                </button>
                <span className="text-sm text-gray-500">Total: 89 Fasilitas</span>
              </div>
            </div>

            {/* Prestasi Atlet Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-600" />
                  Prestasi Terkini
                </h3>
                <button
                  onClick={() => setActiveDataTable({ type: 'prestasi', data: prestasiData })}
                  className="text-green-600 hover:text-green-800 font-semibold flex items-center"
                >
                  Lihat Detail
                  <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nama</th>
                      <th className="text-left py-2">Cabor</th>
                      <th className="text-center py-2">Kategori</th>
                      <th className="text-center py-2">Medali</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestasiData.slice(0, 3).map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{item.nama}</td>
                        <td className="py-2">{item.cabor}</td>
                        <td className="text-center py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.kategori === 'Atlet' ? 'bg-blue-100 text-blue-800' :
                            item.kategori === 'Pelatih' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.kategori}
                          </span>
                        </td>
                        <td className="text-center py-2">
                          {item.medali !== '-' ? (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.medali === 'Emas' ? 'bg-yellow-100 text-yellow-800' :
                              item.medali === 'Perak' ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {item.medali}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setActiveChart({ type: 'prestasi', data: chartData.prestasi })}
                  className="text-green-600 hover:text-green-800 flex items-center"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Lihat Grafik
                </button>
                <span className="text-sm text-gray-500">Total: 105 Prestasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cabang Olahraga Section */}
      <section id="cabang-olahraga" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Cabang Olahraga
            </h2>
            <p className="text-xl text-gray-600">
              Berbagai cabang olahraga yang dikembangkan di daerah
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sepak Bola',
                icon: '⚽',
                athletes: 245,
                clubs: 28,
                facilities: 15,
                achievements: 'Juara 1 POPDA 2023',
                description: 'Cabang olahraga paling populer dengan partisipasi terbanyak'
              },
              {
                name: 'Bulu Tangkis',
                icon: '🏸',
                athletes: 189,
                clubs: 22,
                facilities: 12,
                achievements: 'Juara 2 PORDA 2023',
                description: 'Olahraga prestasi dengan banyak atlet berbakat'
              },
              {
                name: 'Basket',
                icon: '🏀',
                athletes: 156,
                clubs: 18,
                facilities: 8,
                achievements: 'Juara 3 O2SN 2023',
                description: 'Berkembang pesat di kalangan pelajar dan mahasiswa'
              },
              {
                name: 'Voli',
                icon: '🏐',
                athletes: 134,
                clubs: 16,
                facilities: 10,
                achievements: 'Juara 1 Liga Daerah',
                description: 'Olahraga tim yang populer di berbagai kalangan'
              },
              {
                name: 'Renang',
                icon: '🏊',
                athletes: 98,
                clubs: 12,
                facilities: 4,
                achievements: 'Juara 2 Kejuaraan Daerah',
                description: 'Olahraga individual dengan prestasi membanggakan'
              },
              {
                name: 'Atletik',
                icon: '🏃',
                athletes: 87,
                clubs: 10,
                facilities: 6,
                achievements: 'Juara 1 Marathon Daerah',
                description: 'Induk dari semua cabang olahraga'
              }
            ].map((sport, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{sport.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sport.name}</h3>
                  <p className="text-gray-600 text-sm">{sport.description}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Atlet</span>
                    <span className="font-semibold text-green-600">{sport.athletes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Klub</span>
                    <span className="font-semibold text-green-600">{sport.clubs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fasilitas</span>
                    <span className="font-semibold text-green-600">{sport.facilities}</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2">Prestasi Terbaru</h4>
                  <p className="text-green-800 text-sm">{sport.achievements}</p>
                </div>
                
                <button 
                  onClick={() => setActiveSportsBranch(sport)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Olahraga Masyarakat Section */}
      <section id="olahraga-masyarakat" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Olahraga Masyarakat
            </h2>
          </div>
          {/* Community Sports Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Statistik Partisipasi Masyarakat</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Total Peserta Aktif', value: '5,420', icon: Users, color: 'text-green-600' },
                { label: 'Program Berjalan', value: '28', icon: Activity, color: 'text-blue-600' },
                { label: 'Lokasi Kegiatan', value: '67', icon: MapPin, color: 'text-orange-600' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community Programs */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Program Olahraga Masyarakat</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Yoga Pagi',
                  schedule: 'Senin, Rabu, Jumat - 06:00',
                  location: 'Taman Kota',
                  participants: 85,
                  level: 'Pemula - Menengah'
                },
                {
                  name: 'Zumba Dance',
                  schedule: 'Selasa, Kamis - 17:00',
                  location: 'GOR Kecamatan',
                  participants: 120,
                  level: 'Semua Level'
                },
                {
                  name: 'Tai Chi',
                  schedule: 'Sabtu, Minggu - 06:30',
                  location: 'Alun-alun',
                  participants: 65,
                  level: 'Lansia'
                },
                {
                  name: 'Aerobik',
                  schedule: 'Senin, Kamis - 17:30',
                  location: 'Lapangan Desa',
                  participants: 95,
                  level: 'Semua Level'
                },
                {
                  name: 'Lari Pagi',
                  schedule: 'Setiap Hari - 05:30',
                  location: 'Berbagai Rute',
                  participants: 200,
                  level: 'Semua Level'
                },
                {
                  name: 'Senam Lansia',
                  schedule: 'Rabu, Jumat - 08:00',
                  location: 'Puskesmas',
                  participants: 45,
                  level: 'Lansia'
                }
              ].map((program, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{program.name}</h4>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      <span>{program.schedule}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-green-600" />
                      <span>{program.participants} peserta</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      {program.level}
                    </span>
                    <button 
                      onClick={() => setActiveCommunityProgram(program)}
                      className="text-green-600 hover:text-green-800 font-semibold text-sm"
                    >
                      Detail Program
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="info" className="py-20 bg-white">
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

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Galeri Kegiatan
            </h2>
            <p className="text-xl text-gray-600">
              Dokumentasi kegiatan olahraga dan prestasi atlet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryData.map((item) => (
              <div key={item.id} className="group cursor-pointer" onClick={() => setActiveGallery(item)}>
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section id="kegiatan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Agenda Kegiatan
            </h2>
            <p className="text-xl text-gray-600">
              Jadwal kegiatan dan event olahraga mendatang
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agendaData.map((agenda) => (
              <div key={agenda.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="relative">
                  <img 
                    src={agenda.image} 
                    alt={agenda.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      agenda.category === 'Trending' ? 'bg-red-500 text-white' :
                      agenda.category === 'Latest' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {agenda.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{agenda.date} • {agenda.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Location className="w-4 h-4 mr-2" />
                    <span>{agenda.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{agenda.title}</h3>
                  <p className="text-gray-600 mb-4">{agenda.description}</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setActiveAgenda(agenda)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      Detail
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                      Daftar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-20 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Hubungi Kami
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Memiliki pertanyaan atau ingin bergabung? Hubungi tim SIDORA sekarang juga.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4 text-green-300" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-green-100">info@sidora.go.id</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4 text-green-300" />
                  <div>
                    <p className="font-semibold">Telepon</p>
                    <p className="text-green-100">(021) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Location className="w-6 h-6 mr-4 text-green-300" />
                  <div>
                    <p className="font-semibold">Alamat</p>
                    <p className="text-green-100">Jl. Olahraga No. 123, Kota, Provinsi</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Kirim Pesan</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nama</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pesan</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Tulis pesan Anda..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SIDORA</h3>
                  <p className="text-sm text-gray-400">Data Keolahragaan</p>
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
                <li>(021) 123-4567</li>
                <li>Jl. Olahraga No. 123</li>
                <li>Kota, Provinsi</li>
              </ul>
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
