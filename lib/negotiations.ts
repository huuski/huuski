import type { Negotiation } from "./types/negotiation";
import { NegotiationStatus } from "./types/negotiation";

const negotiationsData: Negotiation[] = [
  {
    id: "neg-1",
    customerId: "1",
    customerName: "João Silva",
    title: "Negociação de Contrato Anual",
    description: "Negociação para contrato de serviços anuais",
    value: 50000.00,
    status: NegotiationStatus.IN_PROGRESS,
    startDate: new Date("2024-02-01T08:00:00Z"),
    endDate: new Date("2024-02-28T18:00:00Z"),
    createdAt: new Date("2024-02-01T08:00:00Z"),
    updatedAt: new Date("2024-02-15T14:30:00Z"),
  },
  {
    id: "neg-2",
    customerId: "2",
    customerName: "Maria Santos",
    title: "Proposta de Parceria",
    description: "Proposta de parceria estratégica",
    value: 75000.00,
    status: NegotiationStatus.OPEN,
    startDate: new Date("2024-02-10T10:00:00Z"),
    createdAt: new Date("2024-02-10T10:00:00Z"),
    updatedAt: new Date("2024-02-12T09:20:00Z"),
  },
  {
    id: "neg-3",
    customerId: "3",
    customerName: "Pedro Oliveira",
    title: "Renegociação de Dívida",
    description: "Renegociação de valores em aberto",
    value: 15000.00,
    status: NegotiationStatus.CLOSED,
    startDate: new Date("2024-01-15T12:00:00Z"),
    endDate: new Date("2024-01-30T18:00:00Z"),
    createdAt: new Date("2024-01-15T12:00:00Z"),
    updatedAt: new Date("2024-01-30T18:00:00Z"),
  },
  {
    id: "neg-4",
    customerId: "1",
    customerName: "João Silva",
    title: "Aumento de Limite",
    description: "Solicitação de aumento de limite de crédito",
    value: 30000.00,
    status: NegotiationStatus.CANCELLED,
    startDate: new Date("2024-01-20T14:30:00Z"),
    createdAt: new Date("2024-01-20T14:30:00Z"),
    updatedAt: new Date("2024-02-05T16:45:00Z"),
  },
];

export function getNegotiations(): Negotiation[] {
  return negotiationsData.filter((neg) => !neg.deletedAt);
}

export function getNegotiationById(id: string): Negotiation | undefined {
  return negotiationsData.find((neg) => neg.id === id && !neg.deletedAt);
}

export function getCustomers() {
  // Importação dinâmica para evitar dependência circular
  return [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Maria Santos" },
    { id: "3", name: "Pedro Oliveira" },
  ];
}

