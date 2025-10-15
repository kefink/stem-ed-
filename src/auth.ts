import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Helper to call backend through Next rewrite
async function loginFastAPI(email: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  // Use absolute URL for server-side fetch in NextAuth
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      // Important: include credentials so backend can set cookies if enabled
      credentials: "include",
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data; // { access_token, refresh_token, token_type }
}

async function fetchMe(accessToken?: string) {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  
  // Use absolute URL for server-side fetch in NextAuth
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/v1/users/me`,
    {
      method: "GET",
      headers,
      credentials: "include",
    }
  );
  if (!res.ok) return null;
  return res.json(); // { id, email, role, full_name }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // IMPORTANT: set AUTH_SECRET in your environment for dev/prod
  // You can generate one with: openssl rand -base64 32
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const email = String(creds?.email || "");
        const password = String(creds?.password || "");
        if (!email || !password) return null;
        const login = await loginFastAPI(email, password);
        if (!login) return null;
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
  callbacks: {
    async jwt({ token, user }) {
      // Persist access/refresh tokens in JWT (server-side only)
      if (user) {
        // @ts-ignore
        token.role = (user as any).role;
        // @ts-ignore
        token.access_token = (user as any).access_token;
        // @ts-ignore
        token.refresh_token = (user as any).refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = session.user || {};
      // @ts-ignore
      session.user.role = token.role as string | undefined;
      // Expose backend tokens to client so API calls can authenticate
      // @ts-ignore
      session.accessToken = (token as any).access_token;
      // @ts-ignore
      session.refreshToken = (token as any).refresh_token;
      return session;
    },
  },
});
