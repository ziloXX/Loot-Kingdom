"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/components/ui/Toast";
import { api, type CartItem } from "@/lib/api";
import { formatPrice, formatLootCoins } from "@/lib/utils";
import {
    Minus,
    Plus,
    Trash2,
    Package,
    Coins,
    Loader2,
    ShoppingBag,
    Sparkles,
} from "lucide-react";

export default function CartPage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const { showToast } = useToast();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Fetch cart on mount
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
            return;
        }

        fetchCart();
    }, [isAuthenticated, router]);

    const fetchCart = async () => {
        setIsLoading(true);
        const response = await api.getCart();
        if (response.data) {
            setCartItems(response.data.items);
        }
        setIsLoading(false);
    };

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        setIsUpdating(itemId);

        if (newQuantity <= 0) {
            await removeItem(itemId);
            return;
        }

        const response = await api.updateCartItem(itemId, newQuantity);
        if (response.error) {
            showToast("error", response.error);
        } else {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
        setIsUpdating(null);
    };

    const removeItem = async (itemId: string) => {
        setIsUpdating(itemId);
        const response = await api.removeFromCart(itemId);
        if (response.error) {
            showToast("error", response.error);
        } else {
            setCartItems((prev) => prev.filter((item) => item.id !== itemId));
            showToast("info", "Item removido del inventario");
        }
        setIsUpdating(null);
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);

        const response = await api.createOrder();

        if (response.error) {
            showToast("error", response.error);
            setIsCheckingOut(false);
            return;
        }

        if (response.data) {
            // Store order data for success page
            localStorage.setItem("lastOrder", JSON.stringify(response.data));

            // If payment URL is available (MP configured), redirect to it
            if (response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
                return;
            }

            // Otherwise, go directly to success (for dev without MP)
            router.push(`/checkout/success?order_id=${response.data.id}`);
        }
    };

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const lootCoinsToEarn = Math.floor(subtotal / 2000); // 5% in LC (1 LC per $20 ARS)

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-rpg-primary animate-spin" />
                    </div>
                </main>
            </div>
        );
    }

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-7xl mx-auto px-4 py-12">
                    <div className="pixel-border bg-rpg-bg-secondary p-12 text-center max-w-lg mx-auto">
                        {/* Empty Chest Icon */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="w-16 h-16 text-rpg-text-muted" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <span className="text-3xl">📦</span>
                            </div>
                        </div>

                        <h1 className="font-pixel text-xl text-rpg-gold mb-4">
                            INVENTARIO VACÍO
                        </h1>
                        <p className="text-rpg-text-muted mb-8">
                            Tu inventario está vacío, aventurero. Explora la tienda para encontrar items legendarios.
                        </p>
                        <Link href="/shop" className="rpg-button-gold font-pixel text-xs inline-flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            EXPLORAR TIENDA
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="font-pixel text-2xl text-rpg-gold mb-2">INVENTARIO</h1>
                    <p className="text-rpg-text-muted text-sm">
                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} en tu mochila
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="pixel-border bg-rpg-bg-secondary p-4 flex gap-4"
                            >
                                {/* Product Image */}
                                <Link href={`/product/${item.product.slug}`} className="relative w-20 h-24 shrink-0 overflow-hidden rounded">
                                    <Image
                                        src={item.product.images[0] || "https://placehold.co/80x96/1a1a2e/7c3aed?text=?"}
                                        alt={item.product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            {item.product.franchise && (
                                                <span className="text-rpg-primary text-xs">{item.product.franchise}</span>
                                            )}
                                            <Link href={`/product/${item.product.slug}`}>
                                                <h3 className="text-rpg-text font-medium text-sm line-clamp-2 hover:text-rpg-primary">
                                                    {item.product.title}
                                                </h3>
                                            </Link>
                                            <span className={item.product.tier === "OFFICIAL" ? "tier-official mt-1 inline-block" : "tier-bootleg mt-1 inline-block"}>
                                                {item.product.tier === "OFFICIAL" ? "⭐ Oficial" : "Alt"}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right shrink-0">
                                            <p className="font-pixel text-rpg-gold text-sm">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-rpg-text-muted text-xs">
                                                    {formatPrice(item.product.price)} c/u
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={isUpdating === item.id}
                                                className="w-8 h-8 flex items-center justify-center bg-rpg-bg border border-rpg-bg-tertiary rounded hover:border-rpg-primary transition-colors disabled:opacity-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-pixel text-sm">
                                                {isUpdating === item.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={isUpdating === item.id || item.quantity >= item.product.stock}
                                                className="w-8 h-8 flex items-center justify-center bg-rpg-bg border border-rpg-bg-tertiary rounded hover:border-rpg-primary transition-colors disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            disabled={isUpdating === item.id}
                                            className="text-rpg-text-muted hover:text-rpg-danger transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="pixel-border-gold bg-rpg-bg sticky top-24">
                            <div className="p-6">
                                <h2 className="font-pixel text-lg text-rpg-gold mb-6">RESUMEN</h2>

                                {/* Subtotal */}
                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-rpg-text-muted">Subtotal</span>
                                    <span className="text-rpg-text">{formatPrice(subtotal)}</span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-rpg-text-muted">Envío</span>
                                    <span className="text-rpg-success">Calculado al checkout</span>
                                </div>

                                <hr className="border-rpg-bg-tertiary my-4" />

                                {/* Total */}
                                <div className="flex justify-between mb-6">
                                    <span className="text-rpg-text font-medium">Total</span>
                                    <span className="font-pixel text-rpg-gold text-xl">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                {/* LootCoins to Earn - THE KEY INCENTIVE */}
                                <div className="bg-rpg-gold/10 border border-rpg-gold/30 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Coins className="w-5 h-5 text-rpg-gold" />
                                        <span className="font-pixel text-sm text-rpg-gold">
                                            ¡GANARÁS LOOTCOINS!
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-rpg-text-muted text-sm">Al completar esta compra:</span>
                                        <span className="font-pixel text-lg text-rpg-gold loot-coin-glow">
                                            +{formatLootCoins(lootCoinsToEarn)} LC
                                        </span>
                                    </div>
                                </div>

                                {/* User Balance */}
                                {user && (
                                    <div className="text-center text-rpg-text-muted text-xs mb-6">
                                        Tu balance actual: <span className="text-rpg-gold">{formatLootCoins(user.lootCoins)} LC</span>
                                    </div>
                                )}

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full rpg-button-gold font-pixel text-sm py-4 flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden group"
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            TRANSMUTANDO ORO...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            COMPLETAR ORDEN
                                        </>
                                    )}
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
