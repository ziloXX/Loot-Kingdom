import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
    const isLogged = true; // Simulated state for now

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight">Loot Kingdom</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                        <span>⚔️</span> Armería
                    </Link>
                    <Link href="/products?category=TCG_CARD" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
                        <span>📜</span> Pergaminos
                    </Link>
                    <Link href="/products?tier=SECOND_HAND" className="transition-colors hover:text-primary text-foreground/60 flex items-center gap-1">
                        <span>☠️</span> Mercado Negro
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Gremio
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative group">
                        <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
                        <span className="sr-only">Mochila</span>
                        {/* Badge count simulated */}
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                            2
                        </span>
                    </Button>

                    {isLogged ? (
                        <div className="flex items-center gap-3 pl-2 border-l ml-2">
                            <div className="flex flex-col items-end text-xs mr-1 hidden lg:flex">
                                <span className="font-bold text-amber-500">1,450 🪙</span>
                                <span className="text-muted-foreground">Lvl 3 Cazador</span>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full border border-border">
                                <User className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button size="sm">Ingresar</Button>
                    )}

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="/products" className="text-lg font-medium flex items-center gap-2"><span>⚔️</span> Armería (Figuras)</Link>
                                <Link href="/cards" className="text-lg font-medium flex items-center gap-2"><span>📜</span> Pergaminos (TCG)</Link>
                                <Link href="/used" className="text-lg font-medium flex items-center gap-2 text-destructive"><span>☠️</span> Mercado Negro</Link>
                                <div className="h-px bg-border my-2" />
                                <Link href="/profile" className="text-lg font-medium">Mi Inventario</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
