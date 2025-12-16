import { create } from "zustand";
import { mockUser, type User, type Product } from "@/lib/mock-data";

interface CartItem {
    product: Product;
    quantity: number;
}

interface AppState {
    // User
    user: User | null;
    setUser: (user: User | null) => void;

    // Cart
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: () => number;
    cartCount: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initialize with mock user for development
    user: mockUser,
    setUser: (user) => set({ user }),

    cart: [],

    addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find((item) => item.product.id === product.id);

        if (existing) {
            set({
                cart: cart.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        } else {
            set({ cart: [...cart, { product, quantity: 1 }] });
        }
    },

    removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
        }
        set({
            cart: get().cart.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            ),
        });
    },

    clearCart: () => set({ cart: [] }),

    cartTotal: () => {
        return get().cart.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    },

    cartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
    },
}));
