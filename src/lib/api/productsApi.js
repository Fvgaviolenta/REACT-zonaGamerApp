// Mock de datos y "API" falsa con latencia para simular llamados reales

const categories = [
    {
        id: 'hardware',
        name: 'Hardware',
        children: [
            { id: 'cpu', name: 'CPU', parentId: 'hardware' },
            { id: 'gpu', name: 'GPU', parentId: 'hardware' },
            { id: 'motherboard', name: 'Motherboards', parentId: 'hardware' },
        ],
    },
    {
        id: 'perifericos',
        name: 'Periféricos',
        children: [
            { id: 'teclados', name: 'Teclados', parentId: 'perifericos' },
            { id: 'mouse', name: 'Mouse', parentId: 'perifericos' },
            { id: 'monitores', name: 'Monitores', parentId: 'perifericos' },
        ],
    },
];

const products = [
    {
        id: '1',
        name: 'Nvidia GeForce RTX 4070 Ti SUPER',
        price: 3225225,
        description: 'Potente GPU para gaming y creación.',
        imageUrl:
            'https://www.winpy.cl/files/38856-1725-RTX-4070-TI-SUPER-16G-VENTUS-3X-1.jpg',
        categoryId: 'gpu',
        isFeatured: true,
    },
    {
        id: '2',
        name: 'Redragon Kumara K552 RGB',
        price: 43000,
        description: 'Teclado mecánico compacto, switches blue.',
        imageUrl:
            'https://i.bolder.run/r/czozMjIxLGc6NjkweA/2d37a7fc/736207-Kumara1.png',
        categoryId: 'teclados',
        isFeatured: true,
    },
    {
        id: '3',
        name: 'Intel Core i7-12700KF',
        price: 789903,
        description: '12ª gen, 12 núcleos, hasta 5.0 GHz.',
        imageUrl:
            'https://gsmpro.cl/cdn/shop/files/procesador-intel-core-i7-12700kf.jpg?v=1747340810&width=900',
        categoryId: 'cpu',
        isFeatured: true,
    },
    {
        id: '4',
        name: 'Notebook Gamer HP OMEN',
        price: 899890,
        description: 'Equipo versátil para juegos y trabajo.',
        imageUrl:
            'https://media.spdigital.cl/thumbnails/products/tmp_1ggc33p_21eb8266_thumbnail_4096.jpg',
        categoryId: 'hardware',
        isFeatured: true,
    },
];

// Simula llamadas asíncronas con latencia
export function fetchProducts() {
    return new Promise((res) => setTimeout(() => res(products), 400));
}

export function fetchCategories() {
    return new Promise((res) => setTimeout(() => res(categories), 200));
}