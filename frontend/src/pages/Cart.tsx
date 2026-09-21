import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!customer) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <h1>Carrinho</h1>
        <p>
          Seu carrinho está vazio. <Link to="/">Ver produtos</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Carrinho</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.product.rowKey}>
              <td>
                {item.product.brand} {item.product.model}
              </td>
              <td>R$ {item.product.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  max={item.product.quantity}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.product.rowKey, Number(e.target.value))
                  }
                />
              </td>
              <td>R$ {(item.product.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  className="link-button"
                  onClick={() => removeItem(item.product.rowKey)}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total: R$ {total.toFixed(2)}</h2>
      <button onClick={handleCheckout}>Finalizar Compra</button>
    </div>
  );
}
