"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { api, type AdminOrder } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
    Shield,
    Package,
    Settings,
    ClipboardList,
    Loader2,
    ChevronDown,
} from "lucide-react";

const statusOptions = [
    { value: "PENDING", label: "Pending", color: "text-gray-400" },
    { value: "CONFIRMED", label: "Confirmed", color: "text-blue-400" },
    { value: "SHIPPED", label: "Shipped", color: "text-purple-400" },
    { value: "DELIVERED", label: "Delivered", color: "text-green-400" },
    { value: "CANCELLED", label: "Cancelled", color: "text-red-400" },
];

export default function AdminOrdersPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "ADMIN") {
            router.push("/admin");
            return;
        }
        fetchOrders();
    }, [isAuthenticated, user, router]);

    const fetchOrders = async () => {
        setIsLoading(true);
        const response = await api.getAdminOrders();
        if (response.data) {
            setOrders(response.data);
        }
        setIsLoading(false);
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        await api.updateOrderStatus(orderId, newStatus);
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        setUpdatingId(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <header className="bg-gray-900 border-b border-red-500/30 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-red-500" />
                        <span className="font-pixel text-lg text-red-500">GAME MASTER</span>
                    </div>
                    <Link href="/" className="text-gray-400 hover:text-gray-200 text-sm">
                        ← Back to Shop
                    </Link>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-900 min-h-[calc(100vh-57px)] p-4 border-r border-gray-800">
                    <nav className="space-y-2">
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded">
                            <Settings className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link href="/admin/products" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded">
                            <Package className="w-5 h-5" />
                            Products
                        </Link>
                        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-2 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                            <ClipboardList className="w-5 h-5" />
                            Orders
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className="font-pixel text-2xl text-red-500 mb-2">ORDER COMMAND CENTER</h1>
                        <p className="text-gray-400">{orders.length} total orders</p>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="text-left p-4 text-gray-400 text-sm">Order ID</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Customer</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Total</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Items</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Date</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const statusOption = statusOptions.find((s) => s.value === order.status);
                                    return (
                                        <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                                            <td className="p-4">
                                                <span className="font-mono text-gray-300">
                                                    #{order.id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-gray-200">{order.user.username}</p>
                                                    <p className="text-gray-500 text-xs">{order.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-green-400 font-mono">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="p-4 text-gray-300">
                                                {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString("es-AR")}
                                            </td>
                                            <td className="p-4">
                                                <div className="relative">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        disabled={updatingId === order.id}
                                                        className={`appearance-none bg-gray-800 border border-gray-700 rounded px-3 py-1.5 pr-8 text-sm ${statusOption?.color} cursor-pointer disabled:opacity-50`}
                                                    >
                                                        {statusOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                    {updatingId === order.id && (
                                                        <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 animate-spin" />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {orders.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No orders yet
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
