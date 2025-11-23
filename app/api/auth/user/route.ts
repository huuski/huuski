import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { USER_COOKIE } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get(USER_COOKIE)?.value;
    
    if (!userCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    try {
      const user = JSON.parse(userCookie);
      return NextResponse.json({ user });
    } catch {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error("Error getting user from cookie:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

