"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type ProductTier = 'OFFICIAL' | 'SECOND_HAND' | 'BATTLE_DAMAGED';

interface Variant {
    id: string;
    tier: ProductTier;
    price: number;
    stock: number;
    condition?: string;
}

interface TierSelectorProps {
    variants: Variant[];
    selectedTier: ProductTier;
    onSelect: (tier: ProductTier) => void;
}

const TIER_CONFIG = {
    OFFICIAL: {
        label: "Oficial / Nuevo",
        borderColor: "border-amber-400",
        bgColor: "bg-amber-400/10",
        icon: "✨",
        tooltip: "Sellado de fábrica. Importación directa."
    },
    SECOND_HAND: {
        label: "Segunda Mano",
        borderColor: "border-slate-400",
        bgColor: "bg-slate-400/10",
        icon: "🛡️",
        tooltip: "Cuidado / Open Box. Verifique fotos."
    },
    BATTLE_DAMAGED: {
        label: "Mercado Negro",
        borderColor: "border-red-800",
        bgColor: "bg-red-800/10",
        icon: "☠️",
        tooltip: "Usado con detalles. Sin caja. Oportunidad."
    }
};

export function TierSelector({ variants, selectedTier, onSelect }: TierSelectorProps) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {variants.map((variant) => {
                const config = TIER_CONFIG[variant.tier];
                const isSelected = selectedTier === variant.tier;
                const hasStock = variant.stock > 0;

                return (
                    <div
                        key={variant.id}
                        onClick={() => hasStock && onSelect(variant.tier)}
                        className={cn(
                            "relative flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                            isSelected ? `${config.borderColor} ${config.bgColor} shadow-md` : "border-muted hover:border-muted-foreground/50",
                            !hasStock && "opacity-50 cursor-not-allowed grayscale"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn("text-2xl p-2 rounded-full", isSelected ? "bg-background" : "bg-muted")}>
                                {config.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm md:text-base flex items-center gap-2">
                                    {config.label}
                                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                                </h4>
                                <p className="text-xs text-muted-foreground">{variant.condition || config.tooltip}</p>
                                {!hasStock && <span className="text-xs font-bold text-destructive">AGOTADO</span>}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xl font-bold">
                                ${variant.price.toLocaleString('es-AR')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Stock: {variant.stock}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
