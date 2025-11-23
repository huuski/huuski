import type { Product } from "./types/product";
import { ProductStatus } from "./types/product";

// Dados de exemplo - em produção, isso viria de uma API
const productsData: Product[] = [
  {
    id: "prod-1",
    name: "Produto A",
    sku: "PRD-A-001",
    description: "Descrição do produto A",
    price: 99.90,
    cost: 50.00,
    stock: 50,
    minStock: 10,
    category: "Categoria 1",
    status: ProductStatus.ACTIVE,
    createdAt: new Date("2024-01-10T08:00:00Z"),
    updatedAt: new Date("2024-02-15T14:30:00Z"),
  },
  {
    id: "prod-2",
    name: "Produto B",
    sku: "PRD-B-002",
    description: "Descrição do produto B",
    price: 149.90,
    cost: 75.00,
    stock: 30,
    minStock: 5,
    category: "Categoria 2",
    status: ProductStatus.ACTIVE,
    createdAt: new Date("2024-01-12T10:15:00Z"),
    updatedAt: new Date("2024-02-10T09:20:00Z"),
  },
  {
    id: "prod-3",
    name: "Produto C",
    sku: "PRD-C-003",
    description: "Descrição do produto C",
    price: 199.90,
    cost: 100.00,
    stock: 0,
    minStock: 5,
    category: "Categoria 1",
    status: ProductStatus.OUT_OF_STOCK,
    createdAt: new Date("2024-01-15T12:00:00Z"),
    updatedAt: new Date("2024-02-20T11:00:00Z"),
  },
  {
    id: "prod-4",
    name: "Produto D",
    sku: "PRD-D-004",
    description: "Descrição do produto D",
    price: 79.90,
    cost: 40.00,
    stock: 100,
    minStock: 20,
    category: "Categoria 3",
    status: ProductStatus.ACTIVE,
    createdAt: new Date("2024-01-20T14:30:00Z"),
    updatedAt: new Date("2024-02-18T16:45:00Z"),
  },
  {
    id: "prod-5",
    name: "Produto E",
    sku: "PRD-E-005",
    description: "Descrição do produto E",
    price: 249.90,
    cost: 125.00,
    stock: 15,
    minStock: 10,
    category: "Categoria 2",
    status: ProductStatus.ACTIVE,
    createdAt: new Date("2024-02-01T09:00:00Z"),
    updatedAt: new Date("2024-02-15T10:30:00Z"),
  },
  {
    id: "prod-6",
    name: "Produto F",
    sku: "PRD-F-006",
    description: "Produto descontinuado",
    price: 59.90,
    cost: 30.00,
    stock: 0,
    minStock: 0,
    category: "Categoria 1",
    status: ProductStatus.DISCONTINUED,
    createdAt: new Date("2023-12-01T08:00:00Z"),
    updatedAt: new Date("2024-01-10T12:00:00Z"),
  },
];

export function getProducts(): Product[] {
  return productsData.filter((product) => !product.deletedAt);
}

export function getProductById(id: string): Product | undefined {
  return productsData.find((product) => product.id === id && !product.deletedAt);
}

