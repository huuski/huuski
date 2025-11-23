import type { Service } from "./types/service";
import { ServiceStatus } from "./types/service";

// Dados de exemplo - em produção, isso viria de uma API
const servicesData: Service[] = [
  {
    id: "serv-1",
    name: "Consulta Técnica",
    code: "SVC-001",
    description: "Consulta técnica especializada para diagnóstico de problemas",
    price: 150.00,
    cost: 75.00,
    duration: 60,
    category: "Consultoria",
    status: ServiceStatus.ACTIVE,
    createdAt: new Date("2024-01-10T08:00:00Z"),
    updatedAt: new Date("2024-02-15T14:30:00Z"),
  },
  {
    id: "serv-2",
    name: "Instalação de Sistema",
    code: "SVC-002",
    description: "Instalação completa de sistema com configuração inicial",
    price: 500.00,
    cost: 200.00,
    duration: 120,
    category: "Instalação",
    status: ServiceStatus.ACTIVE,
    createdAt: new Date("2024-01-12T10:15:00Z"),
    updatedAt: new Date("2024-02-10T09:20:00Z"),
  },
  {
    id: "serv-3",
    name: "Manutenção Preventiva",
    code: "SVC-003",
    description: "Serviço de manutenção preventiva mensal",
    price: 300.00,
    cost: 150.00,
    duration: 90,
    category: "Manutenção",
    status: ServiceStatus.ACTIVE,
    createdAt: new Date("2024-01-15T12:00:00Z"),
    updatedAt: new Date("2024-02-20T11:00:00Z"),
  },
  {
    id: "serv-4",
    name: "Treinamento de Usuários",
    code: "SVC-004",
    description: "Treinamento completo para equipe de usuários",
    price: 800.00,
    cost: 400.00,
    duration: 240,
    category: "Treinamento",
    status: ServiceStatus.ACTIVE,
    createdAt: new Date("2024-01-20T14:30:00Z"),
    updatedAt: new Date("2024-02-18T16:45:00Z"),
  },
  {
    id: "serv-5",
    name: "Suporte Técnico Remoto",
    code: "SVC-005",
    description: "Suporte técnico via acesso remoto",
    price: 100.00,
    cost: 50.00,
    duration: 30,
    category: "Suporte",
    status: ServiceStatus.ACTIVE,
    createdAt: new Date("2024-02-01T09:00:00Z"),
    updatedAt: new Date("2024-02-15T10:30:00Z"),
  },
  {
    id: "serv-6",
    name: "Serviço Descontinuado",
    code: "SVC-006",
    description: "Serviço que não é mais oferecido",
    price: 200.00,
    cost: 100.00,
    duration: 60,
    category: "Outros",
    status: ServiceStatus.DISCONTINUED,
    createdAt: new Date("2023-12-01T08:00:00Z"),
    updatedAt: new Date("2024-01-10T12:00:00Z"),
  },
];

export function getServices(): Service[] {
  return servicesData.filter((service) => !service.deletedAt);
}

export function getServiceById(id: string): Service | undefined {
  return servicesData.find((service) => service.id === id && !service.deletedAt);
}

