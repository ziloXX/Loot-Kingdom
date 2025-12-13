"use client";

import { use, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierSelector, ProductTier } from "@/components/product/TierSelector";
import { ArrowLeft, Heart, Share2, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

type Params = {
    slug: string;
};

// Mock Data Structure
const MOCK_PRODUCT = {
    id: "1",
    title: "Dragon Ball Z - Goku SSJ Grandista",
    description: "The Grandista figure of Super Saiyan Goku captures all the intensity of the Z warrior. Standing at 28cm with premium sculpt details, this piece is essential for any Saiyan shrine.",
    franchise: "Dragon Ball Z",
    brand: "Banpresto",
    variants: [
        {
            id: "v1",
            tier: "OFFICIAL" as ProductTier,
            price: 85000,
            stock: 5,
            condition: "New - Factory Sealed",
            images: ["https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop"]
        },
        {
            id: "v2",
            tier: "SECOND_HAND" as ProductTier,
            price: 68000,
            stock: 1,
            condition: "Open Box - Figure Perfect",
            images: ["https://images.unsplash.com/photo-1620336655554-7236d626359f?q=80&w=2000&auto=format&fit=crop"]
        },
        {
            id: "v3",
            tier: "BATTLE_DAMAGED" as ProductTier,
            price: 45000,
            stock: 0,
            condition: "No box - Minor boot detail",
            images: ["https://images.unsplash.com/photo-1542779283-308bc0facc55?q=80&w=2000&auto=format&fit=crop"]
        }
    ]
};

export default function ProductPage({ params }: { params: Promise<Params> }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug } = use(params);

    const [selectedTier, setSelectedTier] = useState<ProductTier>('OFFICIAL');

    const currentVariant = MOCK_PRODUCT.variants.find(v => v.tier === selectedTier) || MOCK_PRODUCT.variants[0];
    const xpReward = Math.floor(currentVariant.price / 100);
    const coinsReward = Math.floor(currentVariant.price / 1000);

    const handleAddToCart = () => {
        console.log(`Added Variant ${currentVariant.id} (${selectedTier}) to Cart`);
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/products" className="hover:text-primary flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
                <span>/</span>
                <span className="text-foreground">{MOCK_PRODUCT.franchise}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 1. Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border shadow-lg relative group">
                        <img
                            src={currentVariant.images[0]}
                            alt={MOCK_PRODUCT.title}
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
                            <span className="text-sm font-bold text-primary tracking-wider uppercase">{MOCK_PRODUCT.franchise}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{MOCK_PRODUCT.brand}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{MOCK_PRODUCT.title}</h1>
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
                            variants={MOCK_PRODUCT.variants}
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
                        <p>{MOCK_PRODUCT.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
