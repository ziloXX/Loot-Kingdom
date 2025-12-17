interface OrderItem {
    id: string;
    quantity: number;
    priceAtOrder: number;
    product: {
        id: string;
        title: string;
        description: string;
        images: string[];
    };
}
interface CreatePreferenceData {
    orderId: string;
    items: OrderItem[];
    total: number;
    payerEmail?: string;
}
export declare class PaymentsService {
    createPreference(data: CreatePreferenceData): Promise<string | null>;
}
export {};
