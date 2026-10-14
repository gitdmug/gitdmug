import { createNeonAuth } from "@neondatabase/auth/next/server";
import { NextResponse } from "next/server";

const hasNeonAuth = Boolean(process.env.NEON_AUTH_BASE_URL?.trim());

function createMockNeonAuth() {
  return {
    handler: () => ({
      GET: async () =>
        NextResponse.json({ error: "NEON_AUTH_BASE_URL is not configured" }, { status: 503 }),
      POST: async () =>
        NextResponse.json({ error: "NEON_AUTH_BASE_URL is not configured" }, { status: 503 }),
    }),
    getSession: async () => ({ data: null, error: null }),
    signOut: async () => {},
    signIn: {
      email: async () => ({
        error: { message: "Neon Auth is not configured in this environment." },
      }),
    },
    signUp: {
      email: async () => ({
        error: { message: "Neon Auth is not configured in this environment." },
      }),
    },
    emailOtp: {
      sendVerificationOtp: async () => {},
    },
  };
}

export const auth = hasNeonAuth
  ? createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!.trim(),
      cookies: {
        secret:
          process.env.NEON_AUTH_COOKIE_SECRET && process.env.NEON_AUTH_COOKIE_SECRET.length >= 32
            ? process.env.NEON_AUTH_COOKIE_SECRET
            : "gitdm_platform_default_auth_secret_32_chars_minimum",
        sessionDataTtl: 300,
      },
    })
  : (createMockNeonAuth() as unknown as ReturnType<typeof createNeonAuth>);
