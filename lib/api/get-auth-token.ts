import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth";

/**
 * Obtém o token de acesso JWT dos cookies (server-side)
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    return token || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}

