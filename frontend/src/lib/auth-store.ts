// 🔒 Auth Store - Zustand con persistencia
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    username: string;
    level: number;
    lootCoins: number;
    xpPoints: number;
    role: 'USER' | 'ADMIN';
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (token: string, user: User) =>
                set({
                    token,
                    user,
                    isAuthenticated: true
                }),

            logout: () =>
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false
                }),

            updateUser: (updatedUser: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedUser } : null,
                })),
        }),
        {
            name: 'loot-kingdom-auth', // localStorage key
        }
    )
);
