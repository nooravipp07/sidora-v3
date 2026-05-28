import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infrastruktur Keolahragaan | Data Sarana dan Prasarana | SIDORA',
  description: 'Data lengkap infrastruktur keolahragaan termasuk sarana dan prasarana olahraga. Lihat distribusi fasilitas olahraga per kecamatan dan kategori.',
  keywords: ['infrastruktur olahraga', 'sarana olahraga', 'prasarana olahraga', 'fasilitas olahraga', 'lapangan olahraga'],
  authors: [{ name: 'SIDORA' }],
  openGraph: {
    title: 'Infrastruktur Keolahragaan | SIDORA',
    description: 'Data lengkap sarana dan prasarana olahraga dengan distribusi per wilayah',
    url: 'https://sidora.bandungkab.go.id/infrastruktur-keolahragaan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infrastruktur Keolahragaan | SIDORA',
    description: 'Data sarana dan prasarana olahraga dengan analisis lengkap',
  },
};

export default function InfrastrukturLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
