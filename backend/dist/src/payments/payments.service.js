"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mercadopago_1 = require("mercadopago");
const getClient = () => {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
        console.warn('⚠️ MP_ACCESS_TOKEN not set! Payment integration will not work.');
        return null;
    }
    return new mercadopago_1.MercadoPagoConfig({ accessToken });
};
let PaymentsService = class PaymentsService {
    async createPreference(data) {
        const client = getClient();
        if (!client) {
            console.warn('Mercado Pago not configured, skipping payment');
            return null;
        }
        const preference = new mercadopago_1.Preference(client);
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
                        unit_price: item.priceAtOrder / 100,
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
        }
        catch (error) {
            console.error('Error creating MP preference:', error);
            return null;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)()
], PaymentsService);
//# sourceMappingURL=payments.service.js.map