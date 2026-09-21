import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cartao_credito");
  const [deliveryMethod, setDeliveryMethod] = useState("padrao");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!customer) {
    navigate("/login");
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <h1>Checkout</h1>
        <p>Seu carrinho está vazio.</p>
      </div>
    );
  }

  async function handleConfirm() {
    setError("");
    setLoading(true);
    try {
      const payload = {
        customerId: customer!.rowKey,
        items: items.map((i) => ({
          productId: i.product.rowKey,
          quantity: i.quantity,
        })),
        paymentMethod,
        deliveryMethod,
      };
      await api.post("/orders/checkout", payload);
      clearCart();
      navigate("/conta");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erro ao processar o pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Finalizar Compra</h1>

      <div className="checkout-summary">
        {items.map((item) => (
          <div key={item.product.rowKey} className="checkout-item">
            <span>
              {item.product.brand} {item.product.model} x{item.quantity}
            </span>
            <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <h2>Total: R$ {total.toFixed(2)}</h2>
      </div>

      <div className="form-group">
        <label>Método de pagamento</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cartao_credito">Cartão de crédito</option>
          <option value="cartao_debito">Cartão de débito</option>
          <option value="pix">Pix</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>

      <div className="form-group">
        <label>Método de entrega</label>
        <select
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
        >
          <option value="padrao">Entrega padrão (5-7 dias úteis)</option>
          <option value="expressa">Entrega expressa (1-2 dias úteis)</option>
          <option value="retirada">Retirada na loja</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <button disabled={loading} onClick={handleConfirm}>
        {loading ? "Processando..." : "Confirmar Pedido"}
      </button>
    </div>
  );
}
