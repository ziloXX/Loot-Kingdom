import Header from "@/components/layout/Header";
import HeroBento from "@/components/home/HeroBento";
import ProductCarousel from "@/components/home/ProductCarousel";
import { getProducts } from "@/lib/api";
import { mockProducts } from "@/lib/mock-data";

export default async function HomePage() {
  // Fetch products from API
  let products = await getProducts();

  // Fallback to mock data if API fails
  if (!products || products.length === 0) {
    console.warn("API unavailable, using mock data");
    products = mockProducts;
  }

  // Get newest products (first 6)
  const newArrivals = products.slice(0, 6);

  // Get official items for featured section
  const officialItems = products.filter((p) => p.tier === "OFFICIAL").slice(0, 6);

  // Get budget-friendly items
  const budgetItems = products.filter((p) => p.tier === "BOOTLEG").slice(0, 6);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Bento Grid */}
        <HeroBento />

        {/* New Arrivals Carousel */}
        <ProductCarousel
          title="NUEVOS INGRESOS"
          subtitle="Los últimos items que llegaron al reino"
          products={newArrivals}
        />

        {/* Official Items Section */}
        <ProductCarousel
          title="⭐ OFICIALES"
          subtitle="Productos con licencia original"
          products={officialItems}
        />

        {/* Budget Friendly Section */}
        <ProductCarousel
          title="🔥 ALTERNATIVAS"
          subtitle="Calidad a precio accesible"
          products={budgetItems}
        />

        {/* Call to Action */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="pixel-border-gold bg-rpg-bg p-8 md:p-12">
              <h2 className="font-pixel text-xl md:text-2xl text-rpg-gold mb-4">
                ¡ÚNETE A LA AVENTURA!
              </h2>
              <p className="text-rpg-text-muted mb-6 max-w-xl mx-auto">
                Registrate y gana LootCoins con cada compra. Canjealos por descuentos exclusivos y desbloquea recompensas legendarias.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="rpg-button-gold font-pixel text-xs">
                  CREAR CUENTA
                </button>
                <button className="rpg-button font-pixel text-xs">
                  VER TIENDA
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-rpg-bg-tertiary py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-rpg-gold text-lg">LK</span>
                <span className="text-rpg-text-muted text-sm">Loot Kingdom © 2024</span>
              </div>
              <div className="flex gap-6 text-sm text-rpg-text-muted">
                <a href="#" className="hover:text-rpg-primary transition-colors">Términos</a>
                <a href="#" className="hover:text-rpg-primary transition-colors">Privacidad</a>
                <a href="#" className="hover:text-rpg-primary transition-colors">Contacto</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
