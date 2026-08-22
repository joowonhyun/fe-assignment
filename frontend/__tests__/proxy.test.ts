import { afterEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/shared/constants/auth";

const req = (path: string, cookie?: string) =>
  new NextRequest(new URL(path, "https://dashboard.example.com"), {
    headers: cookie ? { cookie } : {},
  });

const mockRefresh = (status: number, body?: unknown) =>
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(body ? JSON.stringify(body) : null, {
          status,
          headers: body ? { "content-type": "application/json" } : {},
        }),
    ),
  );

afterEach(() => vi.unstubAllGlobals());

test("폐기된 refreshToken + /login → 로그인 페이지 통과 + 쿠키 삭제", async () => {
  mockRefresh(401);

  const res = await proxy(req("/login", `${REFRESH_TOKEN_COOKIE}=dead`));

  // 수정 전에는 쿠키 존재만으로 "/"로 튕겨 로그인이 불가능했다.
  expect(res.headers.get("location")).toBeNull();
  expect(res.cookies.get(REFRESH_TOKEN_COOKIE)?.value).toBe("");
  expect(res.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe("");
});

test("폐기된 refreshToken + 보호 라우트 → 로그인으로 보내고 쿠키 삭제", async () => {
  mockRefresh(401);

  const res = await proxy(req("/", `${REFRESH_TOKEN_COOKIE}=dead`));

  expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  expect(res.cookies.get(REFRESH_TOKEN_COOKIE)?.value).toBe("");
});

test("유효한 refreshToken + /login → 홈으로 리다이렉트 + accessToken 갱신", async () => {
  mockRefresh(200, { accessToken: "fresh" });

  const res = await proxy(req("/login", `${REFRESH_TOKEN_COOKIE}=alive`));

  expect(new URL(res.headers.get("location")!).pathname).toBe("/");
  expect(res.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe("fresh");
});

test("refresh가 5xx면 쿠키를 유지한다 (일시 장애로 로그아웃시키지 않음)", async () => {
  mockRefresh(503);

  const res = await proxy(req("/", `${REFRESH_TOKEN_COOKIE}=alive`));

  expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  expect(res.cookies.get(REFRESH_TOKEN_COOKIE)).toBeUndefined();
});

test("토큰 없이 보호 라우트 → redirectTo에 쿼리까지 1회 인코딩으로 보존", async () => {
  const res = await proxy(req("/?platform=Naver&page=2"));

  const location = new URL(res.headers.get("location")!);
  expect(location.pathname).toBe("/login");
  expect(location.searchParams.get("redirectTo")).toBe(
    "/?platform=Naver&page=2",
  );
});
