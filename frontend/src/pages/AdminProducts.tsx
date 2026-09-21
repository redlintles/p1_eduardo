import { useEffect, useState } from "react";
import api from "../api/client";
import { Product } from "../types";

const emptyForm = {
  brand: "",
  model: "",
  price: "",
  quantity: "",
  description: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await api.get("/products");
    setProducts(res.data);
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setPhoto(null);
    setEditingId(null);
  }

  async function handleSubmit() {
    setMessage("");
    if (!form.brand || !form.model || !form.price || !form.quantity) {
      setMessage("Preencha marca, modelo, preço e quantidade.");
      return;
    }

    const data = new FormData();
    data.append("brand", form.brand);
    data.append("model", form.model);
    data.append("price", form.price);
    data.append("quantity", form.quantity);
    data.append("description", form.description);
    if (photo) data.append("photo", photo);

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, data);
        setMessage("Produto atualizado com sucesso!");
      } else {
        await api.post("/products", data);
        setMessage("Produto cadastrado com sucesso!");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setMessage("Erro ao salvar produto.");
    }
  }

  function handleEdit(p: Product) {
    setEditingId(p.rowKey);
    setForm({
      brand: p.brand,
      model: p.model,
      price: String(p.price),
      quantity: String(p.quantity),
      description: p.description || "",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente excluir este produto?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  }

  return (
    <div>
      <h2>Gerenciar Produtos</h2>

      <div className="form-card">
        <h3>{editingId ? "Editar Produto" : "Novo Produto"}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Marca</label>
            <input
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Preço</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Quantidade</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Foto do produto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          />
        </div>
        {message && <p className="message">{message}</p>}
        <div className="form-actions">
          <button onClick={handleSubmit}>
            {editingId ? "Salvar alterações" : "Cadastrar produto"}
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
            <th>Foto</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.rowKey}>
              <td>
                {p.photoUrl && (
                  <img src={p.photoUrl} alt={p.model} className="thumb" />
                )}
              </td>
              <td>{p.brand}</td>
              <td>{p.model}</td>
              <td>R$ {p.price.toFixed(2)}</td>
              <td>{p.quantity}</td>
              <td>
                <button className="link-button" onClick={() => handleEdit(p)}>
                  Editar
                </button>
                <button
                  className="link-button"
                  onClick={() => handleDelete(p.rowKey)}
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
