"use client";

import { cn } from "@/lib/utils";
import { Check, Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";

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
        label: "Brand New",
        description: "Factory sealed, direct import",
        borderColor: "border-primary",
        bgColor: "bg-primary/5",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        Icon: Sparkles
    },
    SECOND_HAND: {
        label: "Pre-Owned",
        description: "Verified condition, open box",
        borderColor: "border-secondary",
        bgColor: "bg-secondary/5",
        iconBg: "bg-secondary/10",
        iconColor: "text-secondary",
        Icon: ShieldCheck
    },
    BATTLE_DAMAGED: {
        label: "Clearance",
        description: "As-is, cosmetic imperfections",
        borderColor: "border-destructive",
        bgColor: "bg-destructive/5",
        iconBg: "bg-destructive/10",
        iconColor: "text-destructive",
        Icon: AlertTriangle
    }
};

export function TierSelector({ variants, selectedTier, onSelect }: TierSelectorProps) {
    return (
        <div className="grid grid-cols-1 gap-3">
            {variants.map((variant) => {
                const config = TIER_CONFIG[variant.tier];
                const isSelected = selectedTier === variant.tier;
                const hasStock = variant.stock > 0;
                const Icon = config.Icon;

                return (
                    <div
                        key={variant.id}
                        onClick={() => hasStock && onSelect(variant.tier)}
                        className={cn(
                            "relative flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                            isSelected
                                ? `${config.borderColor} ${config.bgColor} shadow-sm`
                                : "border-border hover:border-muted-foreground/30 bg-card",
                            !hasStock && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-3 rounded-xl transition-colors",
                                isSelected ? config.iconBg : "bg-muted"
                            )}>
                                <Icon className={cn("w-5 h-5", isSelected ? config.iconColor : "text-muted-foreground")} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm md:text-base flex items-center gap-2">
                                    {config.label}
                                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                                </h4>
                                <p className="text-xs text-muted-foreground">{variant.condition || config.description}</p>
                                {!hasStock && <span className="text-xs font-bold text-destructive">OUT OF STOCK</span>}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={cn(
                                "text-xl font-bold",
                                isSelected ? "text-primary" : "text-foreground"
                            )}>
                                ${variant.price.toLocaleString('es-AR')}
                            </div>
                            {hasStock && (
                                <div className="text-xs text-muted-foreground">
                                    {variant.stock} available
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
