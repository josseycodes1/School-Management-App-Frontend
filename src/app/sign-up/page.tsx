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
    // Build the payload with correct type by excluding confirmPassword
    const { confirmPassword, ...rest } = formData;
    const submitData: CreateUserPayload = rest;

    // POST to create user with typed response
    const response = await axios.post<CreateUserResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/`,
      submitData,
      {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const status = response.status;
    const data = response.data;
    const emailToStore = (submitData.email || '').trim();

    // Save email locally for verify page
    try { localStorage.setItem('signupEmail', emailToStore); } catch {}

    // If server created user (201) or returned token, proceed to EmailJS / redirect
    if (status === 201 || data?.created === true || !!data?.token) {
      try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

        if (!serviceId || !templateId || !userId) {
          throw new Error('Missing EmailJS env vars');
        }

        const templateParams = {
          to_email: emailToStore,
          to_name: submitData.first_name || 'User',
          token: data?.token || '',
          verification_token: data?.token || '',
          verify_url: `${window.location.origin}/verify-email?token=${data?.token || ''}`,
        };

        await emailjs.send(serviceId, templateId, templateParams, userId);
      } catch (emailErr) {
        console.warn('EmailJS send failed (user still created):', emailErr);
        // We do not delete the user here; they can use Resend on the verify page.
      }

      setLoading(false);
      router.push('/verify-signup');
      return;
    }

    // If backend returned 200 with explicit signal 'unverified_exists' in detail, redirect
    if (status === 200 && (String(data?.detail || '').toLowerCase() === 'unverified_exists' || String(data?.detail || '').toLowerCase() === 'unverified_exists')) {
      try { localStorage.setItem('signupEmail', emailToStore); } catch {}
      setLoading(false);
      router.push('/verify-signup');
      return;
    }

    // Unexpected successful response shape
    setError(String(data?.message || 'Signup failed: unexpected server response.'));
    setLoading(false);
  } catch (err: any) {
    const error = err as AxiosError;
    console.error('Signup error full object:', error);

    // NETWORK / TIMEOUT (no response present)
    if (!error.response) {
      const friendly = error.code === 'ECONNABORTED'
        ? 'Request timeout. The server may be slow or unreachable. Please try again.'
        : (error.message === 'Network Error'
            ? 'Network error: cannot reach server. Check your connection or backend URL.'
            : `Network or CORS error: ${error.message}`);

      setError(friendly);
      console.error('Network/Timeout error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
      });
      setLoading(false);
      return;
    }

    // Server responded (inspect payload)
    const resp = error.response;
    console.warn('Server responded with status', resp.status, 'data:', resp.data);

    if (resp.status === 400 && resp.data) {
      const respData = resp.data as any;
      const emailErr = Array.isArray(respData.email) ? respData.email[0] : respData.email;
      const rawMsg = String(emailErr || respData.detail || respData.message || respData.error || '');

      const lower = rawMsg.toLowerCase();

      // Redirect if it's an unverified-existing-user case
      if (lower.includes('unverified') || lower.includes('already exists') || respData.detail === 'unverified_exists') {
        try { localStorage.setItem('signupEmail', (formData.email || '').trim()); } catch {}
        setError('An unverified account exists for that email. Redirecting to verification page.');
        setLoading(false);
        router.push('/verify-signup');
        return;
      }

      // Otherwise, show the validation error
      setError(rawMsg || 'Signup validation failed.');
      setLoading(false);
      return;
    }

    if (resp.status === 500) {
      setError('Server error (500). Please try again later.');
    } else {
      setError(String((resp.data as any)?.message || `Signup failed (${resp.status}).`));
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
