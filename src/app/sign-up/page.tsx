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

  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  // Validate password length
  if (formData.password.length < 6) {
    setError('Password must be at least 6 characters');
    setLoading(false);
    return;
  }

  try {
    const { confirmPassword, ...submitData } = formData;

    // 1) Create user (backend is expected to create an unverified user and return a token)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/users/`,
      submitData,
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const emailToStore = (submitData.email || '').trim();
    const token = (response?.data as any)?.token || null;

    // persist the email so verify page can read it (safe fallback)
    try {
      localStorage.setItem('signupEmail', emailToStore);
    } catch {
      // ignore storage errors
    }

    // 2) Attempt to send verification email using EmailJS (best-effort)
    try {
      console.log('🔄 Starting EmailJS send...');
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

      if (!serviceId || !templateId || !userId) {
        throw new Error('Missing EmailJS environment variables');
      }

      const templateParams = {
        to_email: emailToStore,
        to_name: submitData.first_name || 'User',
        user_email: emailToStore,
        email: emailToStore,
        first_name: submitData.first_name || '',
        last_name: submitData.last_name || '',
        token: token || '',
        verification_token: token || '',
        verify_url: `${window.location.origin}/verify-email?token=${token || ''}`,
        site_url: window.location.origin,
      };

      console.log('📨 Sending with params:', {
        to: emailToStore,
        hasToken: !!token,
        verify_url: templateParams.verify_url
      });

      const emailjsResponse = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        userId
      );

      console.log('EmailJS send successful:', {
        status: emailjsResponse.status,
        text: (emailjsResponse as any).text
      });

      // Success: navigate to verify page
      setLoading(false);
      router.push('/verify-signup');

    } catch (emailError: any) {
      // If email sending fails, we still allow the user to go to verify page and request a new token
      console.error('❌ EmailJS detailed error:', emailError);

      // Save email (again, in case previous setItem failed)
      try {
        localStorage.setItem('signupEmail', emailToStore);
      } catch {}

      // Show a helpful message, then redirect to verify page where they can resend token
      const friendlyMessage =
        (emailError?.text && String(emailError.text)) ||
        (emailError?.message && String(emailError.message)) ||
        'Signup succeeded but sending verification email failed. You can request a new token on the verification page.';

      setError(friendlyMessage);
      setLoading(false);

      // Slight delay so user sees the message briefly, then redirect
      setTimeout(() => {
        router.push('/verify-signup');
      }, 1200);

      return;
    }

  } catch (err: any) {
    const error = err as AxiosError;
    console.error('❌ Signup error:', error);

    // 1) Timeout or network error -> save email & redirect to verify page
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      try {
        localStorage.setItem('signupEmail', formData.email.trim());
      } catch {}
      setError('Request timeout or network error. Redirecting so you can request a new verification token.');
      setLoading(false);
      router.push('/verify-signup');
      return;
    }

    // 2) Backend returned 400 and email exists -> assume unverified and redirect to verify page
    if (error.response?.status === 400 && error.response.data && typeof error.response.data === 'object') {
      const responseData = error.response.data as any;
      const emailErr = responseData.email;
      const message = Array.isArray(emailErr) ? emailErr[0] : responseData.message || responseData.error;

      if (typeof message === 'string') {
        const lowered = message.toLowerCase();

        // If backend explicitly says the account is already verified, surface it as an error
        if (lowered.includes('verified')) {
          setError(message);
          setLoading(false);
          return;
        }

        // If it's an "already exists" message, treat it as unverified case and redirect
        if (lowered.includes('already exists') || lowered.includes('exists')) {
          try {
            localStorage.setItem('signupEmail', formData.email.trim());
          } catch {}

          setError('An account with that email already exists but appears unverified. Redirecting to verification page.');
          setLoading(false);
          router.push('/verify-signup');
          return;
        }
      }
    }

    // 3) Other server-side error payloads
    if (error.response?.data && typeof error.response.data === 'object') {
      const responseData = error.response.data as any;
      if (responseData.email) {
        setError(responseData.email[0]);
      } else if (responseData.error) {
        setError(responseData.error);
      } else if (responseData.message) {
        setError(responseData.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    } else if (error.response?.status === 500) {
      setError('Server error. Please try again later.');
    } else {
      setError('Signup failed. Please try again.');
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
