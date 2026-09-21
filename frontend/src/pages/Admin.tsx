import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminProducts from "./AdminProducts";
import AdminCustomers from "./AdminCustomers";

export default function Admin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"produtos" | "clientes">("produtos");

  if (!isAdmin) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container">
      <h1>Painel do Administrador</h1>
      <div className="tabs">
        <button
          className={tab === "produtos" ? "tab active" : "tab"}
          onClick={() => setTab("produtos")}
        >
          Produtos
        </button>
        <button
          className={tab === "clientes" ? "tab active" : "tab"}
          onClick={() => setTab("clientes")}
        >
          Clientes
        </button>
      </div>

      {tab === "produtos" ? <AdminProducts /> : <AdminCustomers />}
    </div>
  );
}
