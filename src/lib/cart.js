import { products } from '../data/products.js';

export const CART_KEY = 'ados-sweet-cart-v1';
export const MAX_QUANTITY = 99;
export const money = (value) => new Intl.NumberFormat('es-PE', {
    style: 'currency', currency: 'PEN',
}).format(value);

export function sanitizeCart(value) {
    const cart = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) return cart;
    for (const product of products) {
        const quantity = value[product.id];
        if (Number.isInteger(quantity) && quantity > 0) {
            cart[product.id] = Math.min(MAX_QUANTITY, quantity);
        }
    }
    return cart;
}

export function cartSummary(cart) {
    const clean = sanitizeCart(cart);
    const items = products.filter((product) => clean[product.id]).map((product) => ({
        ...product, quantity: clean[product.id],
        lineCents: Math.round(product.price * 100) * clean[product.id],
    }));
    return {
        items,
        count: items.reduce((sum, item) => sum + item.quantity, 0),
        total: items.reduce((sum, item) => sum + item.lineCents, 0) / 100,
    };
}

export function normalizePhone(value) {
    const phone = String(value || '').replace(/[\s()+-]/g, '');
    return /^[1-9]\d{7,14}$/.test(phone) ? phone : '';
}

export function buildOrderMessage(cart, details = {}) {
    const { items, total } = cartSummary(cart);
    if (!items.length) return '';
    const lines = items.map((item, index) =>
        `${index + 1}. ${item.name} (${item.size})\n   ${item.quantity} × ${money(item.price)} = ${money(item.lineCents / 100)}`);
    const name = String(details.name || '').trim().slice(0, 80);
    const notes = String(details.notes || '').trim().slice(0, 500);
    return [
        '¡Hola, Ados Sweet! Quisiera pedir:', '', ...lines, '',
        `Subtotal de productos: ${money(total)}`,
        'Envío no incluido. Por favor, confirmen disponibilidad, precio final y entrega.',
        ...(name ? ['', `Mi nombre: ${name}`] : []),
        ...(notes ? [`Notas: ${notes}`] : []),
    ].join('\n');
}

export function buildWhatsAppUrl(phone, cart, details = {}) {
    const number = normalizePhone(phone);
    const message = buildOrderMessage(cart, details);
    if (!number || !message) return null;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
