import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string;
    email: string;
    username: string;
    lootCoins: number;
    role: "USER" | "ADMIN";
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    updateCoins: (amount: number) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (token, user) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            updateUser: (userData) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...userData },
                    });
                }
            },

            updateCoins: (amount) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: {
                            ...currentUser,
                            lootCoins: currentUser.lootCoins + amount,
                        },
                    });
                }
            },
        }),
        {
            name: "loot-kingdom-auth",
            // Only persist specific fields
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
