"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyForgotPasswordContent() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/password_reset/verify/`,
        { token, email, new_password: newPassword }
      );
      setSuccess(response.data.message);
      setTimeout(() => router.push("/log-in"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email is required to resend token");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/password_reset/resend/`,
        { email }
      );
      setSuccess(response.data.message);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-josseypink2">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-josseypink1 mb-2">JOSSEY SCHOOL</h1>
          <h2 className="text-xl text-josseypink1">Reset Password</h2>
        </div>

        <form className="space-y-6" onSubmit={handleReset}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-josseypink1 focus:border-josseypink1"
            />
          </div>

          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              Verification Token
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-josseypink1 focus:border-josseypink1"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-josseypink1 focus:border-josseypink1"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[josseypink1 focus:border-josseypink1"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className={`py-2 px-4 rounded-md text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Resend Token
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-4 rounded-md text-sm font-medium text-white bg-josseypink1 hover:bg-josseypink2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/log-in" className="text-sm text-josseypink1 hover:text-josseypink2">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// ✅ Outer wrapper that fixes Suspense issue
export default function VerifyForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <VerifyForgotPasswordContent />
    </Suspense>
  );
}
