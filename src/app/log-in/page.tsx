'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'

const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
})

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{email?: string; password?: string}>({})
  const [touched, setTouched] = useState<{email?: boolean; password?: boolean}>({})

  const validateField = (name: string, value: string) => {
    try {
      if (name === 'email') {
        loginSchema.pick({ email: true }).parse({ email: value })
      } else if (name === 'password') {
        loginSchema.pick({ password: true }).parse({ password: value })
      }
      return undefined
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message
      }
      return undefined
    }
  }

  const validateForm = () => {
    try {
      loginSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: {email?: string; password?: string} = {}
        error.errors.forEach(err => {
          if (err.path[0] === 'email') newErrors.email = err.message
          if (err.path[0] === 'password') newErrors.password = err.message
        })
        setErrors(newErrors)
      }
      return false
    }
  }

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
      
      return response.data.completed
    } catch (error) {
      console.error('Error checking onboarding progress:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    
    setTouched({ email: true, password: true })

   
    if (!validateForm()) {
      setIsLoading(false)
      toast.error('Please fix the form errors before submitting')
      return
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      setIsLoading(false)
      toast.error('Please enter a valid email address')
      return
    }

    try {
      console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
      console.log('Login attempt to:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/login/`)

    
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts/login/`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 
        }
      )

      if (response.status === 200) {
        const { user, access } = response.data
        toast.success(`Welcome back, ${user.first_name || 'User'}!`)
        
        
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', response.data.refresh)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('role', user.role)
        localStorage.setItem('onboarding_complete', user.onboarding_complete ? 'true' : 'false')

        console.log('✅ Stored user role:', user.role)
        console.log('✅ Stored onboarding status:', user.onboarding_complete)

        
        if (user.role === 'admin') {
          router.push(`/${user.role}`)
          return
        }

        
        const isOnboardingComplete = await checkOnboardingProgress(user.role, access)
        
        if (isOnboardingComplete) {
          router.push(`/${user.role}`)
        } else {
          router.push(`/onboarding/${user.role}`)
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        
        const status = error.response?.status
        const errorData = error.response?.data

        console.error('Login error:', {
          status,
          data: errorData,
          url: error.config?.url
        })

        switch (status) {
          case 401:
           
            const errorMessage = errorData?.error?.toLowerCase()
            
            if (errorMessage?.includes('email') || errorMessage?.includes('account')) {
              setErrors({
                email: 'Account not found with this email'
              })
              toast.error('Account not found. Please check your email or sign up.')
            } else if (errorMessage?.includes('password') || errorMessage?.includes('credential')) {
              setErrors({
                password: 'Incorrect password'
              })
              toast.error('Incorrect password. Please try again.')
            } else {
              setErrors({
                email: 'Invalid credentials',
                password: 'Invalid credentials'
              })
              toast.error('Invalid email or password. Please check your credentials.')
            }
            break
          case 400:
            if (errorData?.error) {
              
              const errorMsg = errorData.error.toLowerCase()
              
              if (errorMsg.includes('email') && errorMsg.includes('required')) {
                setErrors({ email: 'Email is required' })
              } else if (errorMsg.includes('password') && errorMsg.includes('required')) {
                setErrors({ password: 'Password is required' })
              } else if (errorMsg.includes('email') && errorMsg.includes('valid')) {
                setErrors({ email: 'Please enter a valid email address' })
              } else {
                toast.error(errorData.error)
              }
            } else if (errorData?.email || errorData?.password) {
              
              setErrors({
                email: errorData.email?.[0],
                password: errorData.password?.[0]
              })
              toast.error('Please check your input fields')
            } else {
              toast.error('Invalid request. Please check your input.')
            }
            break
          case 404:
            setErrors({
              email: 'Service unavailable'
            })
            toast.error('Service unavailable. Please try again later.')
            break
          case 500:
            toast.error('Server error. Please try again later.')
            break
          case 403:
            setErrors({
              email: 'Email not verified'
            })
            toast.error('Account not verified. Please verify your email first.')
            break
          default:
            if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
              toast.error('Cannot connect to server. Please check your internet connection.')
            } else if (error.code === 'TIMEOUT') {
              toast.error('Request timeout. Please try again.')
            } else {
              toast.error(errorData?.detail || errorData?.error || 'Login failed. Please try again.')
            }
        }
      } else if (error instanceof z.ZodError) {
        
        toast.error('Please fix the form errors before submitting')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
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

    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full px-4 py-2 border rounded-md focus:ring-[#FC46AA] focus:border-[#FC46AA] transition-colors"
    const hasError = errors[fieldName as keyof typeof errors] && touched[fieldName as keyof typeof touched]
    
    if (hasError) {
      return `${baseClass} border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500`
    }
    return `${baseClass} border-gray-300`
  }

  return (
    <div className="min-h-screen bg-josseypink2 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-josseypink1 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            JC
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Please enter your login details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass('email')}
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('password')}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-josseypink1 text-white py-2 rounded-md hover:bg-josseypink2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link 
            href="/forgot-password" 
            className="font-medium text-josseypink1 hover:text-josseypink2 transition-colors"
          >
            Forgot password?
          </Link>
          <p className="mt-2">
            Don't have an account?{' '}
            <Link 
              href="/sign-up" 
              className="font-medium text-josseypink1 hover:text-josseypink2 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}