import LoadingSkeleton from './LoadingSkeleton';
import ProductCard from './ProductCard';

// Grid reutilizable con estado de loading
export default function ProductGrid({ products, loading, skeletonCount = 8 }) {
    if (loading) {
        return (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <LoadingSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}