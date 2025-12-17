"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth";
import { api, type OrderResponse } from "@/lib/api";
import { formatPrice, formatLootCoins } from "@/lib/utils";
import {
    Trophy,
    Coins,
    Sparkles,
    ShoppingBag,
    CheckCircle,
    Star,
    Loader2,
    AlertCircle,
} from "lucide-react";

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, user, updateUser } = useAuthStore();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [showCoinsAnimation, setShowCoinsAnimation] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
            return;
        }

        const verifyPayment = async () => {
            setIsVerifying(true);

            // Get MP params from URL
            const orderId = searchParams.get("order_id") || searchParams.get("external_reference");
            const collectionStatus = searchParams.get("collection_status") || searchParams.get("status");
            const paymentId = searchParams.get("payment_id");

            // Try to get order from localStorage (for dev mode without MP)
            const storedOrder = localStorage.getItem("lastOrder");

            if (orderId && collectionStatus) {
                // MP return - verify payment with backend
                const paymentStatus = collectionStatus === "approved" ? "approved" :
                    collectionStatus === "pending" ? "pending" : "failed";

                const response = await api.confirmOrder(orderId, paymentStatus);

                if (response.error) {
                    setError(response.error);
                    setIsVerifying(false);
                    return;
                }

                if (response.data) {
                    setOrder(response.data);

                    // Update user's LootCoins if payment approved
                    if (paymentStatus === "approved" && user && response.data.lootCoinsEarned) {
                        updateUser({ lootCoins: user.lootCoins + response.data.lootCoinsEarned });
                    }

                    // Trigger animation
                    setTimeout(() => setShowCoinsAnimation(true), 500);
                }

                // Clear localStorage
                localStorage.removeItem("lastOrder");
            } else if (storedOrder) {
                // Dev mode - order already created without MP
                const parsedOrder = JSON.parse(storedOrder);
                setOrder(parsedOrder);
                localStorage.removeItem("lastOrder");

                // For dev, still need to confirm the order
                const response = await api.confirmOrder(parsedOrder.id, "approved");
                if (response.data) {
                    setOrder(response.data);
                    if (user && response.data.lootCoinsEarned) {
                        updateUser({ lootCoins: user.lootCoins + response.data.lootCoinsEarned });
                    }
                }

                setTimeout(() => setShowCoinsAnimation(true), 500);
            } else {
                // No order data - redirect
                router.push("/shop");
                return;
            }

            setIsVerifying(false);
        };

        verifyPayment();
    }, [isAuthenticated, router, searchParams, user, updateUser]);

    // Loading state
    if (isVerifying) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center py-20">
                        <Loader2 className="w-12 h-12 text-rpg-gold mx-auto mb-4 animate-spin" />
                        <p className="font-pixel text-rpg-gold">Verificando pago...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center py-20">
                        <AlertCircle className="w-12 h-12 text-rpg-danger mx-auto mb-4" />
                        <h1 className="font-pixel text-xl text-rpg-danger mb-4">Error</h1>
                        <p className="text-rpg-text-muted mb-6">{error}</p>
                        <Link href="/cart" className="rpg-button-gold font-pixel text-sm">
                            Volver al Carrito
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-rpg-primary border-t-transparent rounded-full mx-auto" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Header />

            {/* Background celebration particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-rpg-gold/40 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
                {/* Victory Banner */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-rpg-gold/20 border-4 border-rpg-gold">
                        <Trophy className="w-12 h-12 text-rpg-gold" />
                    </div>

                    <h1 className="font-pixel text-3xl md:text-4xl text-rpg-gold mb-4 animate-pulse">
                        ¡QUEST COMPLETE!
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-rpg-success mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Pago Confirmado</span>
                    </div>
                    <p className="text-rpg-text-muted">
                        Tu pedido #{order.id.slice(-8).toUpperCase()} ha sido procesado
                    </p>
                </div>

                {/* LootCoins Earned */}
                <div
                    className={`pixel-border-gold bg-rpg-bg p-8 mb-8 text-center transition-all duration-1000 ${showCoinsAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Star className="w-6 h-6 text-rpg-gold animate-spin" style={{ animationDuration: "3s" }} />
                        <span className="font-pixel text-lg text-rpg-text">RECOMPENSA OBTENIDA</span>
                        <Star className="w-6 h-6 text-rpg-gold animate-spin" style={{ animationDuration: "3s" }} />
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <Coins className="w-12 h-12 text-rpg-gold loot-coin-glow" />
                        <span className="font-pixel text-4xl md:text-5xl text-rpg-gold loot-coin-glow">
                            +{formatLootCoins(order.lootCoinsEarned)} LC
                        </span>
                    </div>

                    <p className="text-rpg-text-muted mt-4">
                        ¡LootCoins agregados a tu cuenta!
                    </p>

                    {/* Floating coins animation */}
                    {showCoinsAnimation && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute text-2xl"
                                    style={{
                                        left: `${30 + Math.random() * 40}%`,
                                        bottom: "-20px",
                                        animation: `float-up 2s ease-out forwards`,
                                        animationDelay: `${i * 0.2}s`,
                                    }}
                                >
                                    🪙
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Items */}
                <div className="pixel-border bg-rpg-bg-secondary p-6 mb-8">
                    <h2 className="font-pixel text-lg text-rpg-gold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        LOOT ADQUIRIDO
                    </h2>

                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-rpg-bg rounded-lg">
                                <div className="relative w-16 h-16 rounded overflow-hidden shrink-0">
                                    <Image
                                        src={item.product.images?.[0] || "https://placehold.co/64x64/1a1a2e/7c3aed?text=?"}
                                        alt={item.product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-rpg-text text-sm font-medium line-clamp-1">
                                        {item.product.title}
                                    </h3>
                                    <p className="text-rpg-text-muted text-xs">
                                        Cantidad: {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-pixel text-rpg-gold text-sm">
                                        {formatPrice(item.priceAtOrder * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="border-rpg-bg-tertiary my-4" />

                    <div className="flex justify-between items-center">
                        <span className="text-rpg-text font-medium">Total Pagado</span>
                        <span className="font-pixel text-xl text-rpg-gold">
                            {formatPrice(order.total)}
                        </span>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="text-center">
                    <Link
                        href="/shop"
                        className="rpg-button-gold font-pixel text-sm inline-flex items-center gap-2 py-4 px-8"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        CONTINUAR AVENTURA
                    </Link>
                </div>
            </main>

            <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
}
