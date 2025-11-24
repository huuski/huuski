"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { AUTH_COOKIE, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, USER_COOKIE, type LoginResponse } from "@/lib/auth";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(_: AuthState | undefined, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-mail e senha são obrigatórios." };
  }

  try {
    // Chamar a API de login diretamente (server-side)
    const API_BASE_URL = process.env.API_URL || "https://your-api-name-production.up.railway.app";
    
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
    } catch (fetchError) {
      console.error("Network error:", fetchError);
      return { 
        error: "Não foi possível conectar ao servidor. Verifique se a API está rodando." 
      };
    }

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Parse error:", parseError, "Response:", responseText);
      return { 
        error: `Resposta inválida do servidor: ${response.status} ${response.statusText}` 
      };
    }

    if (!response.ok || responseData.error) {
      const errorMessage = responseData.error || responseData.message || responseData.details || "Erro ao fazer login";
      return { error: errorMessage };
    }

    // Validar estrutura da resposta
    if (!responseData.accessToken || !responseData.user) {
      console.error("Invalid response structure:", responseData);
      return { error: "Resposta da API inválida. Campos obrigatórios ausentes." };
    }

    const loginData: LoginResponse = responseData;

    // Armazenar tokens e informações do usuário nos cookies
    const cookieStore = await cookies();
    
    try {
      // Cookie de autenticação (para middleware)
      cookieStore.set(AUTH_COOKIE, "true", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 horas
      });

      // Access token
      cookieStore.set(ACCESS_TOKEN_COOKIE, loginData.accessToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 horas
      });

      // Refresh token
      cookieStore.set(REFRESH_TOKEN_COOKIE, loginData.refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      // Informações do usuário
      cookieStore.set(USER_COOKIE, JSON.stringify(loginData.user), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 horas
      });
    } catch (cookieError) {
      console.error("Cookie error:", cookieError);
      return { error: "Erro ao salvar dados de autenticação." };
    }

    // Revalidar o path antes do redirect
    revalidatePath("/dashboard");
    
    // Retornar sucesso - o redirect será feito no cliente
    // Isso evita problemas com useActionState
    return { success: true };
  } catch (error) {
    // Se for um redirect, deixar passar (Next.js usa uma exceção especial para redirects)
    if (error && typeof error === "object" && "digest" in error && typeof (error as any).digest === "string" && (error as any).digest.includes("NEXT_REDIRECT")) {
      throw error;
    }
    
    console.error("Error in login action:", error);
    return { 
      error: error instanceof Error ? error.message : "Erro ao conectar com o servidor. Tente novamente." 
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  
  // Limpar todos os cookies de autenticação
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(USER_COOKIE);
  
  // Garantir que os cookies sejam removidos
  cookieStore.set(AUTH_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
  cookieStore.set(ACCESS_TOKEN_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
  cookieStore.set(USER_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
  
  redirect("/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE)?.value;
  
  if (!userCookie) {
    return null;
  }
  
  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

