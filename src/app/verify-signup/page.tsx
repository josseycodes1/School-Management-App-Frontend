'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export default function VerifySignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get('email');
  
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>(emailFromParams || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [resending, setResending] = useState<boolean>(false);

  useEffect(() => {
    if (!emailFromParams) {
      router.push('/sign-up');
    }
  }, [emailFromParams, router]);

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!token) {
      setError('Please enter the verification token');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/verify_email/`,
        {
          email,
          token
        },
        {
          timeout: 30000,
        }
      );
      
      setSuccess(response.data.message || 'Email verified successfully');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/log-in');
      }, 2000);
      
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as any;
        if (responseData.token) {
          setError(responseData.token[0]);
        } else if (responseData.email) {
          setError(responseData.email[0]);
        } else if (responseData.message) {
          setError(responseData.message);
        } else if (error.code === 'ECONNABORTED') {
          setError('Request timeout. Please try again.');
        } else {
          setError('Verification failed. Please try again.');
        }
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else if (error.message === 'Network Error') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Verification failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    setResending(true);
    setError('');
    
    try {
      // This endpoint might need to be created on your backend
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/resend_verification/`,
        { email },
        {
          timeout: 30000,
        }
      );
      
      setSuccess('A new verification token has been sent to your email.');
    } catch (err) {
      const error = err as AxiosError;
      setError('Failed to resend verification token. Please try again.');
    }
    
    setResending(false);
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
          We've sent a verification token to <span className="font-semibold">{email}</span>. 
          Please paste the token below to verify your account.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="token" className="block text-gray-700 mb-2">Verification Token</label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={handleTokenChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
              placeholder="Paste your verification token here"
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

        <div className="flex flex-col gap-2">
          <button
            onClick={handleResendToken}
            disabled={resending}
            className="text-[#FC46AA] hover:underline disabled:opacity-50 text-center"
          >
            {resending ? 'Sending...' : 'Didn\'t receive a token? Send new token'}
          </button>
          
          <button
            onClick={() => router.push('/log-in')}
            className="text-[#FC46AA] hover:underline text-center"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}