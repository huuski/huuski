import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL || "https://your-api-name-production.up.railway.app";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/executionflow`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      return NextResponse.json(
        { error: `Erro ao buscar fluxos de execução: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in execution-flows API route:", error);
    return NextResponse.json(
      { 
        error: "Erro ao conectar com a API",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("POST request to external API:", `${API_BASE_URL}/api/executionflow`);
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/api/executionflow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
          error: `Erro ao criar fluxo de execução: ${response.status} ${response.statusText}`, 
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
    console.error("Error in execution-flow POST API route:", error);
    return NextResponse.json(
      { 
        error: "Erro ao conectar com a API",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

