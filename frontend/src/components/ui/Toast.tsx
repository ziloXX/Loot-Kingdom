"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, ShoppingCart } from "lucide-react";

type ToastType = "success" | "error" | "info" | "cart";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    showToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (type: ToastType, message: string, duration = 3000) => {
            const id = Math.random().toString(36).slice(2);
            const toast: Toast = { id, type, message, duration };

            setToasts((prev) => [...prev, toast]);

            if (duration > 0) {
                setTimeout(() => removeToast(id), duration);
            }
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({
    toasts,
    removeToast,
}: {
    toasts: Toast[];
    removeToast: (id: string) => void;
}) {
    if (toasts.length === 0) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-rpg-success" />,
        error: <AlertTriangle className="w-5 h-5 text-rpg-danger" />,
        info: <Info className="w-5 h-5 text-rpg-primary" />,
        cart: <ShoppingCart className="w-5 h-5 text-rpg-gold" />,
    };

    const backgrounds = {
        success: "border-rpg-success/50 bg-rpg-success/10",
        error: "border-rpg-danger/50 bg-rpg-danger/10",
        info: "border-rpg-primary/50 bg-rpg-primary/10",
        cart: "border-rpg-gold/50 bg-rpg-gold/10",
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${backgrounds[toast.type]}`}
                >
                    {icons[toast.type]}
                    <p className="flex-1 text-sm text-rpg-text">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-rpg-text-muted hover:text-rpg-text transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
