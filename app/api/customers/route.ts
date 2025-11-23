import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_URL || "http://localhost:5026";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/customer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      return NextResponse.json(
        { error: `Erro ao buscar clientes: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in customers API route:", error);
    return NextResponse.json(
      { 
        error: "Erro ao conectar com a API",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

