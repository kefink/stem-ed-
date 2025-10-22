/**
 * fetchWithAuth - A wrapper around fetch that automatically includes
 * the authorization header from NextAuth session
 */
import { getSession } from "next-auth/react";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  // Get the session and attach Authorization header
  try {
    const session = await getSession();
    const accessToken = (session as any)?.accessToken as string | undefined;
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  } catch (error) {
    console.error("Failed to get session:", error);
  }

  // Set Content-Type if body is present and not FormData
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}
