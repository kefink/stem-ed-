// Lightweight API client with bearer token support and auto-refresh.
// Uses localStorage for access token + refresh token returned by backend.
// If you enable cookie session mode on the backend, you can simplify this and remove localStorage usage.

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
import { getSession } from "next-auth/react";

// In cookie-only mode, we don't use localStorage or explicit bearer headers.
export function clearTokens() {
  // No-op in cookie-only mode; backend cookies are cleared via API logout.
}

async function refreshAccessToken(): Promise<boolean> {
  // In cookie session mode, refresh is cookie-bound; call via apiFetch to include CSRF header.
  try {
    await apiFetch("/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "cookie" }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit & { method?: HttpMethod } = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  // Attach Authorization from NextAuth session if available
  try {
    const session = await getSession();
    const at = (session as any)?.accessToken as string | undefined;
    if (at && !headers.has("Authorization"))
      headers.set("Authorization", `Bearer ${at}`);
  } catch {}
  // If backend cookie-session is enabled, attach CSRF header if present
  if (typeof document !== "undefined") {
    const csrfCookie = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("csrf_token="));
    if (csrfCookie && !headers.has("X-CSRF-Token")) {
      const v = decodeURIComponent(csrfCookie.split("=")[1] || "");
      if (v) headers.set("X-CSRF-Token", v);
    }
  }
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(url, { ...options, headers, credentials: "include" });
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry once with same options and updated headers (Authorization may change)
      const retryHeaders = new Headers(options.headers);
      // reattach bearer
      try {
        const session = await getSession();
        const at = (session as any)?.accessToken as string | undefined;
        if (at && !retryHeaders.has("Authorization"))
          retryHeaders.set("Authorization", `Bearer ${at}`);
      } catch {}
      if (
        options.body &&
        !(options.body instanceof FormData) &&
        !retryHeaders.has("Content-Type")
      ) {
        retryHeaders.set("Content-Type", "application/json");
      }
      res = await fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
    }
  }

  if (!res.ok) {
    let detail: any = undefined;
    try {
      detail = await res.json();
    } catch {}
    const error = new Error(
      detail?.detail || `Request failed with ${res.status}`
    );
    throw error;
  }
  return (await res.json()) as T;
}

// Auth helpers
export async function loginWithPassword(email: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);
  const res = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    credentials: "include",
  });
  if (!res.ok) {
    let detail: any = undefined;
    try {
      detail = await res.json();
    } catch {}
    throw new Error(detail?.detail || "Login failed");
  }
  // Cookie-session mode: nothing to store client-side
  try {
    return await res.json();
  } catch {
    return {} as any;
  }
}

export async function logout() {
  // In cookie-session mode, backend will clear cookies and (optionally) revoke all tokens for current user.
  try {
    await apiFetch("/api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  } catch {}
  clearTokens();
}

export async function registerUser(payload: {
  email: string;
  password: string;
  full_name?: string;
  role?: string;
}) {
  return apiFetch("/api/v1/users/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return apiFetch("/api/v1/users/me", { method: "GET" });
}

export async function updateCurrentUser(payload: {
  full_name?: string;
  email?: string;
  password?: string;
}) {
  return apiFetch("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
