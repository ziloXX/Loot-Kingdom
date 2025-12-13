import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Realistic Mock Data based on real e-commerce sources
  const featuredProducts = [
    {
      id: "1",
      slug: "luffy-gear-5-king-of-artist",
      title: "One Piece - Monkey D. Luffy Gear 5 King of Artist",
      price: 45000,
      image: "https://m.media-amazon.com/images/I/61Zu6J8xm2L._AC_SX679_.jpg",
      badges: ["Banpresto", "Official"],
      tier: "OFFICIAL" as const
    },
    {
      id: "2",
      slug: "blue-eyes-white-dragon-sdk",
      title: "Yu-Gi-Oh! - Blue-Eyes White Dragon (SDK-001)",
      price: 185000,
      image: "https://m.media-amazon.com/images/I/71I4+xDXRuL._AC_SX679_.jpg",
      badges: ["First Edition", "Rare"],
      tier: "SECOND_HAND" as const
    },
    {
      id: "3",
      slug: "pochita-plush-chainsaw-man",
      title: "Chainsaw Man - Pochita Jumbo Plush (40cm)",
      price: 32000,
      image: "https://m.media-amazon.com/images/I/71w-yJ-D+tL._AC_SX679_.jpg",
      badges: ["Official", "Sega"],
      tier: "OFFICIAL" as const
    },
    {
      id: "4",
      slug: "pokemon-gengar-lamp",
      title: "Pokemon - Gengar Ghost LED Night Light",
      price: 28000,
      image: "https://m.media-amazon.com/images/I/61jC8Kk9GLL._AC_SX679_.jpg",
      badges: ["Licensed"],
      tier: "OFFICIAL" as const
    },
  ];

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* 
        SOLARIS JAPAN INSPIRED HERO GRID 
        Layout: Center Figures, Left Columns, Right Columns
      */}
      <section className="container mx-auto px-4 md:px-6 mt-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">

          {/* LEFT COLUMN: Plushies & Cards */}
          <div className="flex flex-col gap-4 h-full">
            {/* Plushies */}
            <Link href="/products?category=PLUSHIE" className="relative flex-1 rounded-2xl overflow-hidden group hover-lift">
              <Image
                src="https://m.media-amazon.com/images/I/71UWLV3dY-L._AC_SL1500_.jpg"
                alt="Anime Plushies"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-md">PLUSHIES</h3>
                <p className="text-white/80 text-sm">Pokemon, Chainsaw Man & More</p>
              </div>
            </Link>
            {/* Cards */}
            <Link href="/products?category=TCG_CARD" className="relative flex-1 rounded-2xl overflow-hidden group hover-lift">
              <Image
                src="https://images.unsplash.com/photo-1622398576449-6e5f6e3e6e8d?q=80&w=2000&auto=format&fit=crop"
                alt="Trading Cards"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-md">TRADING CARDS</h3>
                <p className="text-white/80 text-sm">Yu-Gi-Oh! · Magic · Pokemon</p>
              </div>
            </Link>
          </div>

          {/* CENTER COLUMN: FIGURES (Main Focus) */}
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden group hover-lift h-[400px] md:h-full">
            <Link href="/products" className="block w-full h-full">
              <Image
                src="https://m.media-amazon.com/images/I/81Hca2xBKrL._AC_SL1500_.jpg"
                alt="Anime Figures Collection"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
              <div className="absolute bottom-8 left-8">
                <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded mb-2 w-fit">FEATURED</div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-lg mb-2">
                  FIGURES
                </h2>
                <p className="text-xl text-white/90 font-medium max-w-sm drop-shadow-md">
                  The best Scale Figures, Nendoroids & Statues from Japan.
                </p>
                <Button className="mt-6 bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-full" size="lg">
                  Shop Collection
                </Button>
              </div>
            </Link>
          </div>

          {/* RIGHT COLUMN: Accessories & Black Market */}
          <div className="flex flex-col gap-4 h-full">
            {/* Accessories / Decor */}
            <Link href="/products?category=DECOR" className="relative flex-1 rounded-2xl overflow-hidden group hover-lift">
              <Image
                src="https://m.media-amazon.com/images/I/71uX-0BZoSL._AC_SL1500_.jpg"
                alt="Anime Accessories"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-md">ACCESSORIES</h3>
                <p className="text-white/80 text-sm">Posters, Keychains & Goods</p>
              </div>
            </Link>
            {/* Black Market / Pre-owned */}
            <Link href="/products?tier=SECOND_HAND" className="relative flex-1 rounded-2xl overflow-hidden group hover-lift border-2 border-transparent hover:border-secondary">
              <Image
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000&auto=format&fit=crop"
                alt="Pre-Owned Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 saturate-50 group-hover:saturate-100"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">☠️</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter drop-shadow-md">BLACK MARKET</h3>
                </div>
                <p className="text-white/80 text-sm">Rare & Second Hand Treasures</p>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* Latest Drops */}
      <section className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">fresh loot</h2>
            <p className="text-muted-foreground">New arrivals just landed from Tokyo.</p>
          </div>
          <Button variant="ghost" asChild className="text-primary hover:bg-primary/10">
            <Link href="/products" className="flex items-center gap-2 font-bold">View All <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}
