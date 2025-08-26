"use client";

import { Suspense } from "react";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import Link from "next/link";

function VerifySignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    token: "",
    email: emailFromUrl,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResendSuccess("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/verify_email/`, 
        {
          token: formData.token,
          email: formData.email,
        }
      );
      setSuccess(true);
      setTimeout(() => router.push("/log-in"), 2000);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data) {
        const data = error.response.data as { error?: string; message?: string };
        setError(data.error || data.message || "Verification failed. Check your token.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setResendSuccess("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/resend_verification/`, 
        { email: formData.email }
      );
      setResendSuccess("A new verification token has been sent to your email.");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data) {
        const data = error.response.data as { error?: string; message?: string };
        setError(data.error || data.message || "Failed to send new token.");
      } else {
        setError("Failed to send new token. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#FC46AA] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            JC
          </div>
          <h1 className="text-3xl font-bold text-[#FC46AA]">JOSSEYCODES</h1>
          <p className="text-gray-600 mt-2">Verify your email address</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Email verified successfully! Redirecting to login...
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {resendSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {resendSuccess}
              </div>
            )}

            <p className="mb-4 text-gray-600">
              We've sent a verification token to{" "}
              <span className="font-semibold">{formData.email || emailFromUrl}</span>. Please paste the
              token below to verify your account.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="token" className="block text-gray-700 mb-2">
                  Verification Token
                </label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
                  required
                  placeholder="Paste your verification token here"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 mb-4 rounded-md text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F699CD] focus:ring-opacity-50
                  ${loading ? "bg-pink-300 cursor-not-allowed" : "bg-[#FC46AA] hover:bg-[#F699CD]"}
                `}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="text-center">
              <p className="text-gray-600">
                Didn't receive a token?{" "}
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className={`text-[#FC46AA] hover:underline focus:outline-none
                    ${resending ? "text-pink-300 cursor-not-allowed" : ""}`}
                >
                  {resending ? "Sending..." : "Send new token"}
                </button>
              </p>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <Link href="/log-in" className="text-[#FC46AA] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifySignupPage() {
  return (
    <Suspense fallback={<div>Loading verification page...</div>}>
      <VerifySignupContent />
    </Suspense>
  );
}
