import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../api/client";
import { Customer } from "../types";

interface AuthContextType {
  customer: Customer | null;
  isAdmin: boolean;
  loginCustomer: (customer: Customer) => void;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Senha simples de administrador (projeto acadêmico, sem autenticação sofisticada)
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    if (customerId) {
      api
        .get(`/customers/${customerId}`)
        .then((res) => setCustomer(res.data))
        .catch(() => localStorage.removeItem("customerId"));
    }
    if (localStorage.getItem("isAdmin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  function loginCustomer(c: Customer) {
    setCustomer(c);
    localStorage.setItem("customerId", c.rowKey);
  }

  function loginAdmin(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    return false;
  }

  function logout() {
    setCustomer(null);
    setIsAdmin(false);
    localStorage.removeItem("customerId");
    localStorage.removeItem("isAdmin");
  }

  return (
    <AuthContext.Provider
      value={{ customer, isAdmin, loginCustomer, loginAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
