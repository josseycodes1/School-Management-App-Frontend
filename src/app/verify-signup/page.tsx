'use client';

import { useState, FormEvent, ChangeEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';

// Create a component that uses useSearchParams
function VerifySignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    email: emailFromParams || '',
    token: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [resending, setResending] = useState<boolean>(false);

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

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/verify_email/`,
        formData,
        {
          timeout: 30000,
          headers: {
            // Explicitly set content type
            'Content-Type': 'application/json',
          },
        }
      );
      
      setSuccess(response.data.message || 'Email verified successfully');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/log-in');
      }, 2000);
      
    } catch (err) {
      const error = err as AxiosError;
      console.error('Verification error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        // This suggests a backend permission configuration issue
        setError('Server configuration error. Please contact support.');
      } else if (error.response?.data && typeof error.response.data === 'object') {
        const responseData = error.response.data as any;
        if (responseData.detail) {
          setError(responseData.detail);
        } else if (responseData.error) {
          setError(responseData.error);
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
      // First, we need to get the user ID by email
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/`,
        {
          params: { email: formData.email },
          timeout: 30000,
        }
      );
      
      if (userResponse.data.results && userResponse.data.results.length > 0) {
        const userId = userResponse.data.results[0].id;
        
        // Now call the resend verification endpoint with the user ID
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/${userId}/resend_verification/`,
          {},
          {
            timeout: 30000,
          }
        );
        
        setSuccess('Verification token sent successfully. Please check your email.');
      } else {
        setError('User not found. Please try signing up again.');
      }
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

  // Redirect if no email parameter
  if (!emailFromParams) {
    router.push('/sign-up');
    return null;
  }

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
              name="token"
              value={formData.token}
              onChange={handleChange}
              placeholder="Paste your verification token here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
              required
              disabled={loading || success !== ''}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success !== ''}
            className="w-full bg-[#FC46AA] text-white py-2 px-4 rounded-md hover:bg-[#F699CD] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F699CD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? 'Verifying...' : success ? 'Verified Successfully!' : 'Verify Email'}
          </button>
        </form>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleResendToken}
            disabled={resending || success !== ''}
            className="text-[#FC46AA] hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {resending ? 'Sending...' : 'Didn\'t receive a token? Send new token'}
          </button>
          
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

// Main component that wraps the content in Suspense
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