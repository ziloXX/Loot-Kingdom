"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/components/ui/Toast";
import { api, type RewardOption, type Coupon } from "@/lib/api";
import { formatLootCoins } from "@/lib/utils";
import {
    Sparkles,
    Coins,
    Gift,
    Crown,
    Star,
    Loader2,
    Check,
    Copy,
    Scroll,
} from "lucide-react";

// Reward tier icons and styling
const rewardStyles: Record<string, { icon: React.ReactNode; gradient: string; glow: string }> = {
    small: {
        icon: <Gift className="w-8 h-8" />,
        gradient: "from-blue-500/20 to-purple-500/20",
        glow: "shadow-blue-500/20",
    },
    hero: {
        icon: <Crown className="w-8 h-8" />,
        gradient: "from-purple-500/20 to-pink-500/20",
        glow: "shadow-purple-500/30",
    },
    legendary: {
        icon: <Star className="w-8 h-8" />,
        gradient: "from-yellow-500/30 to-orange-500/30",
        glow: "shadow-yellow-500/40",
    },
};

export default function RewardsPage() {
    const router = useRouter();
    const { isAuthenticated, user, updateUser } = useAuthStore();
    const { showToast } = useToast();

    const [rewards, setRewards] = useState<RewardOption[]>([]);
    const [myCoupons, setMyCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [redeeming, setRedeeming] = useState<string | null>(null);
    const [lastRedeemed, setLastRedeemed] = useState<Coupon | null>(null);
    const [copiedCode, setCopiedCode] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth");
            return;
        }
        fetchData();
    }, [isAuthenticated, router]);

    const fetchData = async () => {
        setIsLoading(true);
        const [optionsRes, couponsRes] = await Promise.all([
            api.getRewardOptions(),
            api.getMyCoupons(),
        ]);
        if (optionsRes.data) setRewards(optionsRes.data);
        if (couponsRes.data) setMyCoupons(couponsRes.data);
        setIsLoading(false);
    };

    const handleRedeem = async (rewardId: string) => {
        setRedeeming(rewardId);

        const response = await api.redeemCoupon(rewardId);

        if (response.error) {
            showToast("error", response.error);
            setRedeeming(null);
            return;
        }

        if (response.data) {
            // Update local user coins
            updateUser({ lootCoins: response.data.newBalance });
            setLastRedeemed(response.data.coupon);
            setMyCoupons((prev) => [response.data!.coupon, ...prev]);
            showToast("success", "¡Cupón generado exitosamente!");
        }

        setRedeeming(null);
    };

    const copyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(true);
        showToast("info", "Código copiado al portapapeles");
        setTimeout(() => setCopiedCode(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-6xl mx-auto px-4 py-12">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-rpg-primary animate-spin" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Header />

            {/* Mystical background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-rpg-gold/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-rpg-gold/50">
                        <Sparkles className="w-10 h-10 text-rpg-gold" />
                    </div>
                    <h1 className="font-pixel text-3xl text-rpg-gold mb-4">THE SHRINE</h1>
                    <p className="text-rpg-text-muted max-w-md mx-auto">
                        Ofrece tus LootCoins a los dioses del comercio y recibe bendiciones divinas en forma de descuentos.
                    </p>
                </div>

                {/* User's LootCoins Balance */}
                <div className="pixel-border-gold bg-rpg-bg p-6 mb-12 text-center max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-3">
                        <Coins className="w-8 h-8 text-rpg-gold loot-coin-glow" />
                        <span className="font-pixel text-3xl text-rpg-gold loot-coin-glow">
                            {formatLootCoins(user?.lootCoins || 0)} LC
                        </span>
                    </div>
                    <p className="text-rpg-text-muted text-sm mt-2">Tu tesoro disponible</p>
                </div>

                {/* Last Redeemed Coupon Modal */}
                {lastRedeemed && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="pixel-border-gold bg-rpg-bg p-8 max-w-md w-full text-center relative overflow-hidden">
                            {/* Sparkle effects */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[...Array(12)].map((_, i) => (
                                    <Sparkles
                                        key={i}
                                        className="absolute w-4 h-4 text-rpg-gold/40 animate-pulse"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                            animationDelay: `${Math.random() * 2}s`,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rpg-gold/20 flex items-center justify-center">
                                    <Gift className="w-8 h-8 text-rpg-gold" />
                                </div>

                                <h2 className="font-pixel text-xl text-rpg-gold mb-2">
                                    ¡BENDICIÓN RECIBIDA!
                                </h2>
                                <p className="text-rpg-text-muted text-sm mb-6">
                                    {lastRedeemed.discountPercent}% de descuento en tu próxima compra
                                </p>

                                {/* Code Display */}
                                <div className="bg-rpg-bg-secondary border-2 border-dashed border-rpg-gold/50 rounded-lg p-4 mb-6">
                                    <p className="text-rpg-text-muted text-xs mb-2">Tu código de invocación:</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="font-pixel text-2xl text-rpg-gold tracking-wider">
                                            {lastRedeemed.code}
                                        </span>
                                        <button
                                            onClick={() => copyCode(lastRedeemed.code)}
                                            className="p-2 bg-rpg-bg rounded hover:bg-rpg-bg-tertiary transition-colors"
                                        >
                                            {copiedCode ? (
                                                <Check className="w-5 h-5 text-rpg-success" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-rpg-text-muted" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setLastRedeemed(null)}
                                    className="rpg-button-gold font-pixel text-sm"
                                >
                                    ENTENDIDO
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reward Options */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {rewards.map((reward) => {
                        const style = rewardStyles[reward.id] || rewardStyles.small;
                        const canAfford = (user?.lootCoins || 0) >= reward.cost;

                        return (
                            <div
                                key={reward.id}
                                className={`pixel-border bg-gradient-to-br ${style.gradient} p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${style.glow} shadow-lg`}
                            >
                                {/* Tier badge */}
                                <div className="absolute top-3 right-3">
                                    <span className="text-rpg-gold">{style.icon}</span>
                                </div>

                                <div className="text-center pt-4">
                                    <h3 className="font-pixel text-lg text-rpg-gold mb-2">
                                        {reward.name}
                                    </h3>

                                    <div className="mb-4">
                                        <span className="font-pixel text-4xl text-white">
                                            {reward.percent}%
                                        </span>
                                        <p className="text-rpg-text-muted text-sm">de descuento</p>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 mb-6 bg-rpg-bg/50 rounded-lg py-2">
                                        <Coins className="w-5 h-5 text-rpg-gold" />
                                        <span className="font-pixel text-lg text-rpg-gold">
                                            {formatLootCoins(reward.cost)} LC
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleRedeem(reward.id)}
                                        disabled={!canAfford || redeeming === reward.id}
                                        className={`w-full font-pixel text-sm py-3 rounded transition-all ${canAfford
                                                ? "rpg-button-gold"
                                                : "bg-rpg-bg-tertiary text-rpg-text-muted cursor-not-allowed"
                                            }`}
                                    >
                                        {redeeming === reward.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                        ) : canAfford ? (
                                            "INVOCAR"
                                        ) : (
                                            "LC INSUFICIENTE"
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* My Coupons Section */}
                {myCoupons.length > 0 && (
                    <div className="pixel-border bg-rpg-bg-secondary p-6">
                        <h2 className="font-pixel text-lg text-rpg-gold mb-4 flex items-center gap-2">
                            <Scroll className="w-5 h-5" />
                            MIS BENDICIONES
                        </h2>

                        <div className="space-y-3">
                            {myCoupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border ${coupon.isActive
                                            ? "bg-rpg-bg border-rpg-gold/30"
                                            : "bg-rpg-bg/50 border-rpg-bg-tertiary opacity-60"
                                        }`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-pixel text-rpg-gold">
                                                {coupon.code}
                                            </span>
                                            {!coupon.isActive && (
                                                <span className="text-xs px-2 py-0.5 bg-rpg-bg-tertiary text-rpg-text-muted rounded">
                                                    USADO
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-rpg-text-muted text-sm">
                                            {coupon.discountPercent}% de descuento
                                        </p>
                                    </div>

                                    {coupon.isActive && (
                                        <button
                                            onClick={() => copyCode(coupon.code)}
                                            className="p-2 bg-rpg-bg-tertiary rounded hover:bg-rpg-primary/20 transition-colors"
                                        >
                                            <Copy className="w-4 h-4 text-rpg-text-muted" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
