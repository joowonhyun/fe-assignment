export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15분
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7일

const secure = process.env.NODE_ENV === "production";

// 쿠키 옵션은 proxy.ts / loginAction / actionFetch가 공유한다.
// 만료·보안 플래그를 바꿀 일이 생기면 여기 한 곳만 고친다.
export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure,
  sameSite: "lax",
  maxAge: ACCESS_TOKEN_MAX_AGE,
  path: "/",
} as const;

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure,
  sameSite: "lax",
  maxAge: REFRESH_TOKEN_MAX_AGE,
  path: "/",
} as const;
