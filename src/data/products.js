// Fuente: catálogo de Ados Sweet, revisado el 01/10/2026.
export const catalogSource = 'https://www.canva.com/design/DAGqz4WSmT4/1H4sLBye8f_ZXU_pGzJx5g/view';
const photo = (page, variant = 1) => `/images/products/catalogo-${String(page).padStart(2, '0')}-${variant}.png`;
const single = (id, name, description, category, size, price, page, extra = {}) => ({
    id, name, description, category, brand: 'Ados Sweet', available: true, ...extra,
    variants: [{ id, size, price, image: photo(page) }],
});
const iceCream = (id, name, description, page, prices = [13, 24], extra = {}) => ({
    id, name, description, category: 'Helados', brand: 'Ados Sweet', available: true, ...extra,
    variants: prices.map((price, i) => ({ id: i ? `${id}-500` : id, size: i ? '500 ml' : '250 ml', price, image: photo(page, i + 1) })),
});

export const catalog = [
    single('pina', 'Mermelada de piña', 'Sabor tropical de piña. Elaborada con 99% fruta y endulzada con stevia y yacón natural.', 'Mermeladas', '275 g', 25, 3),
    single('arandanos', 'Mermelada de arándanos', 'Textura suave y sabor profundo. Elaborada con 99% fruta y endulzada con stevia y yacón natural.', 'Mermeladas', '275 g', 25, 4),
    single('mermelada-mango-maracuya', 'Mermelada de mango y maracuyá', 'Una combinación tropical de mango y maracuyá, con stevia y yacón natural.', 'Mermeladas', '275 g', 25, 5),
    single('mermelada-fresa-mora', 'Mermelada de fresa y mora', 'Dos sabores frutales para acompañar tus desayunos, con stevia y yacón natural.', 'Mermeladas', '275 g', 25, 6),
    single('vitaliza', 'Vitaliza', 'Granola tradicional con avena, frutos secos, dátiles y semillas. Crocante y artesanal.', 'Granolas', '250 g', 22, 8, { featured: true }),
    single('chocovital', 'Chocovital', 'Granola artesanal con cacao puro para los amantes del chocolate.', 'Granolas', '250 g', 22, 9),
    single('mani', 'Manirela', 'Mantequilla de maní tostado, cremosa y sin aditivos.', 'Mantequillas', '290 g', 19, 11),
    single('chocorela', 'Chocorela', 'Mantequilla con maní, cacao, miel de dátiles y aceite de coco. Sin azúcar añadida.', 'Mantequillas', '290 g', 22, 12, { featured: true }),
    single('almendrela', 'Almendrela', 'Mantequilla de almendras de textura suave.', 'Mantequillas', '290 g', 33, 13, { available: false }),
    iceCream('fresa', 'Helado de fresa', 'Elaborado con fruta real, de textura suave y cremosa.', 15),
    iceCream('helado-lucuma', 'Helado de lúcuma', 'Pulpa real de lúcuma peruana, con un sabor dulce y ligeramente acaramelado.', 16),
    iceCream('helado-arandanos', 'Helado de arándanos', 'Fruta real con un equilibrio de dulzura y acidez, sin azúcar refinada añadida.', 17),
    iceCream('helado-guanabana', 'Helado de guanábana', 'Fruta real, aromática y delicadamente ácida, en una textura cremosa.', 18),
    iceCream('mango', 'Helado de mango con maracuyá', 'La dulzura del mango se combina con la frescura del maracuyá. Elaborado con fruta real.', 19),
    iceCream('princess-ice-cream', 'Princess Ice Cream', 'Cacao 100% puro, mantequilla de maní y trozos crujientes de maní.', 20, [15, 27], { line: 'Premium' }),
    iceCream('chocolate-intenso', 'Chocolate intenso', 'Helado cremoso elaborado con cacao 100%, de sabor profundo y auténtico.', 21, [13, 24], { line: 'Premium' }),
    iceCream('pistacho', 'Pistacho', 'Pistacho real, crema casera de pistacho y trozos crujientes de pistacho.', 22, [15], { line: 'Premium' }),
    iceCream('ron-pasas', 'Ron con pasas', 'Helado cremoso con ron de verdad y pasas maceradas en ron.', 23, [15, 27], { line: 'Con licor', adultsOnly: true }),
].map(product => ({ ...product, ...product.variants[0] }));

export const products = catalog.flatMap(({ variants, ...product }) =>
    variants.map(variant => ({ ...product, ...variant, catalogId: product.id })),
);
