import ProductCard from './ProductCard'

// SECCION SUPERIOR CON PRODUCTOS DESTACADOS

export default function featuredProducts({ products }) {
    if(!products || products.lenght === 0) return null;

    return (
        <section aria-labelledby="featured-heading" className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <h2 id="featured-heading" className="text-lg font-semibold">
                    Productos Destacados
                </h2>
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p)=> (
                    <ProductCard key={p.id} product={p}/>
                ))}
            </div>
        </section>
    )
}