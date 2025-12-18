"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, Coins, Crown, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { formatLootCoins } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Header() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Hydration fix for localStorage
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 bg-rpg-bg/95 backdrop-blur-sm border-b-2 border-rpg-primary/30">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="pixel-border-gold p-2 bg-rpg-bg">
                                <span className="font-pixel text-rpg-gold text-lg tracking-wider">LK</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 bg-rpg-bg/95 backdrop-blur-sm border-b-2 border-rpg-primary/30">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="pixel-border-gold p-2 bg-rpg-bg">
                            <span className="font-pixel text-rpg-gold text-lg tracking-wider">LK</span>
                        </div>
                        <span className="hidden sm:block font-pixel text-xs text-rpg-text-muted group-hover:text-rpg-gold transition-colors">
                            Loot Kingdom
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rpg-text-muted" />
                            <input
                                type="text"
                                placeholder="Buscar items legendarios..."
                                className="w-full bg-rpg-bg-secondary border-2 border-rpg-bg-tertiary rounded-lg py-2 pl-10 pr-4 text-sm text-rpg-text placeholder:text-rpg-text-muted focus:border-rpg-primary focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <>
                                {/* LootCoins Badge */}
                                <Link
                                    href="/rewards"
                                    className="hidden sm:flex items-center gap-2 pixel-border-gold bg-rpg-bg px-3 py-1.5 hover:bg-rpg-bg-secondary transition-colors cursor-pointer"
                                    title="Canjear LootCoins"
                                >
                                    <Coins className="w-4 h-4 text-rpg-gold loot-coin-glow" />
                                    <span className="font-pixel text-xs text-rpg-gold">
                                        {formatLootCoins(user.lootCoins)}
                                    </span>
                                </Link>

                                {/* Username Badge - Link to Profile */}
                                <Link
                                    href="/profile"
                                    className="hidden lg:flex items-center gap-1.5 bg-rpg-bg-secondary px-2 py-1 rounded border border-rpg-primary/30 hover:border-rpg-primary transition-colors"
                                >
                                    <Crown className="w-3.5 h-3.5 text-rpg-primary" />
                                    <span className="font-pixel text-[10px] text-rpg-text-muted">
                                        {user.username}
                                    </span>
                                </Link>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="hidden lg:flex p-2 bg-rpg-bg-secondary rounded-lg border-2 border-rpg-bg-tertiary hover:border-rpg-danger transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4 text-rpg-text-muted hover:text-rpg-danger" />
                                </button>
                            </>
                        ) : (
                            /* Login Button */
                            <Link
                                href="/auth"
                                className="flex items-center gap-2 px-4 py-2 bg-rpg-primary hover:bg-rpg-primary-dark rounded-lg transition-colors"
                            >
                                <User className="w-4 h-4 text-white" />
                                <span className="font-pixel text-[10px] text-white hidden sm:inline">
                                    LOGIN
                                </span>
                            </Link>
                        )}

                        {/* Cart */}
                        <Link href="/cart" className="relative group">
                            <div className="p-2 bg-rpg-bg-secondary rounded-lg border-2 border-rpg-bg-tertiary group-hover:border-rpg-primary transition-colors">
                                <ShoppingCart className="w-5 h-5 text-rpg-text group-hover:text-rpg-primary transition-colors" />
                            </div>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rpg-gold text-rpg-bg text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center font-pixel text-[10px]">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 bg-rpg-bg-secondary rounded-lg border-2 border-rpg-bg-tertiary"
                        >
                            <Menu className="w-5 h-5 text-rpg-text" />
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="mt-3 md:hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rpg-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar items..."
                            className="w-full bg-rpg-bg-secondary border-2 border-rpg-bg-tertiary rounded-lg py-2 pl-10 pr-4 text-sm text-rpg-text placeholder:text-rpg-text-muted focus:border-rpg-primary focus:outline-none"
                        />
                    </div>
                </div>

                {/* Mobile LootCoins */}
                {isAuthenticated && user && (
                    <div className="mt-3 sm:hidden flex items-center justify-center gap-2 pixel-border-gold bg-rpg-bg px-3 py-1.5">
                        <Coins className="w-4 h-4 text-rpg-gold loot-coin-glow" />
                        <span className="font-pixel text-xs text-rpg-gold">
                            {formatLootCoins(user.lootCoins)} LC
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation Bar */}
            <nav className="border-t border-rpg-bg-tertiary bg-rpg-bg-secondary/50">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center gap-1 overflow-x-auto py-2 text-sm">
                        {[
                            { href: "/shop", label: "Tienda" },
                            { href: "/shop?category=FIGURE", label: "Figuras" },
                            { href: "/shop?category=CARD", label: "Cards" },
                            { href: "/shop?category=PLUSH", label: "Plushies" },
                            { href: "/shop?category=DECOR", label: "Decoración" },
                            { href: "/shop?tier=OFFICIAL", label: "⭐ Oficiales" },
                            { href: "/shop?tier=BOOTLEG", label: "🔥 Alternativas" },
                        ].map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="px-3 py-1.5 rounded text-rpg-text-muted hover:text-rpg-text hover:bg-rpg-bg-tertiary/50 transition-colors whitespace-nowrap"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
