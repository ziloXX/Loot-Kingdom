import Image from "next/image";
import Link from "next/link";
import { Sparkles, Gift, CreditCard, Palette } from "lucide-react";

const categories = [
    {
        title: "Figuras",
        subtitle: "Legendary Artifacts",
        href: "/shop?category=FIGURE",
        icon: Sparkles,
        image: "https://placehold.co/600x400/7c3aed/ffffff?text=FIGURES",
        gradient: "from-violet-600/80 to-purple-900/80",
        size: "large", // Takes 2 columns on desktop
    },
    {
        title: "Plushies",
        subtitle: "Companions +200 Comfort",
        href: "/shop?category=PLUSH",
        icon: Gift,
        image: "https://placehold.co/400x300/22c55e/ffffff?text=PLUSH",
        gradient: "from-green-600/80 to-emerald-900/80",
        size: "medium",
    },
    {
        title: "Cards",
        subtitle: "Sacred Scrolls",
        href: "/shop?category=CARD",
        icon: CreditCard,
        image: "https://placehold.co/400x300/fbbf24/1a1a2e?text=CARDS",
        gradient: "from-amber-600/80 to-orange-900/80",
        size: "medium",
    },
    {
        title: "Decoración",
        subtitle: "Realm Enchantments",
        href: "/shop?category=DECOR",
        icon: Palette,
        image: "https://placehold.co/600x300/3b82f6/ffffff?text=DECOR",
        gradient: "from-blue-600/80 to-indigo-900/80",
        size: "wide", // Takes 2 columns
    },
];

export default function HeroBento() {
    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h1 className="font-pixel text-2xl md:text-3xl text-rpg-gold mb-2">
                        ITEM SHOP
                    </h1>
                    <p className="text-rpg-text-muted text-sm">
                        Explora el inventario de objetos legendarios
                    </p>
                </div>

                {/* Bento Grid - Asymmetric Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[200px]">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        const isLarge = category.size === "large";
                        const isWide = category.size === "wide";

                        return (
                            <Link
                                key={category.title}
                                href={category.href}
                                className={`
                  relative overflow-hidden rounded-xl group
                  ${isLarge ? "col-span-2 row-span-2" : ""}
                  ${isWide ? "col-span-2" : ""}
                  pixel-border
                `}
                            >
                                {/* Background Image */}
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`} />

                                {/* Content */}
                                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white/80" />
                                        <span className="text-white/60 text-xs">{category.subtitle}</span>
                                    </div>
                                    <h2 className={`font-pixel text-white ${isLarge ? "text-xl md:text-2xl" : "text-sm md:text-base"}`}>
                                        {category.title}
                                    </h2>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-rpg-primary/0 group-hover:bg-rpg-primary/20 transition-colors duration-300" />
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                        { label: "Items Disponibles", value: "500+", icon: "📦" },
                        { label: "Marcas Oficiales", value: "50+", icon: "⭐" },
                        { label: "Clientes Felices", value: "2,000+", icon: "👑" },
                        { label: "LootCoins Otorgados", value: "1M+", icon: "💰" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-rpg-bg-secondary/50 border border-rpg-bg-tertiary rounded-lg p-4 text-center"
                        >
                            <span className="text-2xl mb-1 block">{stat.icon}</span>
                            <p className="font-pixel text-rpg-gold text-lg">{stat.value}</p>
                            <p className="text-rpg-text-muted text-xs mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
