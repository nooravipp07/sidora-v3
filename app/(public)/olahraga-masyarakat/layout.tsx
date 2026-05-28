import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Olahraga Masyarakat | Program dan Data Kegiatan | SIDORA',
  description: 'Informasi lengkap tentang program olahraga masyarakat, kegiatan, dan partisipasi masyarakat dalam aktivitas olahraga.',
  keywords: ['olahraga masyarakat', 'program olahraga', 'kegiatan olahraga', 'partisipasi masyarakat', 'aktivitas olahraga'],
  authors: [{ name: 'SIDORA' }],
  openGraph: {
    title: 'Olahraga Masyarakat | SIDORA',
    description: 'Program dan data kegiatan olahraga masyarakat dengan informasi partisipasi',
    url: 'https://sidora.bandungkab.go.id/olahraga-masyarakat',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olahraga Masyarakat | SIDORA',
    description: 'Program dan data kegiatan olahraga masyarakat',
  },
};

export default function OlahragaMasyarakatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
