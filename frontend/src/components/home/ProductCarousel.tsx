"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/mock-data";

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    products: Product[];
}

export default function ProductCarousel({ title, subtitle, products }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 300;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-pixel text-xl text-rpg-gold">{title}</h2>
                        {subtitle && (
                            <p className="text-rpg-text-muted text-sm mt-1">{subtitle}</p>
                        )}
                    </div>

                    {/* Carousel Controls - Pixel Art Style */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="w-10 h-10 flex items-center justify-center bg-rpg-bg-secondary border-2 border-rpg-bg-tertiary rounded hover:border-rpg-primary hover:text-rpg-primary transition-colors"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-10 h-10 flex items-center justify-center bg-rpg-bg-secondary border-2 border-rpg-bg-tertiary rounded hover:border-rpg-primary hover:text-rpg-primary transition-colors"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Products Carousel */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="w-[220px] md:w-[250px] shrink-0 snap-start"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
