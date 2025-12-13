import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Loot Kingdom",
  description: "The best place for anime collectibles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <Navbar />
        <main className="flex-1 container py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
