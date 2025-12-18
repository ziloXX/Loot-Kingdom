"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { api, type AdminDashboard } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
    Shield,
    DollarSign,
    Package,
    Users,
    AlertTriangle,
    Settings,
    ClipboardList,
    Loader2,
    LogOut,
    Home,
} from "lucide-react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAuthenticated) {
            router.push("/auth");
            return;
        }

        if (user?.role !== "ADMIN") {
            setError("403 Forbidden - Magic Barrier Active");
            setIsLoading(false);
            return;
        }

        fetchDashboard();
    }, [mounted, isAuthenticated, user, router]);

    const fetchDashboard = async () => {
        setIsLoading(true);
        const response = await api.getAdminDashboard();
        if (response.error) {
            setError(response.error);
        } else if (response.data) {
            setDashboard(response.data);
        }
        setIsLoading(false);
    };

    // Wait for client-side hydration
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center p-8 border-2 border-red-500/50 bg-gray-900 rounded-lg max-w-md">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="font-pixel text-2xl text-red-500 mb-4">FORBIDDEN</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                    >
                        <Home className="w-4 h-4" />
                        Return to Kingdom
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading || !dashboard) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Admin Header */}
            <header className="bg-gray-900 border-b border-red-500/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-500" />
                            <span className="font-pixel text-lg text-red-500">GAME MASTER</span>
                        </div>
                        <span className="text-gray-500">|</span>
                        <span className="text-gray-400 text-sm">{user?.username}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-400 hover:text-gray-200 text-sm">
                            ← Back to Shop
                        </Link>
                        <button
                            onClick={() => { logout(); router.push("/"); }}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-900 min-h-[calc(100vh-57px)] p-4 border-r border-gray-800">
                    <nav className="space-y-2">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 bg-red-500/20 text-red-400 rounded border border-red-500/30"
                        >
                            <Settings className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/products"
                            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded"
                        >
                            <Package className="w-5 h-5" />
                            Products
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded"
                        >
                            <ClipboardList className="w-5 h-5" />
                            Orders
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="font-pixel text-2xl text-red-500 mb-2">COMMAND CENTER</h1>
                        <p className="text-gray-400">Welcome, Game Master. Here's your kingdom overview.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400 text-sm">Total Sales</span>
                                <DollarSign className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="font-pixel text-2xl text-green-400">
                                {formatPrice(dashboard.totalSales)}
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400 text-sm">Active Orders</span>
                                <ClipboardList className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="font-pixel text-2xl text-blue-400">
                                {dashboard.activeOrders}
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400 text-sm">Total Users</span>
                                <Users className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className="font-pixel text-2xl text-purple-400">
                                {dashboard.totalUsers}
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400 text-sm">Low Stock Alerts</span>
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="font-pixel text-2xl text-orange-400">
                                {dashboard.lowStockProducts.length}
                            </p>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    {dashboard.lowStockProducts.length > 0 && (
                        <div className="bg-gray-900 border border-orange-500/30 rounded-lg p-6">
                            <h2 className="font-pixel text-lg text-orange-400 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                LOW STOCK ALERTS
                            </h2>
                            <div className="space-y-3">
                                {dashboard.lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between bg-gray-800 p-3 rounded"
                                    >
                                        <span className="text-gray-300">{product.title}</span>
                                        <span className={`font-pixel text-sm ${product.stock === 0 ? "text-red-500" : "text-orange-400"}`}>
                                            {product.stock === 0 ? "OUT OF STOCK" : `${product.stock} left`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
