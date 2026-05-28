import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agenda Keolahragaan | SIDORA',
  description: 'Lihat jadwal agenda keolahragaan terlengkap. Cari acara olahraga berdasarkan tanggal, lokasi, dan kategori di seluruh daerah.',
  keywords: ['agenda olahraga', 'jadwal olahraga', 'event olahraga', 'acara keolahragaan', 'kalender olahraga'],
  authors: [{ name: 'SIDORA' }],
  openGraph: {
    title: 'Agenda Keolahragaan | SIDORA',
    description: 'Lihat jadwal lengkap agenda keolahragaan dan event olahraga terkini',
    url: 'https://sidora.bandungkab.go.id/agenda',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenda Keolahragaan | SIDORA',
    description: 'Jadwal lengkap agenda keolahragaan dan event olahraga terkini',
  },
};

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
