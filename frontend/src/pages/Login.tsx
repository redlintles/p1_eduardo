import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Customer } from "../types";

export default function Login() {
  const { loginCustomer, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"cliente" | "admin">("cliente");

  // Cliente
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // Admin
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  async function handleCustomerLogin() {
    setError("");
    try {
      const res = await api.get("/customers");
      const found: Customer | undefined = res.data.find(
        (c: Customer) => c.email.toLowerCase() === email.toLowerCase()
      );
      if (!found) {
        setError("Cliente não encontrado. Cadastre-se abaixo.");
        return;
      }
      loginCustomer(found);
      navigate("/");
    } catch (err) {
      setError("Erro ao efetuar login.");
    }
  }

  async function handleCustomerRegister() {
    setError("");
    if (!name || !email) {
      setError("Nome e e-mail são obrigatórios.");
      return;
    }
    try {
      const res = await api.post("/customers", { name, email, phone, address });
      loginCustomer(res.data);
      navigate("/");
    } catch (err) {
      setError("Erro ao cadastrar cliente.");
    }
  }

  function handleAdminLogin() {
    setAdminError("");
    if (loginAdmin(adminPassword)) {
      navigate("/admin");
    } else {
      setAdminError("Senha incorreta.");
    }
  }

  return (
    <div className="container login-container">
      <div className="tabs">
        <button
          className={tab === "cliente" ? "tab active" : "tab"}
          onClick={() => setTab("cliente")}
        >
          Sou Cliente
        </button>
        <button
          className={tab === "admin" ? "tab active" : "tab"}
          onClick={() => setTab("admin")}
        >
          Administrador
        </button>
      </div>

      {tab === "cliente" ? (
        <div className="form-card">
          <div className="tabs">
            <button
              className={mode === "login" ? "tab active" : "tab"}
              onClick={() => setMode("login")}
            >
              Entrar
            </button>
            <button
              className={mode === "cadastro" ? "tab active" : "tab"}
              onClick={() => setMode("cadastro")}
            >
              Cadastrar
            </button>
          </div>

          {mode === "login" ? (
            <>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button onClick={handleCustomerLogin}>Entrar</button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Nome</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Endereço</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {error && <p className="error">{error}</p>}
              <button onClick={handleCustomerRegister}>Cadastrar</button>
            </>
          )}
        </div>
      ) : (
        <div className="form-card">
          <div className="form-group">
            <label>Senha de administrador</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>
          {adminError && <p className="error">{adminError}</p>}
          <button onClick={handleAdminLogin}>Entrar como Admin</button>
        </div>
      )}
    </div>
  );
}
