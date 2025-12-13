// Client Component - Solo maneja interactividad
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TierSelector, ProductTier } from '@/components/product/TierSelector';
import { Heart, Share2, ShieldCheck, Truck } from 'lucide-react';

interface ProductVariant {
    id: string;
    tier: ProductTier;
    price: number;
    stock: number;
    condition: string;
    images: string[];
}

interface Product {
    id: string;
    title: string;
    description: string;
    franchise: string;
    brand: string;
    variants: ProductVariant[];
}

export default function ProductClient({ product }: { product: Product }) {
    const [selectedTier, setSelectedTier] = useState<ProductTier>(
        product.variants[0]?.tier || 'OFFICIAL'
    );

    const currentVariant = product.variants.find(v => v.tier === selectedTier) || product.variants[0];
    const xpReward = Math.floor(currentVariant.price / 100);
    const coinsReward = Math.floor(currentVariant.price / 1000);

    const handleAddToCart = () => {
        console.log(`Added Variant ${currentVariant.id} (${selectedTier}) to Cart`);
        // TODO: Implementar lógica de carrito
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 1. Gallery */}
            <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border shadow-lg relative group">
                    <img
                        src={currentVariant.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Tier Badge */}
                    <div className="absolute top-4 left-4">
                        {selectedTier === 'OFFICIAL' && (
                            <Badge className="bg-primary text-primary-foreground font-bold shadow-lg">✨ New Import</Badge>
                        )}
                        {selectedTier === 'SECOND_HAND' && (
                            <Badge className="bg-secondary text-secondary-foreground font-bold shadow-lg">🛡️ Verified</Badge>
                        )}
                        {selectedTier === 'BATTLE_DAMAGED' && (
                            <Badge variant="destructive" className="font-bold shadow-lg">⚠️ See Details</Badge>
                        )}
                    </div>
                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                            <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg border border-border cursor-pointer hover:border-primary transition-colors overflow-hidden">
                            <img
                                src={currentVariant.images[0]}
                                alt={`Thumbnail ${i}`}
                                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Product Info Panel */}
            <div className="flex flex-col gap-6">
                {/* Title Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-primary tracking-wider uppercase">{product.franchise}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{product.brand}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{product.title}</h1>
                    <div className="flex items-center gap-2 text-amber-500">
                        <span>★★★★★</span>
                        <span className="text-muted-foreground text-sm">(12 Reviews)</span>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Tier Selector */}
                <div className="space-y-4">
                    <h3 className="font-bold text-base">Select Condition:</h3>
                    <TierSelector
                        variants={product.variants}
                        selectedTier={selectedTier}
                        onSelect={setSelectedTier}
                    />
                </div>

                {/* Purchase Card */}
                <div className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-sm">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Total Price</p>
                            <div className="text-4xl font-bold text-primary">
                                ${currentVariant.price.toLocaleString('es-AR')}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-secondary font-bold mb-1">REWARDS</p>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                                    +{xpReward} XP
                                </Badge>
                                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                                    +{coinsReward} 🪙
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full text-lg h-14 bg-primary hover:bg-primary/90 glow-primary"
                        disabled={currentVariant.stock === 0}
                        onClick={handleAddToCart}
                    >
                        {currentVariant.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </Button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="w-4 h-4 text-secondary" />
                            <span>100% Original</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Truck className="w-4 h-4 text-secondary" />
                            <span>Fast Shipping</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="prose prose-sm text-muted-foreground">
                    <h3 className="font-bold text-foreground text-base">Description</h3>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}
