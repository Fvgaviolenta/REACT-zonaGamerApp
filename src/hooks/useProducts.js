import { useEffect, useState } from 'react';
import { fetchProducts } from '../lib/api/productsApi';

// Encapsula carga y filtrado por categorías seleccionadas
export function useProducts(selectedCategoryIds = []) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchProducts().then((p) => {
            if (!mounted) return;
            const filtered =
                selectedCategoryIds.length > 0
                    ? p.filter((prod) => selectedCategoryIds.includes(prod.categoryId))
                    : p;
            setData(filtered);
            setLoading(false);
        });
        return () => {
            mounted = false;
        };
    }, [selectedCategoryIds]);

    return { products: data, loading };
}