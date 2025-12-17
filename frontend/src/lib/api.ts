import { Product } from "./mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ProductFilters {
    category?: string;
    condition?: string;
    tier?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
}

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    lootCoins: number;
    role: "USER" | "ADMIN";
}

export interface LoginResponse {
    access_token: string;
    user: AuthUser;
}

export interface CartItem {
    id: string;
    quantity: number;
    product: Product;
}

export interface CartResponse {
    items: CartItem[];
    total: number;
    itemCount: number;
}

export interface OrderItem {
    id: string;
    quantity: number;
    priceAtOrder: number;
    product: Product;
}

export interface OrderResponse {
    id: string;
    status: string;
    total: number;
    lootCoinsEarned: number;
    items: OrderItem[];
    createdAt: string;
    paymentUrl?: string | null;
}

export interface CoinGain {
    orderId: string;
    amount: number;
    date: string;
}

export interface UserStats {
    user: {
        id: string;
        username: string;
        lootCoins: number;
    };
    stats: {
        level: number;
        currentLevelProgress: number;
        spentToNextLevel: number;
        playerClass: string;
        totalSpent: number;
        totalOrders: number;
        totalLootCoinsEarned: number;
    };
    recentCoinGains: CoinGain[];
    orders: OrderResponse[];
}

// Admin Types
export interface LowStockProduct {
    id: string;
    title: string;
    stock: number;
    images: string[];
}

export interface AdminDashboard {
    totalSales: number;
    activeOrders: number;
    totalUsers: number;
    lowStockProducts: LowStockProduct[];
}

export interface CreateProductData {
    title: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    tier: "OFFICIAL" | "BOOTLEG";
    category: "FIGURE" | "CARD" | "PLUSH" | "DECOR" | "OTHER";
    condition?: "NEW" | "USED" | "DAMAGED";
    brand?: string;
    franchise?: string;
    images?: string[];
}

export interface AdminOrder extends OrderResponse {
    user: {
        id: string;
        username: string;
        email: string;
    };
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("loot-kingdom-auth");
        if (!stored) return null;
        try {
            const parsed = JSON.parse(stored);
            return parsed.state?.token || null;
        } catch {
            return null;
        }
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit & { auth?: boolean }
    ): Promise<ApiResponse<T>> {
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
                ...options?.headers,
            };

            // Add auth header if needed
            if (options?.auth) {
                const token = this.getToken();
                if (token) {
                    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                    data: null as T,
                    error: errorData.message || `HTTP ${response.status}`,
                };
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            console.error("API Error:", error);
            return {
                data: null as T,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    }

    async register(
        email: string,
        password: string,
        username: string
    ): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password, username }),
        });
    }

    async getProfile(): Promise<ApiResponse<AuthUser>> {
        return this.request<AuthUser>("/auth/me", { auth: true });
    }

    async getStats(): Promise<ApiResponse<UserStats>> {
        return this.request<UserStats>("/auth/stats", { auth: true });
    }

    // ============================================
    // CART
    // ============================================

    async getCart(): Promise<ApiResponse<CartResponse>> {
        return this.request<CartResponse>("/cart", { auth: true });
    }

    async addToCart(productId: string, quantity = 1): Promise<ApiResponse<CartItem>> {
        return this.request<CartItem>("/cart/add", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
            auth: true,
        });
    }

    async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<CartItem>> {
        return this.request<CartItem>(`/cart/${itemId}`, {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
            auth: true,
        });
    }

    async removeFromCart(itemId: string): Promise<ApiResponse<{ id: string }>> {
        return this.request<{ id: string }>(`/cart/${itemId}`, {
            method: "DELETE",
            auth: true,
        });
    }

    async clearCart(): Promise<ApiResponse<{ count: number }>> {
        return this.request<{ count: number }>("/cart", {
            method: "DELETE",
            auth: true,
        });
    }

    // ============================================
    // ORDERS
    // ============================================

    async createOrder(): Promise<ApiResponse<OrderResponse>> {
        return this.request<OrderResponse>("/orders", {
            method: "POST",
            auth: true,
        });
    }

    async confirmOrder(orderId: string, paymentStatus: string): Promise<ApiResponse<OrderResponse>> {
        return this.request<OrderResponse>(`/orders/${orderId}/confirm?status=${paymentStatus}`, {
            method: "POST",
            auth: true,
        });
    }

    async getOrders(): Promise<ApiResponse<OrderResponse[]>> {
        return this.request<OrderResponse[]>("/orders", { auth: true });
    }

    // ============================================
    // PRODUCTS
    // ============================================

    async getProducts(filters?: ProductFilters): Promise<Product[]> {
        const params = new URLSearchParams();

        if (filters?.category) params.append("category", filters.category);
        if (filters?.condition) params.append("condition", filters.condition);
        if (filters?.tier) params.append("tier", filters.tier);
        if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
        if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
        if (filters?.search) params.append("search", filters.search);

        const queryString = params.toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ""}`;

        const response = await this.request<Product[]>(endpoint);

        if (response.error || !response.data) {
            console.warn("Failed to fetch products, returning empty array");
            return [];
        }

        return response.data.map(this.mapProduct);
    }

    async getProductBySlug(slug: string): Promise<Product | null> {
        const response = await this.request<Product>(`/products/${slug}`);

        if (response.error || !response.data) {
            return null;
        }

        return this.mapProduct(response.data);
    }

    private mapProduct(product: Product): Product {
        return {
            id: product.id,
            title: product.title,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            brand: product.brand,
            franchise: product.franchise,
            condition: product.condition,
            tier: product.tier,
            category: product.category,
            images: product.images || [],
        };
    }

    // ============================================
    // ADMIN
    // ============================================

    async getAdminDashboard(): Promise<ApiResponse<AdminDashboard>> {
        return this.request<AdminDashboard>("/admin/dashboard", { auth: true });
    }

    async getAdminProducts(): Promise<ApiResponse<Product[]>> {
        return this.request<Product[]>("/admin/products", { auth: true });
    }

    async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
        return this.request<Product>("/admin/products", {
            method: "POST",
            body: JSON.stringify(data),
            auth: true,
        });
    }

    async updateProduct(id: string, data: Partial<CreateProductData>): Promise<ApiResponse<Product>> {
        return this.request<Product>(`/admin/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            auth: true,
        });
    }

    async deleteProduct(id: string): Promise<ApiResponse<Product>> {
        return this.request<Product>(`/admin/products/${id}`, {
            method: "DELETE",
            auth: true,
        });
    }

    async getAdminOrders(): Promise<ApiResponse<AdminOrder[]>> {
        return this.request<AdminOrder[]>("/admin/orders", { auth: true });
    }

    async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<OrderResponse>> {
        return this.request<OrderResponse>(`/admin/orders/${orderId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
            auth: true,
        });
    }
}

// Export singleton instance
export const api = new ApiClient(API_URL);

// Export convenience functions
export const getProducts = (filters?: ProductFilters) => api.getProducts(filters);
export const getProductBySlug = (slug: string) => api.getProductBySlug(slug);
