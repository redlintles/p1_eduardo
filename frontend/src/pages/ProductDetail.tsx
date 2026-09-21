import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div className="container">Carregando produto...</div>;

  function handleAddToCart() {
    if (!product) return;
    if (quantity < 1 || quantity > product.quantity) {
      setMessage("Quantidade inválida para o estoque disponível.");
      return;
    }
    addItem(product, quantity);
    setMessage("Produto adicionado ao carrinho!");
  }

  return (
    <div className="container">
      <button className="link-button" onClick={() => navigate(-1)}>
        ← Voltar
      </button>
      <div className="product-detail">
        <div className="product-detail-image">
          {product.photoUrl ? (
            <img src={product.photoUrl} alt={product.model} />
          ) : (
            <div className="product-card-placeholder">Sem foto</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>
            {product.brand} {product.model}
          </h1>
          <p className="product-price">R$ {product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <p className="product-stock">
            {product.quantity > 0
              ? `${product.quantity} unidades em estoque`
              : "Fora de estoque"}
          </p>

          {product.quantity > 0 && (
            <div className="add-to-cart">
              <input
                type="number"
                min={1}
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <button onClick={handleAddToCart}>Adicionar ao carrinho</button>
            </div>
          )}
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
