export type Product = {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  cost?: number;
  stock: number;
  minStock?: number;
  category?: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued",
}

