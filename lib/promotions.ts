import type { Promotion } from "./types/promotion";
import { DiscountType } from "./types/promotion";

const promotionsData: Promotion[] = [
  {
    id: "promo-1",
    name: "Black Friday 2024",
    code: "BLACKFRIDAY24",
    description: "Desconto especial de Black Friday",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 30,
    minPurchaseValue: 100.00,
    maxDiscountValue: 500.00,
    startDate: new Date("2024-11-25T00:00:00Z"),
    endDate: new Date("2024-11-30T23:59:59Z"),
    isActive: false,
    usageLimit: 1000,
    usageCount: 0,
    createdAt: new Date("2024-01-10T08:00:00Z"),
    updatedAt: new Date("2024-02-15T14:30:00Z"),
  },
  {
    id: "promo-2",
    name: "Desconto de Primeira Compra",
    code: "PRIMEIRA",
    description: "Desconto para novos clientes",
    discountType: DiscountType.PERCENTAGE,
    discountValue: 15,
    minPurchaseValue: 50.00,
    startDate: new Date("2024-01-01T00:00:00Z"),
    endDate: new Date("2024-12-31T23:59:59Z"),
    isActive: true,
    usageLimit: undefined,
    usageCount: 45,
    createdAt: new Date("2024-01-12T10:15:00Z"),
    updatedAt: new Date("2024-02-10T09:20:00Z"),
  },
  {
    id: "promo-3",
    name: "Frete Grátis",
    code: "FRETEGRATIS",
    description: "Frete grátis para compras acima de R$ 200",
    discountType: DiscountType.FIXED,
    discountValue: 0,
    minPurchaseValue: 200.00,
    startDate: new Date("2024-02-01T00:00:00Z"),
    endDate: new Date("2024-03-31T23:59:59Z"),
    isActive: true,
    usageLimit: 500,
    usageCount: 123,
    createdAt: new Date("2024-02-01T09:00:00Z"),
    updatedAt: new Date("2024-02-15T10:30:00Z"),
  },
  {
    id: "promo-4",
    name: "Desconto Fixo R$ 50",
    code: "DESC50",
    description: "Desconto fixo de R$ 50 em compras acima de R$ 300",
    discountType: DiscountType.FIXED,
    discountValue: 50.00,
    minPurchaseValue: 300.00,
    startDate: new Date("2024-02-15T00:00:00Z"),
    endDate: new Date("2024-04-15T23:59:59Z"),
    isActive: true,
    usageLimit: 200,
    usageCount: 67,
    createdAt: new Date("2024-02-15T12:00:00Z"),
    updatedAt: new Date("2024-02-20T11:00:00Z"),
  },
];

export function getPromotions(): Promotion[] {
  return promotionsData.filter((promo) => !promo.deletedAt);
}

export function getPromotionById(id: string): Promotion | undefined {
  return promotionsData.find((promo) => promo.id === id && !promo.deletedAt);
}

