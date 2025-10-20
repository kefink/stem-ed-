"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/auth/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          setEmail(data.email);

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login?verified=true");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred. Please try again.");
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verified! 🎉
            </h1>
            <p className="text-gray-600 mb-4">{message}</p>
            {email && (
              <p className="text-sm text-gray-500 mb-6">
                Account: <span className="font-semibold">{email}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to login page in 3 seconds...
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-lg hover:bg-[#E55A2B] transition-colors font-semibold"
            >
              Go to Login Now
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/resend-verification"
                className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Resend Verification Email
              </Link>
              <Link
                href="/login"
                className="block text-gray-600 hover:text-gray-800 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
