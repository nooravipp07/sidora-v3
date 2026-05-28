import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Olahraga Prestasi | Data Atlet dan Pencapaian | SIDORA',
  description: 'Data lengkap atlet berprestasi, pencapaian, dan performa di berbagai cabang olahraga. Lihat profil atlet dan statistik prestasi mereka.',
  keywords: ['olahraga prestasi', 'atlet', 'pencapaian atlet', 'performa olahraga', 'data atlet', 'cabang olahraga'],
  authors: [{ name: 'SIDORA' }],
  openGraph: {
    title: 'Olahraga Prestasi | SIDORA',
    description: 'Data lengkap atlet berprestasi dan pencapaian di berbagai cabang olahraga',
    url: 'https://sidora.bandungkab.go.id/olahraga-prestasi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olahraga Prestasi | SIDORA',
    description: 'Data atlet berprestasi dan pencapaian olahraga',
  },
};

export default function OlahragaPrestasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
