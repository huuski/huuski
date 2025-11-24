import type { Supply } from "../types/supply";

export type ApiSupply = {
  id: string;
  name: string;
  description?: string;
  stock: number;
  minStock?: number;
  createdAt: string;
  updatedAt: string;
};

// Usar a API route do Next.js como proxy para evitar problemas de CORS
const API_URL = "/api/supply";

export async function fetchSupplies(): Promise<Supply[]> {
  try {
    console.log("Fetching supplies from:", API_URL);
    
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
        `Erro ao buscar suprimentos: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    const apiSupplies: ApiSupply[] = responseData;
    console.log("Supplies fetched:", apiSupplies.length);

    // Validar se a resposta é um array
    if (!Array.isArray(apiSupplies)) {
      throw new Error("Resposta da API não é um array");
    }

    // Mapear os dados da API para o tipo Supply
    return apiSupplies.map((apiSupply) => {
      try {
        return {
          id: apiSupply.id,
          name: apiSupply.name,
          description: apiSupply.description || "",
          stock: apiSupply.stock || 0,
          minStock: apiSupply.minStock,
          createdAt: new Date(apiSupply.createdAt),
          updatedAt: new Date(apiSupply.updatedAt),
        };
      } catch (mapError) {
        console.error("Error mapping supply:", apiSupply, mapError);
        throw new Error(`Erro ao processar suprimento ${apiSupply.id}: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
      }
    });
  } catch (error) {
    console.error("Error fetching supplies:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao buscar suprimentos");
  }
}

