import Link from "next/link";
import { Crown } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-card mt-12">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Crown className="w-6 h-6 text-primary" />
                            <span className="text-lg font-bold">LOOT<span className="text-primary">KINGDOM</span></span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your ultimate destination for anime and gaming collectibles in Argentina.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/products" className="hover:text-primary transition-colors">Figures</Link></li>
                            <li><Link href="/products?category=TCG_CARD" className="hover:text-primary transition-colors">Trading Cards</Link></li>
                            <li><Link href="/products?category=PLUSHIE" className="hover:text-primary transition-colors">Plushies</Link></li>
                            <li><Link href="/products?tier=SECOND_HAND" className="hover:text-primary transition-colors">Pre-Owned</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                            <li><Link href="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary">Connect</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Loot Kingdom. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
