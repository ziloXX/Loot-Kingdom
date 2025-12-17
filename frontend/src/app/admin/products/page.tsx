"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { api, type CreateProductData } from "@/lib/api";
import { Product } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import {
    Shield,
    Package,
    Plus,
    Edit,
    Trash2,
    Settings,
    ClipboardList,
    Loader2,
    X,
    Save,
    Home,
} from "lucide-react";

export default function AdminProductsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState<CreateProductData>({
        title: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        tier: "OFFICIAL",
        category: "FIGURE",
        condition: "NEW",
        brand: "",
        franchise: "",
        images: [],
    });

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "ADMIN") {
            router.push("/admin");
            return;
        }
        fetchProducts();
    }, [isAuthenticated, user, router]);

    const fetchProducts = async () => {
        setIsLoading(true);
        const response = await api.getAdminProducts();
        if (response.data) {
            setProducts(response.data);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingProduct) {
                await api.updateProduct(editingProduct.id, formData);
            } else {
                await api.createProduct(formData);
            }
            await fetchProducts();
            resetForm();
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            tier: product.tier as "OFFICIAL" | "BOOTLEG",
            category: product.category as "FIGURE" | "CARD" | "PLUSH" | "DECOR" | "OTHER",
            condition: product.condition as "NEW" | "USED" | "DAMAGED",
            brand: product.brand || "",
            franchise: product.franchise || "",
            images: product.images || [],
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este producto?")) return;
        await api.deleteProduct(id);
        await fetchProducts();
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingProduct(null);
        setFormData({
            title: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0,
            tier: "OFFICIAL",
            category: "FIGURE",
            condition: "NEW",
            brand: "",
            franchise: "",
            images: [],
        });
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
                        <Link href="/admin/products" className="flex items-center gap-3 px-4 py-2 bg-red-500/20 text-red-400 rounded border border-red-500/30">
                            <Package className="w-5 h-5" />
                            Products
                        </Link>
                        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded">
                            <ClipboardList className="w-5 h-5" />
                            Orders
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-pixel text-2xl text-red-500 mb-2">INVENTORY CONTROL</h1>
                            <p className="text-gray-400">{products.length} products in stock</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>

                    {/* Product Table */}
                    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="text-left p-4 text-gray-400 text-sm">Product</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Price</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Stock</th>
                                    <th className="text-left p-4 text-gray-400 text-sm">Tier</th>
                                    <th className="text-right p-4 text-gray-400 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-800">
                                                    <Image
                                                        src={product.images[0] || "https://placehold.co/48x48/1a1a2e/7c3aed?text=?"}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-gray-200 text-sm line-clamp-1">{product.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-green-400 font-mono">{formatPrice(product.price)}</td>
                                        <td className="p-4">
                                            <span className={`font-mono ${product.stock < 3 ? "text-orange-400" : "text-gray-300"}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded ${product.tier === "OFFICIAL" ? "bg-yellow-500/20 text-yellow-400" : "bg-purple-500/20 text-purple-400"}`}>
                                                {product.tier}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-gray-400 hover:text-blue-400"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <h2 className="font-pixel text-lg text-red-400">
                                {editingProduct ? "EDIT ITEM" : "NEW ITEM"}
                            </h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                                slug: generateSlug(e.target.value),
                                            });
                                        }}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white h-24"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Price (ARS cents)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Tier</label>
                                    <select
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value as "OFFICIAL" | "BOOTLEG" })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                    >
                                        <option value="OFFICIAL">Official</option>
                                        <option value="BOOTLEG">Bootleg</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as "FIGURE" | "CARD" | "PLUSH" | "DECOR" | "OTHER" })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                    >
                                        <option value="FIGURE">Figure</option>
                                        <option value="CARD">Card</option>
                                        <option value="PLUSH">Plush</option>
                                        <option value="DECOR">Decor</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Condition</label>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value as "NEW" | "USED" | "DAMAGED" })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                    >
                                        <option value="NEW">New</option>
                                        <option value="USED">Used</option>
                                        <option value="DAMAGED">Damaged</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Brand</label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Franchise</label>
                                    <input
                                        type="text"
                                        value={formData.franchise}
                                        onChange={(e) => setFormData({ ...formData, franchise: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.images?.[0] || ""}
                                        onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingProduct ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
