export default function ProductFilterBar({
    search,
    onSearchChange,
    sort,
    onSortChange,
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-6 p-3">
            <input type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 rounded border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
                <option value="featured">Destacados primero</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="alpha">Nombre A-Z</option>
            </select>
        </div>
    );
}