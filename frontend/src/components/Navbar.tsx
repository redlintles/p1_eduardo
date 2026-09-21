import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { customer, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🛍️ Loja Virtual
      </Link>
      <div className="navbar-links">
        <Link to="/">Produtos</Link>
        {isAdmin && <Link to="/admin">Painel Admin</Link>}
        {customer && !isAdmin && <Link to="/conta">Minha Conta</Link>}
        <Link to="/carrinho">Carrinho ({itemCount})</Link>
        {customer || isAdmin ? (
          <button className="link-button" onClick={handleLogout}>
            Sair
          </button>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </div>
    </nav>
  );
}
