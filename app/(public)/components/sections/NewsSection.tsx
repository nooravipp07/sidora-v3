'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content: string;
  tags: string[];
}

interface NewsSectionProps {
  newsData?: NewsItem[];
  onNewsClick?: (news: NewsItem) => void;
}

const defaultNewsData: NewsItem[] = [
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

const NewsSection: React.FC<NewsSectionProps> = ({ 
  newsData = defaultNewsData,
  onNewsClick = () => {}
}) => {
  return (
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
                  onClick={() => onNewsClick(news)}
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
  );
};

export default NewsSection;
