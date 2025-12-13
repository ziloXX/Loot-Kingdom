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
                    <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Catálogo
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Nosotros
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Carrito</span>
                    </Button>

                    {isLogged ? (
                        <Button variant="ghost" size="sm" className="gap-2">
                            <User className="h-4 w-4" />
                            <span className="hidden md:inline-block">Mi Cuenta</span>
                        </Button>
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
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="/products" className="text-lg font-medium">Catálogo</Link>
                                <Link href="/about" className="text-lg font-medium">Nosotros</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
