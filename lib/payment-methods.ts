import type { PaymentMethod } from "./types/payment-method";
import { PaymentMethodType } from "./types/payment-method";

const paymentMethodsData: PaymentMethod[] = [
  {
    id: "pm-1",
    name: "Dinheiro",
    code: "CASH",
    description: "Pagamento em dinheiro",
    type: PaymentMethodType.CASH,
    isActive: true,
    requiresApproval: false,
    createdAt: new Date("2024-01-10T08:00:00Z"),
    updatedAt: new Date("2024-02-15T14:30:00Z"),
  },
  {
    id: "pm-2",
    name: "Cartão de Crédito",
    code: "CC",
    description: "Pagamento com cartão de crédito",
    type: PaymentMethodType.CREDIT_CARD,
    isActive: true,
    requiresApproval: false,
    createdAt: new Date("2024-01-12T10:15:00Z"),
    updatedAt: new Date("2024-02-10T09:20:00Z"),
  },
  {
    id: "pm-3",
    name: "Cartão de Débito",
    code: "CD",
    description: "Pagamento com cartão de débito",
    type: PaymentMethodType.DEBIT_CARD,
    isActive: true,
    requiresApproval: false,
    createdAt: new Date("2024-01-15T12:00:00Z"),
    updatedAt: new Date("2024-02-20T11:00:00Z"),
  },
  {
    id: "pm-4",
    name: "PIX",
    code: "PIX",
    description: "Pagamento via PIX",
    type: PaymentMethodType.PIX,
    isActive: true,
    requiresApproval: false,
    createdAt: new Date("2024-01-20T14:30:00Z"),
    updatedAt: new Date("2024-02-18T16:45:00Z"),
  },
  {
    id: "pm-5",
    name: "Transferência Bancária",
    code: "TB",
    description: "Transferência bancária",
    type: PaymentMethodType.BANK_TRANSFER,
    isActive: true,
    requiresApproval: true,
    createdAt: new Date("2024-02-01T09:00:00Z"),
    updatedAt: new Date("2024-02-15T10:30:00Z"),
  },
];

export function getPaymentMethods(): PaymentMethod[] {
  return paymentMethodsData.filter((pm) => !pm.deletedAt);
}

export function getPaymentMethodById(id: string): PaymentMethod | undefined {
  return paymentMethodsData.find((pm) => pm.id === id && !pm.deletedAt);
}

