'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface ResendVerificationProps {
  email: string;
  isPasswordReset?: boolean; // Flag to distinguish between signup and password reset
}

export function ResendVerification({ email, isPasswordReset = false }: ResendVerificationProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      
      if (isPasswordReset) {
        // For password reset flow
        response = await axios.post(
          'http://localhost:8000/api/accounts/password_reset/resend/',
          { email }
        );
      } else {
        // For signup verification flow
        response = await axios.post(
          'http://localhost:8000/api/accounts/users/resend_verification/',
          { email }
        );
      }

      setSuccess(response.data.message || 'Verification token resent successfully');
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data) {
        // Handle different error response formats
        if (typeof error.response.data === 'object') {
          if ('email' in error.response.data) {
            setError((error.response.data as { email: string[] }).email[0]);
          } else if ('detail' in error.response.data) {
            setError((error.response.data as { detail: string }).detail);
          } else {
            setError('Failed to resend verification token. Please try again.');
          }
        } else {
          setError('Failed to resend verification token. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <p className="text-gray-600 mb-2">
        Didn't receive a verification token?
      </p>
      <button
        onClick={handleResend}
        disabled={loading}
        className={`text-[#FC46AA] hover:underline focus:outline-none ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Sending...' : 'Resend Verification Token'}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-sm mt-1">{success}</p>
      )}
    </div>
  );
}