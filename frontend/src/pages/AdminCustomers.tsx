import { useEffect, useState } from "react";
import api from "../api/client";
import { Customer } from "../types";

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const res = await api.get("/customers");
    setCustomers(res.data);
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit() {
    setMessage("");
    if (!form.name || !form.email) {
      setMessage("Nome e e-mail são obrigatórios.");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, form);
        setMessage("Cliente atualizado com sucesso!");
      } else {
        await api.post("/customers", form);
        setMessage("Cliente cadastrado com sucesso!");
      }
      resetForm();
      loadCustomers();
    } catch (err) {
      setMessage("Erro ao salvar cliente.");
    }
  }

  function handleEdit(c: Customer) {
    setEditingId(c.rowKey);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.phone || "",
      address: c.address || "",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente excluir este cliente?")) return;
    await api.delete(`/customers/${id}`);
    loadCustomers();
  }

  return (
    <div>
      <h2>Gerenciar Clientes</h2>

      <div className="form-card">
        <h3>{editingId ? "Editar Cliente" : "Novo Cliente"}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Nome</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Telefone</label>
            <input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>
        {message && <p className="message">{message}</p>}
        <div className="form-actions">
          <button onClick={handleSubmit}>
            {editingId ? "Salvar alterações" : "Cadastrar cliente"}
          </button>
          {editingId && (
            <button className="secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.rowKey}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>
                <button className="link-button" onClick={() => handleEdit(c)}>
                  Editar
                </button>
                <button
                  className="link-button"
                  onClick={() => handleDelete(c.rowKey)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
