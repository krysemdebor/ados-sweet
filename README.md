# Ados Sweet — Astro + Tailwind + JavaScript

## Ejecutar
1. Instala Node.js 22.12 o superior compatible con Astro 5.
2. Abre esta carpeta en VS Code y una terminal.
3. Ejecuta `npm ci` y después `npm run dev`.
4. Abre la dirección que muestra Astro (normalmente http://localhost:4321).

## Compilar
`npm run build` genera `dist/`. `npm run preview` permite revisar esa compilación.

## Dónde editar
- Páginas: `src/pages/`. Cada archivo .astro crea una ruta.
- Menú, pie y JavaScript del carrito: `src/layouts/Layout.astro`.
- Productos, precios en soles y cantidades: `src/data/products.js`.
- Tarjeta de producto: `src/components/Product.astro`.
- Blog: `src/data/posts.js`, con rutas generadas en `src/pages/blog/[slug].astro`.
- Colores y estilos globales: `src/styles/global.css`. Tailwind 4 se conecta por @tailwindcss/vite en astro.config.mjs.
- Imagen original: `public/images/ados-sweet.png`. Las tarjetas usan encuadres CSS de esta imagen. Para producción, reemplázalos por fotografías individuales.

## Funcionalidad y límites
Carrito local persistente con agregar, eliminar, ajustar cantidades (máximo 99 por producto), subtotal y vaciado. Menú móvil, cinco páginas principales y tres artículos. Contactos descarga una consulta como texto y NO la envía.
Los precios y textos editoriales son ejemplos. No hay pagos, inventario, autenticación, envío de correo ni registro de pedidos. Para vender, conecta un backend y una pasarela, valida precios y stock en el servidor, configura datos reales de contacto y políticas comerciales. Nunca coloques claves secretas en el navegador.

## Publicar por tu cuenta
Sube el contenido de dist a un servicio de alojamiento estático con soporte para index.html en cada ruta. No necesitas Node en el servidor para estas páginas estáticas.

Documentación: https://docs.astro.build/en/guides/styling/#tailwind
