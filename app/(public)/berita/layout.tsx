import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Berita Olahraga Terkini | SIDORA',
  description: 'Baca berita dan artikel olahraga terkini dari berbagai kategori. Dapatkan informasi tentang atlet, event, dan perkembangan dunia olahraga.',
  keywords: ['berita olahraga', 'artikel olahraga', 'berita atlet', 'berita event olahraga', 'informasi keolahragaan'],
  authors: [{ name: 'SIDORA' }],
  openGraph: {
    title: 'Berita Olahraga Terkini | SIDORA',
    description: 'Berita dan artikel olahraga terkini dengan informasi lengkap tentang event dan atlet',
    url: 'https://sidora.bandungkab.go.id/berita',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berita Olahraga Terkini | SIDORA',
    description: 'Berita dan artikel olahraga terkini dengan informasi lengkap',
  },
};

export default function BeritaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
