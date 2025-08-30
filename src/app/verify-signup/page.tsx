'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifySignupPage() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      setMessage("Email is missing from the link.");
    }
  }, [email]);

  const handleVerify = async () => {
    if (!otp || !email) {
      setMessage("Please enter OTP and ensure email exists.");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/verify_email/`,
        { email, otp }
      );

      setIsVerified(true);
      setMessage(response.data.message || "Verified successfully!");

      // Redirect after 2s
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || "Verification failed. Try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-4">Verify Your Email</h1>
        <p className="text-center text-gray-600 mb-4">
          Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter OTP"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={isVerifying || isVerified}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
            isVerifying
              ? "bg-gray-400 cursor-not-allowed"
              : isVerified
              ? "bg-green-500"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isVerifying
            ? "Verifying..."
            : isVerified
            ? "Verified successfully"
            : "Verify"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
