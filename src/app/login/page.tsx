"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (verified === "true") {
      setSuccessMessage("✅ Email verified successfully! You can now log in.");
    }
  }, [verified]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("username", formData.email);
      params.set("password", formData.password);

      const loginResponse = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: params.toString(),
      });

      const loginData = await loginResponse.json().catch(() => ({}));
      const detail =
        loginData?.detail || loginData?.message || "Invalid email or password";

      if (!loginResponse.ok) {
        console.log("Login failed:", detail);

        if (loginResponse.status === 423 || detail.includes("lock")) {
          const match = detail.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
          const lockedUntil = match ? match[1] : null;
          if (lockedUntil) {
            window.location.href = `/account-locked?until=${encodeURIComponent(
              lockedUntil
            )}`;
          } else {
            window.location.href = "/account-locked";
          }
        } else if (
          loginResponse.status === 403 ||
          detail.includes("Email not verified")
        ) {
          setError(`📧 ${detail}`);
        } else if (detail.includes("attempt")) {
          setError(`⚠️ ${detail}`);
        } else {
          setError(detail || "Invalid email or password");
        }

        setIsSubmitting(false);
        return;
      }

      if (!loginData?.access_token) {
        setError("Unexpected response from server. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Fetch user profile using the freshly issued access token
      let userData: any = null;
      try {
        const profileResponse = await fetch("/api/v1/users/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${loginData.access_token}`,
          },
        });

        if (profileResponse.ok) {
          userData = await profileResponse.json();
        }
      } catch (profileError) {
        console.warn("Unable to fetch user profile after login", profileError);
      }

      const preAuthPayload = JSON.stringify({
        login: loginData,
        user: userData,
      });

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        preAuth: preAuthPayload,
      });

      if (result?.error) {
        console.error("NextAuth sign-in failed:", result.error);
        setError("Sign-in failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const next = urlParams.get("next");
      window.location.href = next || "/";
    } catch (err) {
      console.error("Login request error", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      setError("Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bebas text-orange mb-2">
            STEM-ED-ARCHITECTS
          </h1>
          <p className="text-white/80 font-lato">
            Engineering Learning Solutions
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bebas text-navy mb-6 text-center">
            Welcome Back
          </h2>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex flex-col">
              <span>{error}</span>
              {error.includes("Email not verified") && (
                <Link
                  href="/resend-verification"
                  className="text-blue-600 hover:text-blue-800 font-semibold mt-2 text-sm"
                >
                  → Resend verification email
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-montserrat font-semibold text-navy mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block font-montserrat font-semibold text-navy mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
                />
                <span className="ml-2 font-lato text-gray-700">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="font-lato text-orange hover:text-orange-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange hover:bg-orange-dark text-white font-montserrat font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner
                  label="Signing in..."
                  className="justify-center text-white"
                />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-lato text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-orange hover:text-orange-dark font-semibold transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white font-lato text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:border-orange"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-lato text-gray-700">Google</span>
            </button>
            <button
              type="button"
              disabled
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed opacity-60"
            >
              <span className="text-2xl mr-2">🔗</span>
              <span className="font-lato text-gray-700">LinkedIn</span>
              <span className="ml-1 text-xs text-gray-500">(Soon)</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-white/60 font-lato text-sm mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
