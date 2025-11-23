export type Negotiation = {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description?: string;
  value: number;
  status: NegotiationStatus;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export enum NegotiationStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

