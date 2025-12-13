'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, Search, Crown } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/auth-store';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Top Bar - Gradient Header (Solaris Style) */}
            <div className="gradient-header dark:gradient-header-dark text-white py-2 px-4">
                <div className="container flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Crown className="w-7 h-7 text-accent group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold tracking-tight">
                            LOOT<span className="text-accent">KINGDOM</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        <Link href="/products" className="hover:text-accent transition-colors py-1 border-b-2 border-transparent hover:border-accent">
                            Figures
                        </Link>
                        <Link href="/products?category=TCG_CARD" className="hover:text-accent transition-colors py-1 border-b-2 border-transparent hover:border-accent">
                            Trading Cards
                        </Link>
                        <Link href="/products?category=PLUSHIE" className="hover:text-accent transition-colors py-1 border-b-2 border-transparent hover:border-accent">
                            Plushies
                        </Link>
                        <Link href="/products?category=DECOR" className="hover:text-accent transition-colors py-1 border-b-2 border-transparent hover:border-accent">
                            Goods
                        </Link>
                        <Link href="/products?tier=SECOND_HAND" className="text-accent font-bold hover:opacity-80 transition-opacity py-1">
                            Pre-Owned
                        </Link>
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                            <Input
                                placeholder="Search products..."
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-accent"
                            />
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="relative text-white hover:text-accent hover:bg-white/10">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-[11px] font-bold text-accent-foreground flex items-center justify-center">
                                2
                            </span>
                        </Button>

                        {isAuthenticated && user ? (
                            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/20">
                                <div className="flex flex-col items-end text-xs">
                                    <span className="font-bold text-accent flex items-center gap-1">
                                        {user.lootCoins.toLocaleString()} <span className="text-xs">🪙</span>
                                    </span>
                                    <span className="text-white/70">Lvl {user.level}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white" asChild>
                                    <Link href="/profile">
                                        <User className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                                <Link href="/auth/login">Login</Link>
                            </Button>
                        )}

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex items-center gap-2 mb-8">
                                    <Crown className="w-6 h-6 text-primary" />
                                    <span className="text-lg font-bold">LOOT<span className="text-primary">KINGDOM</span></span>
                                </div>
                                <nav className="flex flex-col gap-4">
                                    <Link href="/products" className="text-lg font-medium hover:text-primary transition-colors">Figures</Link>
                                    <Link href="/products?category=TCG_CARD" className="text-lg font-medium hover:text-primary transition-colors">Trading Cards</Link>
                                    <Link href="/products?category=PLUSHIE" className="text-lg font-medium hover:text-primary transition-colors">Plushies</Link>
                                    <Link href="/products?category=DECOR" className="text-lg font-medium hover:text-primary transition-colors">Goods</Link>
                                    <div className="h-px bg-border my-2" />
                                    <Link href="/products?tier=SECOND_HAND" className="text-lg font-bold text-primary">Pre-Owned</Link>
                                    <Link href="/profile" className="text-lg font-medium hover:text-primary transition-colors">My Account</Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Optional: Announcement Bar */}
            <div className="bg-secondary text-secondary-foreground text-center text-sm py-1.5 px-4">
                <span className="font-medium">🎄 Holiday Season!</span> Free shipping on orders over $50,000 ARS
            </div>
        </header>
    );
}
