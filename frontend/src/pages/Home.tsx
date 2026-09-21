import { useEffect, useState } from "react";
import api from "../api/client";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function loadProducts() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.brand) params.brand = filters.brand;
      if (filters.model) params.model = filters.model;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(field: string, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="container">
      <h1>Nossos Produtos</h1>
      <Filters {...filters} onChange={handleFilterChange} />

      {loading ? (
        <p>Carregando...</p>
      ) : products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.rowKey} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
