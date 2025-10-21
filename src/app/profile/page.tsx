"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  updateCurrentUser,
  getTwoFactorStatus,
  startTwoFactorSetup,
  enableTwoFactor,
  disableTwoFactor,
  regenerateTwoFactorBackupCodes,
} from "@/lib/apiClient";

interface UserData {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [twoFactorStatus, setTwoFactorStatus] = useState<{
    enabled: boolean;
    backup_codes_remaining: number;
    confirmed_at?: string | null;
    last_verified_at?: string | null;
  } | null>(null);
  const [twoFactorSetupData, setTwoFactorSetupData] = useState<{
    secret: string;
    otpauth_uri: string;
    backup_codes: string[];
  } | null>(null);
  const [twoFactorCodeInput, setTwoFactorCodeInput] = useState("");
  const [twoFactorDisableInput, setTwoFactorDisableInput] = useState({
    password: "",
    code: "",
    method: "totp" as "totp" | "backup_code",
  });
  const [regenerateCode, setRegenerateCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState<string | null>(null);
  const [isTwoFactorBusy, setIsTwoFactorBusy] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [showRegenerateForm, setShowRegenerateForm] = useState(false);
  const [latestBackupCodes, setLatestBackupCodes] = useState<string[] | null>(
    null
  );

  const fetchTwoFactorStatus = async () => {
    try {
      const status = await getTwoFactorStatus();
      setTwoFactorStatus(status);
    } catch (err) {
      console.warn("Failed to load two-factor status", err);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      loadUserData();
    }
  }, [status, router]);

