import { products } from '../data/products.js';
import { CART_KEY, MAX_QUANTITY, sanitizeCart, cartSummary, money, buildWhatsAppUrl } from '../lib/cart.js';

const dialog = document.querySelector<HTMLDialogElement>('#cart-dialog')!;
const container = document.querySelector<HTMLElement>('#cart-items')!;
const summary = document.querySelector<HTMLElement>('#cart-summary')!;
const checkout = document.querySelector<HTMLButtonElement>('#cart-checkout')!;
const toast = document.querySelector<HTMLElement>('#toast')!;
const form = document.querySelector<HTMLFormElement>('#order-form')!;
const status = document.querySelector<HTMLElement>('#order-status')!;
let cart: Record<string, number> = {};
let timer: ReturnType<typeof setTimeout>;
try { cart = sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY) || '{}')); } catch {}

function notify(message: string) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => { toast.hidden = true; }, 2600);
}
function save() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
    catch { notify('Tu carrito funciona, pero este navegador no permite guardarlo al salir.'); }
}
function makeButton(label: string, text: string, action: string, id: string) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);
    button.dataset.action = action;
    button.dataset.id = id;
    button.className = action === 'remove' ? 'text-xs underline' : 'qty';
    return button;
}
function render(focus?: { id: string; action: string }) {
    const { items, total, count } = cartSummary(cart);
    container.replaceChildren();
    for (const item of items) {
        const row = document.createElement('div');
        row.className = 'cart-row';
        const info = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = item.name;
        const detail = document.createElement('p');
        detail.className = 'text-xs text-stone-600';
        detail.textContent = `${item.size} · ${money(item.price)} c/u`;
        const lineTotal = document.createElement('span');
        lineTotal.className = 'text-sm font-semibold';
        lineTotal.textContent = money(item.lineCents / 100);
        info.append(name, detail, lineTotal);
        const controls = document.createElement('div');
        controls.className = 'flex items-center gap-2';
        const quantity = document.createElement('span');
        quantity.textContent = String(item.quantity);
        quantity.setAttribute('aria-label', `Cantidad de ${item.name}: ${item.quantity}`);
        const minus = makeButton(`Quitar una unidad de ${item.name}`, '−', 'decrease', item.id);
        const plus = makeButton(`Agregar una unidad de ${item.name}`, '+', 'increase', item.id);
        plus.disabled = item.quantity >= MAX_QUANTITY;
        controls.append(minus, quantity, plus);
        row.append(info, controls, makeButton(`Eliminar ${item.name}`, 'Eliminar', 'remove', item.id));
        container.append(row);
    }
    if (!count) {
        const empty = document.createElement('div');
        empty.className = 'py-10 text-center';
        const text = document.createElement('p');
        text.textContent = 'Tu carrito está esperando algo rico. Elige tus favoritos para comenzar.';
        const link = document.createElement('a');
        link.href = '/tienda/';
        link.className = 'btn mt-5';
        link.textContent = 'Explorar la tienda ↗';
        empty.append(text, link);
        container.append(empty);
    }
    document.querySelector('#cart-count')!.textContent = String(count);
    document.querySelector('#cart-open')!.setAttribute('aria-label', `Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`);
    document.querySelector('#cart-total')!.textContent = money(total);
    summary.hidden = !count;
    checkout.disabled = !count || !dialog.dataset.whatsapp;
    if (focus) {
        const target = Array.from(container.querySelectorAll<HTMLButtonElement>('button')).find(button => button.dataset.id === focus.id && button.dataset.action === focus.action && !button.disabled);
        (target || container.querySelector<HTMLButtonElement>('button') || document.querySelector<HTMLButtonElement>('#cart-continue'))?.focus();
    }
}
document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('button');
    if (!button) return;
    const id = button.dataset.add || button.dataset.id;
    if (!id || !products.some(product => product.id === id && product.available !== false)) return;
    if (button.dataset.add) {
        if ((cart[id] || 0) >= MAX_QUANTITY) { notify('Puedes agregar hasta 99 unidades por producto.'); return; }
        cart[id] = (cart[id] || 0) + 1;
        notify(`${products.find(product => product.id === id)!.name} agregado al carrito`);
        render();
    } else if (button.dataset.action && container.contains(button)) {
        const action = button.dataset.action;
        if (action === 'remove') delete cart[id];
        else cart[id] = Math.max(0, Math.min(MAX_QUANTITY, (cart[id] || 0) + (action === 'increase' ? 1 : -1)));
        cart = sanitizeCart(cart);
        render({ id, action });
    } else return;
    status.textContent = 'Se abrirá WhatsApp con tu pedido listo para enviar. El pedido se confirma al conversar con nosotros.';
    save();
});
document.querySelector('#cart-open')!.addEventListener('click', () => { dialog.showModal(); document.body.style.overflow = 'hidden'; });
for (const id of ['cart-close', 'cart-continue']) document.getElementById(id)!.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
document.querySelector('#cart-clear')!.addEventListener('click', () => { cart = {}; save(); render(); document.querySelector<HTMLButtonElement>('#cart-continue')!.focus(); });
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = buildWhatsAppUrl(dialog.dataset.whatsapp, cart, {
        name: (document.getElementById('order-name') as HTMLInputElement).value,
        notes: (document.getElementById('order-notes') as HTMLTextAreaElement).value,
    });
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
    status.textContent = 'Tu pedido está listo en WhatsApp. Pulsa Enviar allí para compartirlo. Conservamos tu carrito para que puedas volver.';
});
window.addEventListener('storage', (event) => {
    if (event.key !== CART_KEY && event.key !== null) return;
    try { cart = sanitizeCart(JSON.parse(event.newValue || '{}')); } catch { cart = {}; }
    render();
});
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle')!;
menuToggle.addEventListener('click', () => {
    const nav = document.querySelector<HTMLElement>('#mobile-nav')!;
    nav.hidden = !nav.hidden;
    menuToggle.setAttribute('aria-expanded', String(!nav.hidden));
    menuToggle.setAttribute('aria-label', nav.hidden ? 'Abrir menú' : 'Cerrar menú');
});
render();
