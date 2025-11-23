import type { Product } from "../types/product";
import { ProductStatus } from "../types/product";

export type ApiProduct = {
  id: string;
  name: string;
  description: string;
  category: number;
  amount: number;
  image: string;
  createdAt: string;
  updatedAt: string;
};

// Usar a API route do Next.js como proxy para evitar problemas de CORS
const API_URL = "/api/products";

export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log("Fetching products from:", API_URL);
    
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
        `Erro ao buscar produtos: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    const apiProducts: ApiProduct[] = responseData;
    console.log("Products fetched:", apiProducts.length);

    // Validar se a resposta é um array
    if (!Array.isArray(apiProducts)) {
      throw new Error("Resposta da API não é um array");
    }

    // Mapear os dados da API para o tipo Product
    return apiProducts.map((apiProduct) => {
      try {
        return {
          id: apiProduct.id,
          name: apiProduct.name,
          description: apiProduct.description || "",
          price: apiProduct.amount,
          category: apiProduct.category?.toString() || "",
          stock: 0, // A API não retorna estoque, definir como 0
          status: ProductStatus.ACTIVE, // Definir como ativo por padrão
          createdAt: new Date(apiProduct.createdAt),
          updatedAt: new Date(apiProduct.updatedAt),
        };
      } catch (mapError) {
        console.error("Error mapping product:", apiProduct, mapError);
        throw new Error(`Erro ao processar produto ${apiProduct.id}: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao buscar produtos");
  }
}

export type CreateProductPayload = {
  name: string;
  description?: string;
  category: number;
  amount: number;
  image?: string;
};

export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  try {
    console.log("Creating product:", payload);
    
    const response = await fetch(`/api/products`, {
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
        `Erro ao criar produto: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    // A resposta deve conter o produto criado
    const apiProduct: ApiProduct = responseData;
    console.log("Product created:", apiProduct.id);

    // Mapear os dados da API para o tipo Product
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      description: apiProduct.description || "",
      price: apiProduct.amount,
      category: apiProduct.category?.toString() || "",
      stock: 0, // A API não retorna estoque, definir como 0
      status: ProductStatus.ACTIVE,
      createdAt: new Date(apiProduct.createdAt),
      updatedAt: new Date(apiProduct.updatedAt),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao criar produto");
  }
}

