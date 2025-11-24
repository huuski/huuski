import type { ExecutionFlow, ExecutionFlowStep, ExecutionFlowStepQuestion, ExecutionFlowStepQuestionOption } from "../types/execution-flow";
import { QuestionType } from "../types/execution-flow";

export type ApiExecutionFlow = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  steps?: ApiExecutionFlowStep[];
};

export type ApiExecutionFlowStep = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  stepNumber: number;
  questions?: ApiExecutionFlowStepQuestion[];
};

export type ApiExecutionFlowStepQuestion = {
  id: string;
  order: number;
  title: string;
  subtitle?: string;
  description?: string;
  type: number;
  options?: ApiExecutionFlowStepQuestionOption[];
  maxLength?: number;
  maxImages?: number;
  acceptedImageTypes?: string[];
  defaultStockItems?: Array<{ supplyId?: string; productId?: string; quantity: number }>;
};

export type ApiExecutionFlowStepQuestionOption = {
  id: string;
  title: string;
  value: string;
  enableExtraAnswer?: boolean;
  extraAnswerMaxLength?: number;
};

// Usar a API route do Next.js como proxy para evitar problemas de CORS
const API_URL = "/api/execution-flows";

export async function fetchExecutionFlows(): Promise<ExecutionFlow[]> {
  try {
    console.log("Fetching execution flows from:", API_URL);
    
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
        `Erro ao buscar fluxos de execução: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    const apiFlows: ApiExecutionFlow[] = responseData;
    console.log("Execution flows fetched:", apiFlows.length);

    // Validar se a resposta é um array
    if (!Array.isArray(apiFlows)) {
      throw new Error("Resposta da API não é um array");
    }

    // Mapear os dados da API para o tipo ExecutionFlow
    return apiFlows.map((apiFlow) => {
      try {
        return {
          id: apiFlow.id,
          title: apiFlow.title,
          createdAt: new Date(apiFlow.createdAt),
          updatedAt: new Date(apiFlow.updatedAt),
          steps: (apiFlow.steps || []).map((apiStep, stepIndex) => ({
            id: apiStep.id,
            title: apiStep.title || "",
            subtitle: apiStep.subtitle || "",
            description: apiStep.description || "",
            stepNumber: apiStep.stepNumber || stepIndex + 1,
            questions: (apiStep.questions || []).map((apiQuestion) => ({
              id: apiQuestion.id,
              order: apiQuestion.order || 0,
              title: apiQuestion.title || "",
            subtitle: apiQuestion.subtitle || "",
            description: apiQuestion.description || "",
            // A API retorna type como número diretamente (1 = TEXT, 2 = TEXTAREA, etc.)
            type: apiQuestion.type as QuestionType,
            options: (apiQuestion.options || []).map((apiOption) => ({
                id: apiOption.id,
                title: apiOption.title || "",
                value: apiOption.value || "",
                enableExtraAnswer: apiOption.enableExtraAnswer || false,
                extraAnswerMaxLength: apiOption.extraAnswerMaxLength,
              })),
              maxLength: apiQuestion.maxLength,
              maxImages: apiQuestion.maxImages,
              acceptedImageTypes: apiQuestion.acceptedImageTypes,
              defaultStockItems: apiQuestion.defaultStockItems
                ? apiQuestion.defaultStockItems
                    .map((item: any) => {
                      const supplyId = item.supplyId || item.productId;
                      if (!supplyId) {
                        console.warn("defaultStockItem sem supplyId ou productId:", item);
                        return null;
                      }
                      return {
                        supplyId,
                        quantity: item.quantity,
                      };
                    })
                    .filter((item): item is { supplyId: string; quantity: number } => item !== null)
                : undefined,
            })),
          })),
        };
      } catch (mapError) {
        console.error("Error mapping execution flow:", apiFlow, mapError);
        throw new Error(`Erro ao processar fluxo ${apiFlow.id}: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
      }
    });
  } catch (error) {
    console.error("Error fetching execution flows:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao buscar fluxos de execução");
  }
}

