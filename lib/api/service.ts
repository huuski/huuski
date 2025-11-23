import type { Service } from "../types/service";
import { ServiceStatus } from "../types/service";

export type ApiService = {
  id: string;
  name: string;
  description: string;
  category: number;
  amount: number;
  image: string;
  duration: string; // Formato "00:30:00" (HH:MM:SS)
  executionFlowId?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Função para converter duração de "HH:MM:SS" para minutos
function parseDurationToMinutes(duration: string): number {
  try {
    const parts = duration.split(":");
    if (parts.length !== 3) {
      console.warn(`Formato de duração inválido: ${duration}, usando 0 minutos`);
      return 0;
    }
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseInt(parts[2], 10) || 0;
    return hours * 60 + minutes + Math.round(seconds / 60);
  } catch (error) {
    console.warn(`Erro ao converter duração ${duration}:`, error);
    return 0;
  }
}

// Usar a API route do Next.js como proxy para evitar problemas de CORS
const API_URL = "/api/services";

export async function fetchServices(): Promise<Service[]> {
  try {
    console.log("Fetching services from:", API_URL);
    
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("Response status:", response.status, response.statusText);

    const responseData = await response.json();

    // Verificar se a resposta contém um erro (da API route)
    if (!response.ok || (responseData.error)) {
      const errorMessage = responseData.error || responseData.message || response.statusText;
      throw new Error(
        `Erro ao buscar serviços: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    const apiServices: ApiService[] = responseData;
    console.log("Services fetched:", apiServices.length);

    // Validar se a resposta é um array
    if (!Array.isArray(apiServices)) {
      throw new Error("Resposta da API não é um array");
    }

    // Mapear os dados da API para o tipo Service
    return apiServices.map((apiService) => {
      try {
        return {
          id: apiService.id,
          name: apiService.name,
          description: apiService.description || "",
          price: apiService.amount,
          category: apiService.category?.toString() || "",
          duration: parseDurationToMinutes(apiService.duration),
          status: ServiceStatus.ACTIVE, // Definir como ativo por padrão
          executionFlowId: apiService.executionFlowId || undefined,
          createdAt: new Date(apiService.createdAt),
          updatedAt: new Date(apiService.updatedAt),
        };
      } catch (mapError) {
        console.error("Error mapping service:", apiService, mapError);
        throw new Error(`Erro ao processar serviço ${apiService.id}: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
      }
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao buscar serviços");
  }
}

// Função para converter minutos para formato "HH:MM:SS"
function formatDurationFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export type UpdateServicePayload = {
  name: string;
  description?: string;
  category: number;
  amount: number;
  image?: string;
  duration: string; // Formato "HH:MM:SS"
  executionFlowId?: string | null;
};

export async function updateService(
  id: string,
  payload: UpdateServicePayload
): Promise<Service> {
  try {
    console.log("Updating service:", id, payload);
    
    const response = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    console.log("Response status:", response.status, response.statusText);

    // Tentar ler a resposta como texto primeiro para ver o erro completo
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // Se não for JSON, usar o texto como mensagem de erro
      responseData = { error: responseText, message: responseText };
    }

    // Verificar se a resposta contém um erro (da API route)
    if (!response.ok || (responseData.error)) {
      const errorMessage = responseData.error || responseData.message || responseData.details || response.statusText;
      console.error("API Error Response:", responseData);
      throw new Error(
        `Erro ao atualizar serviço: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    // A resposta deve conter o serviço atualizado
    const apiService: ApiService = responseData;
    console.log("Service updated:", apiService.id);

    // Mapear os dados da API para o tipo Service
    return {
      id: apiService.id,
      name: apiService.name,
      description: apiService.description || "",
      price: apiService.amount,
      category: apiService.category?.toString() || "",
      duration: parseDurationToMinutes(apiService.duration),
      status: ServiceStatus.ACTIVE,
      executionFlowId: apiService.executionFlowId || undefined,
      createdAt: new Date(apiService.createdAt),
      updatedAt: new Date(apiService.updatedAt),
    };
  } catch (error) {
    console.error("Error updating service:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao atualizar serviço");
  }
}

export type CreateServicePayload = {
  name: string;
  description?: string;
  category: number;
  amount: number;
  image?: string;
  duration: string; // Formato "HH:MM:SS"
  executionFlowId?: string | null;
};

export async function createService(
  payload: CreateServicePayload
): Promise<Service> {
  try {
    console.log("Creating service:", payload);
    
    const response = await fetch(`/api/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    console.log("Response status:", response.status, response.statusText);

    // Tentar ler a resposta como texto primeiro para ver o erro completo
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // Se não for JSON, usar o texto como mensagem de erro
      responseData = { error: responseText, message: responseText };
    }

    // Verificar se a resposta contém um erro (da API route)
    if (!response.ok || (responseData.error)) {
      const errorMessage = responseData.error || responseData.message || responseData.details || response.statusText;
      console.error("API Error Response:", responseData);
      throw new Error(
        `Erro ao criar serviço: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    // A resposta deve conter o serviço criado
    const apiService: ApiService = responseData;
    console.log("Service created:", apiService.id);

    // Mapear os dados da API para o tipo Service
    return {
      id: apiService.id,
      name: apiService.name,
      description: apiService.description || "",
      price: apiService.amount,
      category: apiService.category?.toString() || "",
      duration: parseDurationToMinutes(apiService.duration),
      status: ServiceStatus.ACTIVE,
      executionFlowId: apiService.executionFlowId || undefined,
      createdAt: new Date(apiService.createdAt),
      updatedAt: new Date(apiService.updatedAt),
    };
  } catch (error) {
    console.error("Error creating service:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao criar serviço");
  }
}

