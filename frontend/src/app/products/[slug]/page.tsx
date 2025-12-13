"use client";

import { use, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierSelector, ProductTier } from "@/components/product/TierSelector";
// import { useToast } from "@/components/ui/use-toast";

type Params = {
    slug: string;
};

// Mock Data Structure
const MOCK_PRODUCT = {
    id: "1",
    title: "Dragon Ball Z - Goku SSJ Grandista",
    description: "La figura Grandista de Goku Super Saiyan captura toda la intensidad del guerrero Z. Con 28cm de altura y detalles de escultura premium, esta pieza es indispensable para cualquier altar Saiyan.",
    franchise: "Dragon Ball Z",
    brand: "Banpresto",
    variants: [
        {
            id: "v1",
            tier: "OFFICIAL" as ProductTier,
            price: 85000,
            stock: 5,
            condition: "Nuevo - Sellado de Fábrica",
            images: ["https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop"]
        },
        {
            id: "v2",
            tier: "SECOND_HAND" as ProductTier,
            price: 68000,
            stock: 1,
            condition: "Caja Abierta - Figura Perfecta",
            images: ["https://images.unsplash.com/photo-1620336655554-7236d626359f?q=80&w=2000&auto=format&fit=crop"] // Simulating a different photo
        },
        {
            id: "v3",
            tier: "BATTLE_DAMAGED" as ProductTier,
            price: 45000,
            stock: 0,
            condition: "Sin caja - Pequeño detalle en botas",
            images: ["https://images.unsplash.com/photo-1542779283-308bc0facc55?q=80&w=2000&auto=format&fit=crop"]
        }
    ]
};

export default function ProductPage({ params }: { params: Promise<Params> }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug } = use(params);

    const [selectedTier, setSelectedTier] = useState<ProductTier>('OFFICIAL');

    // Logic to find current variant data
    const currentVariant = MOCK_PRODUCT.variants.find(v => v.tier === selectedTier) || MOCK_PRODUCT.variants[0];
    const xpReward = Math.floor(currentVariant.price / 100);
    const coinsReward = Math.floor(currentVariant.price / 1000);

    const handleAddToCart = () => {
        console.log(`Added Variant ${currentVariant.id} (${selectedTier}) to Cart`);
        // Toast logic would go here
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
            {/* 1. Galería Visual */}
            <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-2xl overflow-hidden border-2 border-muted shadow-lg relative">
                    <img
                        src={currentVariant.images[0]}
                        alt={MOCK_PRODUCT.title}
                        className="w-full h-full object-cover transition-all duration-500"
                    />
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4">
                        {selectedTier === 'OFFICIAL' && <Badge className="bg-amber-500 text-black font-bold">✨ Importado JP</Badge>}
                        {selectedTier === 'SECOND_HAND' && <Badge variant="secondary" className="border-2 border-slate-400">🛡️ Verificado</Badge>}
                        {selectedTier === 'BATTLE_DAMAGED' && <Badge variant="destructive">⚠️ Ver detalles</Badge>}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {/* Thumbnails placeholder */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg border border-border cursor-pointer hover:border-primary"></div>
                    ))}
                </div>
            </div>

            {/* 2. Panel de Comercio */}
            <div className="flex flex-col gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-primary tracking-wider uppercase">{MOCK_PRODUCT.franchise}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{MOCK_PRODUCT.brand}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{MOCK_PRODUCT.title}</h1>
                    <div className="flex items-center gap-2 text-yellow-500 text-sm">
                        ★★★★★ <span className="text-muted-foreground">(12 Reviews)</span>
                    </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Selecciona Condición del Item:
                    </h3>
                    <TierSelector
                        variants={MOCK_PRODUCT.variants}
                        selectedTier={selectedTier}
                        onSelect={setSelectedTier}
                    />
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-border space-y-4 mt-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Precio Total</p>
                            <div className="text-4xl font-bold text-primary">
                                ${currentVariant.price.toLocaleString('es-AR')}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-green-500 font-bold mb-1">RECOMPENSA DE MISIÓN</p>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                                +{xpReward} XP
                            </Badge>
                            <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/50">
                                +{coinsReward} Coins
                            </Badge>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full text-lg h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-xl shadow-indigo-500/20"
                        disabled={currentVariant.stock === 0}
                        onClick={handleAddToCart}
                    >
                        {currentVariant.stock > 0 ? "Agregar al Inventario 🎒" : "Agotado ❌"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        {selectedTier === 'OFFICIAL'
                            ? "Envío asegurado. Garantía de originalidad 100%."
                            : "Producto verificado por nuestro Gremio de Tasadores."}
                    </p>
                </div>

                <div className="prose prose-sm prose-invert text-muted-foreground mt-4">
                    <p>{MOCK_PRODUCT.description}</p>
                </div>
            </div>
        </div>
    );
}
