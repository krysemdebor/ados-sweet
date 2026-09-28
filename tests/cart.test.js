import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/products.js';
import { posts } from '../src/data/posts.js';
import { sanitizeCart, cartSummary, buildWhatsAppUrl, buildOrderMessage, normalizePhone } from '../src/lib/cart.js';

test('saved carts ignore unknown products and invalid quantities', () => {
    assert.deepEqual(sanitizeCart({ vitaliza: 2, fresa: -1, mango: '3', mani: 1.5, invalid: 9, chocovital: 200 }), { vitaliza: 2, chocovital: 99 });
    for (const value of [null, [], 'bad', 7]) assert.deepEqual(sanitizeCart(value), {});
});
test('summary calculates units and totals from catalog prices', () => {
    const result = cartSummary({ vitaliza: 2, fresa: 3 });
    assert.equal(result.count, 5);
    assert.equal(result.total, 84);
    assert.equal(result.items[0].lineCents, 4800);
    assert.equal(cartSummary({}).total, 0);
});
test('WhatsApp requires recipient and a nonempty cart', () => {
    assert.equal(buildWhatsAppUrl('', { vitaliza: 1 }), null);
    assert.equal(buildWhatsAppUrl('51999999999', {}), null);
    assert.equal(normalizePhone('+51 999-999-999'), '51999999999');
    assert.equal(normalizePhone('51abc999999999'), '');
    assert.equal(normalizePhone('000000000'), '');
});
test('order URL preserves products, quantities, totals, accents and customer notes', () => {
    const url = new URL(buildWhatsAppUrl('+51 999 999 999', { vitaliza: 2, fresa: 3 }, { name: 'José & María', notes: 'Recojo #2\n¿Mañana?' }));
    assert.equal(url.host, 'wa.me');
    assert.equal(url.pathname, '/51999999999');
    const message = url.searchParams.get('text');
    assert.match(message, /Vitaliza \(250 g\)/);
    assert.match(message, /2 ×/);
    assert.match(message, /84[.,]00/);
    assert.match(message, /José & María/);
    assert.match(message, /Recojo #2\n¿Mañana\?/);
    assert.match(message, /Envío no incluido/);
    assert.equal(buildOrderMessage({}), '');
});
test('catalog and article references are valid and unique', () => {
    assert.equal(new Set(products.map(p => p.id)).size, products.length);
    assert.equal(new Set(posts.map(p => p.slug)).size, posts.length);
    assert.ok(products.every(p => p.price > 0 && Number.isFinite(p.price)));
    for (const post of posts) {
        assert.ok(post.sections.length >= 3);
        assert.ok(post.productIds.every(id => products.some(p => p.id === id)));
    }
});
