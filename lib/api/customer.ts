import type { Customer } from "../types/customer";
import { CustomerStatus } from "../types/customer";

export type ApiCustomer = {
  id: string;
  name: string;
  document: string;
  birthDate: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  complement: string | null;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

// Função para extrair número da rua (se houver)
function extractStreetNumber(street: string): { street: string; number: string } {
  // Tenta encontrar padrões como "Rua X, 123" ou "Avenida Y 456"
  const match = street.match(/(.+?)(?:,\s*|\s+)(\d+)$/);
  if (match) {
    return {
      street: match[1].trim(),
      number: match[2].trim(),
    };
  }
  // Se não encontrar, retorna a rua completa e número vazio
  return {
    street: street.trim(),
    number: "",
  };
}

// Usar a API route do Next.js como proxy para evitar problemas de CORS
const API_URL = "/api/customers";

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    console.log("Fetching customers from:", API_URL);
    
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
        `Erro ao buscar clientes: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    const apiCustomers: ApiCustomer[] = responseData;
    console.log("Customers fetched:", apiCustomers.length);

    // Validar se a resposta é um array
    if (!Array.isArray(apiCustomers)) {
      throw new Error("Resposta da API não é um array");
    }

    // Mapear os dados da API para o tipo Customer
    return apiCustomers.map((apiCustomer) => {
      try {
        const { street: streetName, number } = extractStreetNumber(apiCustomer.street);
        
        return {
          id: apiCustomer.id,
          name: apiCustomer.name,
          email: apiCustomer.email,
          phone: apiCustomer.phoneNumber,
          document: apiCustomer.document,
          status: CustomerStatus.ACTIVE, // Definir como ativo por padrão
          createdAt: new Date(apiCustomer.createdAt),
          updatedAt: new Date(apiCustomer.updatedAt),
          address: {
            street: streetName,
            number: number || "",
            complement: apiCustomer.complement || undefined,
            neighborhood: "", // A API não retorna neighborhood
            city: apiCustomer.city,
            state: apiCustomer.state,
            zipCode: apiCustomer.zipCode,
            country: apiCustomer.country || "Brasil",
          },
        };
      } catch (mapError) {
        console.error("Error mapping customer:", apiCustomer, mapError);
        throw new Error(`Erro ao processar cliente ${apiCustomer.id}: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
      }
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao buscar clientes");
  }
}

