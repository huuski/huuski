export type PaymentMethod = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  type: PaymentMethodType;
  isActive: boolean;
  requiresApproval: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export enum PaymentMethodType {
  CASH = "cash",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  BANK_TRANSFER = "bank_transfer",
  PIX = "pix",
  CHECK = "check",
  OTHER = "other",
}

