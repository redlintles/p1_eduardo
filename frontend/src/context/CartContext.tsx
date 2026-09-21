import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem, Product } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (rowKey: string) => void;
  updateQuantity: (rowKey: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(product: Product, quantity: number) {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.rowKey === product.rowKey);
      if (existing) {
        return prev.map((i) =>
          i.product.rowKey === product.rowKey
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
  }

  function removeItem(rowKey: string) {
    setItems((prev) => prev.filter((i) => i.product.rowKey !== rowKey));
  }

  function updateQuantity(rowKey: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.product.rowKey === rowKey ? { ...i, quantity } : i
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
