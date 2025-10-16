'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
})

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkOnboardingProgress = async (role: string, accessToken: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/${role}s/onboarding/progress/`, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
      
      return response.data.completed // Assuming this returns boolean
    } catch (error) {
      console.error('Error checking onboarding progress:', error)
      return false // Default to false if there's an error
    }
  }

  console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
  console.log('Login attempt to:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/login/`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      loginSchema.parse(formData)
      
      // Make login request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/login/`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 200) {
        const { user, access } = response.data
        toast.success(`Welcome back, ${user.first_name || 'User'}!`)
        
        // Store user data and tokens
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', response.data.refresh)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('role', user.role)

         console.log('✅ Stored user role:', user.role); 

        // If admin, go straight to dashboard
        if (user.role === 'admin') {
          router.push(`/${user.role}`)
          return
        }

        // Check onboarding progress
        const isOnboardingComplete = await checkOnboardingProgress(user.role, access)
        
        if (isOnboardingComplete) {
          // Redirect to dashboard if onboarding is complete
          router.push(`/${user.role}`)
        } else {
          // Redirect to onboarding if not complete
          router.push(`/onboarding/${user.role}`)
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      } else if (axios.isAxiosError(error)) {
        // Handle axios error
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.detail || 
                            'Login failed'
        toast.error(errorMessage)
        
        // Log detailed error for debugging
        console.error('Login error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        })
      } else {
        toast.error('An error occurred. Please try again.')
        console.error('Unexpected error:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FC46AA] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            JC
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Please enter your login details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-[#FC46AA] focus:border-[#FC46AA]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-[#FC46AA] focus:border-[#FC46AA] pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FC46AA] text-white py-2 rounded-md hover:bg-[#F699CD] transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link href="/forgot-password" className="font-medium text-[#FC46AA] hover:text-[#F699CD]">
            Forgot password?
          </Link>
          <p className="mt-2">
            Don't have an account?{' '}
            <Link href="/sign-up" className="font-medium text-[#FC46AA] hover:text-[#F699CD]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}