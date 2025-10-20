"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/apiClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await forgotPassword(email);
      setSuccessMessage(
        response.message ||
          "If that email exists, a password reset link has been sent. Please check your inbox."
      );
      setEmail(""); // Clear form
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          <p className="text-white/80 font-lato">Password Recovery</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bebas text-navy mb-4 text-center">
            Forgot Password?
          </h2>

          <p className="text-gray-600 font-lato text-center mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">✅ Email Sent!</p>
              <p className="text-sm mt-1">{successMessage}</p>
              <p className="text-sm mt-2">
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSuccessMessage(null);
                  }}
                  className="text-green-800 underline hover:text-green-900"
                >
                  Try again
                </button>
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-montserrat font-semibold text-navy mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange hover:bg-orange-dark text-white font-montserrat font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link
              href="/login"
              className="block font-lato text-orange hover:text-orange-dark transition-colors"
            >
              ← Back to Login
            </Link>
            <p className="font-lato text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-orange hover:text-orange-dark font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-white/60 font-lato text-sm">
            🔒 For security, the reset link expires in 15 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
