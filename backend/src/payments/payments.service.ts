import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize with access token from env
const getClient = () => {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
        console.warn('⚠️ MP_ACCESS_TOKEN not set! Payment integration will not work.');
        return null;
    }
    return new MercadoPagoConfig({ accessToken });
};

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

@Injectable()
export class PaymentsService {
    async createPreference(data: CreatePreferenceData): Promise<string | null> {
        const client = getClient();

        if (!client) {
            // Return null if MP not configured (for development)
            console.warn('Mercado Pago not configured, skipping payment');
            return null;
        }

        const preference = new Preference(client);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        try {
            const response = await preference.create({
                body: {
                    items: data.items.map((item) => ({
                        id: item.product.id,
                        title: item.product.title,
                        description: item.product.description?.substring(0, 256) || 'Loot Kingdom Item',
                        picture_url: item.product.images?.[0] || undefined,
                        quantity: item.quantity,
                        unit_price: item.priceAtOrder / 100, // Convert cents to ARS
                        currency_id: 'ARS',
                    })),
                    payer: data.payerEmail ? { email: data.payerEmail } : undefined,
                    back_urls: {
                        success: `${frontendUrl}/checkout/success?order_id=${data.orderId}`,
                        failure: `${frontendUrl}/checkout/failure?order_id=${data.orderId}`,
                        pending: `${frontendUrl}/checkout/pending?order_id=${data.orderId}`,
                    },
                    auto_return: 'approved',
                    external_reference: data.orderId,
                    statement_descriptor: 'LOOT KINGDOM',
                    notification_url: process.env.MP_WEBHOOK_URL || undefined,
                },
            });

            return response.init_point || null;
        } catch (error) {
            console.error('Error creating MP preference:', error);
            return null;
        }
    }
}
