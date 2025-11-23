import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL || "http://localhost:5026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("POST request to external API:", `${API_BASE_URL}/api/auth/login`);
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
          error: `Erro ao fazer login: ${response.status} ${response.statusText}`, 
          details: errorDetails 
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "Resposta inválida da API" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in auth login API route:", error);
    return NextResponse.json(
      { 
        error: "Erro ao conectar com a API",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

