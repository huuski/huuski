import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_COOKIE } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const isLogged = cookieStore.get(AUTH_COOKIE)?.value === "true";
  redirect(isLogged ? "/dashboard" : "/login");
}
