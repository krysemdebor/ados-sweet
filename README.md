# Ados Sweet — Astro + Tailwind + JavaScript

## Ejecutar

1. Usa Node.js 22.12 o superior compatible con Astro 5.
2. Ejecuta `npm ci`.
3. Copia `.env.example` a `.env` y configura el WhatsApp del negocio.
4. Ejecuta `npm run dev` y abre la dirección indicada en la terminal.

## WhatsApp para pedidos

Configura `PUBLIC_WHATSAPP_NUMBER` con el código de país y el número real del negocio, solo dígitos. Para Perú: `51` seguido de los nueve dígitos del celular. También puedes editar `whatsappNumber` en `src/data/store.js`; la variable de entorno tiene prioridad.

Después de cambiar el número, reinicia el servidor de desarrollo o vuelve a ejecutar `npm run build` y publica la nueva compilación. Astro incorpora este dato público al compilar; no es una credencial.

Si no hay un número válido configurado, el carrito funciona pero el botón de WhatsApp permanece deshabilitado, con un enlace a Contactos. No se usa ningún destinatario inventado.

El cliente agrega productos, ajusta cantidades y pulsa **Pedir por WhatsApp**. Se abre una pestaña con el chat del negocio y un mensaje preparado que incluye:

- Productos, presentaciones, cantidades y precios por unidad.
- Importe por producto y subtotal en soles.
- Nombre y notas opcionales.
- Solicitud de confirmación de disponibilidad, precio final y entrega; el envío no está incluido.

El cliente debe pulsar **Enviar** en WhatsApp. Abrir el enlace no confirma ni registra el pedido, no efectúa pagos y no vacía el carrito.

## Dónde editar

- Productos: `src/data/products.js`. Incluye nueve productos de prueba con precios referenciales; conserva los IDs si quieres mantener los carritos guardados.
- WhatsApp: `src/data/store.js` o `PUBLIC_WHATSAPP_NUMBER`.
- Carrito: `src/components/Cart.astro`, `src/scripts/cart.ts` y `src/lib/cart.js`.
- Tienda y filtros: `src/pages/tienda.astro`, `src/components/ShopFilters.astro`.
- Tarjetas: `src/components/Product.astro`; utilizan encuadres CSS de la imagen de marca existente.
- Blog: `src/data/posts.js`. Cada artículo tiene un slug, categoría, introducción, secciones, cierre y productos relacionados. Las rutas se generan en `src/pages/blog/[slug].astro`.
- Menú y pie: `src/layouts/Layout.astro`.
- Colores: `src/styles/global.css`.

El carrito conserva hasta 99 unidades por producto en `localStorage` y se sincroniza entre pestañas. Si el almacenamiento no está disponible, se puede usar durante la visita actual. Los precios se calculan desde el catálogo, no desde datos de precio guardados en el navegador.

## Verificar y compilar

- `npm test`: validación de cantidades, subtotales, referencias del catálogo y mensaje/enlace de WhatsApp.
- `npm run build`: genera las nueve páginas estáticas en `dist/`.
- `npm run preview`: sirve esa compilación para revisarla.

Prueba manual: agregar dos productos, variar cantidades, recargar, navegar al blog, abrir el carrito, eliminar y vaciar. Comprueba filtros, búsqueda sin tildes, ordenamiento y estado sin resultados. Con el número real configurado, revisa el mensaje de WhatsApp antes de enviarlo. Repite en móvil y con teclado.

## Publicar

Sube `dist/` a un alojamiento estático compatible con `index.html` en cada ruta. Configura la variable de WhatsApp antes de compilar.

Antes de usar el catálogo comercialmente, reemplaza o confirma productos, imágenes, presentaciones y precios de prueba. La disponibilidad, el envío y el pago se coordinan por WhatsApp; este proyecto no incluye inventario, pasarela de pago ni registro de pedidos en un servidor.
