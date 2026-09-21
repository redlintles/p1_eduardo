export interface ProductEntity {
  partitionKey: string;
  rowKey: string;
  brand: string;
  model: string;
  price: number;
  quantity: number;
  description?: string;
  photoUrl?: string;
}

export interface CustomerEntity {
  partitionKey: string;
  rowKey: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderEntity {
  partitionKey: string;
  rowKey: string;
  customerId: string;
  items: string; // JSON.stringify(OrderItemInput[] com dados do produto)
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: string;
  createdAt: string;
}
