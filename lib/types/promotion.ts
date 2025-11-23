export type Promotion = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseValue?: number;
  maxDiscountValue?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

