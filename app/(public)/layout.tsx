import { Metadata } from 'next';
import { Navbar, Footer } from "@/components/public/navigation";

export const metadata: Metadata = {
  title: 'SIDORA - Sistem Informasi Data Keolahragaan | Portal Utama',
  description: 'SIDORA adalah sistem informasi terintegrasi untuk mengelola data keolahragaan, atlet, dan infrastruktur olahraga. Akses data agenda, berita, galeri, dan pencapaian olahraga.',
  keywords: ['keolahragaan', 'data olahraga', 'atlet', 'infrastruktur olahraga', 'agenda olahraga', 'berita olahraga', 'SIDORA'],
  authors: [{ name: 'SIDORA' }],
  openGraph: {
    title: 'SIDORA - Sistem Informasi Data Keolahragaan',
    description: 'Portal informasi terintegrasi untuk data keolahragaan, atlet, dan infrastruktur olahraga',
    url: 'https://sidora.id',
    siteName: 'SIDORA',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIDORA - Sistem Informasi Data Keolahragaan',
    description: 'Portal informasi terintegrasi untuk data keolahragaan, atlet, dan infrastruktur olahraga',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
