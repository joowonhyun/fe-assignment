"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/shared/constants/api";
import {
  ACCESS_COOKIE_OPTIONS,
  ACCESS_TOKEN_COOKIE,
  REFRESH_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE,
} from "@/shared/constants/auth";

type LoginState = { success: true } | { success: false; message: string };

async function performLogin(email: string, password: string): Promise<LoginState> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return {
      success: false,
      message: body?.message ?? "로그인에 실패했습니다.",
    };
  }

  const { accessToken, refreshToken } = (await res.json()) as {
    accessToken: string;
    refreshToken: string;
  };

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, ACCESS_COOKIE_OPTIONS);
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);

  redirect("/");
}

export async function loginAction(
  _prevState: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  if (formData.get("mode") === "demo") {
    return performLogin(
      process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
      process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
    );
  }
  return performLogin(String(formData.get("email")), String(formData.get("password")));
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  redirect("/login");
}
