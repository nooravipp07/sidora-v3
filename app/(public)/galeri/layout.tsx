import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri Olahraga | Dokumentasi Foto Event dan Atlet | SIDORA',
  description: 'Jelajahi galeri foto lengkap dari berbagai event olahraga, atlet, dan momen penting keolahragaan. Koleksi dokumentasi visual dari aktivitas olahraga.',
  keywords: ['galeri olahraga', 'foto olahraga', 'galeri event', 'dokumentasi olahraga', 'foto atlet'],
  authors: [{ name: 'SIDORA' }],
  openGraph: {
    title: 'Galeri Olahraga | SIDORA',
    description: 'Koleksi foto lengkap dari event olahraga, atlet, dan momen penting keolahragaan',
    url: 'https://sidora.bandungkab.go.id/galeri',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galeri Olahraga | SIDORA',
    description: 'Koleksi foto lengkap dari event dan atlet olahraga',
  },
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
