import { auth } from "@/lib/auth/server";

/**
 * Normalized GITDM authentication session.
 * The stable identifier is the Neon Auth user id.
 *
 * Neon Auth's SDK result is a discriminated result at runtime, but its
 * generated TypeScript type can expose the error branch through `data`.
 * Keep that SDK detail in one place so the rest of the application only
 * deals with a verified session object.
 */
export async function getAuthSession() {
  if (!process.env.NEON_AUTH_BASE_URL?.trim()) {
    return null;
  }

  try {
    const result = (await auth.getSession()) as {
      data?: unknown;
      error?: { message?: string } | null;
    };

    if (result?.error || !result?.data || typeof result.data !== "object") {
      return null;
    }

    const data = result.data as {
      user?: {
        id?: string;
        email?: string;
        name?: string | null;
        image?: string | null;
        emailVerified?: boolean;
      } | null;
      session?: unknown;
    };

    if (!data.user?.id || !data.user.email) return null;

    return {
      user: {
        sub: data.user.id,
        email: data.user.email,
        name: data.user.name ?? null,
        nickname: null,
        preferred_username: null,
        given_name: data.user.name?.split(/\s+/)[0] ?? null,
        family_name: data.user.name?.split(/\s+/).slice(1).join(" ") || null,
        picture: data.user.image ?? null,
        emailVerified: Boolean(data.user.emailVerified),
      },
      session: data.session ?? null,
    };
  } catch (error) {
    console.warn("[GITDM auth-session] Session lookup failed:", error);
    return null;
  }
}
