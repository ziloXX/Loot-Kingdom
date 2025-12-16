"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import type { Product } from "@/lib/mock-data";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useAppStore();

    return (
        <div className="rpg-card overflow-hidden flex flex-col group">
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={product.images[0] || "https://placehold.co/400x500/1a1a2e/7c3aed?text=No+Image"}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Tier Badge */}
                <div className="absolute top-2 left-2">
                    <span className={product.tier === "OFFICIAL" ? "tier-official" : "tier-bootleg"}>
                        {product.tier === "OFFICIAL" ? "⭐ Oficial" : "Alt"}
                    </span>
                </div>

                {/* Condition Badge */}
                {product.condition !== "NEW" && (
                    <div className="absolute top-2 right-2">
                        <span className="bg-rpg-bg/80 text-rpg-text-muted text-[10px] px-2 py-1 rounded font-medium">
                            {product.condition === "USED" ? "Usado" : "Dañado"}
                        </span>
                    </div>
                )}

                {/* Stock Warning */}
                {product.stock <= 3 && product.stock > 0 && (
                    <div className="absolute bottom-2 left-2">
                        <span className="bg-rpg-danger/90 text-white text-[10px] px-2 py-1 rounded font-bold">
                            ¡Últimas {product.stock}!
                        </span>
                    </div>
                )}

                {/* Out of Stock */}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-rpg-bg/80 flex items-center justify-center">
                        <span className="font-pixel text-sm text-rpg-danger">AGOTADO</span>
                    </div>
                )}
            </Link>

            {/* Details */}
            <div className="p-4 flex flex-col flex-1">
                {/* Franchise */}
                {product.franchise && (
                    <span className="text-rpg-primary text-xs font-medium mb-1">
                        {product.franchise}
                    </span>
                )}

                {/* Title */}
                <Link href={`/product/${product.slug}`}>
                    <h3 className="text-rpg-text font-medium text-sm leading-tight mb-2 line-clamp-2 hover:text-rpg-primary transition-colors">
                        {product.title}
                    </h3>
                </Link>

                {/* Brand */}
                {product.brand && (
                    <span className="text-rpg-text-muted text-xs mb-3">
                        {product.brand}
                    </span>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Price & Add to Cart */}
                <div className="flex items-end justify-between gap-2 mt-auto">
                    <div>
                        <p className="font-pixel text-rpg-gold text-sm">
                            {formatPrice(product.price)}
                        </p>
                        {/* LootCoins potential */}
                        <p className="text-rpg-text-muted text-[10px] mt-0.5">
                            +{Math.floor(product.price / 10000)} LC
                        </p>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="p-2 bg-rpg-primary hover:bg-rpg-primary-dark disabled:bg-rpg-bg-tertiary disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
