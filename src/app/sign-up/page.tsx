'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import emailjs from 'emailjs-com';

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  role: string;
}

type CreateUserPayload = Omit<SignUpFormData, 'confirmPassword'>;

interface CreateUserResponse {
  token?: string;
  created?: boolean;
  message?: string;
  detail?: string;
  // backend may return other fields — add them here if needed
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validate passwords
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }
  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters');
    setLoading(false);
    return;
  }

  try {
    // Build payload
    const { confirmPassword, ...rest } = formData;
    const submitData: CreateUserPayload = rest;

    console.groupCollapsed('Signup: sending user-create request');
    console.log('POST URL:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/`);
    console.log('Payload (submitData):', submitData);
    console.groupEnd();

    console.time('signup-request-time');
    const response = await axios.post<CreateUserResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/`,
      submitData,
      {
        timeout: 45000, // 45s
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.timeEnd('signup-request-time');

    console.groupCollapsed('Signup: response received');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    console.groupEnd();

    const status = response.status;
    const data = response.data;
    const emailToStore = (submitData.email || '').trim();

    // Save email locally for verify page (best-effort)
    try {
      localStorage.setItem('signupEmail', emailToStore);
    } catch (storageError) {
      console.warn('Could not save to localStorage:', storageError);
    }

    // Check for token in response (we expect token since server returns it)
    const tokenFromBackend = data?.token;
    if (!tokenFromBackend) {
      const msg = 'No verification token returned from backend.';
      console.error(msg, { status, data });
      setError(msg);
      setLoading(false);
      return;
    }

    // Only proceed when the server created the user AND returned a token
    if (status === 201 || data?.created === true || !!tokenFromBackend || status === 200) {
      console.log('User created successfully on backend; token present:', !!tokenFromBackend);

      // EmailJS step — log env vars presence
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

      console.groupCollapsed('EmailJS: env & template params check');
      console.log('EmailJS serviceId present:', Boolean(serviceId));
      console.log('EmailJS templateId present:', Boolean(templateId));
      console.log('EmailJS userId present:', Boolean(userId));
      console.groupEnd();

      // If you want to *require* EmailJS to be configured, fail early:
      if (!serviceId || !templateId || !userId) {
        const msg = 'EmailJS configuration missing. Please set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_USER_ID.';
        console.error(msg);
        setError(msg);
        setLoading(false);
        // Throw so the outer catch treats this as a failure (and it will be visible in logs)
        throw new Error(msg);
      }

      // Build template params (avoid logging full token in prod; we show truncated)
      const templateParams = {
        to_email: emailToStore,
        to_name: submitData.first_name || 'User',
        token: tokenFromBackend,
        verification_token: tokenFromBackend,
        verify_url: `${window.location.origin}/verify-email?token=${tokenFromBackend}`,
      };

      // Log a redacted/summary view of the params for diagnostics
      console.groupCollapsed('EmailJS: sending email with templateParams (redacted)');
      console.log('to_email:', templateParams.to_email);
      console.log('to_name:', templateParams.to_name);
      console.log('token (first 8 chars):', String(templateParams.token).slice(0, 8) + '...');
      console.log('verify_url:', templateParams.verify_url);
      console.groupEnd();

      // Attempt to send email via EmailJS - if this fails, we treat it as a hard failure
      try {
        console.time('emailjs-send-time');
        await emailjs.send(serviceId, templateId, templateParams, userId);
        console.timeEnd('emailjs-send-time');
        console.log('EmailJS: email sent successfully');
      } catch (emailErr) {
        console.error('EmailJS send failed:', emailErr);
        setError('Failed to send verification email. Please try again later.');
        setLoading(false);
        // Throw so outer catch will handle and log the failure
        throw emailErr;
      }

      // Success: stop loading and navigate
      setLoading(false);
      router.push('/verify-signup');
      return;
    }

    // Handle unverified user case (legacy fallback)
    if (status === 200 && String(data?.detail || '').toLowerCase().includes('unverified')) {
      try {
        localStorage.setItem('signupEmail', emailToStore);
      } catch {}
      setLoading(false);
      router.push('/verify-signup');
      return;
    }

    // Unexpected response
    const unexpectedMsg = String(data?.message || 'Signup completed but with unexpected response.');
    console.warn('Unexpected signup response:', status, data);
    setError(unexpectedMsg);
    setLoading(false);

  } catch (err: any) {
    console.error('Signup error handler caught:', err);

    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. The server is taking too long to respond. Please try again.');
      } else if (err.message === 'Network Error') {
        setError('Network error: Cannot connect to the server. Please check your internet connection and ensure the backend is running.');
      } else if (err.response) {
        // Server responded with error status (maybe we threw earlier)
        console.error('Server error response:', err.response.status, err.response.data);

        if (err.response.status === 400) {
          const errorData = err.response.data as any;
          const errorMessage = errorData.email?.[0] || errorData.detail || errorData.message || 'Validation failed';
          setError(errorMessage);
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Request failed with status ${err.response.status}`);
        }
      } else {
        // This also catches errors we deliberately threw (e.g., missing EmailJS config or email send failure)
        if (err.message) {
          setError(String(err.message));
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      }
    } else {
      // Non-Axios error
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  }
};




  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');

  //   // Validate passwords match
  //   if (formData.password !== formData.confirmPassword) {
  //     setError('Passwords do not match');
  //     setLoading(false);
  //     return;
  //   }

  //   // Validate password length
  //   if (formData.password.length < 6) {
  //     setError('Password must be at least 6 characters');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     // Remove confirmPassword from the data sent to the server
  //     const { confirmPassword, ...submitData } = formData;

  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/`,
  //       submitData,
  //       {
  //         timeout: 10000, // 10 second timeout
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     // Save email to localStorage for the verify page to consume
  //     const emailToStore =
  //       (response?.data as any)?.email?.toString() || submitData.email.trim();
  //     try {
  //       localStorage.setItem('signupEmail', emailToStore);
  //     } catch {
  //       // ignore storage errors
  //     }

  //     // Redirect to verify page WITHOUT query string
  //     router.push('/verify-signup');

  //     // Note: we intentionally do not setLoading(false) here
  //     // to keep the button disabled until navigation completes.
  //   } catch (err) {
  //     const error = err as AxiosError;
  //     if (error.response?.data && typeof error.response.data === 'object') {
  //       const responseData = error.response.data as any;
  //       if (responseData.email) {
  //         setError(responseData.email[0]);
  //       } else if (responseData.message) {
  //         setError(responseData.message);
  //       } else if (error.code === 'ECONNABORTED') {
  //         setError('Request timeout. Please try again.');
  //       } else {
  //         setError('Signup failed. Please try again.');
  //       }
  //     } else if (error.code === 'ECONNABORTED') {
  //       setError('Request timeout. Please try again.');
  //     } else if (error.message === 'Network Error') {
  //       setError('Network error. Please check your connection.');
  //     } else {
  //       setError('Signup failed. Please try again.');
  //     }
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#FC46AA] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            JC
          </div>
          <h1 className="text-3xl font-bold text-[#FC46AA]">JOSSEYCODES</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD] pr-10"
                minLength={6}
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD] pr-10"
                minLength={6}
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="first_name" className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
                required
                disabled={loading}
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
                required
                disabled={loading}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F699CD]"
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FC46AA] text-white py-2 px-4 rounded-md hover:bg-[#F699CD] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F699CD] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/log-in" className="text-[#FC46AA] hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
