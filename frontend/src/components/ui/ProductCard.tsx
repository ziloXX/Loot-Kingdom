"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/lib/mock-data";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { showToast } = useToast();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        // Check auth first
        if (!isAuthenticated) {
            showToast("info", "Debes iniciar sesión para agregar items");
            router.push("/auth");
            return;
        }

        setIsAdding(true);
        try {
            const response = await api.addToCart(product.id);

            if (response.error) {
                showToast("error", response.error);
                return;
            }

            showToast("cart", `¡${product.title} equipado!`);
        } catch (error) {
            console.error("Add to cart failed:", error);
            showToast("error", "Error al agregar al carrito");
        } finally {
            setIsAdding(false);
        }
    };

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
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || isAdding}
                        className="p-2 bg-rpg-primary hover:bg-rpg-primary-dark disabled:bg-rpg-bg-tertiary disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                        {isAdding ? (
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : (
                            <ShoppingCart className="w-4 h-4 text-white" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
