// 🧪 Mock Helper para testing del Auth Store
// Usa esto en desarrollo para simular un usuario autenticado

import { useAuthStore } from './auth-store';

// Simular login de un usuario de prueba
export function mockLogin() {
    const { login } = useAuthStore.getState();

    login('mock-jwt-token-123', {
        id: '1',
        email: 'player@lootkingdom.com',
        username: 'DragonHunter',
        level: 3,
        lootCoins: 1450,
        xpPoints: 3200,
        role: 'USER',
    });

    console.log('✅ Mock user logged in:', useAuthStore.getState().user);
}

// Simular logout
export function mockLogout() {
    const { logout } = useAuthStore.getState();
    logout();
    console.log('✅ User logged out');
}

// Simular usuario admin
export function mockAdminLogin() {
    const { login } = useAuthStore.getState();

    login('mock-admin-token-456', {
        id: 'admin-1',
        email: 'admin@lootkingdom.com',
        username: 'GuildMaster',
        level: 99,
        lootCoins: 999999,
        xpPoints: 999999,
        role: 'ADMIN',
    });

    console.log('✅ Mock admin logged in:', useAuthStore.getState().user);
}

// Uso en consola del dev tools:
// import { mockLogin, mockLogout, mockAdminLogin } from '@/lib/auth-helpers';
// mockLogin();
