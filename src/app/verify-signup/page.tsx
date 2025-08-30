'use client';

import { useState, FormEvent, ChangeEvent, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

function VerifySignUpContent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    token: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [resending, setResending] = useState(false);

  // Load email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("signupEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    } else {
      router.push('/sign-up');
    }
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVerifySuccess('');
    setResendSuccess('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/verify_email/`,
        formData,
        {
          timeout: 30000,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setVerifySuccess(response.data.message || 'Email verified successfully');

      // Cleanup and redirect
      setTimeout(() => {
        localStorage.removeItem("signupEmail");
        router.push('/log-in');
      }, 2000);

    } catch (err) {
      const error = err as AxiosError;
      console.error('Verification error:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        setError('Server configuration error. Please contact support.');
      } else if (error.response?.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as any;
        setError(responseData.error || responseData.message || 'Verification failed. Please try again.');
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    setResending(true);
    setError('');
    setResendSuccess('');
    setVerifySuccess('');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/resend_verification/`,
        { email: formData.email },
        {
          timeout: 30000,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setResendSuccess('Verification token sent successfully. Please check your email.');
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as any;
        setError(responseData.error || 'Failed to resend token. Please try again.');
      } else {
        setError('Failed to resend token. Please try again.');
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

        <p className="text-gray-600 mb-6 text-center">
          We've sent a verification token to <span className="font-semibold">{formData.email}</span>. 
          Please paste the token below to verify your account.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}
        {verifySuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{verifySuccess}</div>
        )}
        {resendSuccess && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">{resendSuccess}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Hidden email field */}
          <input type="hidden" name="email" value={formData.email} readOnly />

          <div className="mb-6">
            <label htmlFor="token" className="block text-gray-700 mb-2">Verification Token</label>
            <input
              type="text"
              id="token"
              name="token"
              value={formData.token}
              onChange={handleChange}
              placeholder="Paste your verification token here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FC46AA] text-white py-2 px-4 rounded-md hover:bg-[#F699CD] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F699CD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-600">Didn't receive a token?</span>
            <button
              onClick={handleResendToken}
              disabled={resending}
              className="text-[#FC46AA] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? 'Sending...' : 'Resend'}
            </button>
          </div>

          <button
            onClick={() => router.push('/log-in')}
            className="text-gray-600 hover:underline text-center"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

// Main wrapper with Suspense
export default function VerifySignUp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pink-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#FC46AA] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            JC
          </div>
          <h1 className="text-3xl font-bold text-[#FC46AA]">JOSSEYCODES</h1>
          <p className="text-gray-600 mt-4">Loading verification page...</p>
        </div>
      </div>
    }>
      <VerifySignUpContent />
    </Suspense>
  );
}
