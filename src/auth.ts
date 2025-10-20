import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Helper to call backend through Next rewrite
async function loginFastAPI(email: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  // Use absolute URL for server-side fetch in NextAuth
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    // Important: include credentials so backend can set cookies if enabled
    credentials: "include",
  });

  if (!res.ok) {
    // Return error details for special status codes
    const errorData = await res
      .json()
      .catch(() => ({ detail: "Login failed" }));
    return {
      error: true,
      status: res.status,
      detail: errorData.detail || errorData.message || "Login failed",
    };
  }

  const data = await res.json();
  return data; // { access_token, refresh_token, token_type }
}

async function fetchMe(accessToken?: string) {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  // Use absolute URL for server-side fetch in NextAuth
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/v1/users/me`, {
    method: "GET",
    headers,
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json(); // { id, email, role, full_name }
}

// Helper to register/sync Google user with backend
async function syncGoogleUser(email: string, name: string, googleId: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/v1/auth/google-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      full_name: name,
      google_id: googleId,
    }),
    credentials: "include",
  });

  if (!res.ok) {
    // If endpoint doesn't exist yet, return a mock response
    // You'll need to implement this endpoint in your backend
    return {
      access_token: "google-temp-token",
      user: { id: googleId, email, full_name: name, role: "user" },
    };
  }

  return res.json();
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // IMPORTANT: set AUTH_SECRET in your environment for dev/prod
  // You can generate one with: openssl rand -base64 32
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode to see errors
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        preAuth: { label: "PreAuth", type: "text" },
      },
      authorize: async (creds) => {
        const email = String(creds?.email || "");
        const password = String(creds?.password || "");
        const preAuthRaw = creds?.preAuth ? String(creds.preAuth) : null;

        if (!email || !password) return null;

        // When preAuth payload is provided, trust the caller and reuse tokens/user info
        if (preAuthRaw) {
          try {
            const parsed = JSON.parse(preAuthRaw);
            const login = parsed?.login;
            const user = parsed?.user;

            if (login && user) {
              return {
                id: String(user.id ?? email),
                email: user.email ?? email,
                role: user.role ?? "user",
                name: user.full_name || user.email || email,
                access_token: login.access_token,
                refresh_token: login.refresh_token,
              } as any;
            }
          } catch (error) {
            console.error("Failed to parse preAuth payload", error);
            throw new Error("Invalid pre-authentication data");
          }
        }

        const login = await loginFastAPI(email, password);
        if (!login) return null;

        // Check if login returned an error
        if ((login as any).error) {
          const status = (login as any).status;
          const detail = (login as any).detail;

          // Throw error with status code so frontend can detect it
          if (status === 423) {
            throw new Error(`LOCKED:${detail}`);
          } else if (status === 403) {
            throw new Error(`NOT_VERIFIED:${detail}`);
          } else if (status === 401) {
            // Pass through 401 errors (includes attempt counter messages)
            throw new Error(`INVALID_CREDS:${detail}`);
          } else {
            throw new Error(detail);
          }
        }

        const me = await fetchMe(login.access_token);
        // Build user object for session/jwt
        return me
          ? {
              id: String(me.id),
              email: me.email,
              role: me.role,
              name: me.full_name || me.email,
              access_token: login.access_token,
              refresh_token: login.refresh_token,
            }
          : ({ id: email, email, role: "user" } as any);
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true, // Trust the host in development
  useSecureCookies: false, // Critical for localhost development
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === "google") {
        try {
          const googleUser = await syncGoogleUser(
            user.email!,
            user.name || user.email!,
            account.providerAccountId
          );

          // Store backend tokens in user object
          (user as any).access_token = googleUser.access_token;
          (user as any).refresh_token = googleUser.refresh_token;
          (user as any).role = googleUser.user?.role || "user";

          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Persist access/refresh tokens in JWT (server-side only)
      if (user) {
        // @ts-ignore
        token.role = (user as any).role;
        // @ts-ignore
        token.access_token = (user as any).access_token;
        // @ts-ignore
        token.refresh_token = (user as any).refresh_token;
      }

      // Store provider info
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = session.user || {};
      // @ts-ignore
      session.user.role = token.role as string | undefined;
      // @ts-ignore
      session.user.provider = token.provider as string | undefined;
      // Expose backend tokens to client so API calls can authenticate
      // @ts-ignore
      session.accessToken = (token as any).access_token;
      // @ts-ignore
      session.refreshToken = (token as any).refresh_token;
      return session;
    },
  },
});
