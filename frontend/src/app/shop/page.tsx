"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import FilterSidebar, { type FilterState } from "@/components/catalog/FilterSidebar";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/api";
import { mockProducts, type Product } from "@/lib/mock-data";
import { Filter, Grid3X3, LayoutList, Loader2 } from "lucide-react";

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        category: null,
        condition: null,
        tier: null,
        priceRange: null,
    });
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Fetch products on mount and when filters change
    useEffect(() => {
        async function fetchProducts() {
            setIsLoading(true);

            try {
                const apiFilters: Record<string, string | number | undefined> = {};

                if (filters.category) apiFilters.category = filters.category;
                if (filters.condition) apiFilters.condition = filters.condition;
                if (filters.tier) apiFilters.tier = filters.tier;
                if (filters.priceRange) {
                    apiFilters.minPrice = filters.priceRange[0];
                    apiFilters.maxPrice = filters.priceRange[1] === Infinity ? undefined : filters.priceRange[1];
                }

                const data = await getProducts(apiFilters);

                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    // Fallback to mock data with local filtering
                    console.warn("API unavailable, using mock data");
                    const filtered = mockProducts.filter((product) => {
                        if (filters.category && product.category !== filters.category) return false;
                        if (filters.condition && product.condition !== filters.condition) return false;
                        if (filters.tier && product.tier !== filters.tier) return false;
                        if (filters.priceRange) {
                            const [min, max] = filters.priceRange;
                            if (product.price < min || product.price > max) return false;
                        }
                        return true;
                    });
                    setProducts(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts(mockProducts);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, [filters]);

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    return (
        <div className="min-h-screen">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="font-pixel text-2xl text-rpg-gold mb-2">TIENDA</h1>
                    <p className="text-rpg-text-muted text-sm">
                        Explora nuestro inventario de items legendarios
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 bg-rpg-bg-secondary/50 border border-rpg-bg-tertiary rounded-lg p-3">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-rpg-bg-tertiary/50 rounded text-sm"
                            >
                                <Filter className="w-4 h-4" />
                                Filtros
                            </button>

                            {/* Results Count */}
                            <p className="text-rpg-text-muted text-sm hidden lg:block">
                                <span className="text-rpg-text font-medium">{products.length}</span> items encontrados
                            </p>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded transition-colors ${viewMode === "grid"
                                            ? "bg-rpg-primary text-white"
                                            : "bg-rpg-bg-tertiary/50 text-rpg-text-muted hover:text-rpg-text"
                                        }`}
                                    aria-label="Grid view"
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded transition-colors ${viewMode === "list"
                                            ? "bg-rpg-primary text-white"
                                            : "bg-rpg-bg-tertiary/50 text-rpg-text-muted hover:text-rpg-text"
                                        }`}
                                    aria-label="List view"
                                >
                                    <LayoutList className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {showMobileFilters && (
                            <div className="lg:hidden mb-6">
                                <FilterSidebar onFilterChange={handleFilterChange} />
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="pixel-border bg-rpg-bg p-12 text-center">
                                <Loader2 className="w-8 h-8 text-rpg-primary animate-spin mx-auto mb-4" />
                                <p className="text-rpg-text-muted text-sm">Cargando items...</p>
                            </div>
                        ) : products.length > 0 ? (
                            /* Product Grid */
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                                        : "flex flex-col gap-4"
                                }
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="pixel-border bg-rpg-bg p-12 text-center">
                                <p className="font-pixel text-rpg-gold text-lg mb-2">NO HAY ITEMS</p>
                                <p className="text-rpg-text-muted text-sm">
                                    No encontramos items que coincidan con tus filtros.
                                </p>
                                <button
                                    onClick={() =>
                                        handleFilterChange({
                                            category: null,
                                            condition: null,
                                            tier: null,
                                            priceRange: null,
                                        })
                                    }
                                    className="rpg-button mt-4 text-sm"
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        )}

                        {/* Load More (placeholder) */}
                        {!isLoading && products.length > 0 && (
                            <div className="mt-8 text-center">
                                <button className="rpg-button font-pixel text-xs">
                                    CARGAR MÁS ITEMS
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
