export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string; // CPF/CNPJ
  status: CustomerStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  address?: CustomerAddress;
  notes?: string;
};

export enum CustomerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  BLOCKED = "blocked",
}

export type CustomerAddress = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
};

