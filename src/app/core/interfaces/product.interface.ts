export interface Product {
  id: number;
  sku: string;
  title: string;
  price: number;
  stock: number;
  updatedAt: string; // или Date, если будешь парсить
}
