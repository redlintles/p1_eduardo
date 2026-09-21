import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types";

export default function CustomerArea() {
  const { customer, loginCustomer } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!customer) {
      navigate("/login");
      return;
    }
    api.get(`/customers/${customer.rowKey}/orders`).then((res) => setOrders(res.data));
  }, [customer, navigate]);

  if (!customer) return null;

  async function handleSaveProfile() {
    try {
      const res = await api.put(`/customers/${customer!.rowKey}`, {
        name,
        phone,
        address,
      });
      loginCustomer(res.data);
      setMessage("Dados atualizados com sucesso!");
    } catch (err) {
      setMessage("Erro ao atualizar dados.");
    }
  }

  return (
    <div className="container">
      <h1>Minha Conta</h1>

      <section className="section">
        <h2>Meus Dados</h2>
        <div className="form-group">
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <input value={customer.email} disabled />
        </div>
        <div className="form-group">
          <label>Telefone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Endereço</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        {message && <p className="message">{message}</p>}
        <button onClick={handleSaveProfile}>Salvar alterações</button>
      </section>

      <section className="section">
        <h2>Histórico de Pedidos</h2>
        {orders.length === 0 ? (
          <p>Você ainda não fez nenhum pedido.</p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Pagamento</th>
                <th>Entrega</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.rowKey}>
                  <td>{new Date(o.createdAt).toLocaleString("pt-BR")}</td>
                  <td>
                    {o.items
                      .map((i) => `${i.brand} ${i.model} x${i.quantity}`)
                      .join(", ")}
                  </td>
                  <td>R$ {o.total.toFixed(2)}</td>
                  <td>{o.paymentMethod}</td>
                  <td>{o.deliveryMethod}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
