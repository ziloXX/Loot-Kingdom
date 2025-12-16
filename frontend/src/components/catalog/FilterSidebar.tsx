"use client";

import { useState } from "react";
import { ChevronDown, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
    category: string | null;
    condition: string | null;
    tier: string | null;
    priceRange: [number, number] | null;
}

const categories = [
    { value: "FIGURE", label: "Figuras", icon: "🗿" },
    { value: "CARD", label: "Cards", icon: "🃏" },
    { value: "PLUSH", label: "Plushies", icon: "🧸" },
    { value: "DECOR", label: "Decoración", icon: "🎨" },
    { value: "OTHER", label: "Otros", icon: "📦" },
];

const conditions = [
    { value: "NEW", label: "Nuevo", color: "text-rpg-success" },
    { value: "USED", label: "Usado", color: "text-rpg-gold" },
    { value: "DAMAGED", label: "Dañado", color: "text-rpg-danger" },
];

const tiers = [
    { value: "OFFICIAL", label: "⭐ Oficial", description: "Productos con licencia" },
    { value: "BOOTLEG", label: "🔥 Alternativa", description: "Sin licencia oficial" },
];

const priceRanges = [
    { value: [0, 2000000], label: "Hasta $20,000" },
    { value: [2000000, 5000000], label: "$20,000 - $50,000" },
    { value: [5000000, 10000000], label: "$50,000 - $100,000" },
    { value: [10000000, Infinity], label: "Más de $100,000" },
];

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
    const [filters, setFilters] = useState<FilterState>({
        category: null,
        condition: null,
        tier: null,
        priceRange: null,
    });

    const [expandedSections, setExpandedSections] = useState({
        category: true,
        condition: true,
        tier: true,
        price: true,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        const newFilters = { ...filters, [key]: filters[key] === value ? null : value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const clearFilters = () => {
        const empty: FilterState = { category: null, condition: null, tier: null, priceRange: null };
        setFilters(empty);
        onFilterChange?.(empty);
    };

    const hasActiveFilters = Object.values(filters).some((v) => v !== null);

    return (
        <aside className="w-full lg:w-64 shrink-0">
            {/* Header */}
            <div className="pixel-border bg-rpg-bg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-rpg-primary" />
                        <h2 className="font-pixel text-sm text-rpg-text">FILTROS</h2>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-rpg-text-muted hover:text-rpg-danger text-xs flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {/* Category Filter */}
                <FilterSection
                    title="Categoría"
                    icon="📁"
                    expanded={expandedSections.category}
                    onToggle={() => toggleSection("category")}
                >
                    <div className="space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => updateFilter("category", cat.value)}
                                className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition-colors",
                                    filters.category === cat.value
                                        ? "bg-rpg-primary/20 text-rpg-primary border border-rpg-primary/30"
                                        : "text-rpg-text-muted hover:bg-rpg-bg-tertiary/50 hover:text-rpg-text"
                                )}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Tier Filter */}
                <FilterSection
                    title="Tier"
                    icon="⚔️"
                    expanded={expandedSections.tier}
                    onToggle={() => toggleSection("tier")}
                >
                    <div className="space-y-2">
                        {tiers.map((tier) => (
                            <button
                                key={tier.value}
                                onClick={() => updateFilter("tier", tier.value)}
                                className={cn(
                                    "w-full flex flex-col items-start px-3 py-2 rounded text-left transition-colors",
                                    filters.tier === tier.value
                                        ? "bg-rpg-primary/20 border border-rpg-primary/30"
                                        : "hover:bg-rpg-bg-tertiary/50"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-medium",
                                    filters.tier === tier.value ? "text-rpg-primary" : "text-rpg-text"
                                )}>
                                    {tier.label}
                                </span>
                                <span className="text-[10px] text-rpg-text-muted">{tier.description}</span>
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Condition Filter */}
                <FilterSection
                    title="Condición"
                    icon="🏷️"
                    expanded={expandedSections.condition}
                    onToggle={() => toggleSection("condition")}
                >
                    <div className="flex flex-wrap gap-2">
                        {conditions.map((cond) => (
                            <button
                                key={cond.value}
                                onClick={() => updateFilter("condition", cond.value)}
                                className={cn(
                                    "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                                    filters.condition === cond.value
                                        ? "bg-rpg-primary text-white"
                                        : `bg-rpg-bg-tertiary/50 ${cond.color} hover:bg-rpg-bg-tertiary`
                                )}
                            >
                                {cond.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Price Range Filter */}
                <FilterSection
                    title="Precio"
                    icon="💰"
                    expanded={expandedSections.price}
                    onToggle={() => toggleSection("price")}
                >
                    <div className="space-y-1">
                        {priceRanges.map((range, idx) => (
                            <button
                                key={idx}
                                onClick={() => updateFilter("priceRange", range.value as [number, number])}
                                className={cn(
                                    "w-full px-3 py-2 rounded text-left text-sm transition-colors",
                                    JSON.stringify(filters.priceRange) === JSON.stringify(range.value)
                                        ? "bg-rpg-gold/20 text-rpg-gold border border-rpg-gold/30"
                                        : "text-rpg-text-muted hover:bg-rpg-bg-tertiary/50 hover:text-rpg-text"
                                )}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>
            </div>
        </aside>
    );
}

// Collapsible Section Component
function FilterSection({
    title,
    icon,
    expanded,
    onToggle,
    children,
}: {
    title: string;
    icon: string;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-rpg-bg-secondary/50 border border-rpg-bg-tertiary rounded-lg overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 hover:bg-rpg-bg-tertiary/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span>{icon}</span>
                    <span className="text-sm font-medium text-rpg-text">{title}</span>
                </div>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-rpg-text-muted transition-transform",
                        expanded && "rotate-180"
                    )}
                />
            </button>
            {expanded && <div className="px-3 pb-3">{children}</div>}
        </div>
    );
}
