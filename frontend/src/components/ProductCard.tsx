import { Link } from "react-router-dom";
import { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/produto/${product.rowKey}`} className="product-card">
      <div className="product-card-image">
        {product.photoUrl ? (
          <img src={product.photoUrl} alt={`${product.brand} ${product.model}`} />
        ) : (
          <div className="product-card-placeholder">Sem foto</div>
        )}
      </div>
      <div className="product-card-info">
        <h3>
          {product.brand} {product.model}
        </h3>
        <p className="product-price">R$ {product.price.toFixed(2)}</p>
        <p className="product-stock">
          {product.quantity > 0
            ? `${product.quantity} em estoque`
            : "Fora de estoque"}
        </p>
      </div>
    </Link>
  );
}