  const loadUserData = async () => {
    try {
      const data = await getCurrentUser();
      setUserData(data);
      setFormData({
        full_name: data.full_name || "",
        email: data.email,
        password: "",
        confirmPassword: "",
      });
      await fetchTwoFactorStatus();
    } catch (err: any) {
      setError(err?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: any = {
        full_name: formData.full_name,
        email: formData.email,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await updateCurrentUser(payload);
      await loadUserData();
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: userData?.full_name || "",
      email: userData?.email || "",
      password: "",
      confirmPassword: "",
    });
    setError(null);
    setSuccess(null);
  };

  const handleStartTwoFactor = async () => {
    setTwoFactorError(null);
    setTwoFactorSuccess(null);
    setLatestBackupCodes(null);
    setIsTwoFactorBusy(true);
    try {
      const setup = await startTwoFactorSetup();
      setTwoFactorSetupData(setup);
      setTwoFactorCodeInput("");
      setTwoFactorSuccess(
        "Two-factor setup started. Scan the QR code or enter the secret below, then confirm with a code."
      );
      await fetchTwoFactorStatus();
    } catch (err: any) {
      setTwoFactorError(err?.message || "Failed to start two-factor setup.");
    } finally {
      setIsTwoFactorBusy(false);
    }
  };

  const handleConfirmTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorSetupData) return;
    setTwoFactorError(null);
    setTwoFactorSuccess(null);
    setIsTwoFactorBusy(true);
    try {
      await enableTwoFactor(twoFactorCodeInput.trim());
      setTwoFactorSuccess("Two-factor authentication enabled successfully!");
      setTwoFactorSetupData(null);
      setTwoFactorCodeInput("");
      setLatestBackupCodes(null);
      await fetchTwoFactorStatus();
    } catch (err: any) {
      setTwoFactorError(
        err?.message || "Failed to enable two-factor authentication."
      );
    } finally {
      setIsTwoFactorBusy(false);
    }
  };

  const handleDisableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError(null);
    setTwoFactorSuccess(null);
    setIsTwoFactorBusy(true);
    try {
      await disableTwoFactor({
        password: twoFactorDisableInput.password,
        code: twoFactorDisableInput.code,
        method: twoFactorDisableInput.method,
      });
      setTwoFactorSuccess("Two-factor authentication disabled.");
      setTwoFactorDisableInput({ password: "", code: "", method: "totp" });
      setShowDisableForm(false);
      setLatestBackupCodes(null);
      await fetchTwoFactorStatus();
    } catch (err: any) {
      setTwoFactorError(
        err?.message || "Failed to disable two-factor authentication."
      );
    } finally {
      setIsTwoFactorBusy(false);
    }
  };

  const handleRegenerateBackupCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setTwoFactorError(null);
    setTwoFactorSuccess(null);
    setIsTwoFactorBusy(true);
    try {
      const result = await regenerateTwoFactorBackupCodes(
        regenerateCode.trim()
      );
      setTwoFactorSuccess(
        "New backup codes generated. Store them securely now."
      );
      setLatestBackupCodes(result.backup_codes || []);
      setRegenerateCode("");
      setShowRegenerateForm(false);
      await fetchTwoFactorStatus();
    } catch (err: any) {
      setTwoFactorError(err?.message || "Failed to regenerate backup codes.");
    } finally {
      setIsTwoFactorBusy(false);
    }
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return value;
    return dt.toLocaleString();
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy flex items-center justify-center">
        <div className="text-white text-xl font-montserrat">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bebas text-orange mb-2">My Profile</h1>
          <p className="text-white/80 font-lato">
            View and manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Profile Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange to-orange-dark rounded-full flex items-center justify-center text-white text-4xl font-bebas">
              {userData?.full_name
                ? userData.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : userData?.email[0].toUpperCase()}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block font-montserrat font-semibold text-navy mb-2">
                Full Name
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <h3 className="text-3xl font-bebas text-navy mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 font-lato mb-4">
                    Add a verification code requirement to keep your account
                    secure even if your password is compromised.
                  </p>

                  {twoFactorError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {twoFactorError}
                    </div>
                  )}

                  {twoFactorSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                      {twoFactorSuccess}
                    </div>
                  )}

                  {twoFactorStatus?.enabled ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 font-lato">
                        <p className="font-semibold text-navy">
                          Status: Enabled ✅
                        </p>
                        <p className="mt-2 text-sm">
                          Confirmed:{" "}
                          {formatDateTime(twoFactorStatus.confirmed_at)}
                        </p>
                        <p className="mt-1 text-sm">
                          Last verified:{" "}
                          {formatDateTime(twoFactorStatus.last_verified_at)}
                        </p>
                        <p className="mt-1 text-sm">
                          Backup codes remaining:{" "}
                          {twoFactorStatus.backup_codes_remaining}
                        </p>
                      </div>

                      {latestBackupCodes && latestBackupCodes.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="font-semibold text-navy mb-2">
                            Your new backup codes
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            Save these codes somewhere safe. Each code can only
                            be used once.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-sm">
                            {latestBackupCodes.map((code) => (
                              <span
                                key={code}
                                className="px-3 py-2 bg-gray-100 rounded"
                              >
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowRegenerateForm((prev) => !prev);
                            setShowDisableForm(false);
                            setTwoFactorError(null);
                            setTwoFactorSuccess(null);
                            setLatestBackupCodes(null);
                          }}
                          className="flex-1 bg-orange text-white font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-orange-dark transition-all disabled:opacity-50"
                          disabled={isTwoFactorBusy}
                        >
                          Regenerate Backup Codes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDisableForm((prev) => !prev);
                            setShowRegenerateForm(false);
                            setTwoFactorError(null);
                            setTwoFactorSuccess(null);
                          }}
                          className="flex-1 bg-gray-200 text-gray-700 font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
                          disabled={isTwoFactorBusy}
                        >
                          Disable Two-Factor
                        </button>
                      </div>

                      {showRegenerateForm && (
                        <form
                          onSubmit={handleRegenerateBackupCodes}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
                        >
                          <div>
                            <label className="block font-montserrat font-semibold text-navy mb-2">
                              Authenticator Code
                            </label>
                            <input
                              type="text"
                              value={regenerateCode}
                              onChange={(event) =>
                                setRegenerateCode(event.target.value)
                              }
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                              placeholder="123456"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={
                                isTwoFactorBusy || !regenerateCode.trim()
                              }
                              className="flex-1 bg-navy text-white font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-navy-light transition-all disabled:opacity-50"
                            >
                              {isTwoFactorBusy
                                ? "Regenerating..."
                                : "Generate Codes"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowRegenerateForm(false)}
                              disabled={isTwoFactorBusy}
                              className="flex-1 bg-gray-300 text-gray-700 font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      {showDisableForm && (
                        <form
                          onSubmit={handleDisableTwoFactor}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
                        >
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-montserrat font-semibold text-navy mb-2">
                                Account Password
                              </label>
                              <input
                                type="password"
                                value={twoFactorDisableInput.password}
                                onChange={(event) =>
                                  setTwoFactorDisableInput((prev) => ({
                                    ...prev,
                                    password: event.target.value,
                                  }))
                                }
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                              />
                            </div>
                            <div>
                              <label className="block font-montserrat font-semibold text-navy mb-2">
                                {twoFactorDisableInput.method === "backup_code"
                                  ? "Backup Code"
                                  : "Authenticator Code"}
                              </label>
                              <input
                                type="text"
                                value={twoFactorDisableInput.code}
                                onChange={(event) =>
                                  setTwoFactorDisableInput((prev) => ({
                                    ...prev,
                                    code: event.target.value,
                                  }))
                                }
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                                placeholder={
                                  twoFactorDisableInput.method === "backup_code"
                                    ? "1234-5678"
                                    : "123456"
                                }
                              />
                            </div>
                          </div>

                          <div className="flex justify-between text-sm">
                            <button
                              type="button"
                              onClick={() =>
                                setTwoFactorDisableInput((prev) => ({
                                  ...prev,
                                  method:
                                    prev.method === "totp"
                                      ? "backup_code"
                                      : "totp",
                                  code: "",
                                }))
                              }
                              className="text-orange hover:text-orange-dark font-semibold"
                            >
                              {twoFactorDisableInput.method === "backup_code"
                                ? "Use authenticator code"
                                : "Use a backup code"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowDisableForm(false);
                                setTwoFactorDisableInput({
                                  password: "",
                                  code: "",
                                  method: "totp",
                                });
                              }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={
                              isTwoFactorBusy ||
                              !twoFactorDisableInput.password.trim() ||
                              !twoFactorDisableInput.code.trim()
                            }
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                          >
                            {isTwoFactorBusy
                              ? "Disabling..."
                              : "Disable Two-Factor"}
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {twoFactorSetupData ? (
                        <>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="font-semibold text-navy mb-2">
                              Scan or enter this secret in your authenticator
                              app
                            </p>
                            <div className="font-mono text-sm bg-white border border-gray-300 rounded px-3 py-2 inline-block">
                              {twoFactorSetupData.secret}
                            </div>
                            <p className="text-sm text-gray-600 mt-3">
                              Or tap
                              <a
                                href={twoFactorSetupData.otpauth_uri}
                                className="text-orange hover:text-orange-dark ml-1"
                              >
                                this link
                              </a>
                              on a device with an authenticator installed.
                            </p>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="font-semibold text-navy mb-2">
                              Backup Codes (store these safely)
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-sm">
                              {twoFactorSetupData.backup_codes.map((code) => (
                                <span
                                  key={code}
                                  className="px-3 py-2 bg-gray-100 rounded"
                                >
                                  {code}
                                </span>
                              ))}
                            </div>
                          </div>

                          <form
                            onSubmit={handleConfirmTwoFactor}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block font-montserrat font-semibold text-navy mb-2">
                                Enter the 6-digit code to confirm
                              </label>
                              <input
                                type="text"
                                value={twoFactorCodeInput}
                                onChange={(event) =>
                                  setTwoFactorCodeInput(event.target.value)
                                }
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                                placeholder="123456"
                              />
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="submit"
                                disabled={
                                  isTwoFactorBusy || !twoFactorCodeInput.trim()
                                }
                                className="flex-1 bg-navy text-white font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-navy-light transition-all disabled:opacity-50"
                              >
                                {isTwoFactorBusy
                                  ? "Enabling..."
                                  : "Enable Two-Factor"}
                              </button>
                              <button
                                type="button"
                                disabled={isTwoFactorBusy}
                                onClick={() => {
                                  setTwoFactorSetupData(null);
                                  setTwoFactorCodeInput("");
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 font-montserrat font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handleStartTwoFactor}
                          disabled={isTwoFactorBusy}
                          className="bg-orange hover:bg-orange-dark text-white font-montserrat font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                        >
                          {isTwoFactorBusy
                            ? "Preparing..."
                            : "Start Two-Factor Setup"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-montserrat font-semibold text-navy mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="john@example.com"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block font-montserrat font-semibold text-navy mb-2">
                Role
              </label>
              <input
                type="text"
                value={userData?.role || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed capitalize"
              />
            </div>

            {/* Password Fields (only shown when editing) */}
            {isEditing && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-montserrat font-semibold text-navy mb-4">
                    Change Password (Optional)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-montserrat font-semibold text-navy mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                          placeholder="Leave blank to keep current"
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

                    <div>
                      <label className="block font-montserrat font-semibold text-navy mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
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
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-orange hover:bg-orange-dark text-white font-montserrat font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-montserrat font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-navy hover:bg-navy-light text-white font-montserrat font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
