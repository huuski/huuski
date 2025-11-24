import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/api/get-auth-token";

const API_BASE_URL = process.env.API_URL || "https://your-api-name-production.up.railway.app";

async function getHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/executionflow/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      return NextResponse.json(
        { error: `Erro ao buscar fluxo de execução: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in execution-flow by id API route:", error);
    return NextResponse.json(
      { 
        error: "Erro ao conectar com a API",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log("PUT request to external API:", `${API_BASE_URL}/api/executionflow/${id}`);
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/executionflow/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseText = await response.text();
    console.log("External API response status:", response.status);
    console.log("External API response body:", responseText);

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = JSON.parse(responseText);
      } catch {
        errorDetails = responseText;
      }
      
      return NextResponse.json(
        { 
          error: `Erro ao atualizar fluxo de execução: ${response.status} ${response.statusText}`, 
          details: errorDetails 
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { success: true };
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in execution-flow PUT API route:", error);
    return NextResponse.json(
      { 
        error: "Erro ao conectar com a API",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

