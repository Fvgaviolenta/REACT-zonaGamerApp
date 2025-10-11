export default function ProductCard({ product }) {
    return (
        <div className="card bg-base-100 w-full shadow-sm">
            <figure>
                <img
                    src={product?.imageUrl}
                    alt={product?.name || 'Producto'}
                    loading="lazy"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{product?.name}</h2>
                {product?.description ? <p>{product.description}</p> : null}
                <div className="card-actions justify-end">
                    <button className="btn btn-primary">Comprar</button>
                </div>
            </div>
        </div>
    );
}