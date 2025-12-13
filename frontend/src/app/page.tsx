import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Mock Data
  const featuredProducts = [
    {
      id: "1",
      slug: "goku-ssj-grandista",
      title: "Dragon Ball Z - Goku SSJ Grandista",
      price: 85000,
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop",
      badges: ["Nuevo", "Importado"],
      tier: "OFFICIAL" as const
    },
    {
      id: "2",
      slug: "blue-eyes-white-dragon",
      title: "Blue Eyes White Dragon - SDK-001",
      price: 120000,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
      badges: ["Rare", "1st Edition"],
      tier: "SECOND_HAND" as const
    },
    {
      id: "3",
      slug: "pikachu-plush-vintage",
      title: "Pikachu Plush Vintage 1999",
      price: 45000,
      image: "https://images.unsplash.com/photo-1542779283-308bc0facc55?q=80&w=2000&auto=format&fit=crop",
      badges: ["Vintage"],
      tier: "BATTLE_DAMAGED" as const
    },
    {
      id: "4",
      slug: "gengar-lamp",
      title: "Gengar Neon LED Light",
      price: 32000,
      image: "https://images.unsplash.com/photo-1563223605-e37fe544521f?q=80&w=1974&auto=format&fit=crop",
      badges: ["Decor"],
      tier: "OFFICIAL" as const
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-20 px-8 md:px-16 shadow-2xl mt-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Encuentra tu próximo <span className="text-amber-400">Tesoro Legendario</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
            Explora la Armería, descubre Pergaminos antiguos y aprovecha las ofertas del Mercado Negro. Solo para verdaderos aventureros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg" asChild>
              <Link href="/products">Explorar Armería ⚔️</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link href="/products?tier=SECOND_HAND">Mercado Negro ☠️</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Link href="/products" className="group relative h-48 rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:border-amber-500/50 transition-colors">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.05))]"></div>
          <div className="text-center z-10">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">⚔️</div>
            <h3 className="text-xl font-bold text-white">Figuras & Estatuas</h3>
            <p className="text-zinc-400 text-sm">Banpresto, Figma, SH Figuarts</p>
          </div>
        </Link>
        {/* Card 2 */}
        <Link href="/cards" className="group relative h-48 rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:border-blue-500/50 transition-colors">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.05))]"></div>
          <div className="text-center z-10">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">📜</div>
            <h3 className="text-xl font-bold text-white">Cartas (TCG)</h3>
            <p className="text-zinc-400 text-sm">Yu-Gi-Oh!, Pokémon, Magic</p>
          </div>
        </Link>
        {/* Card 3 */}
        <Link href="/used" className="group relative h-48 rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:border-red-500/50 transition-colors">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.05))]"></div>
          <div className="text-center z-10">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">☠️</div>
            <h3 className="text-xl font-bold text-white">Mercado Negro</h3>
            <p className="text-zinc-400 text-sm">Oportunidades de Segunda Mano</p>
          </div>
        </Link>
      </section>

      {/* Latest Drops */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Novedades del Reino</h2>
          <Button variant="ghost" asChild>
            <Link href="/products" className="flex items-center gap-2">Ver todo <ArrowRight className="w-4 h-4" /></Link>
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
