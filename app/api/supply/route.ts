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

export async function GET() {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/supply`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      return NextResponse.json(
        { error: `Erro ao buscar suprimentos: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in supply API route:", error);
    return NextResponse.json(
      { 
        error: "Erro ao conectar com a API",
        message: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

