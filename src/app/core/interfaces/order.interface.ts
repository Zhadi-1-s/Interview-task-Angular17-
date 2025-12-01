export interface Order {
  id: number;
  number: string;
  customerName: string;
  status: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  qty: number;
  price: number;
}