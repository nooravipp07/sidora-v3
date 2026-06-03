import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/useAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SIDORA - Sistem Informasi Data Keolahragaan",
  description: "SIDORA (Sistem Informasi Data Olahraga Kabupaten Bandung) adalah platform terintegrasi untuk mengelola data atlet, cabang olahraga, sarana dan prasarana olahraga, prestasi, agenda event, serta informasi keolahragaan Kabupaten Bandung.",
  keywords: [
    // Brand
    "sidora",
    "sidora kabupaten bandung",
    "sidora olahraga",

    // Sistem dan data olahraga
    "sistem informasi keolahragaan",
    "sistem informasi olahraga",
    "database olahraga",
    "data keolahragaan",
    "data olahraga kabupaten bandung",
    "portal olahraga kabupaten bandung",

    // Atlet
    "data atlet",
    "profil atlet",
    "atlet kabupaten bandung",
    "prestasi atlet",
    "pembinaan atlet",

    // Infrastruktur
    "sarana olahraga",
    "prasarana olahraga",
    "fasilitas olahraga",
    "infrastruktur olahraga",
    "venue olahraga kabupaten bandung",

    // Event
    "agenda olahraga",
    "event olahraga",
    "jadwal pertandingan olahraga",
    "kompetisi olahraga",
    "turnamen olahraga",

    // Informasi publik
    "berita olahraga",
    "informasi olahraga",
    "galeri olahraga",
    "prestasi olahraga",
    "capaian olahraga",

    // Lokasi
    "olahraga kabupaten bandung",
    "dispora kabupaten bandung",
    "data olahraga jawa barat",
    "informasi atlet kabupaten bandung"
  ],
  authors: [{ name: "SIDORA" }],
  metadataBase: new URL("https://sidora.bandungkab.go.id"),
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "r79FcYRd6RTyWnY07iWv6v7YC6aVVWa1WkdOOk__kY0",
  },
  openGraph: {
    title: "SIDORA - Sistem Informasi Data Keolahragaan",
    description: "Sistem informasi terintegrasi untuk data keolahragaan, atlet, dan infrastruktur olahraga",
    url: "https://sidora.bandungkab.go.id",
    siteName: "SIDORA",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIDORA - Sistem Informasi Data Keolahragaan",
    description: "Sistem informasi terintegrasi untuk data keolahragaan",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://sidora.bandungkab.go.id",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
