'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';

interface VerifyFormData {
  token: string;
  email: string;
}

export default function VerifySignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationData, setVerificationData] = useState<VerifyFormData>({
    token: '',
    email: searchParams.get('email') || ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVerificationData({
      ...verificationData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/accounts/api/users/verify_email/',
        verificationData
      );
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/log-in');
      }, 3000);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
        setError((error.response.data as { error: string }).error);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
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
          <p className="text-gray-600 mt-2">Verify your email</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Email verified successfully! Redirecting to login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={verificationData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="token" className="block text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                id="token"
                name="token"
                value={verificationData.token}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
                placeholder="Enter the code sent to your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FC46AA] text-white py-2 px-4 rounded-md hover:bg-[#F699CD] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F699CD] focus:ring-opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Didn't receive a code?{' '}
            <button 
              className="text-[#FC46AA] hover:underline"
              onClick={() => {
                alert('Please check your email again or contact support.');
              }}
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}