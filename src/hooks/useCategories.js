import { useEffect, useState } from 'react';
import { fetchCategories } from '../lib/api/productsApi';

// Carga de categorías (una sola vez)
export function useCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCategories().then((c) => {
      if (!mounted) return;
      setData(c);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { categories: data, loading };
}