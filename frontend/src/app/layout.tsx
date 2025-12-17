import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loot Kingdom | RPG Item Shop",
  description: "Your legendary destination for anime figures, cards, and collectibles. Every purchase is an adventure.",
  keywords: ["anime", "figures", "collectibles", "Argentina", "JRPG", "gaming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${pressStart.variable} font-sans antialiased bg-rpg-bg text-rpg-text min-h-screen`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
