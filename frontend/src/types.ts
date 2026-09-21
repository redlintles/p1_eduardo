export interface Product {
  partitionKey: string;
  rowKey: string;
  brand: string;
  model: string;
  price: number;
  quantity: number;
  description?: string;
  photoUrl?: string;
}

export interface Customer {
  partitionKey: string;
  rowKey: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface OrderItem {
  productId: string;
  brand: string;
  model: string;
  price: number;
  quantity: number;
}

export interface Order {
  partitionKey: string;
  rowKey: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
