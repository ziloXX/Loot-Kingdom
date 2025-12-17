"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sword, Shield, Coins, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

type AuthMode = "login" | "register";

export default function AuthPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [mode, setMode] = useState<AuthMode>("login");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (mode === "login") {
                const response = await api.login(email, password);

                if (response.error) {
                    setError(response.error);
                    return;
                }

                if (response.data) {
                    login(response.data.access_token, response.data.user);
                    router.push("/");
                }
            } else {
                // Register
                if (!username.trim()) {
                    setError("Username is required");
                    return;
                }

                const response = await api.register(email, password, username);

                if (response.error) {
                    setError(response.error);
                    return;
                }

                if (response.data) {
                    login(response.data.access_token, response.data.user);
                    router.push("/");
                }
            }
        } catch (err) {
            setError("Connection failed. Try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-rpg-bg via-rpg-bg to-black" />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-rpg-gold/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 pixel-border-gold bg-rpg-bg p-4">
                        <span className="font-pixel text-3xl text-rpg-gold">LK</span>
                    </div>
                    <h1 className="font-pixel text-xl text-rpg-text mt-4">
                        {mode === "login" ? "CONTINUE" : "NEW GAME"}
                    </h1>
                    <p className="text-rpg-text-muted text-sm mt-2">
                        {mode === "login"
                            ? "Enter your credentials to access your kingdom"
                            : "Create your character and start your adventure"}
                    </p>
                </div>

                {/* Auth Container */}
                <div className="pixel-border bg-rpg-bg-secondary p-6">
                    {/* Tab Buttons */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setMode("login")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded font-pixel text-xs transition-all ${mode === "login"
                                    ? "bg-rpg-primary text-white"
                                    : "bg-rpg-bg-tertiary text-rpg-text-muted hover:text-rpg-text"
                                }`}
                        >
                            <Sword className="w-4 h-4" />
                            LOGIN
                        </button>
                        <button
                            onClick={() => setMode("register")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded font-pixel text-xs transition-all ${mode === "register"
                                    ? "bg-rpg-primary text-white"
                                    : "bg-rpg-bg-tertiary text-rpg-text-muted hover:text-rpg-text"
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            NEW GAME
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-rpg-danger/20 border border-rpg-danger/50 rounded text-rpg-danger text-sm text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username (Register only) */}
                        {mode === "register" && (
                            <div>
                                <label className="block text-rpg-text-muted text-xs mb-2 uppercase">
                                    Character Name
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="BraveHero123"
                                    className="w-full bg-rpg-bg border-2 border-rpg-bg-tertiary rounded py-3 px-4 text-rpg-text placeholder:text-rpg-text-muted/50 focus:border-rpg-primary focus:outline-none transition-colors"
                                    required={mode === "register"}
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-rpg-text-muted text-xs mb-2 uppercase">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hero@lootkingdom.com"
                                className="w-full bg-rpg-bg border-2 border-rpg-bg-tertiary rounded py-3 px-4 text-rpg-text placeholder:text-rpg-text-muted/50 focus:border-rpg-primary focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-rpg-text-muted text-xs mb-2 uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-rpg-bg border-2 border-rpg-bg-tertiary rounded py-3 px-4 pr-12 text-rpg-text placeholder:text-rpg-text-muted/50 focus:border-rpg-primary focus:outline-none transition-colors"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rpg-text-muted hover:text-rpg-text transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rpg-button-gold font-pixel text-sm py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    LOADING...
                                </>
                            ) : mode === "login" ? (
                                <>
                                    <Sword className="w-4 h-4" />
                                    ENTER KINGDOM
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    START ADVENTURE
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bonus Info (Register) */}
                    {mode === "register" && (
                        <div className="mt-6 p-4 bg-rpg-gold/10 border border-rpg-gold/30 rounded text-center">
                            <div className="flex items-center justify-center gap-2 text-rpg-gold mb-1">
                                <Coins className="w-4 h-4" />
                                <span className="font-pixel text-sm">+100 LC</span>
                            </div>
                            <p className="text-rpg-text-muted text-xs">
                                New heroes receive 100 LootCoins on registration!
                            </p>
                        </div>
                    )}
                </div>

                {/* Back to Shop */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-rpg-text-muted text-sm hover:text-rpg-primary transition-colors"
                    >
                        ← Back to Shop
                    </a>
                </div>
            </div>
        </div>
    );
}
