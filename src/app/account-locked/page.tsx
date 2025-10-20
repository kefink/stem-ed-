"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AccountLockedPage() {
  const searchParams = useSearchParams();
  const lockedUntil = searchParams.get("until");
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!lockedUntil) return;

    const calculateTimeRemaining = () => {
      const unlockTime = new Date(lockedUntil);
      const now = new Date();
      const diff = unlockTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Account is now unlocked");
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining(`${minutes}m ${seconds}s`);
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bebas text-white mb-2">
            Account Locked
          </h1>
          <p className="text-white/80 font-lato">Security Protection Active</p>
        </div>

        {/* Lockout Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bebas text-red-600 mb-4">
              🔒 Too Many Failed Login Attempts
            </h2>
            <p className="text-gray-700 font-lato">
              Your account has been temporarily locked for security reasons due
              to multiple failed login attempts.
            </p>
          </div>

          {lockedUntil && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-center text-gray-700 font-montserrat">
                <span className="font-semibold">Time Remaining:</span>
              </p>
              <p className="text-center text-3xl font-bebas text-red-600 mt-2">
                {timeRemaining || "Calculating..."}
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                Locked until: {new Date(lockedUntil).toLocaleString()}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-orange mr-3 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-montserrat font-semibold text-gray-800">
                  What happened?
                </h3>
                <p className="text-sm text-gray-600 font-lato">
                  After 5 failed login attempts, your account is automatically
                  locked for 15 minutes to prevent unauthorized access.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-orange mr-3 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-montserrat font-semibold text-gray-800">
                  What to do?
                </h3>
                <p className="text-sm text-gray-600 font-lato">
                  Wait for the lockout period to expire, then try logging in
                  again. Make sure you're using the correct email and password.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-orange mr-3 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <h3 className="font-montserrat font-semibold text-gray-800">
                  Didn't attempt to login?
                </h3>
                <p className="text-sm text-gray-600 font-lato">
                  If you didn't try to log in, someone may be attempting to
                  access your account. Please reset your password immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="block w-full bg-orange hover:bg-orange-dark text-white font-montserrat font-bold py-3 px-6 rounded-lg text-center transition-all duration-300 hover:scale-105"
            >
              Reset Password
            </Link>

            <Link
              href="/login"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-montserrat font-bold py-3 px-6 rounded-lg text-center transition-all duration-300"
            >
              Back to Login
            </Link>

            <Link
              href="/contact"
              className="block w-full text-center text-orange hover:text-orange-dark font-lato transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-white font-montserrat font-semibold mb-2">
            🛡️ Security Tips
          </h3>
          <ul className="text-white/80 font-lato text-sm space-y-1">
            <li>• Use a strong, unique password</li>
            <li>• Never share your password with anyone</li>
            <li>• Enable two-factor authentication when available</li>
            <li>• Check your email for security alerts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
