export type Service = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  price: number;
  cost?: number;
  duration?: number; // em minutos
  category?: string;
  status: ServiceStatus;
  executionFlowId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export enum ServiceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISCONTINUED = "discontinued",
}

