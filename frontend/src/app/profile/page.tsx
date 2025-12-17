"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth";
import { api, type UserStats, type OrderResponse } from "@/lib/api";
import { formatPrice, formatLootCoins } from "@/lib/utils";
import {
    User,
    Coins,
    Trophy,
    Shield,
    Scroll,
    ChevronRight,
    Loader2,
    Package,
    TrendingUp,
    Star,
} from "lucide-react";

// Map order status to RPG terms
const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Quest Pending", color: "text-yellow-500" },
    CONFIRMED: { label: "Quest Active", color: "text-blue-500" },
    SHIPPED: { label: "In Transit", color: "text-purple-500" },
    DELIVERED: { label: "Loot Secured", color: "text-green-500" },
    CANCELLED: { label: "Quest Failed", color: "text-red-500" },
};

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progressAnimated, setProgressAnimated] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
            return;
        }

        fetchStats();
    }, [isAuthenticated, router]);

    const fetchStats = async () => {
        setIsLoading(true);
        const response = await api.getStats();
        if (response.data) {
            setStats(response.data);
            // Trigger progress bar animation
            setTimeout(() => setProgressAnimated(true), 300);
        }
        setIsLoading(false);
    };

    if (isLoading || !stats) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-5xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-rpg-primary animate-spin" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header />

            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="font-pixel text-2xl text-rpg-gold mb-2">CHARACTER SHEET</h1>
                    <p className="text-rpg-text-muted text-sm">Tu perfil de aventurero</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Hero Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Character Card */}
                        <div className="pixel-border-gold bg-rpg-bg p-6">
                            {/* Avatar */}
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 rounded-full bg-rpg-bg-secondary border-4 border-rpg-primary flex items-center justify-center">
                                    <User className="w-12 h-12 text-rpg-primary" />
                                </div>
                            </div>

                            {/* Username */}
                            <h2 className="font-pixel text-lg text-rpg-gold text-center mb-2">
                                {stats.user.username}
                            </h2>

                            {/* Class */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Shield className="w-4 h-4 text-rpg-primary" />
                                <span className="text-rpg-text-muted text-sm">{stats.stats.playerClass}</span>
                            </div>

                            {/* Level */}
                            <div className="bg-rpg-bg-secondary rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-rpg-text-muted text-xs uppercase">Level</span>
                                    <span className="font-pixel text-xl text-rpg-gold">{stats.stats.level}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-3 bg-rpg-bg rounded-full overflow-hidden border border-rpg-bg-tertiary">
                                    <div
                                        className="h-full bg-gradient-to-r from-rpg-primary to-rpg-gold transition-all duration-1000 ease-out"
                                        style={{
                                            width: progressAnimated ? `${stats.stats.currentLevelProgress * 100}%` : "0%",
                                        }}
                                    />
                                </div>

                                <p className="text-rpg-text-muted text-xs mt-2 text-center">
                                    {formatPrice(stats.stats.spentToNextLevel)} para nivel {stats.stats.level + 1}
                                </p>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="pixel-border bg-rpg-bg-secondary p-4">
                            <h3 className="font-pixel text-sm text-rpg-text mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-rpg-primary" />
                                ESTADÍSTICAS
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-rpg-text-muted text-sm">Total Gastado</span>
                                    <span className="text-rpg-gold font-medium">{formatPrice(stats.stats.totalSpent)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-rpg-text-muted text-sm">Órdenes</span>
                                    <span className="text-rpg-text font-medium">{stats.stats.totalOrders}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-rpg-text-muted text-sm">LC Ganados</span>
                                    <span className="text-rpg-gold font-medium">+{formatLootCoins(stats.stats.totalLootCoinsEarned)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Treasury & Quest Log */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Treasury */}
                        <div className="pixel-border-gold bg-rpg-bg p-6">
                            <h3 className="font-pixel text-lg text-rpg-gold mb-4 flex items-center gap-2">
                                <Coins className="w-5 h-5" />
                                TREASURY
                            </h3>

                            {/* Total LootCoins */}
                            <div className="flex items-center justify-center gap-4 py-6 bg-rpg-bg-secondary rounded-lg mb-4">
                                <Coins className="w-10 h-10 text-rpg-gold loot-coin-glow" />
                                <span className="font-pixel text-4xl text-rpg-gold loot-coin-glow">
                                    {formatLootCoins(stats.user.lootCoins)} LC
                                </span>
                            </div>

                            {/* Recent Coin Gains */}
                            {stats.recentCoinGains.length > 0 && (
                                <div>
                                    <h4 className="text-rpg-text-muted text-xs uppercase mb-3">Ganancias Recientes</h4>
                                    <div className="space-y-2">
                                        {stats.recentCoinGains.map((gain) => (
                                            <div
                                                key={gain.orderId}
                                                className="flex items-center justify-between bg-rpg-bg rounded p-2"
                                            >
                                                <span className="text-rpg-text-muted text-sm">
                                                    Orden #{gain.orderId.slice(-6).toUpperCase()}
                                                </span>
                                                <span className="text-rpg-gold font-pixel text-sm">
                                                    +{formatLootCoins(gain.amount)} LC
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quest Log - Order History */}
                        <div className="pixel-border bg-rpg-bg-secondary p-6">
                            <h3 className="font-pixel text-lg text-rpg-gold mb-4 flex items-center gap-2">
                                <Scroll className="w-5 h-5" />
                                QUEST LOG
                            </h3>

                            {stats.orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-rpg-text-muted mx-auto mb-4" />
                                    <p className="text-rpg-text-muted">No has completado ninguna quest aún.</p>
                                    <Link href="/shop" className="rpg-button mt-4 inline-block text-sm">
                                        Comenzar Aventura
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {stats.orders.map((order) => {
                                        const status = statusMap[order.status] || { label: order.status, color: "text-rpg-text-muted" };
                                        return (
                                            <div
                                                key={order.id}
                                                className="bg-rpg-bg rounded-lg p-4 border border-rpg-bg-tertiary hover:border-rpg-primary transition-colors"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Trophy className="w-4 h-4 text-rpg-gold" />
                                                        <span className="text-rpg-text font-medium">
                                                            Quest #{order.id.slice(-6).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className={`text-sm font-medium ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-rpg-text-muted">
                                                        {new Date(order.createdAt).toLocaleDateString("es-AR", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-rpg-gold font-pixel">
                                                            {formatPrice(order.total)}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-rpg-gold">
                                                            <Star className="w-3 h-3" />
                                                            <span className="text-xs">+{order.lootCoinsEarned} LC</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