// Função simplificada para buscar apenas IDs e títulos (usada no select de serviços)
export async function fetchExecutionFlowsSimple(): Promise<ApiExecutionFlow[]> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const responseData = await response.json();

    if (!response.ok || (responseData.error)) {
      const errorMessage = responseData.error || responseData.message || response.statusText;
      throw new Error(
        `Erro ao buscar fluxos de execução: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    const apiFlows: ApiExecutionFlow[] = responseData;

    if (!Array.isArray(apiFlows)) {
      throw new Error("Resposta da API não é um array");
    }

    return apiFlows;
  } catch (error) {
    console.error("Error fetching execution flows:", error);
    
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao buscar fluxos de execução");
  }
}

export async function fetchExecutionFlowById(id: string): Promise<ExecutionFlow> {
  try {
    console.log("Fetching execution flow by id from:", `/api/execution-flows/${id}`);
    
    const response = await fetch(`/api/execution-flows/${id}`, {
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
        `Erro ao buscar fluxo de execução: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    const apiFlow: ApiExecutionFlow = responseData;
    console.log("Execution flow fetched:", apiFlow.id);

    // Mapear os dados da API para o tipo ExecutionFlow
    try {
      return {
        id: apiFlow.id,
        title: apiFlow.title,
        createdAt: new Date(apiFlow.createdAt),
        updatedAt: new Date(apiFlow.updatedAt),
        steps: (apiFlow.steps || []).map((apiStep, stepIndex) => ({
          id: apiStep.id,
          title: apiStep.title || "",
          subtitle: apiStep.subtitle || "",
          description: apiStep.description || "",
          stepNumber: apiStep.stepNumber || stepIndex + 1,
          questions: (apiStep.questions || []).map((apiQuestion) => ({
            id: apiQuestion.id,
            order: apiQuestion.order || 0,
            title: apiQuestion.title || "",
            subtitle: apiQuestion.subtitle || "",
            description: apiQuestion.description || "",
            // A API retorna type como número diretamente (1 = TEXT, 2 = TEXTAREA, etc.)
            type: apiQuestion.type as QuestionType,
            options: (apiQuestion.options || []).map((apiOption) => ({
              id: apiOption.id,
              title: apiOption.title || "",
              value: apiOption.value || "",
              enableExtraAnswer: apiOption.enableExtraAnswer || false,
              extraAnswerMaxLength: apiOption.extraAnswerMaxLength,
            })),
            maxLength: apiQuestion.maxLength,
            maxImages: apiQuestion.maxImages,
            acceptedImageTypes: apiQuestion.acceptedImageTypes,
            defaultStockItems: apiQuestion.defaultStockItems
              ? apiQuestion.defaultStockItems
                  .map((item: any) => {
                    const supplyId = item.supplyId || item.productId;
                    if (!supplyId) {
                      console.warn("defaultStockItem sem supplyId ou productId:", item);
                      return null;
                    }
                    return {
                      supplyId,
                      quantity: item.quantity,
                    };
                  })
                  .filter((item): item is { supplyId: string; quantity: number } => item !== null)
              : undefined,
          })),
        })),
      };
    } catch (mapError) {
      console.error("Error mapping execution flow:", apiFlow, mapError);
      throw new Error(`Erro ao processar fluxo ${apiFlow.id}: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
    }
  } catch (error) {
    console.error("Error fetching execution flow by id:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao buscar fluxo de execução");
  }
}

export type UpdateExecutionFlowPayload = {
  title: string;
  description?: string;
  flow: string; // JSON string dos steps
};

export type CreateExecutionFlowPayload = {
  title: string;
  description?: string;
  flow: string; // JSON string dos steps
};

export async function updateExecutionFlow(
  id: string,
  payload: UpdateExecutionFlowPayload
): Promise<ExecutionFlow> {
  try {
    console.log("Updating execution flow:", id, payload);
    console.log("Payload flow (string):", payload.flow);
    
    const response = await fetch(`/api/execution-flows/${id}`, {
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
        `Erro ao atualizar fluxo de execução: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    // Após atualizar, buscar o fluxo atualizado
    return await fetchExecutionFlowById(id);
  } catch (error) {
    console.error("Error updating execution flow:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao atualizar fluxo de execução");
  }
}

export async function createExecutionFlow(
  payload: CreateExecutionFlowPayload
): Promise<ExecutionFlow> {
  try {
    console.log("Creating execution flow:", payload);
    console.log("Payload flow (string):", payload.flow);
    
    const response = await fetch(`/api/execution-flows`, {
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
        `Erro ao criar fluxo de execução: ${response.status} ${response.statusText}. ${errorMessage}`
      );
    }

    // A resposta deve conter o fluxo criado com o ID
    const apiFlow: ApiExecutionFlow = responseData;
    console.log("Execution flow created:", apiFlow.id);

    // Mapear os dados da API para o tipo ExecutionFlow
    try {
      return {
        id: apiFlow.id,
        title: apiFlow.title,
        createdAt: new Date(apiFlow.createdAt),
        updatedAt: new Date(apiFlow.updatedAt),
        steps: (apiFlow.steps || []).map((apiStep, stepIndex) => ({
          id: apiStep.id,
          title: apiStep.title || "",
          subtitle: apiStep.subtitle || "",
          description: apiStep.description || "",
          stepNumber: apiStep.stepNumber || stepIndex + 1,
          questions: (apiStep.questions || []).map((apiQuestion) => ({
            id: apiQuestion.id,
            order: apiQuestion.order || 0,
            title: apiQuestion.title || "",
            subtitle: apiQuestion.subtitle || "",
            description: apiQuestion.description || "",
            // A API retorna type como número diretamente (1 = TEXT, 2 = TEXTAREA, etc.)
            type: apiQuestion.type as QuestionType,
            options: (apiQuestion.options || []).map((apiOption) => ({
              id: apiOption.id,
              title: apiOption.title || "",
              value: apiOption.value || "",
              enableExtraAnswer: apiOption.enableExtraAnswer || false,
              extraAnswerMaxLength: apiOption.extraAnswerMaxLength,
            })),
            maxLength: apiQuestion.maxLength,
            maxImages: apiQuestion.maxImages,
            acceptedImageTypes: apiQuestion.acceptedImageTypes,
            defaultStockItems: apiQuestion.defaultStockItems
              ? apiQuestion.defaultStockItems
                  .map((item: any) => {
                    const supplyId = item.supplyId || item.productId;
                    if (!supplyId) {
                      console.warn("defaultStockItem sem supplyId ou productId:", item);
                      return null;
                    }
                    return {
                      supplyId,
                      quantity: item.quantity,
                    };
                  })
                  .filter((item): item is { supplyId: string; quantity: number } => item !== null)
              : undefined,
          })),
        })),
      };
    } catch (mapError) {
      console.error("Error mapping execution flow:", apiFlow, mapError);
      throw new Error(`Erro ao processar fluxo criado ${apiFlow.id}: ${mapError instanceof Error ? mapError.message : String(mapError)}`);
    }
  } catch (error) {
    console.error("Error creating execution flow:", error);
    
    // Melhorar mensagem de erro
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:5026`
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error("Erro desconhecido ao criar fluxo de execução");
  }
}

