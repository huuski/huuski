export type Supply = {
  id: string;
  name: string;
  description?: string;
  stock: number;
  minStock?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

