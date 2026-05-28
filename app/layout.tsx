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
  description: "SIDORA adalah sistem informasi terintegrasi untuk mengelola dan mengakses data keolahragaan, atlet, infrastruktur, dan event olahraga secara komprehensif.",
  keywords: ["keolahragaan", "data olahraga", "sistem informasi keolahragaan", "atlet", "infrastruktur olahraga kabupaten bandung", "agenda olahraga", "berita olahraga", "galeri olahraga", "pencapaian olahraga"],
  authors: [{ name: "SIDORA" }],
  metadataBase: new URL("https://sidora.bandungkab.go.id"),
  icons: {
    icon: "/favicon.ico",
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
